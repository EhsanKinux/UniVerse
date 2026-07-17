"use client";

import { useEffect } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Megaphone01Icon } from "@hugeicons/core-free-icons";

import type { NewsItem } from "@/lib/api/types";
import { categoryTone, isExternalLink } from "@/lib/notifications/ui";
import { cn } from "@/lib/utils";

export interface ToastData {
  id: string;
  item: NewsItem;
  /** Small label above the title, e.g. «خبر جدید» or «اطلاعیهٔ خوابگاه». */
  eyebrow?: string;
}

const TOAST_MS = 6000;

/**
 * The transient toast stack — fixed at the top, above the sticky header. Toasts
 * slide in and auto-dismiss; tapping one navigates to the news link (if any).
 */
export function Toaster({
  toasts,
  onDismiss,
}: {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex flex-col items-center gap-2 px-3 pt-[calc(env(safe-area-inset-top)+0.6rem)]">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastData;
  onDismiss: (id: string) => void;
}) {
  const { item } = toast;

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), TOAST_MS);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const dismiss = () => onDismiss(toast.id);

  const cardClass =
    "pointer-events-auto block w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card/95 shadow-lg shadow-black/5 backdrop-blur-xl animate-in fade-in slide-in-from-top-3 duration-300";

  const inner = (
    <div className="flex items-start gap-3 p-3.5">
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl border",
          categoryTone(item.category),
        )}
      >
        <HugeiconsIcon icon={Megaphone01Icon} size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <span className="text-[11px] font-medium text-muted-foreground">
          {toast.eyebrow ?? "خبر جدید"} · {item.categoryLabel}
        </span>
        <p className="mt-0.5 line-clamp-1 text-sm font-bold text-foreground">{item.title}</p>
        <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">{item.body}</p>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          dismiss();
        }}
        aria-label="بستن"
        className="-me-1 -mt-1 shrink-0 rounded-lg p-1 text-muted-foreground transition-colors hover:text-foreground"
      >
        <HugeiconsIcon icon={Cancel01Icon} size={16} />
      </button>
    </div>
  );

  // Every toast is tappable; it dismisses and navigates. With no explicit link,
  // it deep-links to the item's detail page.
  const href = item.link ?? `/news/${item.id}`;

  return isExternalLink(href) ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={dismiss}
      className={cardClass}
    >
      {inner}
    </a>
  ) : (
    <Link href={href} onClick={dismiss} className={cardClass}>
      {inner}
    </Link>
  );
}
