## 1. Root Configuration

- [ ] 1.1 Create root `package.json` with npm workspaces pointing to `packages/*`
- [ ] 1.2 Create `tsconfig.base.json` with shared TypeScript settings (strict, ES2022, NodeNext module resolution)
- [ ] 1.3 Create `biome.json` with recommended linting and formatting defaults
- [ ] 1.4 Create `vitest.workspace.ts` referencing all three packages
- [ ] 1.5 Update `.gitignore` for Node, Next.js (`.next/`), build artifacts (`dist/`), and environment files

## 2. Shared Package

- [ ] 2.1 Create `packages/shared/package.json` with name `@icpexplorer/shared`, TypeScript as dev dependency
- [ ] 2.2 Create `packages/shared/tsconfig.json` extending root base config
- [ ] 2.3 Create `packages/shared/src/index.ts` with a placeholder export

## 3. MCP Server Package

- [ ] 3.1 Create `packages/mcp-server/package.json` with `@modelcontextprotocol/sdk`, `@icp-sdk/core`, `@icp-sdk/canisters`, `zod` as dependencies, `tsup` as dev dependency, and `@icpexplorer/shared` as workspace dependency
- [ ] 3.2 Create `packages/mcp-server/tsconfig.json` extending root base config
- [ ] 3.3 Create `packages/mcp-server/tsup.config.ts` with entry point, ESM output, and DTS generation
- [ ] 3.4 Create `packages/mcp-server/src/index.ts` with a minimal MCP server that registers a single placeholder tool and supports stdio transport
- [ ] 3.5 Create `packages/mcp-server/src/tools/` directory with an empty placeholder

## 4. Web Playground Package

- [ ] 4.1 Initialize Next.js App Router project in `packages/web/` with TypeScript
- [ ] 4.2 Install and configure Tailwind CSS
- [ ] 4.3 Initialize shadcn/ui with default style and CSS variables
- [ ] 4.4 Install Vercel AI SDK (`ai`, `@ai-sdk/anthropic`) and TanStack Query (`@tanstack/react-query`)
- [ ] 4.5 Add `@icpexplorer/shared` as workspace dependency
- [ ] 4.6 Configure `next.config.ts` with `transpilePackages: ['@icpexplorer/shared']`
- [ ] 4.7 Create minimal `src/app/layout.tsx` and `src/app/page.tsx` landing page

## 5. Root Scripts and Integration

- [ ] 5.1 Add root npm scripts: `build`, `dev`, `lint`, `format`, `test` that run across all packages
- [ ] 5.2 Run `npm install` and verify all workspace dependencies resolve
- [ ] 5.3 Run `npm run build` and verify all packages build successfully
- [ ] 5.4 Run `npm run lint` and verify Biome passes
- [ ] 5.5 Run `npm test` and verify Vitest runs (even with no tests yet)
