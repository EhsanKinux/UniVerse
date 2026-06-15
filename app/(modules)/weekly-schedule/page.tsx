"use client";

import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, Location04Icon, UserIcon } from "@hugeicons/core-free-icons";

import { ModuleHero } from "@/components/module/module-hero";
import { EmptyState } from "@/components/module/module-ui";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { weeklySchedule } from "@/lib/schedule-data";
import { cn } from "@/lib/utils";

const HERO_TONE =
  "text-teal-600 border-teal-500/15 from-teal-500/18 via-teal-500/8 shadow-teal-500/25 dark:text-teal-300";

export default function WeeklySchedulePage() {
  const todayId = useMemo(() => weeklySchedule.find((d) => d.isToday)?.id ?? weeklySchedule[0].id, []);
  const [activeId, setActiveId] = useState(todayId);

  const activeDay = weeklySchedule.find((d) => d.id === activeId) ?? weeklySchedule[0];
  const totalSessions = weeklySchedule.reduce((s, d) => s + d.sessions.length, 0);

  return (
    <div className="space-y-6">
      <ModuleHero
        backHref="/student"
        backLabel="بخش دانشجویی"
        icon={Clock01Icon}
        title="برنامه هفتگی"
        description="برنامه کلاس‌های هفته شامل ساعت، مکان و استاد. روزها را از نوار بالا انتخاب کنید."
        status="شخصی"
        tone={HERO_TONE}
        stats={[
          { icon: Clock01Icon, value: String(totalSessions), label: "جلسه در هفته" },
          { icon: UserIcon, value: String(weeklySchedule.length), label: "روز کلاسی" },
        ]}
      />

      {/* Day selector */}
      <div className="grid grid-cols-5 gap-2">
        {weeklySchedule.map((day) => {
          const active = day.id === activeId;
          return (
            <button
              key={day.id}
              onClick={() => setActiveId(day.id)}
              className={cn(
                "relative flex flex-col items-center gap-1 rounded-2xl border py-3 transition-all active:scale-95",
                active
                  ? "border-primary/20 bg-primary/12 text-primary shadow-sm"
                  : "border-border bg-card/70 text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-background/70 text-sm font-bold">
                {day.short}
              </span>
              <span className="text-[10px] font-medium">{day.sessions.length} کلاس</span>
              {day.isToday && (
                <span className="absolute top-1.5 left-1.5 size-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
          );
        })}
      </div>

      <section id="content" className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <h2 className="text-lg font-bold text-foreground">{activeDay.label}</h2>
          {activeDay.isToday && (
            <Badge variant="success" className="px-2.5 py-0.5 text-[11px]">
              امروز
            </Badge>
          )}
        </div>

        {activeDay.sessions.length === 0 ? (
          <EmptyState icon={Clock01Icon} title="کلاسی در این روز ندارید" subtitle="روز دیگری را انتخاب کنید" />
        ) : (
          <div className="space-y-3">
            {activeDay.sessions.map((session) => (
              <Card key={session.id} className="flex gap-3 overflow-hidden p-4">
                {/* time rail */}
                <div className="flex shrink-0 flex-col items-center">
                  <span className="font-mono text-sm font-bold text-foreground">{session.start}</span>
                  <span className="my-1 w-px flex-1 bg-border" />
                  <span className="font-mono text-xs text-muted-foreground">{session.end}</span>
                </div>

                <div className="min-w-0 flex-1 border-r border-border pr-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold leading-6 text-foreground">{session.course}</h3>
                    <span
                      className={cn(
                        "shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-medium",
                        session.type === "عملی"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "bg-primary/10 text-primary",
                      )}
                    >
                      {session.type}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1 text-sm">
                    <p className="flex items-center gap-1.5 text-muted-foreground">
                      <HugeiconsIcon icon={UserIcon} size={14} className="text-primary/70" />
                      {session.professor}
                    </p>
                    <p className="flex items-center gap-1.5 text-muted-foreground">
                      <HugeiconsIcon icon={Location04Icon} size={14} className="text-primary/70" />
                      {session.room}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
