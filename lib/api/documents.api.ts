import { env } from "@/lib/env";

import { apiClient } from "./client";
import type { CategoryDocuments } from "./types";

// Thin, typed wrapper around the public documents endpoints. Reads need no auth,
// but going through `apiClient` keeps the base URL and error normalization
// consistent with the rest of the app.
export const documentsApi = {
  /** The active file + archive for a category (e.g. "courses"). */
  getCategory(category: string): Promise<CategoryDocuments> {
    return apiClient
      .get<CategoryDocuments>(`/documents/${category}`)
      .then((res) => res.data);
  },

  /**
   * Absolute URL to a document's file, served by the backend. By default the
   * browser opens it inline (its native PDF viewer — the most reliable option on
   * a mobile PWA); pass `{ download: true }` to force a download that keeps the
   * original filename.
   */
  fileUrl(id: string, opts?: { download?: boolean }): string {
    const base = `${env.apiBaseUrl}/documents/file/${id}`;
    return opts?.download ? `${base}?download=1` : base;
  },
};
