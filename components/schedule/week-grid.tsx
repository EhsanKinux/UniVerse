"use client";

import { useMemo } from "react";

import { Card } from "@/components/ui/card";
import { useTehranNow } from "@/hooks/schedule/use-tehran-now";
import type { SessionParity } from "@/lib/api/types";
import {
  courseTone,
  faDigits,
  matchesParity,
  PARITY_SHORT,
  toMinutes,
  WEEK_DAYS,
  type FlatSession,
} from "@/lib/meta/schedule-meta";
import { cn } from "@/lib/utils";

/** Pixel height of one hour on the chart. */
const HOUR_PX = 56;

/** A session enriched with its computed lane (for side-by-side overlaps). */
interface PositionedSession {
  session: FlatSession;
  lane: number;
  laneCount: number;
}

/**
 * Greedy "lane" assignment, the way calendar apps draw conflicts: sessions that
 * overlap in time share the day's width side-by-side instead of stacking on top
 * of each other.
 */
function layoutDay(sessions: FlatSession[]): PositionedSession[] {
  const sorted = [...sessions].sort(
    (a, b) => toMinutes(a.start) - toMinutes(b.start) || toMinutes(b.end) - toMinutes(a.end),
  );

  const positioned: PositionedSession[] = [];
  let cluster: PositionedSession[] = [];
  let laneEnds: number[] = []; // per-lane latest end time within the cluster
  let clusterEnd = -1;

  const flushCluster = () => {
    for (const item of cluster) item.laneCount = laneEnds.length;
    positioned.push(...cluster);
    cluster = [];
    laneEnds = [];
  };

  for (const session of sorted) {
    const start = toMinutes(session.start);
    const end = toMinutes(session.end);

    // A gap after every running session closes the current overlap cluster.
    if (cluster.length > 0 && start >= clusterEnd) flushCluster();

    let lane = laneEnds.findIndex((laneEnd) => laneEnd <= start);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(end);
    } else {
      laneEnds[lane] = end;
    }

    cluster.push({ session, lane, laneCount: 1 });
    clusterEnd = Math.max(clusterEnd, end);
  }
  flushCluster();

  return positioned;
}

/**
 * The weekly chart: days as columns (RTL: شنبه on the right), hours flowing
 * downward, each class a tappable colored block sized by its duration. Today's
 * column is tinted and carries a live "now" line.
 */
export function WeekGrid({
  sessions,
  parityView,
  todayIndex,
  onSelectCourse,
}: {
  sessions: FlatSession[];
  parityView: SessionParity;
  todayIndex: number;
  onSelectCourse: (courseId: string) => void;
}) {
  const now = useTehranNow();
  const visible = useMemo(
    () => sessions.filter((s) => matchesParity(s, parityView)),
    [sessions, parityView],
  );

  // Hour range: tightly wrap the actual classes (fall back to 8–18), padded to
  // whole hours so the axis labels stay round.
  const { startHour, endHour } = useMemo(() => {
    if (visible.length === 0) return { startHour: 8, endHour: 18 };
    const min = Math.min(...visible.map((s) => toMinutes(s.start)));
    const max = Math.max(...visible.map((s) => toMinutes(s.end)));
    return { startHour: Math.floor(min / 60), endHour: Math.ceil(max / 60) };
  }, [visible]);

  const rangeStart = startHour * 60;
  const totalMinutes = (endHour - startHour) * 60;
  const bodyHeight = (totalMinutes / 60) * HOUR_PX;

  const byDay = useMemo(
    () => WEEK_DAYS.map((day) => layoutDay(visible.filter((s) => s.dayOfWeek === day.index))),
    [visible],
  );

  const nowTop =
    now && now.minutes >= rangeStart && now.minutes <= rangeStart + totalMinutes
      ? ((now.minutes - rangeStart) / totalMinutes) * bodyHeight
      : null;

  return (
    <Card className="overflow-hidden p-3">
      {/* Day headers */}
      <div className="grid grid-cols-[2.25rem_repeat(6,1fr)] gap-x-1 pb-2">
        <div />
        {WEEK_DAYS.map((day) => {
          const isToday = day.index === todayIndex;
          return (
            <div
              key={day.index}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl py-1.5 text-center",
                isToday && "bg-primary/10",
              )}
            >
              <span className={cn("text-xs font-bold", isToday ? "text-primary" : "text-foreground")}>
                {day.short}
              </span>
              <span className={cn("text-[9px]", isToday ? "text-primary/80" : "text-muted-foreground")}>
                {isToday ? "امروز" : day.label.slice(0, 6)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Body */}
      <div className="grid grid-cols-[2.25rem_repeat(6,1fr)] gap-x-1">
        {/* Hour axis */}
        <div className="relative" style={{ height: bodyHeight }}>
          {Array.from({ length: endHour - startHour + 1 }, (_, i) => (
            <span
              key={i}
              className="absolute start-0 -translate-y-1/2 text-[9px] font-medium tabular-nums text-muted-foreground"
              style={{ top: i * HOUR_PX }}
            >
              {faDigits(startHour + i)}
            </span>
          ))}
        </div>

        {/* Day columns */}
        {WEEK_DAYS.map((day, dayIdx) => {
          const isToday = day.index === todayIndex;
          return (
            <div
              key={day.index}
              className={cn(
                "relative overflow-hidden rounded-lg",
                isToday ? "bg-primary/[0.04]" : "bg-muted/20",
              )}
              style={{ height: bodyHeight }}
            >
              {/* Hour gridlines */}
              {Array.from({ length: endHour - startHour }, (_, i) => (
                <div
                  key={i}
                  className="absolute inset-x-0 border-t border-border/40"
                  style={{ top: i * HOUR_PX }}
                />
              ))}

              {/* Session blocks */}
              {byDay[dayIdx].map(({ session, lane, laneCount }) => {
                const top = ((toMinutes(session.start) - rangeStart) / totalMinutes) * bodyHeight;
                const height =
                  ((toMinutes(session.end) - toMinutes(session.start)) / totalMinutes) * bodyHeight;
                const tone = courseTone(session.course.color);
                const width = 100 / laneCount;

                return (
                  <button
                    key={session.id}
                    type="button"
                    onClick={() => onSelectCourse(session.course.id)}
                    aria-label={`${session.course.name}، ${day.label} ${session.start} تا ${session.end}`}
                    className={cn(
                      "absolute flex flex-col items-center gap-0.5 overflow-hidden rounded-lg border px-0.5 py-1 text-center transition-transform active:scale-[0.97]",
                      tone.block,
                    )}
                    style={{
                      top: top + 1,
                      height: Math.max(height - 2, 18),
                      insetInlineStart: `calc(${lane * width}% + 1px)`,
                      width: `calc(${width}% - 2px)`,
                    }}
                  >
                    <span className="shrink-0 text-[8px] font-medium tabular-nums opacity-80">
                      {faDigits(session.start)}
                    </span>
                    {/* Vertical text: narrow columns can't fit horizontal Persian
                        names without wrapping to 1–2 chars/line, so run the name
                        down the block's (duration-sized) height instead. Desktop
                        columns are wide enough to read normally again. */}
                    <span className="min-h-0 flex-1 text-[10px] font-bold leading-tight [overflow-wrap:anywhere] [text-orientation:mixed] [writing-mode:vertical-rl] lg:text-[11px] lg:[writing-mode:horizontal-tb]">
                      {session.course.name}
                    </span>
                    {session.parity !== "all" && (
                      <span className="shrink-0 text-[8px] font-black opacity-70">
                        {PARITY_SHORT[session.parity]}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Live "now" line on today's column */}
              {isToday && nowTop !== null && (
                <div className="pointer-events-none absolute inset-x-0 z-10" style={{ top: nowTop }}>
                  <div className="h-0.5 bg-destructive/80" />
                  <div className="absolute -top-[3px] start-0 size-2 rounded-full bg-destructive" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
