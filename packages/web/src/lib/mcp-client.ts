/**
 * MCP client bridge.
 *
 * Spawns the `@icpexplorer/mcp-server` as a child process over stdio and
 * exposes its tools as Vercel AI SDK `tool()` definitions. The client is
 * a lazy singleton that automatically reconnects after disconnection.
 *
 * @example
 * ```ts
 * const tools = await getMcpTools();
 * // Pass `tools` directly to `streamText({ tools })`
 * ```
 */

import { resolve } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { ToolSet } from "ai";
import { jsonSchema, tool } from "ai";

/**
 * Resolves the MCP server entry point at runtime.
 * In Next.js, `process.cwd()` is the web package root (`packages/web/`).
 * The MCP server's built output lives in the sibling `mcp-server` package.
 */
const resolveMcpServerPath = (): string =>
  resolve(process.cwd(), "../mcp-server/dist/index.js");

/** Singleton promise — reset to `null` when the transport closes. */
let clientPromise: Promise<Client> | null = null;

/**
 * Creates a new MCP client connected to the server via stdio.
 * Registers a close handler that resets the singleton so the next
 * call to {@link ensureClient} spawns a fresh process.
 */
const initClient = async (): Promise<Client> => {
  const transport = new StdioClientTransport({
    command: "node",
    args: [resolveMcpServerPath()],
  });

  transport.onclose = () => {
    clientPromise = null;
  };

  const client = new Client({ name: "icpexplorer-web", version: "0.0.0" });
  await client.connect(transport);
  return client;
};

/**
 * Returns the singleton MCP client, spawning the server on first call.
 * If the previous connection was lost, a new one is created transparently.
 */
const ensureClient = (): Promise<Client> => {
  if (!clientPromise) {
    clientPromise = initClient();
  }
  return clientPromise;
};

/**
 * Calls an MCP tool by name and returns the parsed JSON result.
 *
 * @param name - The MCP tool name (e.g. `"get_metrics"`).
 * @param args - The tool arguments object.
 * @returns The parsed JSON result from the tool's text content.
 */
export const callTool = async (
  name: string,
  args: Record<string, unknown>,
): Promise<unknown> => {
  const client = await ensureClient();
  const result = await client.callTool({ name, arguments: args });

  const textContent = result.content as
    | { type: string; text: string }[]
    | undefined;
  const text = textContent?.find((c) => c.type === "text")?.text;

  if (result.isError) {
    throw new Error(text ?? "MCP tool execution failed");
  }

  if (text) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  return result.content;
};

/**
 * Discovers all MCP server tools and returns them as AI SDK `tool()`
 * definitions ready to pass to `streamText()`.
 *
 * Each MCP tool's JSON Schema `inputSchema` is wrapped with the AI SDK
 * `jsonSchema()` helper. Tool execution delegates to {@link callTool}.
 */
export const getMcpTools = async (): Promise<ToolSet> => {
  const client = await ensureClient();
  const { tools: mcpTools } = await client.listTools();

  const aiTools: ToolSet = {};

  for (const t of mcpTools) {
    const name = t.name;
    aiTools[name] = tool({
      description: t.description ?? "",
      inputSchema: jsonSchema<Record<string, unknown>>(t.inputSchema),
      execute: async (args) => callTool(name, args),
    });
  }

  return aiTools;
};
