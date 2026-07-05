import { env } from "@/lib/env";

import { apiClient } from "./client";
import type { NewsDetail, NewsItem } from "./types";

// Thin, typed wrapper around the public news endpoints. Reads need no auth, but
// going through `apiClient` keeps the base URL and error handling consistent.
export const newsApi = {
  /** The current published list (pinned first, then newest). */
  list(): Promise<NewsItem[]> {
    return apiClient.get<NewsItem[]>("/news").then((res) => res.data);
  },

  /** One published item with its attachments — the detail page. 404 if unpublished. */
  get(id: string): Promise<NewsDetail> {
    return apiClient.get<NewsDetail>(`/news/${id}`).then((res) => res.data);
  },

  /**
   * Absolute URL of the Server-Sent Events stream, for `new EventSource(url)`.
   * The backend pushes a frame whenever news is created / updated / deleted.
   */
  streamUrl(): string {
    return `${env.apiBaseUrl}/news/stream`;
  },

  /** Absolute URL of an item's cover image, served inline by the backend. */
  coverUrl(newsId: string): string {
    return `${env.apiBaseUrl}/news/${newsId}/cover`;
  },

  /**
   * Absolute URL of an attachment's file. Opens inline by default (native viewer
   * on mobile); pass `{ download: true }` to force a download that keeps the
   * original filename. Mirrors `documentsApi.fileUrl`.
   */
  attachmentUrl(attachmentId: string, opts?: { download?: boolean }): string {
    const base = `${env.apiBaseUrl}/news/file/${attachmentId}`;
    return opts?.download ? `${base}?download=1` : base;
  },
};
