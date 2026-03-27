/**
 * MCP tool: `get_time_series`
 *
 * Returns historical time-series data for a single named ICP network metric
 * over a specified time range. Supports custom aggregation intervals via `step`.
 */

import type { TimeSeriesMetric } from "@icpexplorer/shared";
import { fetchTimeSeries } from "@icpexplorer/shared";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

/**
 * Maps user-facing metric names to the Metrics API identifier and the
 * response key that contains the data series.
 */
const TIME_SERIES_MAP: Record<
  string,
  { apiMetric: TimeSeriesMetric; key: string }
> = {
  node_count: { apiMetric: "ic-node-count", key: "total_nodes" },
  active_node_count: { apiMetric: "ic-node-count", key: "up_nodes" },
  subnet_count: { apiMetric: "ic-subnet-total", key: "ic_subnet_total" },
  canister_count: {
    apiMetric: "registered-canisters-count",
    key: "running_canisters",
  },
  stopped_canister_count: {
    apiMetric: "registered-canisters-count",
    key: "stopped_canisters",
  },
  cycle_burn_rate: { apiMetric: "cycle-burn-rate", key: "cycle_burn_rate" },
};

/** Metric names that support time-series queries. */
const SUPPORTED_METRICS = Object.keys(TIME_SERIES_MAP) as [string, ...string[]];

/** Zod schema for the `get_time_series` input parameters. */
const timeSeriesInputSchema = z.object({
  metric: z
    .enum(SUPPORTED_METRICS)
    .describe(
      `The metric to query. Available: ${SUPPORTED_METRICS.join(", ")}`,
    ),
  start: z
    .number()
    .describe("Start of the time range as a Unix timestamp in seconds"),
  end: z
    .number()
    .optional()
    .describe(
      "End of the time range as a Unix timestamp in seconds (defaults to now)",
    ),
  step: z
    .number()
    .optional()
    .describe(
      "Step interval in seconds between data points (1–259200). Use 86400 for daily points.",
    ),
});

/**
 * Registers the `get_time_series` tool on the given MCP server.
 *
 * @param server - The MCP server instance to register the tool on.
 */
export const registerGetTimeSeries = (server: McpServer): void => {
  server.registerTool(
    "get_time_series",
    {
      description:
        "Get historical time-series data for a named ICP network metric. Returns timestamped data points within the specified range. Available metrics: " +
        SUPPORTED_METRICS.join(", "),
      inputSchema: timeSeriesInputSchema,
    },
    async ({ metric, start, end, step }) => {
      try {
        const mapping = TIME_SERIES_MAP[metric];
        if (!mapping) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Unsupported time-series metric: "${metric}". Available: ${SUPPORTED_METRICS.join(", ")}`,
              },
            ],
            isError: true,
          };
        }

        const data = await fetchTimeSeries(mapping.apiMetric, {
          start,
          end,
          step,
        });
        const series = data[mapping.key] ?? [];

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ metric, data: series }),
            },
          ],
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        return {
          content: [
            {
              type: "text" as const,
              text: `Failed to fetch time series: ${message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
};
