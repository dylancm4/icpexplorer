/**
 * MCP tool: `get_metrics`
 *
 * Returns the current value(s) of one or more named ICP network metrics.
 * Accepts a single metric name or an array of metric names and returns
 * a JSON object keyed by metric name.
 */

import type { NetworkStats } from "@icpexplorer/shared";
import { fetchNetworkStats } from "@icpexplorer/shared";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

/** All metric names supported by `get_metrics`. */
export const METRIC_NAMES = [
  "node_count",
  "active_node_count",
  "subnet_count",
  "canister_count",
  "stopped_canister_count",
  "cycle_burn_rate",
  "total_neurons",
  "total_proposals",
] as const;

/** Maps each metric name to its corresponding {@link NetworkStats} property. */
const METRIC_MAP: Record<(typeof METRIC_NAMES)[number], keyof NetworkStats> = {
  node_count: "totalNodes",
  active_node_count: "upNodes",
  subnet_count: "totalSubnets",
  canister_count: "runningCanisters",
  stopped_canister_count: "stoppedCanisters",
  cycle_burn_rate: "averageCycleBurnRate",
  total_neurons: "totalNeurons",
  total_proposals: "totalProposals",
};

/** Zod schema for the `metrics` input parameter. */
const metricsInputSchema = z.object({
  metrics: z
    .union([z.enum(METRIC_NAMES), z.array(z.enum(METRIC_NAMES))])
    .describe(
      "One or more metric names to fetch. Available: " +
        METRIC_NAMES.join(", "),
    ),
});

/**
 * Registers the `get_metrics` tool on the given MCP server.
 *
 * @param server - The MCP server instance to register the tool on.
 */
export const registerGetMetrics = (server: McpServer): void => {
  server.registerTool(
    "get_metrics",
    {
      description:
        "Get current value(s) of named ICP network metrics. Accepts a single metric name or an array. Available metrics: " +
        METRIC_NAMES.join(", "),
      inputSchema: metricsInputSchema,
    },
    async ({ metrics }) => {
      try {
        const requested = Array.isArray(metrics) ? metrics : [metrics];
        const stats = await fetchNetworkStats();

        const result: Record<string, number> = {};
        for (const name of requested) {
          result[name] = stats[METRIC_MAP[name]];
        }

        return {
          content: [{ type: "text" as const, text: JSON.stringify(result) }],
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        return {
          content: [
            {
              type: "text" as const,
              text: `Failed to fetch metrics: ${message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
};
