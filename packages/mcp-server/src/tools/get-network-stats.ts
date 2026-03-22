/**
 * MCP tool: `get_network_stats`
 *
 * Returns live ICP network statistics from the Metrics API.
 * Takes no parameters — fetches all stats in a single call and
 * returns a human-readable formatted text block.
 */

import { fetchNetworkStats } from "@icpexplorer/shared";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Registers the `get_network_stats` tool on the given MCP server.
 *
 * @param server - The MCP server instance to register the tool on.
 */
export function registerGetNetworkStats(server: McpServer): void {
  server.registerTool(
    "get_network_stats",
    {
      description:
        "Get live ICP network statistics including node count, canister count, subnet count, cycle burn rate, and governance metrics",
    },
    async () => {
      try {
        const stats = await fetchNetworkStats();

        const text = [
          "ICP Network Statistics",
          "======================",
          `Total Nodes: ${stats.totalNodes}`,
          `Active Nodes: ${stats.upNodes}`,
          `Running Canisters: ${stats.runningCanisters.toLocaleString()}`,
          `Stopped Canisters: ${stats.stoppedCanisters.toLocaleString()}`,
          `Total Subnets: ${stats.totalSubnets}`,
          `Avg Cycle Burn Rate: ${stats.averageCycleBurnRate.toLocaleString()}`,
          `Total Neurons: ${stats.totalNeurons.toLocaleString()}`,
          `Total Proposals: ${stats.totalProposals.toLocaleString()}`,
        ].join("\n");

        return {
          content: [{ type: "text" as const, text }],
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        return {
          content: [
            {
              type: "text" as const,
              text: `Failed to fetch network stats: ${message}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
