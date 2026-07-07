import { apiClient } from "./client";
import type { PhoneBookGroup } from "./types";

// Thin, typed wrapper around the public phone-directory endpoint. Reads need no
// auth, but going through `apiClient` keeps the base URL and error handling
// consistent with the rest of the app (mirrors chartApi / documentsApi).
export const phoneBookApi = {
  /** Every published contact group (واحد) with its numbers, in one call. */
  list(): Promise<PhoneBookGroup[]> {
    return apiClient.get<PhoneBookGroup[]>("/phone-book").then((res) => res.data);
  },
};
