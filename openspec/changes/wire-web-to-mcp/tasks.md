## 1. MCP Server Tools

- [ ] 1.1 Replace `get-network-stats.ts` with `get-metrics.ts` implementing the `get_metrics` tool (accepts `metrics: string | string[]`, returns keyed values)
- [ ] 1.2 Create `get-time-series.ts` with `get_time_series` tool (metric string, start, optional end, optional step)
- [ ] 1.3 Update `index.ts` to register both tools and remove old registration
- [ ] 1.4 Verify MCP server builds successfully (`npm run build` in mcp-server)

## 2. MCP Client Bridge

- [ ] 2.1 Add `@modelcontextprotocol/sdk` dependency to `packages/web`
- [ ] 2.2 Create `packages/web/src/lib/mcp-client.ts` with singleton lazy client that spawns MCP server via stdio
- [ ] 2.3 Implement `getTools()` function that calls `client.listTools()` and generates AI SDK `tool()` definitions
- [ ] 2.4 Implement `callTool()` function that delegates to `client.callTool()` and parses results

## 3. Wire Chat Route

- [ ] 3.1 Replace inline tool definitions in `route.ts` with MCP-bridged tools from the client bridge
- [ ] 3.2 Remove direct `@icpexplorer/shared` imports from the chat route
- [ ] 3.3 Verify chat functionality works end-to-end (network metrics, time series, governance queries)

## 4. Cleanup

- [ ] 4.1 Update `docs/STACK.md` to reflect MCP client bridge in web package
