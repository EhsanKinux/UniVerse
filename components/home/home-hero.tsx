"use client";

import { useMemo } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Calendar03Icon,
  Clock01Icon,
  Moon02Icon,
  SparklesIcon,
  Sun03Icon,
  SunriseIcon,
  SunsetIcon,
} from "@hugeicons/core-free-icons";

import { useProfile } from "@/hooks/auth/use-profile";
import { useTehranNow } from "@/hooks/schedule/use-tehran-now";
import { useWeeklySchedule } from "@/hooks/schedule/use-weekly-schedule";
import type { SessionParity } from "@/lib/api/types";
import {
  faDigits,
  flattenSessions,
  matchesParity,
  toMinutes,
  untilLabel,
  type FlatSession,
} from "@/lib/meta/schedule-meta";

// Tehran-clock greeting windows; the icon follows the sky, not the app theme.
const GREETINGS: readonly { from: number; to: number; text: string; icon: IconSvgElement }[] = [
  { from: 5 * 60, to: 12 * 60, text: "صبح بخیر", icon: SunriseIcon },
  { from: 12 * 60, to: 15 * 60, text: "ظهر بخیر", icon: Sun03Icon },
  { from: 15 * 60, to: 19 * 60, text: "عصر بخیر", icon: SunsetIcon },
];

function greetingFor(minutes: number): { text: string; icon: IconSvgElement } {
  return (
    GREETINGS.find((g) => minutes >= g.from && minutes < g.to) ?? { text: "شب بخیر", icon: Moon02Icon }
  );
}

type ClassChip =
  | { kind: "live"; session: FlatSession }
  | { kind: "next"; session: FlatSession; untilMinutes: number };

/**
 * The home-page hero: campus photo under a brand-tinted gradient, with a
 * Tehran-clock greeting, today's Persian date and — when the student has a
 * schedule — a live/next-class chip. Everything time- or user-dependent is
 * `null` during SSR (via useTehranNow / disabled queries), so the first client
 * render matches the server and the dynamic bits fill in right after hydration.
 */
export function HomeHero() {
  const now = useTehranNow();
  const { profile, user } = useProfile();
  const { data } = useWeeklySchedule();

  const name = profile?.name?.trim() || user?.name?.trim() || "";
  // First two tokens keep honorific pairs («سید علی») but drop long surnames.
  const shortName = name ? name.split(/\s+/).slice(0, 2).join(" ") : "";

  const faDate = useMemo(
    () =>
      now
        ? new Intl.DateTimeFormat("fa-IR", {
            timeZone: "Asia/Tehran",
            weekday: "long",
            day: "numeric",
            month: "long",
          }).format(new Date())
        : null,
    [now],
  );

  const chip = useMemo<ClassChip | null>(() => {
    if (!now || !data || now.dayIndex !== data.todayIndex) return null;
    const parityView: SessionParity = data.settings.currentWeekParity ?? "all";
    const sessions = flattenSessions(data.courses)
      .filter((s) => s.dayOfWeek === data.todayIndex && matchesParity(s, parityView))
      .sort((a, b) => toMinutes(a.start) - toMinutes(b.start));

    const live = sessions.find(
      (s) => now.minutes >= toMinutes(s.start) && now.minutes < toMinutes(s.end),
    );
    if (live) return { kind: "live", session: live };

    const next = sessions.find((s) => toMinutes(s.start) > now.minutes);
    if (next) return { kind: "next", session: next, untilMinutes: toMinutes(next.start) - now.minutes };

    return null;
  }, [now, data]);

  const greeting = now ? greetingFor(now.minutes) : null;

  return (
    <section className="relative isolate overflow-hidden rounded-3xl border border-border shadow-lg shadow-black/10">
      {/* Photo layer — the slow settle-zoom only runs for motion-tolerant users. */}
      <div
        className="absolute inset-0 bg-[url('/imgs/HUT.webp')] bg-cover bg-center motion-safe:animate-hero-zoom"
        aria-hidden
      />

      {/* Legibility + brand: bottom fade for the text, a primary wash across the
          photo and a soft glow so it reads as designed rather than pasted. */}
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/15" aria-hidden />
      <div
        className="absolute inset-0 bg-linear-to-tl from-primary/40 via-primary/10 to-transparent opacity-70 mix-blend-hard-light"
        aria-hidden
      />
      <div className="absolute -bottom-24 -left-20 size-64 rounded-full bg-primary/40 blur-3xl" aria-hidden />

      <div className="relative flex aspect-video w-full flex-col items-start justify-end gap-3.5 p-5 sm:aspect-21/9 md:p-7">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-md motion-safe:animate-fade-in-up">
          <HugeiconsIcon icon={faDate ? Calendar03Icon : SparklesIcon} size={14} className="text-white/80" />
          {faDate ?? "خوش آمدید"}
        </div>

        <div className="motion-safe:animate-fade-in-up motion-safe:[animation-delay:90ms]">
          <h2 className="flex items-center gap-2.5 text-2xl font-bold leading-9 tracking-tight text-white md:text-3xl md:leading-11">
            {greeting && (
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white/90 backdrop-blur-md md:size-10">
                <HugeiconsIcon icon={greeting.icon} size={20} />
              </span>
            )}
            <span className="min-w-0">
              {greeting ? (
                <>
                  {greeting.text}
                  {shortName && <span className="text-white/85">، {shortName}</span>}
                </>
              ) : (
                "همه چیز دانشگاه در یک اپ"
              )}
            </span>
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-white/75 md:max-w-lg">
            امور آموزشی، خدمات، غذا، برنامه هفتگی و اطلاعات دانشجویی — سریع و یکجا.
          </p>
        </div>

        {chip && (
          <Link
            href="/weekly-schedule"
            className="group inline-flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/15 py-1.5 pe-3 ps-2 text-xs font-medium text-white backdrop-blur-md transition-colors hover:bg-white/25 motion-safe:animate-fade-in-up"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/15">
              {chip.kind === "live" ? (
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-300" />
              ) : (
                <HugeiconsIcon icon={Clock01Icon} size={13} />
              )}
            </span>
            <span className="truncate">
              {chip.kind === "live" ? (
                <>
                  در حال برگزاری: <span className="font-bold">{chip.session.course.name}</span> تا ساعت{" "}
                  {faDigits(chip.session.end)}
                </>
              ) : (
                <>
                  کلاس بعدی: <span className="font-bold">{chip.session.course.name}</span> —{" "}
                  {untilLabel(chip.untilMinutes)} دیگر
                </>
              )}
            </span>
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              size={14}
              className="shrink-0 opacity-70 transition-transform group-hover:-translate-x-0.5"
            />
          </Link>
        )}
      </div>
    </section>
  );
}
