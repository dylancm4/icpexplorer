# Roadmap

> Ordered list of what we plan to build next. Keep this up to date as priorities shift.

## Done

1. ~~**Wire web app to MCP server**~~ — Chat route consumes MCP server via stdio bridge with dynamic tool discovery

## Up Next

1. **Expand MCP server tools** — Build out the full ~15 tool set: account balances, canister info, NNS governance, SNS DAOs, ICRC tokens, pricing/cycles
2. **Add test coverage** — Unit tests for MCP server tools and shared data-fetching layer, integration tests for the MCP client bridge
3. **Frontend tests** — Component and interaction tests for the web app once the UI stabilizes beyond proof-of-concept
4. **Interactive data visualizations** — Chat-driven 2D visualizations of ICP network data (subnet topology, transaction flows, governance activity, token analytics). Users describe what they want to see and the AI generates explorable visualizations inline. Libraries TBD.
5. **3D network visualizations** — Upgrade select visualizations to 3D (e.g., interactive subnet/node topology). Builds on the 2D foundation from step 4.
