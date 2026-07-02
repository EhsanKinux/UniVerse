import type { AppNotification } from "./types";

// The notification HISTORY list. Deliberately distinct from preferences.ts's
// "universe_notifications_v1" key, which stores the on/off toggle.
const KEY = "universe_notifications_list_v1";

/** Cap the stored history so localStorage can't grow without bound. */
export const MAX_NOTIFICATIONS = 30;

export function loadNotifications(): AppNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AppNotification[]) : [];
  } catch {
    return [];
  }
}

export function saveNotifications(list: AppNotification[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX_NOTIFICATIONS)));
  } catch {
    /* ignore quota / disabled storage */
  }
}
