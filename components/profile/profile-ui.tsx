"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { ArrowLeft01Icon, Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";

/** Small section title (+ optional subtitle) used between profile cards. */
export function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="px-1">
      <h2 className="text-lg font-bold tracking-tight text-foreground">{title}</h2>
      {subtitle && <p className="mt-1 text-xs leading-5 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

/** Read-only label/value row with an icon tile and an optional copy button. */
export function InfoRow({
  icon,
  label,
  value,
  copyable,
}: {
  icon: IconSvgElement;
  label: string;
  value: string;
  copyable?: boolean;
}) {
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="flex items-center gap-3 p-3.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background">
        <HugeiconsIcon icon={icon} size={18} className="text-muted-foreground" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] text-muted-foreground">{label}</span>
        <span className="block truncate text-sm font-semibold text-foreground">{value}</span>
      </span>
      {copyable && (
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "کپی شد" : "کپی"}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:scale-95"
        >
          <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} size={16} className={cn(copied && "text-emerald-500")} />
        </button>
      )}
    </div>
  );
}

/** Tappable row that links out (mailto/tel/etc.) with a trailing chevron. */
export function ActionRow({
  icon,
  label,
  value,
  href,
  ltr,
}: {
  icon: IconSvgElement;
  label: string;
  value: string;
  href: string;
  ltr?: boolean;
}) {
  return (
    <a href={href} className="flex items-center gap-3 p-3.5 transition-colors hover:bg-muted/40 active:bg-muted/60">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background">
        <HugeiconsIcon icon={icon} size={18} className="text-primary" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">{label}</span>
        <span dir={ltr ? "ltr" : undefined} className={cn("block truncate text-[11px] text-muted-foreground", ltr && "text-right")}>
          {value}
        </span>
      </span>
      <HugeiconsIcon icon={ArrowLeft01Icon} size={16} className="shrink-0 text-muted-foreground/60" />
    </a>
  );
}
