"use client";

import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  ArrowUpRight01Icon,
  CheckmarkCircle02Icon,
  Copy01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

import { ModuleHero } from "@/components/module/module-hero";
import { EmptyState, ErrorState, SectionHeading } from "@/components/module/module-ui";
import { Card } from "@/components/ui/card";
import { useGroups } from "@/hooks/groups/use-groups";
import { groupsApi } from "@/lib/api/groups.api";
import type { Group, GroupLink } from "@/lib/api/types";
import { groupLinkMeta } from "@/lib/meta/groups-meta";
import { cn, toPersianDigits } from "@/lib/utils";

const HERO_TONE =
  "text-fuchsia-600 border-fuchsia-500/15 from-fuchsia-500/18 via-fuchsia-500/8 shadow-fuchsia-500/25 dark:text-fuchsia-300";

// Shared look for a join-option button/row (matches the phone-list action buttons).
const OPTION_CLASS =
  "flex h-11 w-full items-center gap-2.5 rounded-2xl border border-border bg-background px-3.5 text-sm font-semibold text-foreground transition-all hover:border-primary/30 hover:bg-primary/5 active:scale-[0.98]";

export default function GroupsPage() {
  const { data, isLoading, isError, refetch } = useGroups();
  const [copied, setCopied] = useState<string | null>(null);
  const [openQr, setOpenQr] = useState<Set<string>>(() => new Set());

  const categories = useMemo(() => data ?? [], [data]);
  const totalGroups = useMemo(
    () => categories.reduce((sum, c) => sum + c.groups.length, 0),
    [categories],
  );

  async function copyHandle(id: string, handle: string) {
    try {
      await navigator.clipboard.writeText(handle);
      setCopied(id);
      setTimeout(() => setCopied((c) => (c === id ? null : c)), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  function toggleQr(id: string) {
    setOpenQr((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function renderOption(link: GroupLink) {
    const meta = groupLinkMeta(link.kind);
    const label = link.label?.trim() || meta.defaultLabel;

    if (link.kind === "link" && link.url) {
      return (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={OPTION_CLASS}
        >
          <HugeiconsIcon icon={meta.icon} size={17} className="shrink-0 text-primary" />
          <span className="min-w-0 flex-1 truncate">{label}</span>
          <HugeiconsIcon icon={ArrowUpRight01Icon} size={15} className="shrink-0 text-muted-foreground" />
        </a>
      );
    }

    if (link.kind === "handle" && link.handle) {
      const isCopied = copied === link.id;
      return (
        <button
          key={link.id}
          onClick={() => copyHandle(link.id, link.handle!)}
          className={OPTION_CLASS}
          aria-label={`کپی ${link.handle}`}
        >
          <HugeiconsIcon
            icon={isCopied ? CheckmarkCircle02Icon : Copy01Icon}
            size={17}
            className={cn("shrink-0", isCopied ? "text-emerald-500" : "text-primary")}
          />
          <span dir="ltr" className="min-w-0 flex-1 truncate text-right font-mono text-[13px]">
            {link.handle}
          </span>
          <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
            {isCopied ? "کپی شد" : "کپی"}
          </span>
        </button>
      );
    }

    if (link.kind === "qr" && link.hasQr) {
      const open = openQr.has(link.id);
      return (
        <div key={link.id}>
          <button onClick={() => toggleQr(link.id)} className={OPTION_CLASS} aria-expanded={open}>
            <HugeiconsIcon icon={meta.icon} size={17} className="shrink-0 text-primary" />
            <span className="min-w-0 flex-1 truncate">{label}</span>
            <HugeiconsIcon
              icon={open ? ArrowUp01Icon : ArrowDown01Icon}
              size={16}
              className="shrink-0 text-muted-foreground"
            />
          </button>
          {open && (
            <div className="mt-2 flex justify-center rounded-2xl border border-border bg-white p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={groupsApi.qrUrl(link.id)}
                alt={label}
                loading="lazy"
                className="size-44 object-contain"
              />
            </div>
          )}
        </div>
      );
    }

    return null;
  }

  function renderCard(group: Group) {
    return (
      <Card key={group.id} className="overflow-hidden p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold leading-6 text-foreground">{group.title}</h3>
            {group.description && (
              <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
                {group.description}
              </p>
            )}
          </div>
          {group.platform && (
            <span className="shrink-0 rounded-lg border border-primary/20 bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
              {group.platform}
            </span>
          )}
        </div>

        {group.links.length > 0 && (
          <div className="mt-3.5 space-y-2">{group.links.map((link) => renderOption(link))}</div>
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <ModuleHero
        backHref="/student"
        backLabel="بخش دانشجویی"
        icon={UserGroupIcon}
        title="گروه‌ها"
        description="کانال‌های رسمی، گروه‌های کلاسی و انجمن‌های دانشجویی را پیدا کنید و عضو شوید."
        status="اجتماعی"
        tone={HERO_TONE}
        stats={
          totalGroups
            ? [{ icon: UserGroupIcon, value: toPersianDigits(totalGroups), label: "گروه و کانال" }]
            : []
        }
      />

      {isLoading ? (
        <GroupsSkeleton />
      ) : isError ? (
        <ErrorState
          title="دریافت گروه‌ها ناموفق بود"
          subtitle="اتصال به سرور برقرار نشد. دوباره تلاش کنید."
          onRetry={() => {
            refetch();
          }}
        />
      ) : categories.length === 0 ? (
        <EmptyState
          icon={UserGroupIcon}
          title="هنوز گروهی ثبت نشده است"
          subtitle="به‌محض ثبت گروه‌ها و کانال‌ها توسط دانشگاه، اینجا نمایش داده می‌شود."
        />
      ) : (
        <section id="content" className="space-y-5">
          {categories.map((category) => (
            <div key={category.id} className="space-y-3">
              <SectionHeading title={category.title} />
              <div className="grid gap-3">{category.groups.map((group) => renderCard(group))}</div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

function GroupsSkeleton() {
  return (
    <div className="space-y-5">
      {[0, 1].map((s) => (
        <div key={s} className="space-y-3">
          <div className="h-6 w-40 animate-pulse rounded-lg bg-card/60" />
          <div className="grid gap-3">
            {[0, 1].map((c) => (
              <div key={c} className="h-[128px] animate-pulse rounded-2xl border border-border bg-card/50" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
