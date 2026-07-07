"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  BookOpen01Icon,
  CalendarAdd01Icon,
  Clock01Icon,
  GridViewIcon,
  Login03Icon,
  TimeScheduleIcon,
} from "@hugeicons/core-free-icons";

import { ModuleHero } from "@/components/module/module-hero";
import { ErrorState, FilterChips, InfoNote } from "@/components/module/module-ui";
import { CourseFormSheet } from "@/components/schedule/course-form-sheet";
import { DayTimeline } from "@/components/schedule/day-timeline";
import { ReminderSettingsCard } from "@/components/schedule/reminder-settings-card";
import { ScheduleSkeleton } from "@/components/schedule/schedule-skeleton";
import { WeekGrid } from "@/components/schedule/week-grid";
import { Button } from "@/components/ui/button";
import { useWeeklySchedule } from "@/hooks/schedule/use-weekly-schedule";
import type { Course, SessionParity } from "@/lib/api/types";
import { faDigits, flattenSessions, weeklyHoursLabel } from "@/lib/meta/schedule-meta";
import { cn } from "@/lib/utils";

const HERO_TONE =
  "text-teal-600 border-teal-500/15 from-teal-500/18 via-teal-500/8 shadow-teal-500/25 dark:text-teal-300";

type ViewMode = "day" | "week";

export default function WeeklySchedulePage() {
  const { data, isPending, isError, refetch, hasSession, mounted } = useWeeklySchedule();

  const [view, setView] = useState<ViewMode>("day");
  // The user's chip choice wins; otherwise follow the declared current week.
  const [parityOverride, setParityOverride] = useState<SessionParity | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  const courses = useMemo(() => data?.courses ?? [], [data?.courses]);
  const sessions = useMemo(() => flattenSessions(courses), [courses]);
  const parityView: SessionParity = parityOverride ?? data?.settings.currentWeekParity ?? "all";
  const editingCourse: Course | null = courses.find((c) => c.id === editingCourseId) ?? null;

  function openCreate() {
    setEditingCourseId(null);
    setSheetOpen(true);
  }

  function openEdit(courseId: string) {
    setEditingCourseId(courseId);
    setSheetOpen(true);
  }

  const hero = (
    <ModuleHero
      backHref="/student"
      backLabel="بخش دانشجویی"
      icon={Clock01Icon}
      title="برنامه هفتگی"
      description="درس‌های خودتان را ثبت کنید، برنامه روز و هفته را یکجا ببینید و قبل از هر کلاس یادآوری بگیرید."
      status="شخصی"
      tone={HERO_TONE}
      stats={
        data
          ? [
              { icon: BookOpen01Icon, value: faDigits(courses.length), label: "درس" },
              { icon: Clock01Icon, value: faDigits(sessions.length), label: "جلسه در هفته" },
              { icon: TimeScheduleIcon, value: weeklyHoursLabel(sessions), label: "ساعت در هفته" },
            ]
          : undefined
      }
    />
  );

  // ---- Auth / loading / error gates -----------------------------------------

  if (!mounted) return <ScheduleSkeleton />;

  if (!hasSession) {
    return (
      <div className="space-y-6">
        {hero}
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/40 p-10 text-center">
          <HugeiconsIcon icon={Login03Icon} size={40} className="mb-3 text-muted-foreground/40" />
          <p className="text-sm font-semibold text-foreground">برنامه هفتگی مخصوص حساب شماست</p>
          <p className="mt-1 text-xs leading-6 text-muted-foreground">
            برای ساختن و همگام‌سازی برنامه کلاس‌هایتان ابتدا وارد شوید.
          </p>
          <Link
            href="/sign-in?redirect=/weekly-schedule"
            className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-5 text-xs font-bold text-primary-foreground transition-transform active:scale-95"
          >
            ورود به حساب
          </Link>
        </div>
      </div>
    );
  }

  if (isPending) return <ScheduleSkeleton />;

  if (isError || !data) {
    return (
      <div className="space-y-6">
        {hero}
        <ErrorState subtitle="برنامه هفتگی در دسترس نیست. اتصال خود را بررسی کنید." onRetry={() => void refetch()} />
      </div>
    );
  }

  // ---- Loaded ---------------------------------------------------------------

  return (
    <div className="space-y-6">
      {hero}

      {/* Toolbar: view switch + add course */}
      <div className="flex items-center gap-2">
        <div
          className="flex flex-1 rounded-2xl border border-border bg-card/70 p-1"
          role="radiogroup"
          aria-label="نمای برنامه"
        >
          {(
            [
              { value: "day", label: "روزانه", icon: TimeScheduleIcon },
              { value: "week", label: "هفتگی", icon: GridViewIcon },
            ] as const
          ).map((opt) => {
            const active = view === opt.value;
            return (
              <button
                key={opt.value}
                role="radio"
                aria-checked={active}
                onClick={() => setView(opt.value)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all",
                  active ? "bg-primary/12 text-primary shadow-sm" : "text-muted-foreground",
                )}
              >
                <HugeiconsIcon icon={opt.icon} size={15} />
                {opt.label}
              </button>
            );
          })}
        </div>
        <Button onClick={openCreate} className="h-[42px] rounded-2xl px-4 text-xs font-bold">
          <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
          افزودن درس
        </Button>
      </div>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/40 p-10 text-center">
          <HugeiconsIcon icon={CalendarAdd01Icon} size={40} className="mb-3 text-muted-foreground/40" />
          <p className="text-sm font-semibold text-foreground">هنوز درسی ثبت نکرده‌اید</p>
          <p className="mt-1 text-xs leading-6 text-muted-foreground">
            اولین درس را اضافه کنید تا نمودار هفتگی و یادآوری کلاس‌ها فعال شود.
          </p>
          <Button onClick={openCreate} className="mt-4 rounded-full px-5 text-xs font-bold">
            <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
            افزودن اولین درس
          </Button>
        </div>
      ) : (
        <>
          {/* Parity filter */}
          <FilterChips
            options={[
              { value: "all" as const, label: "همه هفته‌ها" },
              {
                value: "odd" as const,
                label: data.settings.currentWeekParity === "odd" ? "هفته فرد (این هفته)" : "هفته فرد",
              },
              {
                value: "even" as const,
                label: data.settings.currentWeekParity === "even" ? "هفته زوج (این هفته)" : "هفته زوج",
              },
            ]}
            value={parityView}
            onChange={(v) => setParityOverride(v)}
          />

          <section id="content">
            {view === "day" ? (
              <DayTimeline
                sessions={sessions}
                parityView={parityView}
                todayIndex={data.todayIndex}
                onEditCourse={openEdit}
              />
            ) : (
              <WeekGrid
                sessions={sessions}
                parityView={parityView}
                todayIndex={data.todayIndex}
                onSelectCourse={openEdit}
              />
            )}
          </section>
        </>
      )}

      <ReminderSettingsCard settings={data.settings} />

      <InfoNote title="فقط برای شما">
        برنامه هفتگی به حساب کاربری شما گره خورده و روی همه دستگاه‌هایتان همگام می‌شود. یادآوری کلاس‌ها به‌صورت
        اعلان سیستمی ارسال می‌شود؛ برای دریافت آن کافی است یک بار اجازه اعلان را فعال کنید.
      </InfoNote>

      <CourseFormSheet open={sheetOpen} onOpenChange={setSheetOpen} course={editingCourse} />
    </div>
  );
}
