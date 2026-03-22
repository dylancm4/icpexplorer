/**
 * Core types for ICP network statistics.
 *
 * These types represent the structured data returned by the
 * ICP Metrics API after parsing and validation.
 */

/**
 * A single data point in a time-series response.
 *
 * Parsed from the Metrics API's raw `[timestamp_number, "value_string"]` tuples.
 */
export interface TimeSeriesPoint {
  /** Unix timestamp in seconds. */
  timestamp: number;
  /** Numeric value parsed from the API's string representation. */
  value: number;
}

/**
 * Time-series data keyed by the Metrics API response field name.
 *
 * Multi-key endpoints (e.g., `ic-node-count` returning `total_nodes` and `up_nodes`)
 * produce multiple entries. Single-key endpoints produce one entry.
 */
export type TimeSeriesData = Record<string, TimeSeriesPoint[]>;

/**
 * Aggregated ICP network statistics fetched from the Metrics API.
 *
 * All numeric values are pre-parsed from the API's string responses
 * and rounded to integers where appropriate.
 */
export interface NetworkStats {
  /** Total number of nodes in the network. */
  totalNodes: number;
  /** Number of nodes currently in an "UP" state. */
  upNodes: number;
  /** Number of running canisters (rounded from interpolated float). */
  runningCanisters: number;
  /** Number of stopped canisters (rounded from interpolated float). */
  stoppedCanisters: number;
  /** Total number of subnets. */
  totalSubnets: number;
  /** Average cycle burn rate across the network. */
  averageCycleBurnRate: number;
  /** Total number of governance neurons. */
  totalNeurons: number;
  /** Total number of governance proposals. */
  totalProposals: number;
}
