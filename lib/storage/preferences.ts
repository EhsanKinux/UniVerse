// Local, client-only user preferences — kept separate from the auth identity.

const NOTIFICATIONS_KEY = "universe_notifications_v1";

export function getNotificationsEnabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem(NOTIFICATIONS_KEY) !== "0";
  } catch {
    return true;
  }
}

export function setNotificationsEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, enabled ? "1" : "0");
  } catch {
    /* ignore */
  }
}
