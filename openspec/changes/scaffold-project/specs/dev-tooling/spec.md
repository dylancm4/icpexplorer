## ADDED Requirements

### Requirement: Biome for linting and formatting
The frontend SHALL use Biome as the sole linting and formatting tool, configured via `biome.json` in `frontend/app/`. The configuration SHALL enable both linting and formatting with Biome's recommended defaults.

#### Scenario: Biome checks pass on scaffolded code
- **WHEN** `npx biome check` is run in `frontend/app/`
- **THEN** all files pass linting and formatting checks with no errors

#### Scenario: Biome formats code
- **WHEN** `npx biome check --write` is run in `frontend/app/`
- **THEN** all TypeScript and JSON files are formatted according to Biome's rules

### Requirement: Vitest for unit testing
The frontend SHALL use Vitest as the test runner, configured in `vite.config.ts` with jsdom as the test environment.

#### Scenario: Vitest runs with no tests
- **WHEN** `npx vitest run` is executed in `frontend/app/`
- **THEN** the test runner executes and exits cleanly with a "no tests found" message or similar (not an error)

#### Scenario: A sample test can run
- **WHEN** a test file is added to `src/` with a basic assertion
- **THEN** `npx vitest run` discovers and runs the test successfully

### Requirement: npm scripts for developer workflow
The frontend's `package.json` SHALL include scripts for common developer tasks: `dev` (start dev server), `build` (production build), `preview` (preview production build), `check` (run Biome checks), `format` (run Biome formatting), and `test` (run Vitest).

#### Scenario: All scripts are defined
- **WHEN** `npm run` is executed in `frontend/app/`
- **THEN** scripts for `dev`, `build`, `preview`, `check`, `format`, and `test` are listed
