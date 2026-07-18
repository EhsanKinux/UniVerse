"use client";

import { useQuery } from "@tanstack/react-query";

import { foodApi } from "@/lib/api/food.api";
import { foodKeys } from "@/lib/api/query-keys";
import type { FoodHub } from "@/lib/api/types";

/**
 * Fetches the staff-managed تغذیه hub from GET /food (weekly menu +
 * announcements). It's a public endpoint, so it runs for everyone. The
 * announcements SSE stream (see use-food-stream) invalidates this query on every
 * change, so the page updates live without polling — the staleTime is only a
 * load/reconnect fallback. Mirrors use-dorm.ts.
 */
export function useFood() {
  return useQuery<FoodHub>({
    queryKey: foodKeys.hub(),
    queryFn: () => foodApi.hub(),
    staleTime: 5 * 60_000,
  });
}
