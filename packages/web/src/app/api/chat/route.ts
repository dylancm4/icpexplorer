/**
 * `POST /api/chat` route handler.
 *
 * Streams Claude responses with tool-calling support for ICP network
 * data queries. Uses Vercel AI SDK v6 `streamText()` with the Anthropic
 * provider and MCP-bridged tools from the local MCP server.
 */

import { anthropic } from "@ai-sdk/anthropic";
import type { UIMessage } from "ai";
import { convertToModelMessages, stepCountIs, streamText } from "ai";
import { getMcpTools } from "@/lib/mcp-client";

/** Builds the system prompt with the current timestamp for relative date calculations. */
const buildSystemPrompt = (): string => {
  const now = Math.floor(Date.now() / 1000);
  return `You are an ICP (Internet Computer Protocol) network data assistant. Your role is to answer questions about the ICP network using the tools provided.

The current Unix timestamp is ${now} (${new Date().toISOString()}).
Use this to calculate relative time ranges (e.g., "past month" = now minus 30 days).

You can help users with:
- **Current network stats**: node count (total and active), running/stopped canisters, subnet count, cycle burn rate, total neurons, and total proposals
- **Historical trends**: how node count, canister count, subnet count, or cycle burn rate have changed over time

When a user first messages you or asks what you can do, proactively explain the types of questions you can answer with specific examples like:
- "How many nodes are currently running on the ICP network?"
- "What's the current cycle burn rate?"
- "How has the node count changed recently?"
- "How many governance proposals have been submitted?"

Rules:
- ALWAYS use the provided tools to fetch data before answering questions. Never fabricate or guess network statistics.
- When asked about current network state, use get_metrics.
- When asked about historical trends or changes over time, use get_time_series.
- If the user asks something outside your available data, politely explain what you CAN help with and suggest relevant questions they could ask.
- Present numbers in a human-readable format (e.g., use commas for large numbers).
- Be concise and factual in your responses.`;
};

/**
 * Handles POST requests to the chat endpoint.
 *
 * Streams Claude responses with tool use for ICP data queries.
 * Requires `ANTHROPIC_API_KEY` environment variable to be set.
 */
export const POST = async (req: Request) => {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY is not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const body = await req.json();
  const messages = body?.messages as UIMessage[] | undefined;
  if (!Array.isArray(messages)) {
    return new Response(
      JSON.stringify({
        error: "Invalid request body: messages array required",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }
  const modelMessages = await convertToModelMessages(messages);

  const tools = await getMcpTools();

  const result = streamText({
    model: anthropic("claude-haiku-4-5"),
    system: buildSystemPrompt(),
    messages: modelMessages,
    tools,
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
};
