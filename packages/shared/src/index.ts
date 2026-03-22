/**
 * @packageDocumentation
 * Shared types, Zod schemas, and utilities consumed by both
 * the MCP server (`@icpexplorer/mcp-server`) and the web
 * playground (`@icpexplorer/web`).
 *
 * This package is an internal workspace dependency — it is
 * never published to npm.
 */

export type { TimeSeriesMetric, TimeSeriesOptions } from "./api/metrics";
export { fetchNetworkStats, fetchTimeSeries } from "./api/metrics";
export {
  cycleBurnRateResponseSchema,
  governanceMetricsResponseSchema,
  networkStatsSchema,
  timeSeriesEntrySchema,
  timeSeriesPointSchema,
} from "./schemas";
export type { NetworkStats, TimeSeriesData, TimeSeriesPoint } from "./types";
