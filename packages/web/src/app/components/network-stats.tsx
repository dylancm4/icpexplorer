"use client";

/**
 * Client component that displays live ICP network statistics.
 *
 * Fetches data from `/api/stats` using TanStack Query's `useQuery`
 * hook, providing automatic caching, refetching, and loading/error states.
 */

import type { NetworkStats } from "@icpexplorer/shared";
import { useQuery } from "@tanstack/react-query";

/**
 * Fetches network stats from the local API route.
 */
async function fetchStats(): Promise<NetworkStats> {
  const response = await fetch("/api/stats");
  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }
  return response.json();
}

/**
 * Displays a grid of ICP network statistics with loading and error states.
 */
export function NetworkStatsDisplay() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["network-stats"],
    queryFn: fetchStats,
  });

  if (isLoading) {
    return (
      <div className="text-center text-gray-500">Loading network stats...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading stats: {error.message}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const stats = [
    { label: "Total Nodes", value: data.totalNodes },
    { label: "Active Nodes", value: data.upNodes },
    {
      label: "Running Canisters",
      value: data.runningCanisters.toLocaleString(),
    },
    {
      label: "Stopped Canisters",
      value: data.stoppedCanisters.toLocaleString(),
    },
    { label: "Total Subnets", value: data.totalSubnets },
    {
      label: "Avg Cycle Burn Rate",
      value: data.averageCycleBurnRate.toLocaleString(),
    },
    { label: "Total Neurons", value: data.totalNeurons.toLocaleString() },
    { label: "Total Proposals", value: data.totalProposals.toLocaleString() },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-gray-200 p-4 text-center"
        >
          <p className="text-sm text-gray-500">{stat.label}</p>
          <p className="text-2xl font-semibold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
