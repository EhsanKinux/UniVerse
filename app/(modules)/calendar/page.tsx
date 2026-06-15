"use client";

import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, CheckmarkCircle02Icon, Clock01Icon } from "@hugeicons/core-free-icons";

import { ModuleHero } from "@/components/module/module-hero";
import { EmptyState, FilterChips, InfoNote, SectionHeading } from "@/components/module/module-ui";
import { Card } from "@/components/ui/card";
import {
  academicTerm,
  calendarEvents,
  eventCategories,
  type EventCategory,
  type EventStatus,
} from "@/lib/calendar-data";
import { cn } from "@/lib/utils";

const HERO_TONE = "text-sky-600 border-sky-500/15 from-sky-500/18 via-sky-500/8 shadow-sky-500/25 dark:text-sky-300";

const statusStyles: Record<EventStatus, { label: string; dot: string; ring: string }> = {
  past: { label: "برگزار شد", dot: "bg-muted-foreground/40", ring: "border-border" },
  current: { label: "در جریان", dot: "bg-emerald-500", ring: "border-emerald-500/40" },
  upcoming: { label: "پیش‌رو", dot: "bg-primary", ring: "border-primary/30" },
};

type FilterValue = EventCategory | "all";

export default function CalendarPage() {
  const [filter, setFilter] = useState<FilterValue>("all");

  const filterOptions = useMemo(
    () => [
      { value: "all" as FilterValue, label: "همه" },
      ...(Object.entries(eventCategories) as [EventCategory, { label: string }][]).map(([value, { label }]) => ({
        value: value as FilterValue,
        label,
      })),
    ],
    [],
  );

  const filtered = useMemo(
    () => (filter === "all" ? calendarEvents : calendarEvents.filter((e) => e.category === filter)),
    [filter],
  );

  const grouped = useMemo(() => {
    const map = new Map<string, typeof calendarEvents>();
    for (const event of filtered) {
      const list = map.get(event.month) ?? [];
      list.push(event);
      map.set(event.month, list);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const upcomingCount = calendarEvents.filter((e) => e.status !== "past").length;

  return (
    <div className="space-y-6">
      <ModuleHero
        backHref="/educational"
        backLabel="بخش آموزشی"
        icon={Calendar03Icon}
        title="تقویم آموزشی"
        description={`${academicTerm.title} — ${academicTerm.subtitle}`}
        status="فعال"
        tone={HERO_TONE}
        stats={[
          { icon: Calendar03Icon, value: String(calendarEvents.length), label: "رویداد" },
          { icon: Clock01Icon, value: String(upcomingCount), label: "پیش‌رو" },
        ]}
      />

      <FilterChips options={filterOptions} value={filter} onChange={setFilter} />

      <section id="content" className="space-y-5">
        {grouped.length === 0 ? (
          <EmptyState icon={Calendar03Icon} title="رویدادی در این دسته نیست" />
        ) : (
          grouped.map(([month, events]) => (
            <div key={month} className="space-y-3">
              <SectionHeading title={month} />
              <div className="relative space-y-3 pr-4">
                {/* timeline line */}
                <div className="absolute top-2 bottom-2 right-[7px] w-px bg-border" />
                {events.map((event) => {
                  const cat = eventCategories[event.category];
                  const status = statusStyles[event.status];
                  return (
                    <div key={event.id} className="relative">
                      {/* node */}
                      <span
                        className={cn(
                          "absolute top-5 -right-4 z-10 flex size-3.5 items-center justify-center rounded-full border-2 bg-background",
                          status.ring,
                        )}
                      >
                        <span className={cn("size-1.5 rounded-full", status.dot)} />
                      </span>

                      <Card
                        className={cn(
                          "p-4 transition-all",
                          event.status === "current" && "border-emerald-500/30 ring-1 ring-emerald-500/10",
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <span
                                className="inline-block size-2 rounded-full"
                                style={{ backgroundColor: cat.color }}
                              />
                              <span className="text-xs font-medium" style={{ color: cat.color }}>
                                {cat.label}
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-foreground">{event.title}</h3>
                          </div>
                          <time className="shrink-0 rounded-xl border border-border bg-background/70 px-2.5 py-1 text-xs font-semibold text-foreground">
                            {event.dateLabel}
                          </time>
                        </div>

                        {event.description && (
                          <p className="mt-2.5 text-sm leading-6 text-muted-foreground">{event.description}</p>
                        )}

                        <div className="mt-3 flex items-center gap-1.5">
                          <HugeiconsIcon
                            icon={event.status === "past" ? CheckmarkCircle02Icon : Clock01Icon}
                            size={13}
                            className="text-muted-foreground"
                          />
                          <span className="text-[11px] font-medium text-muted-foreground">{status.label}</span>
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </section>

      <InfoNote title="یادآوری">
        تاریخ‌های این تقویم بر اساس مصوبه شورای آموزشی است و ممکن است تغییر کند. مرجع رسمی، اطلاعیه‌های سامانه گلستان و
        معاونت آموزشی دانشگاه است.
      </InfoNote>
    </div>
  );
}
