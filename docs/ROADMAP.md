# Roadmap

> Ordered list of what we plan to build next. Keep this up to date as priorities shift.

## Up Next

1. **Rebuild Chat UI with shadcn/ui** — Replace the POC chat component with shadcn primitives (Card, ScrollArea, Button, etc.), add markdown rendering for assistant responses, and fix auto-scroll
2. **Wire web app to MCP server** — The chat route currently calls shared data-fetching functions directly. It should consume the MCP server instead, making the web app a live demo of the MCP server's capabilities
3. **Expand MCP server tools** — Build out the full ~15 tool set: account balances, canister info, NNS governance, SNS DAOs, ICRC tokens, pricing/cycles
