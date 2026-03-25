/**
 * Landing page for the ICP Explorer web playground.
 *
 * Renders a hero section with live ICP network statistics and
 * an AI chat interface for querying network data conversationally.
 */

import { ModeToggle } from "@/components/mode-toggle";
import { Chat } from "./components/chat";
import { NetworkStatsDisplay } from "./components/network-stats";

/** Renders the landing page with network stats and AI chat. */
const Home = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-bold">ICP Explorer</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          AI-powered explorer for the Internet Computer
        </p>
      </div>
      <NetworkStatsDisplay />
      <Chat />
    </main>
  );
};

export default Home;
