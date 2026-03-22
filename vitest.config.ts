/**
 * Root Vitest configuration for the monorepo.
 *
 * Uses workspace mode to discover and run tests across all packages
 * in `packages/*`. Each package can define its own Vitest config for
 * package-specific overrides. `passWithNoTests` prevents CI failures
 * when a package has no test files yet.
 */
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: ["packages/*"],
    passWithNoTests: true,
  },
});
