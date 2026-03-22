## Context

The end-to-end POC proved the shared data layer works: `fetchNetworkStats()` flows through the MCP server and web app. The web app already has `ai` (v6.0.134) and `@ai-sdk/anthropic` (v3.0.63) installed but unused. The next step is a chat interface that lets users ask natural-language questions about ICP network data, with Claude calling tools to fetch data and formulate answers.

The Metrics API time-series endpoints already return historical arrays of `[timestamp, value]` pairs. Currently `fetchNetworkStats()` only takes the last entry. Adding time-series query functions enables Claude to answer historical questions.

## Goals / Non-Goals

**Goals:**
- A streaming chat interface where users can ask about ICP network data in natural language
- Claude autonomously calls tools to fetch current stats or historical time-series data
- Time-series query functions in the shared package for node count, canister count, subnet count, and cycle burn rate history
- All builds, lints, and tests still pass

**Non-Goals:**
- Persistent chat history or user accounts
- Production-ready rate limiting, cost controls, or usage tracking
- Charts or data visualization (text responses only for the POC)
- Multiple AI models or model selection
- Server-side caching of Metrics API responses
- Expanding the MCP server with new tools (that's a separate change)

## Decisions

### Use Vercel AI SDK v6 `streamText()` + `@ai-sdk/react` `useChat()`

The chat API route will use `streamText()` from `ai` with `@ai-sdk/anthropic`'s `anthropic()` provider. The client component will use `useChat()` from `@ai-sdk/react` (needs adding as a dependency).

```
packages/web/src/app/
  api/chat/route.ts          — POST handler with streamText()
  components/chat.tsx         — client component with useChat()
```

The route handler defines tools inline using Vercel AI SDK's `tool()` helper with Zod schemas. Tools call the shared data functions directly — no MCP protocol overhead for web-to-server communication.

**Rationale:** This is the standard Vercel AI SDK pattern for Next.js. `streamText()` handles tool execution server-side and streams results. `useChat()` manages message state, streaming UI updates, and tool result rendering client-side. The AI SDK v6 `tool()` helper provides type-safe tool definitions with Zod schemas — the same Zod we already use in the shared package.

**Alternative considered:** Using the MCP server as an intermediary (web → MCP client → MCP server → shared). This adds unnecessary complexity for a web app that can import the shared package directly. The MCP server serves external clients (Claude Desktop, etc.); the web app should call shared functions directly.

### Use `claude-sonnet-4-6` as the model

Sonnet 4.6 is the latest Sonnet, fast, capable with tool use, and cost-effective. For a POC where responses should feel interactive, Sonnet's speed matters more than Opus's reasoning depth.

**Rationale:** Tool-calling for structured data retrieval doesn't need Opus-level reasoning. Sonnet handles "fetch stats and summarize" well. Can always be changed later.

### Add time-series query functions to shared package

```
packages/shared/src/
  types.ts                    — add TimeSeriesPoint, TimeSeriesData types
  api/metrics.ts              — add fetchTimeSeries() function
```

`fetchTimeSeries(metric, options?)` fetches a specific metric's time-series data from the Metrics API. Supported metrics: `ic-node-count`, `registered-canisters-count`, `ic-subnet-total`, `cycle-burn-rate`. All four endpoints accept `start`, `end` (optional), and `step` query parameters for controlling the time range and resolution.

Returns `TimeSeriesData` (`Record<string, TimeSeriesPoint[]>`) — a map of response keys to parsed data points. Multi-key endpoints (e.g., `ic-node-count` returns both `total_nodes` and `up_nodes`) are preserved as separate keys.

Metric-to-key mapping:
- `ic-node-count` → `total_nodes`, `up_nodes`
- `registered-canisters-count` → `running_canisters`, `stopped_canisters`
- `ic-subnet-total` → `ic_subnet_total`
- `cycle-burn-rate` → `cycle_burn_rate`

Note: `average-cycle-burn-rate` is a separate endpoint that returns only a single flat pair `[string, string]` — NOT a time-series array. It is used by `fetchNetworkStats()` for the current snapshot but is NOT suitable for `fetchTimeSeries()`. The `cycle-burn-rate` endpoint returns proper time-series arrays `[[number, string], ...]`.

**Rationale:** This reuses the existing Metrics API integration and provides Claude with historical data. The function is generic enough to support any time-series endpoint.

### Define three tools for the chat

1. **`getNetworkStats`** — Returns current network statistics snapshot. No parameters. Calls existing `fetchNetworkStats()`.
2. **`getTimeSeries`** — Returns historical time-series data for a specific metric. Parameters: `metric` (enum of supported metrics). Calls new `fetchTimeSeries()`.
3. **`getGovernanceStats`** — Returns current governance metrics (neurons, proposals). No parameters. Extracts from existing `fetchNetworkStats()`.

**Rationale:** Three focused tools give Claude clear capabilities without overwhelming it. The metric enum in `getTimeSeries` constrains Claude to valid endpoints. Governance is separated so Claude can fetch it independently when the user asks specifically about governance.

### `ANTHROPIC_API_KEY` via environment variable

The API key is read server-side from `process.env.ANTHROPIC_API_KEY`. A `.env.local` file (gitignored) holds the key locally. The `anthropic()` provider from `@ai-sdk/anthropic` reads it automatically.

**Rationale:** Standard Next.js pattern. The key never reaches the browser. `.env.local` is already in `.gitignore` by default in Next.js projects.

### Chat UI is minimal

A single `Chat` client component with:
- A scrollable message list showing user and assistant messages
- Tool invocation indicators (e.g., "Fetching network stats...")
- A text input with submit button
- Basic Tailwind styling consistent with the existing page

**Rationale:** Functional, not polished. The goal is to prove the AI integration works end-to-end. Styling and UX refinements come later.

## Risks / Trade-offs

**[API key exposure]** If `ANTHROPIC_API_KEY` is missing, the chat route will fail. → Return a clear error message. Add a check in the route handler.

**[Cost accumulation]** Every chat message incurs API costs. No rate limiting in the POC. → Acceptable for personal/demo use.

**[Tool hallucination]** Claude might claim data it didn't fetch, or misinterpret tool results. → Keep the system prompt focused: "You are an ICP network data assistant. Use the provided tools to answer questions. Do not make up data."

**[Metrics API format changes]** Time-series endpoints could change format. → Zod schemas validate at runtime and fail fast. Already mitigated in the existing POC.
