"use client";

import { useCurrentUser } from "./use-current-user";

/**
 * Convenience read-model for "who is the current user?". Built on the cached
 * `/auth/me` query, so it's cheap to call from many components.
 */
export function useAuth() {
  const query = useCurrentUser();

  return {
    user: query.data ?? null,
    isAuthenticated: Boolean(query.data),
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
  };
}
