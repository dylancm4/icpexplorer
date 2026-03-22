## ADDED Requirements

### Requirement: Root icp.yaml references both canisters
The project root SHALL contain an `icp.yaml` that references the `backend` and `frontend` canisters. The canisters themselves SHALL be configured via `canister.yaml` files in their respective directories.

#### Scenario: icp.yaml is valid
- **WHEN** `icp deploy` is run from the project root
- **THEN** the icp CLI locates and processes both canister configurations without errors

### Requirement: Frontend asset canister configuration
The frontend's `canister.yaml` SHALL use the `@dfinity/asset-canister` recipe with `dist` as the asset directory and build commands that install dependencies and run the production build.

#### Scenario: Frontend canister deploys assets
- **WHEN** `icp deploy frontend` is run against a local network
- **THEN** the frontend is built and its assets are uploaded to the asset canister

### Requirement: SPA routing via .ic-assets.json5
The frontend SHALL include a `.ic-assets.json5` file in `public/` that enables `enable_aliasing` for SPA route fallback and sets appropriate cache headers (immutable for hashed assets, no-cache for HTML).

#### Scenario: SPA routing works on asset canister
- **WHEN** a user navigates directly to a sub-route (e.g., `/about`) on the deployed asset canister
- **THEN** `index.html` is served and the client-side router handles the route (no 404)

### Requirement: Local network with Internet Identity
The `icp.yaml` SHALL configure the local network with `ii: true` to start a local Internet Identity canister for development.

#### Scenario: Local II is available
- **WHEN** `icp network start -d` is run
- **THEN** a local Internet Identity canister is started and accessible for authentication testing

### Requirement: Gitignore covers ICP artifacts
The project `.gitignore` SHALL exclude `.icp/cache/`, `node_modules/`, `dist/`, and auto-generated files (`routeTree.gen.ts`, `src/backend/api/`), while preserving `.icp/data/` (which contains canister IDs).

#### Scenario: Build artifacts are not tracked
- **WHEN** `icp build` and `npm run build` have been run
- **THEN** `git status` shows no untracked files in `.icp/cache/`, `node_modules/`, `dist/`, or auto-generated directories
