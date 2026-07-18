"use client";

import { useQuery } from "@tanstack/react-query";

import { foodApi } from "@/lib/api/food.api";
import { foodKeys } from "@/lib/api/query-keys";
import type { FoodPlace } from "@/lib/api/types";

/**
 * Fetches live nearby food places around a point from GET /food/places (the
 * backend's cached OpenStreetMap proxy). `center` is null until the page has
 * settled on a search point (user location or the campus fallback), so the
 * query simply waits. The long staleTime matches the server's ~10-minute cache —
 * POI data changes on the order of days, not seconds.
 */
export function useFoodPlaces(
  center: { lat: number; lng: number } | null,
  radius: number,
) {
  return useQuery<FoodPlace[]>({
    queryKey: center
      ? foodKeys.places(center.lat, center.lng, radius)
      : [...foodKeys.all, "places", "idle"],
    queryFn: () => foodApi.places({ lat: center!.lat, lng: center!.lng, radius }),
    enabled: center !== null,
    staleTime: 10 * 60_000,
    retry: 1, // Overpass can be slow; one retry, then show the error state
  });
}
