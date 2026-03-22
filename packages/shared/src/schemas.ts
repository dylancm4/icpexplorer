/**
 * Zod schemas for ICP Metrics API response validation.
 *
 * Each schema matches the actual response shape of the corresponding
 * Metrics API endpoint (verified via live API calls). All numeric values
 * arrive as strings and are coerced to numbers during parsing.
 */

import { z } from "zod";

/**
 * Schema for time-series endpoints (`ic-node-count`, `registered-canisters-count`, `ic-subnet-total`).
 *
 * Response shape: `{ key: [[timestamp_number, "value_string"], ...] }`
 */
export const timeSeriesEntrySchema = z.tuple([z.number(), z.string()]);

/**
 * Schema for a parsed time-series data point.
 *
 * Represents the validated output after converting raw API tuples
 * `[timestamp_number, "value_string"]` into structured objects.
 */
export const timeSeriesPointSchema = z.object({
  timestamp: z.number(),
  value: z.number(),
});

/**
 * Schema for the `average-cycle-burn-rate` endpoint.
 *
 * Response shape: `{ average_cycle_burn_rate: [timestamp_number, "value_string"] }`
 * Note: This is a flat pair, NOT a nested array like time-series endpoints.
 */
export const cycleBurnRateResponseSchema = z.object({
  average_cycle_burn_rate: z.tuple([z.number(), z.string()]),
});

/**
 * Schema for a single governance metric subset entry.
 */
export const governanceSubsetSchema = z.object({
  metric: z.record(z.string(), z.string()),
  value: z.tuple([z.number(), z.string()]),
});

/**
 * Schema for a single governance metric (containing name and subsets).
 */
export const governanceMetricSchema = z.object({
  name: z.string(),
  subsets: z.array(governanceSubsetSchema),
});

/**
 * Schema for the `governance-metrics` endpoint response.
 *
 * Response shape: `{ metrics: [{ name, subsets: [{ metric, value }] }] }`
 * Contains 81+ named metrics; we extract specific ones by name.
 */
export const governanceMetricsResponseSchema = z.object({
  metrics: z.array(governanceMetricSchema),
});

/**
 * Schema for the validated `NetworkStats` object returned by `fetchNetworkStats()`.
 */
export const networkStatsSchema = z.object({
  totalNodes: z.number(),
  upNodes: z.number(),
  runningCanisters: z.number(),
  stoppedCanisters: z.number(),
  totalSubnets: z.number(),
  averageCycleBurnRate: z.number(),
  totalNeurons: z.number(),
  totalProposals: z.number(),
});
