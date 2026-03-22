## 1. Shared Data Layer

- [ ] 1.1 Add `zod` as a dependency to `packages/shared/package.json`
- [ ] 1.2 Create `packages/shared/src/types.ts` with `NetworkStats` type
- [ ] 1.3 Create `packages/shared/src/schemas.ts` with Zod schemas for Metrics API responses and `networkStatsSchema`
- [ ] 1.4 Create `packages/shared/src/api/metrics.ts` with `fetchNetworkStats()` that calls the 5 Metrics API endpoints and returns a `NetworkStats` object
- [ ] 1.5 Update `packages/shared/src/index.ts` to re-export types, schemas, and `fetchNetworkStats`
- [ ] 1.6 Verify shared package builds (`npm run build -w packages/shared` or root build)

## 2. MCP Server Tool

- [ ] 2.1 Create `packages/mcp-server/src/tools/get-network-stats.ts` that registers `get_network_stats` tool using `registerTool()`, calling `fetchNetworkStats()` from shared and formatting the result as labeled text lines
- [ ] 2.2 Update `packages/mcp-server/src/index.ts` to import the new tool registration (keep `ping` tool)
- [ ] 2.3 Verify MCP server builds (`npm run build -w packages/mcp-server`)

## 3. Web Stats Display

- [ ] 3.1 Create `packages/web/src/app/providers.tsx` with `QueryClientProvider` wrapper
- [ ] 3.2 Update `packages/web/src/app/layout.tsx` to wrap children with the providers component
- [ ] 3.3 Create `packages/web/src/app/api/stats/route.ts` GET handler that calls `fetchNetworkStats()` and returns JSON
- [ ] 3.4 Create `packages/web/src/app/components/network-stats.tsx` client component using `useQuery()` to fetch `/api/stats` and display labeled stats with loading and error states
- [ ] 3.5 Update `packages/web/src/app/page.tsx` to include the `NetworkStats` component
- [ ] 3.6 Verify web app builds and stats display in dev mode (`npm run dev -w packages/web`)

## 4. Integration Verification

- [ ] 4.1 Run `npm run build` (all packages build)
- [ ] 4.2 Run `npm run lint` (Biome passes)
- [ ] 4.3 Run `npm test` (Vitest passes)
