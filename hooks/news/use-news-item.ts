"use client";

import { useQuery } from "@tanstack/react-query";

import { newsApi } from "@/lib/api/news.api";
import { newsKeys } from "@/lib/api/query-keys";
import type { NewsDetail } from "@/lib/api/types";

/**
 * Fetches one published news item (with its attachments) from GET /news/:id for
 * the detail page. Public endpoint, so it runs for everyone. The SSE stream (see
 * use-news-stream) invalidates this on any change to the item, so an open detail
 * page updates live. `enabled` guards against an empty id from the route param.
 */
export function useNewsItem(id: string) {
  return useQuery<NewsDetail>({
    queryKey: newsKeys.detail(id),
    queryFn: () => newsApi.get(id),
    enabled: id.length > 0,
    staleTime: 5 * 60_000,
    retry: false, // a 404 (unpublished/unknown) should surface immediately
  });
}
