"use client";

import { useQuery } from "@tanstack/react-query";

import { chartApi } from "@/lib/api/chart.api";
import { chartKeys } from "@/lib/api/query-keys";
import type { ChartDepartment } from "@/lib/api/types";

/**
 * Fetches the published department → chart-PDF tree from GET /chart. It's a public
 * endpoint, so it runs for everyone. Charts change at most once a term, so we keep
 * a generous staleTime and let React Query refetch on the next mount.
 */
export function useChart() {
  return useQuery<ChartDepartment[]>({
    queryKey: chartKeys.list(),
    queryFn: () => chartApi.list(),
    staleTime: 30 * 60_000,
  });
}
