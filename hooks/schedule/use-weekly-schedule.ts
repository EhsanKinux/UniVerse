"use client";

import { useQuery } from "@tanstack/react-query";

import { scheduleApi } from "@/lib/api/schedule.api";
import { scheduleKeys } from "@/lib/api/query-keys";
import { tokenStorage } from "@/lib/api/token-storage";
import type { WeeklySchedule } from "@/lib/api/types";
import { useMounted } from "@/hooks/use-mounted";

/**
 * Fetches the logged-in student's weekly schedule from GET /schedule.
 *
 * The endpoint is per-user, so the query only runs once mounted (tokens are
 * client-only) AND a session exists — logged-out visitors never fire it; the
 * page shows them a sign-in prompt instead. An expired access token is
 * transparently refreshed by the axios client.
 */
export function useWeeklySchedule() {
  const mounted = useMounted();
  const hasSession = mounted && tokenStorage.hasSession();

  const query = useQuery<WeeklySchedule>({
    queryKey: scheduleKeys.weekly(),
    queryFn: scheduleApi.getWeeklySchedule,
    enabled: hasSession,
    // The user edits their own data here; keep it snappy but not chatty.
    staleTime: 60_000,
  });

  return { ...query, hasSession, mounted };
}
