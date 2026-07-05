import { env } from "@/lib/env";
import { apiClient } from "./client";
import type { ProfileData, UpdateProfilePayload } from "./types";

// Thin, typed wrappers around the profile endpoints (see
// univers-backend/src/profile). All routes require a logged-in user; the axios
// client attaches the access token and handles the silent-refresh dance.

export const profileApi = {
  /** The caller's profile + completion summary. */
  getProfile(): Promise<ProfileData> {
    return apiClient.get<ProfileData>("/profile").then((res) => res.data);
  },

  /** Partial update: `null`/"" clears a field, omitted keys stay unchanged. */
  updateProfile(payload: UpdateProfilePayload): Promise<ProfileData> {
    return apiClient.patch<ProfileData>("/profile", payload).then((res) => res.data);
  },

  /** Upload/replace the avatar. Sent as multipart/form-data under `avatar`. */
  uploadAvatar(file: File): Promise<ProfileData> {
    const form = new FormData();
    form.append("avatar", file);
    // Let the browser set the multipart boundary — override the client's JSON
    // default Content-Type by clearing it here.
    return apiClient
      .post<ProfileData>("/profile/avatar", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },

  /** Remove the avatar (back to the initials fallback). */
  deleteAvatar(): Promise<ProfileData> {
    return apiClient.delete<ProfileData>("/profile/avatar").then((res) => res.data);
  },
};

/**
 * Turn the server's relative `avatarUrl` into an absolute URL an <img> can load
 * (the API lives on a different origin). Returns undefined when there's no avatar.
 */
export function resolveAvatarSrc(avatarUrl: string | null | undefined): string | undefined {
  return avatarUrl ? `${env.apiBaseUrl}${avatarUrl}` : undefined;
}
