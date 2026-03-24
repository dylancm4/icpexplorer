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

A conversational AI frontend where users type natural language questions about ICP and get intelligent answers. Not a block explorer/dashboard — it's an AI-powered chat interface that uses the MCP server's data layer under the hood. Built with Next.js, Vercel AI SDK, and shadcn/ui.

## Tech stack

See [STACK.md](STACK.md) for the full tech stack reference.

## Monorepo structure

- `packages/mcp-server/` — the MCP server (publishable to npm)
- `packages/web/` — the AI playground (Next.js, deployed to Vercel)
- `packages/shared/` — shared ICP data-fetching logic, types & Zod schemas
