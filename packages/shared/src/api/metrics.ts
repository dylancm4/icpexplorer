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
import type { NetworkStats } from "../types";

/** Base URL for the ICP Metrics API. */
const BASE_URL = "https://metrics-api.internetcomputer.org/api/v1";

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
