import { env } from "@/lib/env";

import { apiClient } from "./client";
import type { GroupCategory } from "./types";

// Thin, typed wrapper around the public «گروه‌ها» endpoints. Reads need no auth,
// but going through `apiClient` keeps the base URL and error handling consistent
// with the rest of the app (mirrors phoneBookApi / chartApi).
export const groupsApi = {
  /** Every published category with its group cards and join options, in one call. */
  list(): Promise<GroupCategory[]> {
    return apiClient.get<GroupCategory[]>("/groups").then((res) => res.data);
  },

  /** Absolute URL of a join option's QR image, served inline by the backend. */
  qrUrl(linkId: string): string {
    return `${env.apiBaseUrl}/groups/links/${linkId}/qr`;
  },
};
