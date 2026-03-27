/**
 * Next.js configuration for the ICP Explorer web playground.
 *
 * - `reactCompiler` enables the React Compiler (automatic memoization),
 *   eliminating the need for manual `useMemo`/`useCallback` calls.
 * - `transpilePackages` ensures the internal `@icpexplorer/shared`
 *   workspace package is compiled by Next.js, since it ships raw
 *   TypeScript source rather than pre-built JavaScript.
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ["@icpexplorer/shared"],
  serverExternalPackages: [
    "@icpexplorer/mcp-server",
    "@modelcontextprotocol/sdk",
  ],
};

export default nextConfig;
