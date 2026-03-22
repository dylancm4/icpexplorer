## Why

The scaffold is complete but every package is a placeholder. Before building out the full ~15-tool MCP server and AI chat interface, we need a minimal end-to-end proof of concept that exercises all three packages with real ICP data. This validates the monorepo wiring, shared data layer, and developer workflow before investing in the full feature set.

## What Changes

- Add a `fetchNetworkStats()` function to `packages/shared` that calls the ICP Metrics API (`metrics-api.internetcomputer.org`) and returns structured network statistics
- Add shared TypeScript types and Zod schemas for network stats data
- Add a real `get_network_stats` MCP tool in `packages/mcp-server` that uses the shared fetch function (keep existing `ping` tool as health check)
- Add a live stats display page to `packages/web` that calls the shared fetch function via a Next.js route handler and renders ICP network statistics

## Capabilities

### New Capabilities
- `icp-data-layer`: Shared data-fetching functions and types for querying ICP REST APIs, starting with network statistics (node count, canister counts, subnet count, cycle burn rate, governance metrics). Always prefer `metrics-api.internetcomputer.org` over `ic-api.internetcomputer.org` when there is overlap between the two APIs.
- `mcp-network-stats-tool`: MCP tool `get_network_stats` that returns live ICP network statistics via the shared data layer
- `web-stats-display`: Web page displaying live ICP network statistics fetched via a Next.js route handler, proving the web app can consume the shared data layer

### Modified Capabilities

## Impact

- **packages/shared**: New source files for ICP API client, types, and Zod schemas. New dependency on `zod` (already in mcp-server, needs adding to shared).
- **packages/mcp-server**: New tool file, updated index.ts to register the tool. No new dependencies (already has everything needed).
- **packages/web**: New route handler, providers component, stats display component, and updated page and layout. No new dependencies needed (TanStack Query already installed; Zod validation is handled internally by the shared package).
- **External APIs**: Calls `metrics-api.internetcomputer.org` (public, no auth, no rate limits documented). Preferred over `ic-api.internetcomputer.org` for overlapping data.
