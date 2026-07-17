import { env } from "@/lib/env";

import { apiClient } from "./client";
import type { DormAnnouncementDetail, DormHub } from "./types";

// Thin, typed wrapper around the public dormitory endpoints. Reads need no auth,
// but going through `apiClient` keeps the base URL and error handling consistent.
// Mirrors news.api.ts — the announcement feed behaves exactly like news.
export const dormApi = {
  /** The whole خوابگاه hub (announcements, rules, facilities, forms) in one call. */
  hub(): Promise<DormHub> {
    return apiClient.get<DormHub>("/dorm").then((res) => res.data);
  },

  /** One published announcement with its attachments — the detail page. 404 if unpublished. */
  getAnnouncement(id: string): Promise<DormAnnouncementDetail> {
    return apiClient
      .get<DormAnnouncementDetail>(`/dorm/announcements/${id}`)
      .then((res) => res.data);
  },

  /**
   * Absolute URL of the announcements Server-Sent Events stream, for
   * `new EventSource(url)`. The backend pushes a frame on each announcement change.
   */
  streamUrl(): string {
    return `${env.apiBaseUrl}/dorm/announcements/stream`;
  },

  /** Absolute URL of an announcement's cover image, served inline by the backend. */
  coverUrl(id: string): string {
    return `${env.apiBaseUrl}/dorm/announcements/${id}/cover`;
  },

  /**
   * Absolute URL of an attachment's file. Opens inline by default; pass
   * `{ download: true }` to force a download that keeps the original filename.
   */
  attachmentUrl(attachmentId: string, opts?: { download?: boolean }): string {
    const base = `${env.apiBaseUrl}/dorm/announcements/file/${attachmentId}`;
    return opts?.download ? `${base}?download=1` : base;
  },

  /** Absolute URL of a dorm form's file (inline; `{ download: true }` forces save). */
  formFileUrl(formId: string, opts?: { download?: boolean }): string {
    const base = `${env.apiBaseUrl}/dorm/forms/file/${formId}`;
    return opts?.download ? `${base}?download=1` : base;
  },
};
