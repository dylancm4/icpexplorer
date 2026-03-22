## ADDED Requirements

### Requirement: Vite React TypeScript project structure
The frontend SHALL be a Vite + React + TypeScript application located at `frontend/app/` with an `index.html` entry point, `src/main.tsx` as the React root, and `dist/` as the build output directory.

#### Scenario: Project builds successfully
- **WHEN** `npm run build` is executed in `frontend/app/`
- **THEN** a production bundle is generated in `frontend/app/dist/` containing `index.html` and hashed asset files

#### Scenario: Dev server starts
- **WHEN** `npm run dev` is executed in `frontend/app/`
- **THEN** a local development server starts with hot module replacement enabled

### Requirement: TanStack Router with file-based routing
The frontend SHALL use TanStack Router with file-based route generation. Route files SHALL be placed in `src/routes/` and the route tree SHALL be auto-generated via the `@tanstack/router-plugin/vite` plugin.

#### Scenario: Root route renders
- **WHEN** a user navigates to `/`
- **THEN** the root route component from `src/routes/index.tsx` renders inside the root layout

#### Scenario: Route tree auto-generation
- **WHEN** a new file is added to `src/routes/`
- **THEN** the `routeTree.gen.ts` file is automatically regenerated to include the new route

### Requirement: TanStack Query configured
The frontend SHALL have TanStack Query configured with a `QueryClientProvider` wrapping the application root, ready for use in components.

#### Scenario: Query client is available
- **WHEN** any component in the application calls `useQuery`
- **THEN** the query executes using the globally configured `QueryClient`

### Requirement: Tailwind CSS and shadcn/ui configured
The frontend SHALL use Tailwind CSS for utility-first styling and shadcn/ui initialized with the "new-york" style and CSS variables for theming.

#### Scenario: Tailwind classes apply
- **WHEN** a Tailwind utility class (e.g., `text-red-500`) is used on an element
- **THEN** the corresponding CSS is included in the build output and the element is styled correctly

#### Scenario: shadcn/ui component can be added
- **WHEN** `npx shadcn@latest add button` is run in `frontend/app/`
- **THEN** a Button component is generated in the configured components directory using the project's Tailwind theme

### Requirement: Minimal landing page
The frontend SHALL include a minimal landing page at the root route that calls the backend canister's `greet` function and displays the result, demonstrating the full stack works end-to-end.

#### Scenario: Landing page renders with backend response
- **WHEN** a user opens the application in a browser
- **THEN** the page calls the backend `greet` function and displays the greeting returned by the canister

### Requirement: TypeScript bindings from Candid
The frontend SHALL use the `@icp-sdk/bindgen` Vite plugin to auto-generate TypeScript bindings from the backend's `backend.did` file. Generated bindings SHALL be output to `src/backend/api/`.

#### Scenario: Bindings are generated on build
- **WHEN** the frontend is built
- **THEN** TypeScript types and actor factories matching the backend Candid interface are generated in `src/backend/api/`
