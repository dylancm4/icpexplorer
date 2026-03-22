/**
 * `POST /api/chat` route handler.
 *
 * Streams Claude responses with tool-calling support for ICP network
 * data queries. Uses Vercel AI SDK v6 `streamText()` with the Anthropic
 * provider and three tools backed by the shared data layer.
 */

import { anthropic } from "@ai-sdk/anthropic";
import { fetchNetworkStats, fetchTimeSeries } from "@icpexplorer/shared";
import type { UIMessage } from "ai";
import { convertToModelMessages, stepCountIs, streamText, tool } from "ai";
import { z } from "zod";

/** Builds the system prompt with the current timestamp for relative date calculations. */
function buildSystemPrompt(): string {
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
- When asked about current network state, use getNetworkStats or getGovernanceStats.
- When asked about historical trends or changes over time, use getTimeSeries.
- If the user asks something outside your available data, politely explain what you CAN help with and suggest relevant questions they could ask.
- Present numbers in a human-readable format (e.g., use commas for large numbers).
- Be concise and factual in your responses.`;
}

/**
 * Handles POST requests to the chat endpoint.
 *
 * Streams Claude responses with tool use for ICP data queries.
 * Requires `ANTHROPIC_API_KEY` environment variable to be set.
 */
export async function POST(req: Request) {
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

  const result = streamText({
    model: anthropic("claude-haiku-4-5"),
    system: buildSystemPrompt(),
    messages: modelMessages,
    tools: {
      getNetworkStats: tool({
        description:
          "Fetches current ICP network statistics including node count, canister count, subnet count, cycle burn rate, neurons, and proposals.",
        inputSchema: z.object({}),
        execute: async () => fetchNetworkStats(),
      }),
      getTimeSeries: tool({
        description:
          "Fetches historical time-series data for a specific ICP network metric. Always provide start and end timestamps to get meaningful historical data. Returns data points with timestamps and values, keyed by the metric's response fields.",
        inputSchema: z.object({
          metric: z
            .enum([
              "ic-node-count",
              "registered-canisters-count",
              "ic-subnet-total",
              "cycle-burn-rate",
            ])
            .describe(
              "The metric to query. ic-node-count returns total_nodes and up_nodes. registered-canisters-count returns running_canisters and stopped_canisters. ic-subnet-total returns ic_subnet_total. cycle-burn-rate returns cycle_burn_rate.",
            ),
          start: z
            .number()
            .describe(
              "Start of the time range as a Unix timestamp in seconds. For example, 30 days ago.",
            ),
          end: z
            .number()
            .describe(
              "End of the time range as a Unix timestamp in seconds. Usually the current time.",
            ),
          step: z
            .number()
            .optional()
            .describe(
              "Step interval in seconds between data points (1–259200). Defaults to a reasonable interval based on the range. Use 86400 for daily points.",
            ),
        }),
        execute: async ({ metric, start, end, step }) => {
          return fetchTimeSeries(metric, { start, end, step });
        },
      }),
      getGovernanceStats: tool({
        description:
          "Fetches current ICP governance statistics: total neurons and total proposals.",
        inputSchema: z.object({}),
        execute: async () => {
          const { totalNeurons, totalProposals } = await fetchNetworkStats();
          return { totalNeurons, totalProposals };
        },
      }),
    },
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
