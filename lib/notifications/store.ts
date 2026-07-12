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

// "Last seen" watermark (epoch ms): everything published up to this moment has
// been acknowledged (the bell panel was opened). News that arrives while the
// app is CLOSED misses the live SSE event and enters via the list backfill —
// this watermark is how the backfill tells genuinely-new items (→ unread badge)
// apart from plain history.
const SEEN_KEY = "universe_notifications_seen_v1";

export function loadLastSeenAt(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    if (raw === null) return null;
    const ts = Number(raw);
    return Number.isFinite(ts) ? ts : null;
  } catch {
    return null;
  }
}

export function saveLastSeenAt(ts: number): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SEEN_KEY, String(ts));
  } catch {
    /* ignore quota / disabled storage */
  }
}
