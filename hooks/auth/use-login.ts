"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authApi } from "@/lib/api/auth.api";
import { authKeys } from "@/lib/api/query-keys";
import { tokenStorage } from "@/lib/api/token-storage";
import type { ApiError } from "@/lib/api/errors";
import type { AuthResponse, LoginPayload } from "@/lib/api/types";

/**
 * Logs in, persists the returned token pair, and primes the `/auth/me` cache
 * with the user so the app reflects the session immediately. Navigation is left
 * to the caller (so it can honor a `redirect` target).
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ApiError, LoginPayload>({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      tokenStorage.setTokens(data);
      queryClient.setQueryData(authKeys.me(), data.user);
    },
  });
}
