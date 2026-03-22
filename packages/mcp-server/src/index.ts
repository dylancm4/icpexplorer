/**
 * @packageDocumentation
 * Entry point for the ICP Explorer MCP server.
 *
 * Starts a Model Context Protocol server over stdio transport,
 * exposing tools that let AI assistants query the Internet Computer
 * blockchain. Tool implementations live in `./tools/`.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerGetNetworkStats } from "./tools/get-network-stats.js";

/** MCP server instance configured for ICP Explorer. */
const server = new McpServer({
  name: "icpexplorer",
  version: "0.0.0",
});

/**
 * Placeholder health-check tool.
 * Returns "pong" to confirm the server is reachable and responding.
 */
server.registerTool(
  "ping",
  {
    description: "Check if the ICP Explorer MCP server is running",
  },
  () => {
    return {
      content: [{ type: "text", text: "pong" }],
    };
  },
);

registerGetNetworkStats(server);

/**
 * Bootstraps the MCP server by binding it to a stdio transport.
 * The server then listens for JSON-RPC messages on stdin and
 * writes responses to stdout.
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
