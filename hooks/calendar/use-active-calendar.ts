"use client";

import { useQuery } from "@tanstack/react-query";

import { calendarApi } from "@/lib/api/calendar.api";
import { isApiError } from "@/lib/api/errors";
import { calendarKeys } from "@/lib/api/query-keys";
import type { ActiveCalendar } from "@/lib/api/types";

/**
 * Fetches the active semester and its events from GET /calendar/active.
 *
 * The endpoint is public, so this runs for everyone. A 404 ("no active semester
 * published yet") is a normal state rather than a failure, so we resolve it to
 * `null` — the UI then shows an empty state and React Query never flips to
 * `isError` for that case. Genuine failures (offline, 5xx) still surface as
 * errors so the UI can offer a retry.
 */
export function useActiveCalendar() {
  return useQuery<ActiveCalendar | null>({
    queryKey: calendarKeys.active(),
    queryFn: async () => {
      try {
        return await calendarApi.getActive();
      } catch (error) {
        if (isApiError(error) && error.status === 404) return null;
        throw error;
      }
    },
    // The academic calendar changes rarely; keep it fresh for half an hour.
    staleTime: 30 * 60_000,
  });
}
