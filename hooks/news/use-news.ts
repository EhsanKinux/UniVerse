"use client";

import { useQuery } from "@tanstack/react-query";

import { newsApi } from "@/lib/api/news.api";
import { newsKeys } from "@/lib/api/query-keys";
import type { NewsItem } from "@/lib/api/types";

/**
 * Fetches the published news list from GET /news. It's a public endpoint, so it
 * runs for everyone. The SSE stream (see use-news-stream) invalidates this query
 * on every change, so the carousel updates live without polling — we keep a
 * modest staleTime only as a fallback for the initial load / reconnects.
 */
export function useNews() {
  return useQuery<NewsItem[]>({
    queryKey: newsKeys.list(),
    queryFn: () => newsApi.list(),
    staleTime: 5 * 60_000,
  });
}
