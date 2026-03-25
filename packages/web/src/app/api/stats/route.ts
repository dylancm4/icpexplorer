/**
 * `GET /api/stats` route handler.
 *
 * Calls the shared `fetchNetworkStats()` function server-side
 * and returns the result as JSON. Used by the client-side
 * `NetworkStats` component via TanStack Query.
 */

import { fetchNetworkStats } from "@icpexplorer/shared";
import { NextResponse } from "next/server";

/**
 * Fetches live ICP network statistics and returns them as JSON.
 *
 * @returns HTTP 200 with `NetworkStats` JSON on success, or HTTP 500 with error message.
 */
export const GET = async () => {
  try {
    const stats = await fetchNetworkStats();
    return NextResponse.json(stats);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to fetch network stats: ${message}` },
      { status: 500 },
    );
  }
};
