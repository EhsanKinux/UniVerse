import { isServer, QueryClient } from "@tanstack/react-query";

import { isApiError } from "./errors";

// SSR-safe QueryClient management following the TanStack Next.js guidance:
// create a fresh client on the server for every request, but reuse a single
// client in the browser so the cache survives re-renders.

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000, // 1 min — avoid immediate refetches after hydration
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // Don't retry auth/client errors; they won't succeed on retry.
          if (isApiError(error) && error.status >= 400 && error.status < 500) return false;
          return failureCount < 2;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (isServer) {
    // Server: always a brand-new client (never share between requests/users).
    return makeQueryClient();
  }
  // Browser: lazily create one singleton.
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
