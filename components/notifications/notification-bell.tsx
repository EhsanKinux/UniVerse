"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { InboxIcon, Megaphone01Icon, Notification03Icon } from "@hugeicons/core-free-icons";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AppNotification } from "@/lib/notifications/types";
import { categoryTone, isExternalLink } from "@/lib/notifications/ui";
import { cn, toPersianDigits } from "@/lib/utils";

import { useNotifications } from "./notification-provider";

/** Header bell with an unread badge and a dropdown history panel. */
export function NotificationBell() {
  const { notifications, unreadCount, markAllRead, clearAll } = useNotifications();

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        // Opening the panel counts as "seen" → clear the unread badge.
        if (open && unreadCount > 0) markAllRead();
      }}
    >
      <DropdownMenuTrigger
        aria-label={unreadCount > 0 ? `اعلان‌ها (${unreadCount} خوانده‌نشده)` : "اعلان‌ها"}
        className="relative grid size-10 shrink-0 place-items-center rounded-full border border-border bg-card/70 text-foreground shadow-sm outline-none transition-transform active:scale-95 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <HugeiconsIcon icon={Notification03Icon} size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -end-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-background bg-destructive px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "+۹" : toPersianDigits(unreadCount)}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[min(22rem,calc(100vw-1.5rem))] p-0"
      >
        <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2.5">
          <p className="text-sm font-bold text-foreground">اعلان‌ها</p>
          {notifications.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
            >
              پاک کردن همه
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
            <HugeiconsIcon icon={InboxIcon} size={36} className="mb-2 text-muted-foreground/40" />
            <p className="text-sm font-medium text-foreground">اعلانی ندارید</p>
            <p className="mt-1 text-xs text-muted-foreground">
              اخبار و اطلاعیه‌های جدید اینجا نمایش داده می‌شوند.
            </p>
          </div>
        ) : (
          <div className="max-h-[min(60vh,28rem)] overflow-y-auto py-1">
            {notifications.map((n) => (
              <NotificationRow key={n.id} notification={n} />
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationRow({ notification: n }: { notification: AppNotification }) {
  const content = (
    <div
      className={cn(
        "flex items-start gap-3 px-3 py-2.5 transition-colors hover:bg-muted/60",
        !n.read && "bg-primary/[0.04]",
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border",
          categoryTone(n.category),
        )}
      >
        <HugeiconsIcon icon={Megaphone01Icon} size={16} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[11px] text-muted-foreground">
            {n.categoryLabel} · {n.dateLabel}
          </span>
          {!n.read && <span className="size-2 shrink-0 rounded-full bg-primary" />}
        </div>
        <p className="mt-0.5 line-clamp-1 text-sm font-bold text-foreground">{n.title}</p>
        <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">{n.body}</p>
      </div>
    </div>
  );

  if (!n.link) return content;

  return isExternalLink(n.link) ? (
    <a href={n.link} target="_blank" rel="noopener noreferrer" className="block">
      {content}
    </a>
  ) : (
    <Link href={n.link} className="block">
      {content}
    </Link>
  );
}
