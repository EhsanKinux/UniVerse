"use client";

import { useSyncExternalStore } from "react";

export interface TehranNow {
  /** University weekday: 0 = شنبه … 6 = جمعه. */
  dayIndex: number;
  /** Minutes since Tehran midnight. */
  minutes: number;
}

const WEEKDAY_INDEX: Record<string, number> = {
  Sat: 0,
  Sun: 1,
  Mon: 2,
  Tue: 3,
  Wed: 4,
  Thu: 5,
  Fri: 6,
};

function readTehranNow(): TehranNow {
  const parts: Record<string, string> = {};
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tehran",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  for (const part of formatter.formatToParts(new Date())) {
    parts[part.type] = part.value;
  }
  return {
    dayIndex: WEEKDAY_INDEX[parts.weekday] ?? 0,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

// The wall clock is an external store: components SUBSCRIBE to it rather than
// mirroring it into state from an effect (which the react-hooks lint rightly
// flags as a cascading-render risk).

function subscribe(onTick: () => void): () => void {
  const timer = setInterval(onTick, 30_000);
  return () => clearInterval(timer);
}

// getSnapshot must return a REFERENTIALLY stable value until the time actually
// changes, or React would re-render in a loop comparing fresh objects.
let lastSnapshot: TehranNow | null = null;

function getSnapshot(): TehranNow {
  const next = readTehranNow();
  if (
    !lastSnapshot ||
    lastSnapshot.dayIndex !== next.dayIndex ||
    lastSnapshot.minutes !== next.minutes
  ) {
    lastSnapshot = next;
  }
  return lastSnapshot;
}

// On the server there is no clock to agree on — render "unknown" and let the
// client fill it in right after hydration (avoids an SSR/client mismatch).
function getServerSnapshot(): TehranNow | null {
  return null;
}

/**
 * The current Tehran wall-clock time, ticking every half minute — drives the
 * "now" line on the chart and the «در حال برگزاری» highlight. Pinned to
 * Asia/Tehran (not the device timezone) so it always matches class times;
 * `null` during SSR/hydration.
 */
export function useTehranNow(): TehranNow | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
