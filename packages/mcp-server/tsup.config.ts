/**
 * tsup build configuration for the MCP server package.
 *
 * - Outputs ESM with TypeScript declaration files.
 * - Bundles `@icpexplorer/shared` into the distributable so consumers
 *   don't need the workspace dependency at runtime.
 * - All other dependencies (e.g. `@icp-sdk/*`, `@modelcontextprotocol/sdk`)
 *   are externalized and must be installed by the consumer.
 */
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  noExternal: ["@icpexplorer/shared"],
});
