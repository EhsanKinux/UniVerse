"use client";

import { useMemo, useState } from "react";
import { Calendar03Icon, Clock01Icon } from "@hugeicons/core-free-icons";

import { CalendarSkeleton } from "@/components/calendar/calendar-skeleton";
import { CalendarTimeline } from "@/components/calendar/calendar-timeline";
import { ModuleHero } from "@/components/module/module-hero";
import { EmptyState, ErrorState, FilterChips, InfoNote } from "@/components/module/module-ui";
import { useActiveCalendar } from "@/hooks/calendar";
import type { EventCategory } from "@/lib/api/types";
import { eventCategories } from "@/lib/meta/calendar-meta";
import { toPersianDigits } from "@/lib/utils";

const HERO_TONE =
  "text-sky-600 border-sky-500/15 from-sky-500/18 via-sky-500/8 shadow-sky-500/25 dark:text-sky-300";

type FilterValue = EventCategory | "all";

const filterOptions: { value: FilterValue; label: string }[] = [
  { value: "all", label: "همه" },
  ...(Object.entries(eventCategories) as [EventCategory, { label: string }][]).map(
    ([value, { label }]) => ({ value, label }),
  ),
];

export default function CalendarPage() {
  const { data, isLoading, isError, error, refetch } = useActiveCalendar();
  const [filter, setFilter] = useState<FilterValue>("all");

  const events = useMemo(() => data?.events ?? [], [data]);

  const filtered = useMemo(
    () => (filter === "all" ? events : events.filter((e) => e.category === filter)),
    [events, filter],
  );

  const upcomingCount = useMemo(() => events.filter((e) => e.status !== "past").length, [events]);

  if (isLoading) {
    return <CalendarSkeleton />;
  }

  const semester = data?.semester;
  const heroDescription = semester
    ? [semester.title, semester.subtitle].filter(Boolean).join(" — ")
    : "تقویم آموزشی مصوب شورای آموزشی دانشگاه";

  return (
    <div className="space-y-6">
      <ModuleHero
        backHref="/educational"
        backLabel="بخش آموزشی"
        icon={Calendar03Icon}
        title="تقویم آموزشی"
        description={heroDescription}
        status="فعال"
        tone={HERO_TONE}
        stats={[
          { icon: Calendar03Icon, value: toPersianDigits(events.length), label: "رویداد" },
          { icon: Clock01Icon, value: toPersianDigits(upcomingCount), label: "پیش‌رو" },
        ]}
      />

      {isError ? (
        <ErrorState
          title="دریافت تقویم ناموفق بود"
          subtitle={error?.message}
          onRetry={() => {
            refetch();
          }}
        />
      ) : !semester || events.length === 0 ? (
        <EmptyState
          icon={Calendar03Icon}
          title="هنوز تقویمی منتشر نشده است"
          subtitle="به‌محض تصویب تقویم نیمسال جاری، رویدادها اینجا نمایش داده می‌شوند."
        />
      ) : (
        <>
          <FilterChips options={filterOptions} value={filter} onChange={setFilter} />

          <section id="content" className="space-y-5">
            {filtered.length === 0 ? (
              <EmptyState icon={Calendar03Icon} title="رویدادی در این دسته نیست" />
            ) : (
              <CalendarTimeline events={filtered} />
            )}
          </section>
        </>
      )}

      <InfoNote title="یادآوری">
        تاریخ‌های این تقویم بر اساس مصوبه شورای آموزشی است و ممکن است تغییر کند. مرجع رسمی،
        اطلاعیه‌های سامانه گلستان و معاونت آموزشی دانشگاه است.
      </InfoNote>
    </div>
  );
}
