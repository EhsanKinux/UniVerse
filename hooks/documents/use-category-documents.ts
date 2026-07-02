"use client";

import { useQuery } from "@tanstack/react-query";

import { documentsApi } from "@/lib/api/documents.api";
import { documentKeys } from "@/lib/api/query-keys";
import type { CategoryDocuments } from "@/lib/api/types";

/**
 * Fetches the active file + archive for a document category (e.g. "courses")
 * from GET /documents/:category.
 *
 * Unlike the calendar, this endpoint always succeeds: an empty category just
 * returns `active: null` with an empty archive, so there's no 404 to special-
 * case — the UI reads `active`/`archive` and shows an empty state when both are
 * empty. Genuine failures (offline, 5xx) still surface as errors for a retry.
 */
export function useCategoryDocuments(category: string) {
  return useQuery<CategoryDocuments>({
    queryKey: documentKeys.category(category),
    queryFn: () => documentsApi.getCategory(category),
    // Documents change at most once a term; keep them fresh for half an hour.
    staleTime: 30 * 60_000,
  });
}
