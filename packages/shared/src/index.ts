/**
 * @packageDocumentation
 * Shared types, Zod schemas, and utilities consumed by both
 * the MCP server (`@icpexplorer/mcp-server`) and the web
 * playground (`@icpexplorer/web`).
 *
 * This package is an internal workspace dependency — it is
 * never published to npm.
 */

export { fetchNetworkStats } from "./api/metrics";
export {
  cycleBurnRateResponseSchema,
  governanceMetricsResponseSchema,
  networkStatsSchema,
  timeSeriesEntrySchema,
} from "./schemas";
export type { NetworkStats } from "./types";
