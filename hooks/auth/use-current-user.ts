"use client";

import { useQuery } from "@tanstack/react-query";

import { authApi } from "@/lib/api/auth.api";
import { authKeys } from "@/lib/api/query-keys";
import { tokenStorage } from "@/lib/api/token-storage";
import type { User } from "@/lib/api/types";
import { useMounted } from "@/hooks/use-mounted";

/**
 * Fetches the authenticated user from GET /auth/me. Only runs once mounted
 * (cookies are client-only) and a session exists, so logged-out visitors never
 * fire the request. Also validates the session on load — an expired access
 * token transparently triggers the refresh flow in the axios client.
 */
export function useCurrentUser() {
  const mounted = useMounted();

  return useQuery<User>({
    queryKey: authKeys.me(),
    queryFn: authApi.getMe,
    enabled: mounted && tokenStorage.hasSession(),
    staleTime: 5 * 60_000,
    retry: false,
  });
}
