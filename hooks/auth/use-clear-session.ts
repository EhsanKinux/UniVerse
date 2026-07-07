"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { tokenStorage } from "@/lib/api/token-storage";
import { resetOnboarding } from "@/lib/storage/onboarding";

/**
 * Tears down all client-side session state — auth tokens, cached queries, and
 * the one-time onboarding flag — then routes back to sign-in.
 *
 * Shared by logout and account deletion so both leave the app in an identical
 * clean-slate state. Resetting onboarding here is what makes the welcome flow
 * replay on the way back in (the flag is otherwise sticky in localStorage).
 */
export function useClearSession() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useCallback(() => {
    tokenStorage.clearTokens();
    queryClient.clear();
    resetOnboarding();
    router.replace("/sign-in");
  }, [queryClient, router]);
}
