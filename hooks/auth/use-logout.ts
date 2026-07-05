"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { authApi } from "@/lib/api/auth.api";
import { tokenStorage } from "@/lib/api/token-storage";

/**
 * Logs out. The server call revokes the refresh token; we then clear local
 * state and redirect — in `onSettled` so a failed/expired call still signs the
 * user out locally.
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      tokenStorage.clearTokens();
      queryClient.clear();
      router.replace("/sign-in");
    },
  });
}
