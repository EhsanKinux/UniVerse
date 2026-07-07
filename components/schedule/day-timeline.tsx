"use client";

import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock01Icon,
  Delete02Icon,
  Location04Icon,
  PencilEdit02Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/module/module-ui";
import { useCourseMutations } from "@/hooks/schedule/use-course-mutations";
import { useTehranNow } from "@/hooks/schedule/use-tehran-now";
import type { SessionParity } from "@/lib/api/types";
import {
  courseTone,
  faDigits,
  matchesParity,
  PARITY_LABELS,
  SESSION_TYPE_LABELS,
  toMinutes,
  WEEK_DAYS,
  type FlatSession,
} from "@/lib/meta/schedule-meta";
import { cn } from "@/lib/utils";

/**
 * The day view: a selector for the six week days, then that day's sessions as a
 * timeline of cards (time rail on the right, RTL). Today's ongoing class gets a
 * live highlight; each card offers edit / quick-delete.
 */
export function DayTimeline({
  sessions,
  parityView,
  todayIndex,
  onEditCourse,
}: {
  sessions: FlatSession[];
  parityView: SessionParity;
  todayIndex: number;
  onEditCourse: (courseId: string) => void;
}) {
  // Default to today when it's a class day; otherwise شنبه.
  const [activeDay, setActiveDay] = useState(() => (todayIndex <= 5 ? todayIndex : 0));
  const now = useTehranNow();

  const visible = useMemo(
    () => sessions.filter((s) => matchesParity(s, parityView)),
    [sessions, parityView],
  );
  const daySessions = visible.filter((s) => s.dayOfWeek === activeDay);
  const isTodayActive = activeDay === todayIndex;

  // The single "next up" session today (first one that hasn't started yet).
  const nextSessionId =
    isTodayActive && now
      ? daySessions.find((s) => toMinutes(s.start) > now.minutes)?.id ?? null
      : null;

  return (
    <div className="space-y-4">
      {/* Day selector */}
      <div className="grid grid-cols-6 gap-1.5">
        {WEEK_DAYS.map((day) => {
          const count = visible.filter((s) => s.dayOfWeek === day.index).length;
          const active = day.index === activeDay;
          return (
            <button
              key={day.index}
              onClick={() => setActiveDay(day.index)}
              className={cn(
                "relative flex flex-col items-center gap-1 rounded-2xl border py-2.5 transition-all active:scale-95",
                active
                  ? "border-primary/20 bg-primary/12 text-primary shadow-sm"
                  : "border-border bg-card/70 text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-background/70 text-sm font-bold">
                {day.short}
              </span>
              <span className="text-[10px] font-medium">{faDigits(count)} کلاس</span>
              {day.index === todayIndex && (
                <span className="absolute top-1.5 left-1.5 size-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 px-1">
        <h2 className="text-lg font-bold text-foreground">{WEEK_DAYS[activeDay].label}</h2>
        {isTodayActive && (
          <Badge variant="success" className="px-2.5 py-0.5 text-[11px]">
            امروز
          </Badge>
        )}
      </div>

      {daySessions.length === 0 ? (
        <EmptyState
          icon={Clock01Icon}
          title="کلاسی در این روز ندارید"
          subtitle="با دکمه «افزودن درس» جلسه جدیدی ثبت کنید"
        />
      ) : (
        <div className="space-y-3">
          {daySessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              live={
                isTodayActive && now
                  ? now.minutes >= toMinutes(session.start) && now.minutes < toMinutes(session.end)
                  : false
              }
              isNext={session.id === nextSessionId}
              onEdit={() => onEditCourse(session.course.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SessionCard({
  session,
  live,
  isNext,
  onEdit,
}: {
  session: FlatSession;
  live: boolean;
  isNext: boolean;
  onEdit: () => void;
}) {
  const tone = courseTone(session.course.color);
  const { deleteCourse } = useCourseMutations();
  const [confirming, setConfirming] = useState(false);

  function onDelete() {
    if (!confirming) {
      setConfirming(true);
      // Fall back to the safe state if the second tap never comes.
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    deleteCourse.mutate(session.course.id);
  }

  return (
    <Card className={cn("flex gap-3 overflow-hidden p-4", live && "ring-1 ring-emerald-500/40")}>
      {/* time rail */}
      <div className="flex shrink-0 flex-col items-center">
        <span className="font-mono text-sm font-bold tabular-nums text-foreground">
          {faDigits(session.start)}
        </span>
        <span className={cn("my-1 w-0.5 flex-1 rounded-full", tone.swatch, "opacity-40")} />
        <span className="font-mono text-xs tabular-nums text-muted-foreground">{faDigits(session.end)}</span>
      </div>

      <div className="min-w-0 flex-1 border-r border-border pr-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 text-base font-bold leading-6 text-foreground">{session.course.name}</h3>
          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={onEdit}
              aria-label={`ویرایش ${session.course.name}`}
              className="flex size-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:text-primary"
            >
              <HugeiconsIcon icon={PencilEdit02Icon} size={15} />
            </button>
            <button
              onClick={onDelete}
              disabled={deleteCourse.isPending}
              aria-label={`حذف ${session.course.name}`}
              className={cn(
                "flex h-8 items-center justify-center gap-1 rounded-full border transition-all",
                confirming
                  ? "border-destructive/30 bg-destructive/10 px-2.5 text-[10px] font-bold text-destructive"
                  : "w-8 border-border bg-background text-muted-foreground hover:text-destructive",
              )}
            >
              <HugeiconsIcon icon={Delete02Icon} size={15} />
              {confirming && "حذف؟"}
            </button>
          </div>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span className={cn("rounded-lg px-2 py-0.5 text-[10px] font-medium", tone.chip)}>
            {SESSION_TYPE_LABELS[session.type]}
          </span>
          {session.parity !== "all" && (
            <span className="rounded-lg bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              {PARITY_LABELS[session.parity]}
            </span>
          )}
          {live && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
              در حال برگزاری
            </span>
          )}
          {isNext && !live && (
            <span className="rounded-lg bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
              جلسه بعدی
            </span>
          )}
        </div>

        <div className="mt-2 space-y-1 text-sm">
          {session.course.professor && (
            <p className="flex items-center gap-1.5 text-muted-foreground">
              <HugeiconsIcon icon={UserIcon} size={14} className={cn("shrink-0", tone.text)} />
              {session.course.professor}
            </p>
          )}
          {session.room && (
            <p className="flex items-center gap-1.5 text-muted-foreground">
              <HugeiconsIcon icon={Location04Icon} size={14} className={cn("shrink-0", tone.text)} />
              {session.room}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
