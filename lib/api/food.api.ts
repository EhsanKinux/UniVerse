import { env } from "@/lib/env";

import { apiClient } from "./client";
import type { FoodAnnouncementDetail, FoodHub, FoodPlace } from "./types";

// Thin, typed wrapper around the public food endpoints. Reads need no auth, but
// going through `apiClient` keeps the base URL and error handling consistent.
// Mirrors dorm.api.ts — the announcement feed behaves exactly like the dorm's.
export const foodApi = {
  /** The staff-managed تغذیه hub (weekly menu + announcements) in one call. */
  hub(): Promise<FoodHub> {
    return apiClient.get<FoodHub>("/food").then((res) => res.data);
  },

  /** Live nearby food places around a point, nearest first (OSM via the backend). */
  places(params: { lat: number; lng: number; radius?: number }): Promise<FoodPlace[]> {
    const query = new URLSearchParams({
      lat: String(params.lat),
      lng: String(params.lng),
    });
    if (params.radius) query.set("radius", String(params.radius));
    return apiClient
      .get<FoodPlace[]>(`/food/places?${query.toString()}`)
      .then((res) => res.data);
  },

  /** One published announcement with its attachments — the detail page. 404 if unpublished. */
  getAnnouncement(id: string): Promise<FoodAnnouncementDetail> {
    return apiClient
      .get<FoodAnnouncementDetail>(`/food/announcements/${id}`)
      .then((res) => res.data);
  },

  /**
   * Absolute URL of the announcements Server-Sent Events stream, for
   * `new EventSource(url)`. The backend pushes a frame on each announcement change.
   */
  streamUrl(): string {
    return `${env.apiBaseUrl}/food/announcements/stream`;
  },

  /** Absolute URL of an announcement's cover image, served inline by the backend. */
  coverUrl(id: string): string {
    return `${env.apiBaseUrl}/food/announcements/${id}/cover`;
  },

  /**
   * Absolute URL of an attachment's file. Opens inline by default; pass
   * `{ download: true }` to force a download that keeps the original filename.
   */
  attachmentUrl(attachmentId: string, opts?: { download?: boolean }): string {
    const base = `${env.apiBaseUrl}/food/announcements/file/${attachmentId}`;
    return opts?.download ? `${base}?download=1` : base;
  },

  /** Absolute URL of a weekly menu file (inline; `{ download: true }` forces save). */
  menuFileUrl(menuId: string, opts?: { download?: boolean }): string {
    const base = `${env.apiBaseUrl}/food/menu/file/${menuId}`;
    return opts?.download ? `${base}?download=1` : base;
  },
};
