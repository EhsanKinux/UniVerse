"use client";

import { useQuery } from "@tanstack/react-query";

import { groupsApi } from "@/lib/api/groups.api";
import { groupsKeys } from "@/lib/api/query-keys";
import type { GroupCategory } from "@/lib/api/types";

/**
 * Fetches the published category → group → join-option tree from GET /groups.
 * It's a public endpoint, so it runs for everyone. The directory changes rarely,
 * so we keep a generous staleTime and let React Query refetch on the next mount.
 */
export function useGroups() {
  return useQuery<GroupCategory[]>({
    queryKey: groupsKeys.list(),
    queryFn: () => groupsApi.list(),
    staleTime: 30 * 60_000,
  });
}
