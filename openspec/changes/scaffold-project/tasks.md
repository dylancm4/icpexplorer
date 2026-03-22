## 1. Project Root Setup

- [ ] 1.1 Create `.gitignore` covering Node, ICP (`.icp/cache/`), build artifacts (`dist/`), and auto-generated files (`routeTree.gen.ts`, `src/backend/api/`)
- [ ] 1.2 Create `icp.yaml` at project root referencing `backend` and `frontend` canisters, with local network configured for Internet Identity (`ii: true`)

## 2. Backend Canister

- [ ] 2.1 Create `backend/canister.yaml` with `@dfinity/motoko` recipe pointing to `src/main.mo` and `backend.did`
- [ ] 2.2 Create `backend/mops.toml` for Motoko package management
- [ ] 2.3 Create `backend/src/main.mo` with a minimal actor exposing a `greet` function
- [ ] 2.4 Create `backend/backend.did` Candid interface matching the actor

## 3. Frontend Initialization

- [ ] 3.1 Initialize Vite + React + TypeScript project in `frontend/app/` with `index.html`, `src/main.tsx`, and TypeScript configs
- [ ] 3.2 Create `frontend/canister.yaml` with `@dfinity/asset-canister` recipe pointing to `dist/` with build commands
- [ ] 3.3 Configure `vite.config.ts` with React plugin, `@icp-sdk/bindgen` plugin, and dev server proxy for local canister
- [ ] 3.4 Create `frontend/app/public/.ic-assets.json5` with SPA aliasing and cache headers

## 4. Routing and Data Fetching

- [ ] 4.1 Install and configure TanStack Router with file-based routing via `@tanstack/router-plugin/vite`
- [ ] 4.2 Create root layout route in `src/routes/__root.tsx`
- [ ] 4.3 Create index route in `src/routes/index.tsx` with a minimal landing page
- [ ] 4.4 Install and configure TanStack Query with `QueryClientProvider` in the app root

## 5. Styling

- [ ] 5.1 Install and configure Tailwind CSS
- [ ] 5.2 Initialize shadcn/ui with "new-york" style and CSS variables

## 6. Dev Tooling

- [ ] 6.1 Install Biome and create `biome.json` with recommended linting and formatting defaults
- [ ] 6.2 Install Vitest and configure it in `vite.config.ts` with jsdom environment
- [ ] 6.3 Add npm scripts to `package.json`: `dev`, `build`, `preview`, `check`, `format`, `test`

## 7. Verification

- [ ] 7.1 Run `npm run build` in `frontend/app/` and verify production bundle is generated
- [ ] 7.2 Run `npx biome check` and verify all files pass
- [ ] 7.3 Run `npx vitest run` and verify test runner works
- [ ] 7.4 Run `icp build` from project root and verify both canisters build
