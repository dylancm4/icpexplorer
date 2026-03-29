# ICP Explorer

> Single source of truth for what this project is and why it exists. Keep this up to date as the project evolves.

## 1. icp-mcp-server (open source, npm package)

A standalone MCP server that lets any AI assistant (Claude, Cursor, ChatGPT, etc.) query and explore the ICP blockchain. ~15 read-only tools covering:

- Account balances & transaction history
- Canister info (controllers, module hash, subnet)
- NNS governance (proposals, neurons, known neurons)
- SNS DAOs (list, metadata, proposals)
- ICRC token data (any token — ckBTC, ckETH, ckUSDC, SNS tokens)
- Network stats (subnets, nodes, cycle burn rates)
- ICP pricing & cycles conversion rates

No auth needed. Data comes from 5 public DFINITY REST APIs + direct anonymous canister queries via `@icp-sdk/core` and `@icp-sdk/canisters`. Think "Tatum for ICP."

## 2. icpexplorer.org (web app)

A conversational AI frontend where users type natural language questions about ICP and get intelligent answers powered by the MCP server's data layer. Built with Next.js, Vercel AI SDK, and shadcn/ui.

Beyond chat, the web app will feature **interactive data visualizations** that users can create through conversation. Instead of static dashboards, users describe what they want to see and the AI generates rich, explorable visualizations:

- **Network topology** — subnet structure, data centers, node providers, node machines as interactive force-directed graphs
- **Transaction flows** — ICP movement between accounts and canisters as animated flow diagrams
- **Governance activity** — NNS proposal voting patterns, neuron distributions as heatmaps and chord diagrams
- **Token analytics** — ICRC token metrics, liquidity, and holder distributions as dynamic charts

The goal is to make ICP network data not just queryable but *visual and explorable* — combining conversational AI with creative 2D (and eventually 3D) data visualization.

## Tech stack

See [STACK.md](STACK.md) for the full tech stack reference.

## Monorepo structure

- `packages/mcp-server/` — the MCP server (publishable to npm)
- `packages/web/` — the AI playground (Next.js, deployed to Vercel)
- `packages/shared/` — shared ICP data-fetching logic, types & Zod schemas
