"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import type { ApiError } from "@/lib/api/errors";
import { authApi } from "@/lib/api/auth.api";
import { tokenStorage } from "@/lib/api/token-storage";

/**
 * Permanently deletes the account. Takes the current password (the server
 * requires it to confirm). On success we clear the local session — the same
 * teardown as logout — and send the user to sign-in.
 */
export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<{ success: boolean }, ApiError, string>({
    mutationFn: (password) => authApi.deleteAccount(password),
    onSuccess: () => {
      tokenStorage.clearTokens();
      queryClient.clear();
      router.replace("/sign-in");
    },
  });
}
