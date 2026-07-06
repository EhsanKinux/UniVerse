"use client";

import { useMutation } from "@tanstack/react-query";

import type { ApiError } from "@/lib/api/errors";
import { authApi } from "@/lib/api/auth.api";
import { useClearSession } from "./use-clear-session";

/**
 * Permanently deletes the account. Takes the current password (the server
 * requires it to confirm). On success we clear the local session — the same
 * teardown as logout — and send the user to sign-in.
 */
export function useDeleteAccount() {
  const clearSession = useClearSession();

  return useMutation<{ success: boolean }, ApiError, string>({
    mutationFn: (password) => authApi.deleteAccount(password),
    onSuccess: () => clearSession(),
  });
}
