// Mock authentication — client-side only, no backend.

const AUTH_KEY = "universe_auth_v1";

export type MockUser = {
  name: string;
  email: string;
  /** Optional, user-editable contact number (stored locally). */
  phone?: string;
};

export function signInMock(user: MockUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function signOutMock() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
}

export function getMockUser(): MockUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as MockUser) : null;
  } catch {
    return null;
  }
}

/** Merge a partial patch into the stored user and persist it. Returns the updated user. */
export function updateMockUser(patch: Partial<MockUser>): MockUser | null {
  if (typeof window === "undefined") return null;
  const current = getMockUser() ?? { name: "", email: "" };
  const next: MockUser = { ...current, ...patch };
  localStorage.setItem(AUTH_KEY, JSON.stringify(next));
  return next;
}

export function isAuthedMock(): boolean {
  return getMockUser() !== null;
}

/** Two-letter (or single fallback) initials for an avatar, RTL-safe. */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "؟";
  if (parts.length === 1) return parts[0].slice(0, 2);
  return parts[0][0] + parts[1][0];
}
