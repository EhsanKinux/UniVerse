"use client";

import { useQuery } from "@tanstack/react-query";

import { phoneBookApi } from "@/lib/api/phone-book.api";
import { phoneBookKeys } from "@/lib/api/query-keys";
import type { PhoneBookGroup } from "@/lib/api/types";

/**
 * Fetches the published contact-group → number tree from GET /phone-book. It's a
 * public endpoint, so it runs for everyone. The directory changes rarely, so we
 * keep a generous staleTime and let React Query refetch on the next mount.
 */
export function usePhoneBook() {
  return useQuery<PhoneBookGroup[]>({
    queryKey: phoneBookKeys.list(),
    queryFn: () => phoneBookApi.list(),
    staleTime: 30 * 60_000,
  });
}
