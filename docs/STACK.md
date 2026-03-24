# Tech Stack

> Single source of truth for the project's technology choices. Keep this up to date as the stack evolves.

## MCP Server (`packages/mcp-server`)

- **Language:** TypeScript
- **Protocol:** `@modelcontextprotocol/sdk` + Zod
- **ICP SDKs:** `@dfinity/agent`, `@dfinity/nns`, `@dfinity/sns`, `@dfinity/ledger-icp`, `@dfinity/ledger-icrc`, `@dfinity/cmc`
- **Build:** tsup (for npm publishing)

## Web Playground (`packages/web`)

- **Framework:** Next.js (App Router)
- **AI:** `ai` + `@ai-sdk/anthropic` (LLM chat with streaming + tool calls)
- **UI:** Tailwind + shadcn/ui
- **Data Fetching:** TanStack Query (ICP API data)

## Shared (`packages/shared`)

- **Types:** TypeScript types + Zod schemas
- **Data Fetching:** Shared functions used by both MCP server and web

## Tooling

- **Monorepo:** npm workspaces
- **Linting/Formatting:** Biome
- **Testing:** Vitest
- **Runtime:** Node.js 22 LTS

## Deploy

- **Web:** Vercel
- **MCP Server:** npm
