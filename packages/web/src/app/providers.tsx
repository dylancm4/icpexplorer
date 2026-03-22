"use client";

/**
 * Application-wide providers for the ICP Explorer web playground.
 *
 * Wraps the component tree with TanStack Query's `QueryClientProvider`
 * so that `useQuery` hooks function correctly in client components.
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

/**
 * Provider wrapper that initializes a stable `QueryClient` instance
 * and makes it available to all descendant components.
 *
 * @param props.children - The component tree to wrap.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
