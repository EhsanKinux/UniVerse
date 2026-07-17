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

import { useDorm } from "@/hooks/dorm/use-dorm";
import { useDormStream } from "@/hooks/dorm/use-dorm-stream";
import { useNews } from "@/hooks/news/use-news";
import { useNewsStream } from "@/hooks/news/use-news-stream";
import type { DormAnnouncement, NewsItem } from "@/lib/api/types";
import {
  MAX_NOTIFICATIONS,
  loadLastSeenAt,
  loadNotifications,
  saveLastSeenAt,
  saveNotifications,
} from "@/lib/notifications/store";
import type { AppNotification } from "@/lib/notifications/types";
import { getNotificationsEnabled } from "@/lib/storage/preferences";

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

/** Where a dorm announcement notification routes (its detail page inside خوابگاه). */
const dormRoute = (id: string) => `/dormitory/announcements/${id}`;

/** Map a dorm announcement to a bell entry. Unlike news, the `link` is ALWAYS the
 *  detail route, so the bell/toast never fall back to the news `/news/:id` path. */
function toDormNotification(item: DormAnnouncement, read: boolean): AppNotification {
  return {
    id: item.id,
    newsId: item.id,
    title: item.title,
    body: item.body,
    category: item.category,
    categoryLabel: item.categoryLabel,
    dateLabel: item.dateLabel,
    link: dormRoute(item.id),
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
  // Publish times at or before this are "seen"; the backfill marks later ones
  // unread so news that arrived while the app was closed still lights the badge.
  const lastSeenRef = useRef(0);

  const commit = useCallback((next: AppNotification[]) => {
    const capped = next.slice(0, MAX_NOTIFICATIONS);
    listRef.current = capped;
    setNotifications(capped);
    if (hydrated.current) saveNotifications(capped);
  }, []);

  // Hydrate persisted history once, after mount (client-only → no SSR mismatch).
  useEffect(() => {
    listRef.current = loadNotifications();
    const seen = loadLastSeenAt();
    if (seen === null) {
      // First run on this device: treat everything published so far as seen,
      // so the initial history backfill doesn't light the badge.
      lastSeenRef.current = Date.now();
      saveLastSeenAt(lastSeenRef.current);
    } else {
      lastSeenRef.current = seen;
    }
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

  // A brand-new dorm announcement arrived over SSE → unread entry + a toast. Same
  // shape as news, but its toast eyebrow + link mark it as a خوابگاه item.
  const handleCreatedDorm = useCallback(
    (item: DormAnnouncement) => {
      if (listRef.current.some((n) => n.newsId === item.id)) return; // de-dupe
      commit([toDormNotification(item, false), ...listRef.current]);
      if (getNotificationsEnabled()) {
        setToasts((prev) =>
          [
            {
              id: `${item.id}:${Date.now()}`,
              item: { ...item, link: dormRoute(item.id) },
              eyebrow: "اطلاعیهٔ خوابگاه",
            },
            ...prev,
          ].slice(0, 3),
        );
      }
    },
    [commit],
  );

  useDormStream(handleCreatedDorm);

  // Backfill the bell from the current news list. Items published after the
  // watermark arrived while the app was closed (the SSE event was missed), so
  // they surface as UNREAD up top; anything older is just history, added read.
  const { data: newsList } = useNews();
  useEffect(() => {
    if (!newsList || !hydrated.current) return;
    const known = new Set(listRef.current.map((n) => n.newsId));
    const missing = newsList.filter((item) => !known.has(item.id));
    if (missing.length === 0) return;
    const additions = missing.map((item) => {
      const publishedAt = Date.parse(item.publishedAt);
      const isNew = Number.isFinite(publishedAt) && publishedAt > lastSeenRef.current;
      return toNotification(item, !isNew);
    });
    const fresh = additions.filter((n) => !n.read);
    const history = additions.filter((n) => n.read);
    commit([...fresh, ...listRef.current, ...history]);
  }, [newsList, commit]);

  // The SAME backfill for dorm announcements, so the bell shows them (and lights
  // for any that were published while the app was closed) alongside news.
  const { data: dormHub } = useDorm();
  useEffect(() => {
    const dormList = dormHub?.announcements;
    if (!dormList || !hydrated.current) return;
    const known = new Set(listRef.current.map((n) => n.newsId));
    const missing = dormList.filter((item) => !known.has(item.id));
    if (missing.length === 0) return;
    const additions = missing.map((item) => {
      const publishedAt = Date.parse(item.publishedAt);
      const isNew = Number.isFinite(publishedAt) && publishedAt > lastSeenRef.current;
      return toDormNotification(item, !isNew);
    });
    const fresh = additions.filter((n) => !n.read);
    const history = additions.filter((n) => n.read);
    commit([...fresh, ...listRef.current, ...history]);
  }, [dormHub, commit]);

  const markSeenNow = useCallback(() => {
    lastSeenRef.current = Date.now();
    saveLastSeenAt(lastSeenRef.current);
  }, []);

  const markAllRead = useCallback(() => {
    markSeenNow();
    commit(listRef.current.map((n) => (n.read ? n : { ...n, read: true })));
  }, [commit, markSeenNow]);

  // Advancing the watermark here too keeps cleared items from being re-added
  // as unread by the next backfill pass.
  const clearAll = useCallback(() => {
    markSeenNow();
    commit([]);
  }, [commit, markSeenNow]);

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
