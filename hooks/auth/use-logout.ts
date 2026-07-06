"use client";

import { useMutation } from "@tanstack/react-query";

import { authApi } from "@/lib/api/auth.api";
import { useClearSession } from "./use-clear-session";

/**
 * Logs out. The server call revokes the refresh token; we then clear local
 * state and redirect — in `onSettled` so a failed/expired call still signs the
 * user out locally.
 */
export function useLogout() {
  const clearSession = useClearSession();

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => clearSession(),
  });
}
