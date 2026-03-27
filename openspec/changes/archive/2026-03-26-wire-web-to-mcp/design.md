## Context

The web app's chat route defines three AI SDK tools inline that import directly from `@icpexplorer/shared`. The MCP server has only one tool (`get_network_stats`). The two systems are disconnected.

The ICP Dashboard consists of 5 REST APIs with 150+ endpoints. Per MCP best practices (modelcontextprotocol.io/community/design-principles), tools should map to user intents with `snake_case` `verb_noun` naming.

## Goals / Non-Goals

**Goals:**
- Web app chat route consumes MCP server tools instead of calling shared functions directly
- MCP server tool set covers the current chat route capabilities (network metrics, time series, governance)
- Tool interface scales to 100+ metrics without adding new tools
- Adding a new MCP tool automatically makes it available in the chat UI

**Non-Goals:**
- Implementing the full ~15-tool set (that's the next roadmap item)
- Response caching in the MCP server (future optimization)
- HTTP/SSE transport for the MCP server (stdio is the standard MCP transport)
- Changing the chat UI or user-facing behavior

## Decisions

### 1. Two symmetrical tools: `get_metrics` + `get_time_series`

| MCP Tool | Replaces (chat route) | What it does |
|----------|----------------------|--------------|
| `get_metrics` | `getNetworkStats` + `getGovernanceStats` | Current value(s) of one or more named metrics. Accepts `metrics: string \| string[]`. |
| `get_time_series` | `getTimeSeries` | Historical data for one named metric. Params: `metric` (string), `start` (Unix timestamp), optional `end` (defaults to now), optional `step` (aggregation interval). |

These two tools are symmetrical: same metric namespace, one returns current values, the other returns historical data. This scales naturally — adding a new metric means adding it to the enum, not creating a new tool.

`get_metrics` accepts a single metric or an array so the LLM can batch "give me a network overview" into `["node_count", "subnet_count", "canister_count", "cycle_burn_rate"]` in a single call, rather than making 4 separate tool calls (which would consume the step budget).

**Alternative considered:** Separate `get_network_metrics` and `get_governance_metrics` tools with opinionated groupings. Rejected because the groupings are arbitrary, don't scale, and create an asymmetry with `get_time_series` which is already metric-agnostic.

**Future optimization:** Some API endpoints (e.g., `governance-metrics`) return 30+ metrics in one response. A short-lived TTL cache (30-60s) on raw API responses would avoid redundant calls when the LLM requests related metrics in sequence. Not needed now — all current metrics come from different endpoints.

**Future tools** (not in this change, but the interface accommodates):
- `get_canister_info`, `list_proposals` / `get_proposal`, `get_account_balance` / `get_transactions`, `list_sns_daos`, `get_token_info` / `get_token_balance`, `get_icp_price`

### 2. In-process stdio bridge (singleton, lazy)

The MCP client spawns the MCP server as a child process and communicates over stdio. This matches how Claude Desktop and other MCP hosts work.

- **Singleton**: one shared client instance, spawned lazily on first request
- **Why stdio over HTTP**: stdio is the standard MCP transport, avoids adding an HTTP server, and the MCP SDK handles it cleanly
- **Child process lifecycle**: the bridge module detects disconnection and respawns on next request

**Alternative considered:** HTTP/SSE transport. Rejected because it adds deployment complexity (two running services) and isn't how MCP servers are typically consumed.

### 3. Dynamic tool bridging from MCP metadata

The bridge calls `client.listTools()` to discover available tools, then generates AI SDK `tool()` definitions from the MCP tool schemas (name, description, inputSchema). Tool execution calls `client.callTool()`.

Adding a new tool to the MCP server automatically exposes it in the chat route with zero web package changes.

**Alternative considered:** Manual AI SDK tool wrappers per MCP tool. Rejected because it duplicates definitions.

### 4. Tool registration pattern

Each tool is a standalone file in `packages/mcp-server/src/tools/` exporting a `register*()` function that takes the `McpServer` instance. This pattern already exists. New tools follow the same convention:
- `get-metrics.ts` (replaces `get-network-stats.ts`)
- `get-time-series.ts` (new)

Tools use Zod schemas from `@icpexplorer/shared` for input validation and call the shared data-fetching layer.

### 5. Naming convention

Following MCP community standards and reference servers (GitHub MCP, Stripe MCP):
- `snake_case` tool names
- `verb_noun` format: `get_metrics`, `get_time_series`, `list_proposals`
- Domain prefix only when disambiguation is needed (e.g., future `sns_list_proposals` vs `nns_list_proposals`)

## Risks / Trade-offs

- **Child process lifecycle** — MCP server process could crash. Mitigation: bridge detects disconnection and respawns on next request.
- **Cold start latency** — First request spawns the child process. Acceptable for a demo app; could add warmup in the future.
- **Multiple API calls per `get_metrics`** — Requesting metrics from different API endpoints requires parallel fetches. Acceptable for now; a response cache would mitigate this in the future.
- **Stdio in serverless** — Vercel serverless functions have process lifecycle constraints. May need to revisit for production Vercel deployment. Fine for development and self-hosted.
