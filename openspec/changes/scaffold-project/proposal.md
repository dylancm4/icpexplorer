## Why

We are starting the project from a completely empty repository. Before any features can be built, we need a fully configured development environment with all tooling wired together: frontend build pipeline, backend canister setup, linting, formatting, testing, and deployment configuration. This is the foundational scaffolding that every future change will build upon.

## What Changes

- Initialize a Vite + React + TypeScript frontend app in `frontend/app/` following the standard ICP project layout
- Configure TanStack Router for type-safe client-side routing
- Configure TanStack Query for data fetching and caching
- Set up Tailwind CSS and shadcn/ui for styling and UI components
- Configure Biome for linting and formatting
- Configure Vitest for unit testing
- Create a Motoko backend canister in `backend/` with a minimal actor, Candid interface, and `canister.yaml`
- Set up `icp.yaml` at the project root referencing both frontend and backend canisters
- Configure `@icp-sdk/bindgen` Vite plugin for auto-generating TypeScript bindings from the backend Candid interface
- Add `.ic-assets.json5` in `public/` with SPA routing (`enable_aliasing`) and security headers
- Configure local network with Internet Identity support (`ii: true`)
- Add a `.gitignore` covering Node, ICP (`.icp/cache/`), and build artifacts
- Create a minimal landing page to verify the full stack works end-to-end

## Capabilities

### New Capabilities
- `frontend-build`: Vite + React + TypeScript build pipeline with Tailwind, shadcn/ui, TanStack Router, and TanStack Query configured
- `backend-canister`: Motoko backend canister with canister.yaml, Candid interface, and icp CLI build/deploy configuration
- `dev-tooling`: Biome linting/formatting and Vitest testing setup
- `icp-deployment`: icp.yaml configuration with asset canister (frontend) and Motoko canister (backend) recipes, local network with Internet Identity, and SPA routing via .ic-assets.json5

### Modified Capabilities
None — this is a greenfield project.

## Impact

- **Dependencies**: React, TypeScript, Vite, TanStack Router, TanStack Query, Tailwind CSS, shadcn/ui, Biome, Vitest, @icp-sdk/auth, @icp-sdk/bindgen, and @icp-sdk/core packages will be added
- **Project structure**: Establishes the standard ICP project layout with `frontend/app/` for the React SPA, `backend/` for the Motoko canister, `icp.yaml` at the root, and `canister.yaml` in each canister directory
- **Developer workflow**: Defines how to run the dev server, build, test, lint, format, and deploy for the lifetime of the project
