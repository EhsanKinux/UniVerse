"use client";

import { useQuery } from "@tanstack/react-query";

import { profileApi } from "@/lib/api/profile.api";
import { profileKeys } from "@/lib/api/query-keys";
import { tokenStorage } from "@/lib/api/token-storage";
import type { ProfileData } from "@/lib/api/types";
import { useMounted } from "@/hooks/use-mounted";

/**
 * Fetches the caller's full profile (fields + completion) from GET /profile.
 * Only runs once mounted and a session exists, so logged-out visitors never
 * fire the request — mirroring useCurrentUser.
 */
export function useProfileDetails() {
  const mounted = useMounted();

  return useQuery<ProfileData>({
    queryKey: profileKeys.me(),
    queryFn: profileApi.getProfile,
    enabled: mounted && tokenStorage.hasSession(),
    staleTime: 60_000,
  });
}
