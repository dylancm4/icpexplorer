## Why

We need to scaffold a monorepo for two complementary products: an MCP server that lets AI assistants query the ICP blockchain, and a web playground at icpexplorer.org where users can ask natural language questions about ICP. The repo is currently empty (just research docs and OpenSpec config). Before any features can be built, we need the project structure, dependencies, build tooling, and configuration wired together.

## What Changes

- Initialize an npm workspaces monorepo with three packages: `packages/mcp-server`, `packages/web`, `packages/shared`
- Set up `packages/shared` as a TypeScript library with Zod schemas and shared types
- Set up `packages/mcp-server` as a TypeScript project with `@modelcontextprotocol/sdk`, `@icp-sdk/core`, `@icp-sdk/canisters`, Zod, and `tsup` for building
- Set up `packages/web` as a Next.js (App Router) project with Vercel AI SDK (`ai` + `@ai-sdk/anthropic`), Tailwind + shadcn/ui, and TanStack Query
- Configure Biome for linting/formatting across the monorepo
- Configure Vitest for testing across the monorepo
- Add root-level npm scripts for building, linting, and testing all packages
- Create a minimal working MCP server with a single placeholder tool
- Create a minimal Next.js app with a landing page

## Capabilities

### New Capabilities
- `mcp-server`: TypeScript MCP server package with @icp-sdk/core, @icp-sdk/canisters, @modelcontextprotocol/sdk, tsup build, stdio + streamable HTTP transports
- `web-playground`: Next.js App Router application with Vercel AI SDK, Tailwind + shadcn/ui, TanStack Query
- `shared-lib`: Shared TypeScript library with Zod schemas and types used by both MCP server and web playground
- `monorepo-tooling`: npm workspaces, Biome linting/formatting, Vitest testing, root-level orchestration scripts

### Modified Capabilities
None -- this is a greenfield scaffold.

## Impact

- **Dependencies**: @icp-sdk/core, @icp-sdk/canisters, @modelcontextprotocol/sdk, zod, tsup, next, ai, @ai-sdk/anthropic, tailwindcss, @tanstack/react-query, Biome, Vitest
- **Project structure**: Establishes the monorepo layout with packages/mcp-server, packages/web, packages/shared
- **Developer workflow**: Defines how to build, test, lint, and run each package for the lifetime of the project
