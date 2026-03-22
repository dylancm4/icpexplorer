## Context

The monorepo scaffold is complete with three packages (`shared`, `mcp-server`, `web`) but all contain placeholder code. The MCP server has only a `ping` tool. The web app is a static landing page. The shared package exports a placeholder string.

We need a minimal end-to-end proof of concept that flows real ICP data through all three packages. The ICP Metrics API at `metrics-api.internetcomputer.org` provides public, unauthenticated REST endpoints returning JSON — ideal for a quick POC.

## Goals / Non-Goals

**Goals:**
- A shared data-fetching function that retrieves live ICP network statistics from the Metrics API
- An MCP tool `get_network_stats` that returns formatted stats to any MCP client
- A web page that displays live stats using TanStack Query, proving the shared data layer works end-to-end
- All builds, lints, and tests still pass

**Non-Goals:**
- Canister queries via `@icp-sdk/core` (that's a later change — REST APIs first)
- AI chat interface or Vercel AI SDK integration
- Multiple MCP tools (just one real tool + the existing ping)
- Production-ready error handling, caching, or retry logic
- Styling beyond basic Tailwind — functional, not polished

## Decisions

### Use Metrics API as the sole data source

The Metrics API (`metrics-api.internetcomputer.org`) is preferred over the IC API (`ic-api.internetcomputer.org`) when there is overlap. For the POC, we'll call these endpoints:

| Endpoint | Data |
|----------|------|
| `/api/v1/ic-node-count` | Total and active node counts |
| `/api/v1/registered-canisters-count` | Running and stopped canisters |
| `/api/v1/ic-subnet-total` | Number of subnets |
| `/api/v1/average-cycle-burn-rate` | Current cycle burn rate |
| `/api/v1/governance-metrics` | Total neurons, total proposals (extracted by name from 81+ metrics) |

Response formats vary by endpoint (verified via live API calls):

- **Time-series endpoints** (`ic-node-count`, `registered-canisters-count`, `ic-subnet-total`) return `{ key: [[timestamp_number, "value_string"], ...] }` — take the last entry, parse value to number.
- **`average-cycle-burn-rate`** returns `{ average_cycle_burn_rate: ["timestamp_string", "value_string"] }` — a single flat pair, not a nested array.
- **`governance-metrics`** returns `{ metrics: [{ name: string, subsets: [{ metric: {...}, value: ["timestamp_string", "value_string"] }] }] }` — 81+ named metrics. For the POC we extract `governance_neurons_total` and `governance_proposals_total` by name.
- **All numeric values are strings** and must be parsed to numbers. Some counts (e.g., `registered-canisters-count`) return interpolated floats — round to integers for display.

**Rationale:** REST is simpler than canister queries for a POC. No SDK initialization, no Candid encoding, no agent setup. The Metrics API provides everything we need for a compelling stats display.

### Shared package owns types, schemas, and fetch logic

```
packages/shared/src/
  index.ts              — re-exports public API
  types.ts              — NetworkStats type
  schemas.ts            — Zod schemas for API responses
  api/
    metrics.ts          — fetchNetworkStats() implementation
```

The shared package adds `zod` as a dependency. Both `mcp-server` and `web` import from `@icpexplorer/shared`.

**Rationale:** This proves the shared package pattern works. The same `fetchNetworkStats()` is called by both the MCP tool handler and the Next.js route handler.

### MCP tool returns structured text

The `get_network_stats` tool takes no parameters and returns a formatted text block with all stats. MCP tools return `content: [{ type: "text", text: "..." }]` — we'll format the stats as a readable summary.

**Rationale:** Keep it simple. A single no-args tool is the easiest to test and verify. Later tools will accept parameters with Zod schemas.

### Web app uses TanStack Query + Next.js route handler

```
packages/web/src/app/
  api/stats/route.ts        — GET handler, calls fetchNetworkStats()
  page.tsx                  — server component shell
  providers.tsx             — QueryClientProvider wrapper
  components/
    network-stats.tsx       — client component using useQuery()
```

The route handler calls the shared `fetchNetworkStats()` server-side and returns JSON. The `network-stats.tsx` client component uses TanStack Query's `useQuery()` to fetch from `/api/stats` with automatic caching, refetching, and loading/error states. A `QueryClientProvider` wraps the app in `providers.tsx`.

**Rationale:** TanStack Query is already installed and is the right abstraction for async data fetching in the web app. It gives us loading states, error handling, and automatic refetching out of the box — even for a POC, this is simpler than raw `useState`/`useEffect` and sets the right pattern for future tools.

### Keep ping tool alongside new tool

The existing `ping` tool stays as a health check. The new `get_network_stats` tool is registered in a separate file and imported into `index.ts`.

**Rationale:** `ping` is useful for MCP client connectivity testing. Don't remove working functionality.

## Risks / Trade-offs

**[Metrics API response format uncertainty]** The OpenAPI spec doesn't fully document response shapes. We've verified the actual formats via live API calls (documented above), but they could change without notice since this API has no stability guarantees. → Zod schemas validate at runtime and will fail fast with clear errors if the format changes.

**[Metrics API availability]** The API is public but not officially documented as stable. → Acceptable for a POC. If it goes down, the tool/page will show errors. Production hardening comes later.

**[Shared package transpilation in Next.js]** `transpilePackages: ['@icpexplorer/shared']` is already configured. → Should work. Verify during integration that the shared package's ESM exports are consumed correctly by both tsup (mcp-server) and Next.js (web).
