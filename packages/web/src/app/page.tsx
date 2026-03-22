/**
 * Landing page for the ICP Explorer web playground.
 *
 * Renders a hero section with live ICP network statistics.
 * The `NetworkStatsDisplay` is a client component that fetches
 * data via TanStack Query from the `/api/stats` route handler.
 */

import { NetworkStatsDisplay } from "./components/network-stats";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">ICP Explorer</h1>
        <p className="mt-4 text-lg text-gray-600">
          AI-powered explorer for the Internet Computer
        </p>
      </div>
      <NetworkStatsDisplay />
    </main>
  );
}
