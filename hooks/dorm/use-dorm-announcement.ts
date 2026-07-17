"use client";

import { useQuery } from "@tanstack/react-query";

import { dormApi } from "@/lib/api/dorm.api";
import { dormKeys } from "@/lib/api/query-keys";
import type { DormAnnouncementDetail } from "@/lib/api/types";

/**
 * Fetches one published dorm announcement (with its attachments) from
 * GET /dorm/announcements/:id for the detail page. Public endpoint. The SSE
 * stream invalidates this on any change to the item, so an open detail page
 * updates live. `enabled` guards against an empty id from the route param.
 */
export function useDormAnnouncement(id: string) {
  return useQuery<DormAnnouncementDetail>({
    queryKey: dormKeys.announcement(id),
    queryFn: () => dormApi.getAnnouncement(id),
    enabled: id.length > 0,
    staleTime: 5 * 60_000,
    retry: false, // a 404 (unpublished/unknown) should surface immediately
  });
}
