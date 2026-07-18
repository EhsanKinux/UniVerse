"use client";

import { useQuery } from "@tanstack/react-query";

import { foodApi } from "@/lib/api/food.api";
import { foodKeys } from "@/lib/api/query-keys";
import type { FoodAnnouncementDetail } from "@/lib/api/types";

/**
 * Fetches one published food announcement (with its attachments) from
 * GET /food/announcements/:id for the detail page. Public endpoint. The SSE
 * stream invalidates this on any change to the item, so an open detail page
 * updates live. `enabled` guards against an empty id from the route param.
 */
export function useFoodAnnouncement(id: string) {
  return useQuery<FoodAnnouncementDetail>({
    queryKey: foodKeys.announcement(id),
    queryFn: () => foodApi.getAnnouncement(id),
    enabled: id.length > 0,
    staleTime: 5 * 60_000,
    retry: false, // a 404 (unpublished/unknown) should surface immediately
  });
}
