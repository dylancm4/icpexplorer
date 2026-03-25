## Why

The web app's chat route (`/api/chat`) currently imports shared data-fetching functions directly from `@icpexplorer/shared` and defines AI SDK tools inline. Meanwhile, the MCP server has only one tool (`get_network_stats`). The two systems are disconnected — the web app doesn't use or demonstrate the MCP server at all.

Wiring the chat route through the MCP server makes the web app a live demo of the MCP server's capabilities, ensures feature parity, and means adding a new MCP tool automatically surfaces it in the chat UI.

This change also establishes the MCP tool interface that will scale to 100+ metrics without rework. The 5 ICP Dashboard APIs expose 150+ REST endpoints. Per MCP best practices, tools should map to user intents — not REST endpoints. Our design uses two symmetrical tools: one for current values, one for historical data.

## What Changes

- Replace the MCP server's single `get_network_stats` tool with two symmetrical tools: `get_metrics` (current values) and `get_time_series` (historical data)
- Add an in-process MCP client bridge in the web package that spawns the MCP server via stdio and dynamically derives AI SDK tools from MCP tool metadata
- Replace the chat route's inline tool definitions with the bridge, so it consumes MCP server tools instead of calling shared functions directly

## Capabilities

### New Capabilities
- `mcp-client-bridge`: In-process MCP client that spawns the MCP server and bridges its tools into the Vercel AI SDK chat route
- `mcp-metrics-tool`: Two symmetrical MCP server tools — `get_metrics` for current value(s) of named metrics, `get_time_series` for historical data of a named metric

### Modified Capabilities
- `ai-chat`: Chat route will consume tools from MCP server via the bridge instead of defining them inline

### Removed Capabilities
- `mcp-network-stats-tool`: Replaced by the more general `mcp-metrics-tool`

## Impact

- `packages/mcp-server/src/tools/` — replace existing tool, add new tools
- `packages/mcp-server/src/index.ts` — register new tools
- `packages/web/src/app/api/chat/route.ts` — replace inline tools with MCP bridge
- `packages/web/src/lib/` — new MCP client bridge module
- `packages/web/package.json` — add `@modelcontextprotocol/sdk` dependency
