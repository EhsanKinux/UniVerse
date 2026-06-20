// Local-only profile extras.
//
// The backend's user model is `{ id, email, name, createdAt }` and currently
// exposes no profile-update endpoint. Fields the user can tweak on the device
// (a contact phone, plus an optional display-name override) are kept here in
// localStorage until a backend endpoint exists. Cleared on sign-out.

const KEY = "universe_profile_v1";

export type LocalProfile = {
  /** Optional display-name override (server `name` is the default). */
  name?: string;
  /** Contact phone — not part of the backend model. */
  phone?: string;
};

export function getLocalProfile(): LocalProfile {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as LocalProfile) : {};
  } catch {
    return {};
  }
}

export function updateLocalProfile(patch: LocalProfile): LocalProfile {
  if (typeof window === "undefined") return {};
  const next: LocalProfile = { ...getLocalProfile(), ...patch };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function clearLocalProfile(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
