"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authApi } from "@/lib/api/auth.api";
import { authKeys } from "@/lib/api/query-keys";
import { tokenStorage } from "@/lib/api/token-storage";
import type { ApiError } from "@/lib/api/errors";
import type { AuthResponse, RegisterPayload } from "@/lib/api/types";

/**
 * Registers a new account. The backend logs the user straight in (returns a
 * token pair), so this mirrors `useLogin`: persist tokens + prime the cache.
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ApiError, RegisterPayload>({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      tokenStorage.setTokens(data);
      queryClient.setQueryData(authKeys.me(), data.user);
    },
  });
}
