/**
 * ICP Metrics API client.
 *
 * Fetches live network statistics from `metrics-api.internetcomputer.org`
 * and returns a validated {@link NetworkStats} object.
 */

import {
  cycleBurnRateResponseSchema,
  governanceMetricsResponseSchema,
  networkStatsSchema,
  timeSeriesEntrySchema,
} from "../schemas";
import type { NetworkStats, TimeSeriesData } from "../types";

/** Base URL for the ICP Metrics API. */
const BASE_URL = "https://metrics-api.internetcomputer.org/api/v1";

/** Supported time-series metric names. */
export type TimeSeriesMetric =
  | "ic-node-count"
  | "registered-canisters-count"
  | "ic-subnet-total"
  | "cycle-burn-rate";

/**
 * Maps each time-series endpoint to the response keys it returns.
 *
 * Multi-key endpoints (e.g., `ic-node-count`) return multiple arrays
 * under different keys in a single response object.
 */
const METRIC_KEYS: Record<TimeSeriesMetric, string[]> = {
  "ic-node-count": ["total_nodes", "up_nodes"],
  "registered-canisters-count": ["running_canisters", "stopped_canisters"],
  "ic-subnet-total": ["ic_subnet_total"],
  "cycle-burn-rate": ["cycle_burn_rate"],
};

/** Optional parameters for controlling time-series query range. */
export interface TimeSeriesOptions {
  /** Start of the time range as a Unix timestamp in seconds. */
  start?: number;
  /** End of the time range as a Unix timestamp in seconds. */
  end?: number;
  /** Step interval in seconds (1–259200). */
  step?: number;
}

/**
 * Fetches a JSON response from the Metrics API.
 *
 * @param path - The API path (e.g. `/ic-node-count`).
 * @returns The parsed JSON response body.
 * @throws If the network request fails or returns a non-OK status.
 */
async function fetchMetrics(path: string): Promise<unknown> {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(
      `Metrics API error: ${response.status} ${response.statusText} for ${path}`,
    );
  }
  return response.json();
}

/**
 * Extracts the latest numeric value from a time-series endpoint response.
 *
 * Time-series endpoints return `{ key: [[timestamp, "value"], ...] }`.
 * This takes the last entry and parses the value string to a number.
 *
 * @param data - The raw API response object.
 * @param key - The top-level key containing the time-series array.
 * @returns The parsed numeric value from the last entry.
 */
function extractLatestTimeSeries(data: unknown, key: string): number {
  const obj = data as Record<string, unknown[]>;
  const entries = obj[key];
  if (!entries || entries.length === 0) {
    throw new Error(`No data found for time-series key "${key}"`);
  }
  const latest = timeSeriesEntrySchema.parse(entries[entries.length - 1]);
  return Number.parseFloat(latest[1]);
}

/**
 * Extracts a governance metric value by name from the governance-metrics response.
 *
 * @param metrics - The parsed governance metrics array.
 * @param name - The metric name to find (e.g. `governance_neurons_total`).
 * @returns The parsed numeric value.
 */
function extractGovernanceMetric(
  metrics: { name: string; subsets: { value: [number, string] }[] }[],
  name: string,
): number {
  const metric = metrics.find((m) => m.name === name);
  const subset = metric?.subsets[0];
  if (!subset) {
    throw new Error(`Governance metric "${name}" not found`);
  }
  return Number.parseFloat(subset.value[1]);
}

/**
 * Fetches live ICP network statistics from the Metrics API.
 *
 * Calls 5 endpoints in parallel, parses and validates all responses,
 * and returns a structured {@link NetworkStats} object.
 *
 * @returns A validated `NetworkStats` object with all numeric values parsed.
 * @throws If any API call fails or returns an unexpected response shape.
 */
export async function fetchNetworkStats(): Promise<NetworkStats> {
  const [nodeData, canisterData, subnetData, burnRateData, governanceData] =
    await Promise.all([
      fetchMetrics("/ic-node-count"),
      fetchMetrics("/registered-canisters-count"),
      fetchMetrics("/ic-subnet-total"),
      fetchMetrics("/average-cycle-burn-rate"),
      fetchMetrics("/governance-metrics"),
    ]);

  const burnRate = cycleBurnRateResponseSchema.parse(burnRateData);
  const governance = governanceMetricsResponseSchema.parse(governanceData);

  const stats: NetworkStats = {
    totalNodes: extractLatestTimeSeries(nodeData, "total_nodes"),
    upNodes: extractLatestTimeSeries(nodeData, "up_nodes"),
    runningCanisters: Math.round(
      extractLatestTimeSeries(canisterData, "running_canisters"),
    ),
    stoppedCanisters: Math.round(
      extractLatestTimeSeries(canisterData, "stopped_canisters"),
    ),
    totalSubnets: extractLatestTimeSeries(subnetData, "ic_subnet_total"),
    averageCycleBurnRate: Number.parseFloat(
      burnRate.average_cycle_burn_rate[1],
    ),
    totalNeurons: extractGovernanceMetric(
      governance.metrics,
      "governance_neurons_total",
    ),
    totalProposals: extractGovernanceMetric(
      governance.metrics,
      "governance_proposals_total",
    ),
  };

  return networkStatsSchema.parse(stats);
}

/**
 * Fetches historical time-series data for a specific metric from the Metrics API.
 *
 * Returns a `TimeSeriesData` object mapping response keys to arrays of parsed
 * data points. Multi-key endpoints (e.g., `ic-node-count`) return multiple keys.
 *
 * @param metric - The metric endpoint to query.
 * @param options - Optional time-range parameters (`start`, `end`, `step`).
 * @returns A `TimeSeriesData` object with parsed time-series points.
 * @throws If the metric is unsupported, the API is unreachable, or the response is malformed.
 */
export async function fetchTimeSeries(
  metric: TimeSeriesMetric,
  options?: TimeSeriesOptions,
): Promise<TimeSeriesData> {
  const keys = METRIC_KEYS[metric];
  if (!keys) {
    throw new Error(`Unsupported time-series metric: "${metric}"`);
  }

  const params = new URLSearchParams();
  if (options?.start !== undefined) params.set("start", String(options.start));
  if (options?.end !== undefined) params.set("end", String(options.end));
  if (options?.step !== undefined) params.set("step", String(options.step));

  const query = params.toString();
  const path = `/${metric}${query ? `?${query}` : ""}`;
  const data = await fetchMetrics(path);

  const obj = data as Record<string, unknown[]>;
  const result: TimeSeriesData = {};

  for (const key of keys) {
    const entries = obj[key];
    if (!entries || entries.length === 0) {
      throw new Error(`No data found for time-series key "${key}"`);
    }
    result[key] = entries.map((entry) => {
      const parsed = timeSeriesEntrySchema.parse(entry);
      return { timestamp: parsed[0], value: Number.parseFloat(parsed[1]) };
    });
  }

  return result;
}
