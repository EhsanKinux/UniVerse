import { env } from "@/lib/env";

import { apiClient } from "./client";
import type { ChartDepartment } from "./types";

// Thin, typed wrapper around the public educational-chart endpoints. Reads need
// no auth, but going through `apiClient` keeps the base URL and error handling
// consistent with the rest of the app (mirrors documentsApi / newsApi).
export const chartApi = {
  /** Every published department (رشته) with its chart PDFs, in one call. */
  list(): Promise<ChartDepartment[]> {
    return apiClient.get<ChartDepartment[]>("/chart").then((res) => res.data);
  },

  /**
   * Absolute URL to a chart PDF, served by the backend. By default the browser
   * opens it inline (its native PDF viewer — the most reliable option on a mobile
   * PWA); pass `{ download: true }` to force a download that keeps the original
   * filename. Mirrors `documentsApi.fileUrl`.
   */
  fileUrl(id: string, opts?: { download?: boolean }): string {
    const base = `${env.apiBaseUrl}/chart/file/${id}`;
    return opts?.download ? `${base}?download=1` : base;
  },
};
