/**
 * Core types for ICP network statistics.
 *
 * These types represent the structured data returned by the
 * ICP Metrics API after parsing and validation.
 */

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
