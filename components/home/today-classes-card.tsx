"use client";

import { useMemo } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  CalendarAdd01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Coffee01Icon,
  Location04Icon,
} from "@hugeicons/core-free-icons";

import { Card } from "@/components/ui/card";
import { useTehranNow } from "@/hooks/schedule/use-tehran-now";
import { useWeeklySchedule } from "@/hooks/schedule/use-weekly-schedule";
import type { SessionParity } from "@/lib/api/types";
import {
  courseTone,
  faDigits,
  flattenSessions,
  matchesParity,
  toMinutes,
  WEEK_DAYS,
  type FlatSession,
} from "@/lib/schedule-meta";
import { cn } from "@/lib/utils";

/** «۱ ساعت و ۵ دقیقه» / «۴۵ دقیقه» from a raw minute count. */
function untilLabel(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${faDigits(h)} ساعت و ${faDigits(m)} دقیقه`;
  if (h > 0) return `${faDigits(h)} ساعت`;
  return `${faDigits(m)} دقیقه`;
}

export function TodayClassesCard() {
  const { data, isPending, isError, hasSession, mounted } = useWeeklySchedule();
  const now = useTehranNow();

  const todaySessions = useMemo<FlatSession[]>(() => {
    if (!data) return [];
    const parityView: SessionParity = data.settings.currentWeekParity ?? "all";
    return flattenSessions(data.courses).filter(
      (s) => s.dayOfWeek === data.todayIndex && matchesParity(s, parityView),
    );
  }, [data]);

  if (!mounted || (hasSession && isPending)) return <TodaySkeleton />;
  if (!hasSession || isError || !data) return null;

  const dayLabel = data.todayIndex <= 5 ? WEEK_DAYS[data.todayIndex].label : "جمعه";

  const header = (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <HugeiconsIcon icon={Clock01Icon} size={18} />
        </span>
        <div className="leading-tight">
          <h2 className="text-base font-bold tracking-tight text-foreground">کلاس‌های امروز</h2>
          <p className="text-[11px] text-muted-foreground">
            {dayLabel}
            {todaySessions.length > 0 && ` · ${faDigits(todaySessions.length)} کلاس`}
          </p>
        </div>
      </div>

      <Link
        href="/weekly-schedule"
        className="inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
      >
        برنامه هفته
        <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
      </Link>
    </div>
  );

  // No courses yet → nudge the student to build their schedule.
  if (data.courses.length === 0) {
    return (
      <Card className="space-y-3 p-4">
        {header}
        <Link
          href="/weekly-schedule"
          className="flex items-center gap-3 rounded-2xl border border-dashed border-border bg-muted/30 p-4 transition-colors active:scale-[0.99]"
        >
          <HugeiconsIcon icon={CalendarAdd01Icon} size={22} className="shrink-0 text-primary" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground">هنوز برنامه‌ای نساخته‌اید</p>
            <p className="mt-0.5 text-[11px] leading-5 text-muted-foreground">
              درس‌هایتان را ثبت کنید تا کلاس‌های هر روز اینجا نمایش داده شود.
            </p>
          </div>
        </Link>
      </Card>
    );
  }

  // Has courses but nothing today → free day / weekend.
  if (todaySessions.length === 0) {
    return (
      <Card className="space-y-3 p-4">
        {header}
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/20 p-4">
          <HugeiconsIcon icon={Coffee01Icon} size={22} className="shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground">امروز کلاسی ندارید</p>
            <p className="mt-0.5 text-[11px] leading-5 text-muted-foreground">
              {data.todayIndex === 6 ? "جمعه خوبی داشته باشید." : "از وقت آزادتان لذت ببرید."}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const live =
    now?.dayIndex === data.todayIndex
      ? todaySessions.find((s) => now.minutes >= toMinutes(s.start) && now.minutes < toMinutes(s.end)) ?? null
      : null;
  const next =
    now?.dayIndex === data.todayIndex
      ? todaySessions.find((s) => toMinutes(s.start) > now.minutes) ?? null
      : null;
  const allDone = now?.dayIndex === data.todayIndex && !live && !next;

  return (
    <Card className="space-y-3 p-4">
      {header}

      {/* Status banner: live class, next-up countdown, or "all done". */}
      {live && (
        <StatusBanner
          tone={courseTone(live.course.color).block}
          label={
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 animate-pulse rounded-full bg-current" />
              در حال برگزاری
            </span>
          }
          name={live.course.name}
          meta={`تا ساعت ${faDigits(live.end)}`}
        />
      )}
      {!live && next && now && (
        <StatusBanner
          tone={courseTone(next.course.color).block}
          label="کلاس بعدی"
          name={next.course.name}
          meta={`${untilLabel(toMinutes(next.start) - now.minutes)} دیگر`}
        />
      )}
      {allDone && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-sm font-bold text-emerald-600 dark:text-emerald-400">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={17} className="shrink-0" />
          کلاس‌های امروزتان تمام شد
        </div>
      )}

      {/* Today's timeline */}
      <ul className="space-y-2.5">
        {todaySessions.map((session) => {
          const tone = courseTone(session.course.color);
          const isLive = session.id === live?.id;
          const isPast = now?.dayIndex === data.todayIndex && now.minutes >= toMinutes(session.end);

          return (
            <li
              key={session.id}
              className={cn("flex items-center gap-3 transition-opacity", isPast && "opacity-45")}
            >
              <span className={cn("h-9 w-1 shrink-0 rounded-full", tone.swatch, !isLive && "opacity-60")} />

              <div className="w-11 shrink-0 text-center">
                <span className="block font-mono text-xs font-bold tabular-nums text-foreground">
                  {faDigits(session.start)}
                </span>
                <span className="block font-mono text-[10px] tabular-nums text-muted-foreground">
                  {faDigits(session.end)}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-foreground">{session.course.name}</p>
                {session.room && (
                  <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-muted-foreground">
                    <HugeiconsIcon icon={Location04Icon} size={12} className={cn("shrink-0", tone.text)} />
                    {session.room}
                  </p>
                )}
              </div>

              {isLive ? (
                <span className="shrink-0 rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  اکنون
                </span>
              ) : session.id === next?.id ? (
                <span className="shrink-0 rounded-lg bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  بعدی
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function StatusBanner({
  tone,
  label,
  name,
  meta,
}: {
  tone: string;
  label: React.ReactNode;
  name: string;
  meta: string;
}) {
  return (
    <div className={cn("flex items-center gap-3 rounded-2xl border p-3", tone)}>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium opacity-80">{label}</p>
        <p className="truncate text-sm font-bold">{name}</p>
      </div>
      <span className="shrink-0 text-xs font-bold tabular-nums">{meta}</span>
    </div>
  );
}

function TodaySkeleton() {
  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-center gap-2.5">
        <span className="size-9 animate-pulse rounded-2xl bg-muted" />
        <div className="space-y-1.5">
          <span className="block h-3.5 w-24 animate-pulse rounded bg-muted" />
          <span className="block h-2.5 w-16 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <span className="block h-14 animate-pulse rounded-2xl bg-muted" />
      <div className="space-y-2.5">
        {Array.from({ length: 2 }, (_, i) => (
          <span key={i} className="block h-9 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </Card>
  );
}
