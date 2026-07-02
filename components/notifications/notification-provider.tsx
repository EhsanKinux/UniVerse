"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useNews } from "@/hooks/news/use-news";
import { useNewsStream } from "@/hooks/news/use-news-stream";
import type { NewsItem } from "@/lib/api/types";
import {
  MAX_NOTIFICATIONS,
  loadNotifications,
  saveNotifications,
} from "@/lib/notifications/store";
import type { AppNotification } from "@/lib/notifications/types";
import { getNotificationsEnabled } from "@/lib/preferences";

import { Toaster, type ToastData } from "./toaster";

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  markAllRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within <NotificationProvider>");
  }
  return ctx;
}

function toNotification(item: NewsItem, read: boolean): AppNotification {
  return {
    id: item.id,
    newsId: item.id,
    title: item.title,
    body: item.body,
    category: item.category,
    categoryLabel: item.categoryLabel,
    dateLabel: item.dateLabel,
    link: item.link,
    read,
    receivedAt: Date.now(),
  };
}

/**
 * Owns the notification state and the single SSE subscription. Mounted once near
 * the root (see components/providers.tsx). It:
 *   • hydrates history from localStorage and persists changes,
 *   • turns each live "created" SSE event into an unread entry + a toast,
 *   • backfills the bell (as read) from the current news list so it isn't empty.
 */
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // A live mirror of `notifications`, so event handlers can de-duplicate without
  // being recreated on every change (which would tear down and reopen the SSE).
  const listRef = useRef<AppNotification[]>([]);
  const hydrated = useRef(false);

  const commit = useCallback((next: AppNotification[]) => {
    const capped = next.slice(0, MAX_NOTIFICATIONS);
    listRef.current = capped;
    setNotifications(capped);
    if (hydrated.current) saveNotifications(capped);
  }, []);

  // Hydrate persisted history once, after mount (client-only → no SSR mismatch).
  useEffect(() => {
    listRef.current = loadNotifications();
    setNotifications(listRef.current);
    hydrated.current = true;
  }, []);

  // A brand-new published item arrived over SSE → unread entry + a toast.
  const handleCreated = useCallback(
    (item: NewsItem) => {
      if (listRef.current.some((n) => n.newsId === item.id)) return; // de-dupe
      commit([toNotification(item, false), ...listRef.current]);
      // The bell always records it; the toggle only governs the toast pop-up.
      if (getNotificationsEnabled()) {
        setToasts((prev) => [{ id: `${item.id}:${Date.now()}`, item }, ...prev].slice(0, 3));
      }
    },
    [commit],
  );

  useNewsStream(handleCreated);

  // Backfill the bell from the current list so it isn't empty on first load —
  // marked READ, so only genuinely-new (live) items ever show as unread.
  const { data: newsList } = useNews();
  useEffect(() => {
    if (!newsList || !hydrated.current) return;
    const known = new Set(listRef.current.map((n) => n.newsId));
    const missing = newsList.filter((item) => !known.has(item.id));
    if (missing.length === 0) return;
    commit([...listRef.current, ...missing.map((item) => toNotification(item, true))]);
  }, [newsList, commit]);

  const markAllRead = useCallback(() => {
    commit(listRef.current.map((n) => (n.read ? n : { ...n, read: true })));
  }, [commit]);

  const clearAll = useCallback(() => commit([]), [commit]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const value = useMemo<NotificationContextValue>(
    () => ({ notifications, unreadCount, markAllRead, clearAll }),
    [notifications, unreadCount, markAllRead, clearAll],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismissToast} />
    </NotificationContext.Provider>
  );
}
