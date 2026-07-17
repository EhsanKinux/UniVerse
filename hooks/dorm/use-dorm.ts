"use client";

import { useQuery } from "@tanstack/react-query";

import { dormApi } from "@/lib/api/dorm.api";
import { dormKeys } from "@/lib/api/query-keys";
import type { DormHub } from "@/lib/api/types";

/**
 * Fetches the whole خوابگاه hub from GET /dorm (announcements, rules, facilities,
 * forms). It's a public endpoint, so it runs for everyone. The announcements SSE
 * stream (see use-dorm-stream) invalidates this query on every change, so the
 * page updates live without polling — the staleTime is only a load/reconnect
 * fallback.
 */
export function useDorm() {
  return useQuery<DormHub>({
    queryKey: dormKeys.hub(),
    queryFn: () => dormApi.hub(),
    staleTime: 5 * 60_000,
  });
}
