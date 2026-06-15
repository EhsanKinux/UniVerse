// Mock authentication — client-side only, no backend.

const AUTH_KEY = "universe_auth_v1";

export type MockUser = {
  name: string;
  email: string;
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

export function isAuthedMock(): boolean {
  return getMockUser() !== null;
}
