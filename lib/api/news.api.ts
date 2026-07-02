import { env } from "@/lib/env";

import { apiClient } from "./client";
import type { NewsItem } from "./types";

// Thin, typed wrapper around the public news endpoints. Reads need no auth, but
// going through `apiClient` keeps the base URL and error handling consistent.
export const newsApi = {
  /** The current published list (pinned first, then newest). */
  list(): Promise<NewsItem[]> {
    return apiClient.get<NewsItem[]>("/news").then((res) => res.data);
  },

  /**
   * Absolute URL of the Server-Sent Events stream, for `new EventSource(url)`.
   * The backend pushes a frame whenever news is created / updated / deleted.
   */
  streamUrl(): string {
    return `${env.apiBaseUrl}/news/stream`;
  },
};
