import type { NewsCategory } from "@/lib/api/types";

/** A notification shown in the bell panel and persisted to localStorage. */
export interface AppNotification {
  /** Same as the source news id (also used to de-duplicate). */
  id: string;
  newsId: string;
  title: string;
  body: string;
  category: NewsCategory | string;
  categoryLabel: string;
  dateLabel: string;
  /** Where tapping the notification goes (internal route or external URL). */
  link: string | null;
  read: boolean;
  /** When we received it (ms epoch) — newest first in the panel. */
  receivedAt: number;
}
