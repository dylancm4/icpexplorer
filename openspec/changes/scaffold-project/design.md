## Context

The repository contains research documents and OpenSpec configuration but no application code. We need to scaffold a monorepo for an off-chain MCP server + web playground. The MCP server queries the ICP blockchain via public REST APIs and direct canister calls. The web playground is a Next.js app that provides a conversational AI interface to the same data.

Both products share data-fetching logic and types, which live in a shared package.

## Goals / Non-Goals

**Goals:**
- A working monorepo where `npm install` at the root installs all dependencies
- `packages/mcp-server` builds to a publishable npm package via tsup
- `packages/web` builds and runs as a Next.js dev server
- `packages/shared` is consumed by both mcp-server and web as a workspace dependency
- Biome and Vitest configured and working across all packages
- A minimal MCP server that starts and responds to the MCP `initialize` handshake
- A minimal Next.js app that renders a landing page

**Non-Goals:**
- Implementing any MCP tools (that's the next change)
- Implementing the AI chat interface (that's a later change)
- Setting up CI/CD pipelines
- Configuring Vercel deployment
- Adding any ICP data-fetching logic

## Decisions

### Monorepo structure

```
icpexplorer/
├── packages/
│   ├── mcp-server/
│   │   ├── src/
│   │   │   ├── index.ts          (entry point, MCP server setup)
│   │   │   └── tools/            (tool definitions, empty for now)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── tsup.config.ts
│   ├── web/
│   │   ├── src/
│   │   │   └── app/              (Next.js App Router)
│   │   │       ├── layout.tsx
│   │   │       └── page.tsx
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   ├── tsconfig.json
│   │   └── tailwind.config.ts
│   └── shared/
│       ├── src/
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── research/                     (existing research docs, unchanged)
├── openspec/                     (existing OpenSpec config, unchanged)
├── package.json                  (root workspace config)
├── biome.json                    (root-level, applies to all packages)
├── tsconfig.base.json            (shared TypeScript config)
├── vitest.workspace.ts           (Vitest workspace config)
└── .gitignore
```

**Rationale:** npm workspaces with a flat `packages/` directory. Biome config at the root applies to everything. Each package has its own `tsconfig.json` that extends a shared base. Vitest uses workspace mode to run tests across all packages.

### npm workspaces (not pnpm, not Turborepo)

Use npm workspaces for simplicity. For a 3-package monorepo, the overhead of pnpm or Turborepo isn't justified. npm workspaces are built-in, require no extra tooling, and work everywhere.

### tsup for MCP server build

tsup (esbuild-based) bundles the MCP server into a single distributable file for npm publishing. It's fast, zero-config for simple libraries, and handles TypeScript natively.

The MCP server package.json will define:
- `bin` field for CLI usage (`npx @anthropic/icp-mcp` or similar)
- `main`/`module`/`types` fields for programmatic import

### Next.js App Router for web playground

App Router is the current standard for Next.js. It provides:
- Server Components (default) for the landing page and static content
- Route Handlers for the AI chat API endpoint (Vercel AI SDK integration)
- Built-in file-based routing

### Shared package as internal workspace dependency

`packages/shared` is referenced by the other packages as `"@icpexplorer/shared": "workspace:*"` in their package.json. It's not published to npm -- it's an internal workspace dependency.

The shared package exports:
- TypeScript types (ICP data models, tool input/output schemas)
- Zod schemas (validation for MCP tool inputs, API responses)
- Data-fetching functions (used by both MCP server tools and web API routes)

For the scaffold, this package will be mostly empty -- just the structure and a placeholder export.

### Biome at the root level

Single `biome.json` at the project root. Biome discovers it automatically regardless of which subdirectory you're in. No need for per-package configs.

### Vitest workspace mode

`vitest.workspace.ts` at the root defines all packages as test targets. Each package can have its own test files alongside source code. Running `npm test` at the root runs all tests.

### TypeScript project references

Each package has its own `tsconfig.json` extending `tsconfig.base.json` at the root. This ensures consistent compiler settings (strict mode, ES2022 target, Node module resolution) while allowing per-package customization.

## Risks / Trade-offs

**[npm workspace linking]** Workspace dependencies use symlinks. If `@icp-sdk/core` or `@icp-sdk/canisters` have issues with hoisted dependencies, we may need to add overrides. -> Monitor during setup, add overrides if needed.

**[Next.js + workspace packages]** Next.js sometimes struggles with transpiling workspace packages. We may need `transpilePackages: ['@icpexplorer/shared']` in `next.config.ts`. -> Add it proactively.

**[tsup bundling workspace deps]** tsup needs to be told whether to bundle or externalize workspace dependencies. For the MCP server, we want to bundle `@icpexplorer/shared` but externalize `@icp-sdk/*`. -> Configure explicitly in `tsup.config.ts`.
