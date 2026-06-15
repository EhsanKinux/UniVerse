"use client";

import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Book02Icon,
  Calendar03Icon,
  Clock01Icon,
  Location04Icon,
  UserIcon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons";

import { ModuleHero } from "@/components/module/module-hero";
import { EmptyState, FilterChips, SearchBox, SectionHeading } from "@/components/module/module-ui";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { courseGroups, courses } from "@/lib/courses-data";
import { cn } from "@/lib/utils";

const HERO_TONE =
  "text-emerald-600 border-emerald-500/15 from-emerald-500/18 via-emerald-500/8 shadow-emerald-500/25 dark:text-emerald-300";

export default function CoursesPage() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<(typeof courseGroups)[number]>("همه");

  const filtered = useMemo(() => {
    const q = query.trim();
    return courses.filter((c) => {
      const matchesGroup = group === "همه" || c.group === group;
      const matchesQuery = !q || c.title.includes(q) || c.professor.includes(q) || c.code.includes(q);
      return matchesGroup && matchesQuery;
    });
  }, [query, group]);

  const totalUnits = courses.reduce((sum, c) => sum + c.units, 0);

  return (
    <div className="space-y-6">
      <ModuleHero
        backHref="/educational"
        backLabel="بخش آموزشی"
        icon={Book02Icon}
        title="دروس ارائه‌شده"
        description="دروس ارائه‌شده نیمسال جاری را مرور کنید؛ شامل استاد، زمان کلاس، ظرفیت و تاریخ امتحان."
        status="آماده"
        tone={HERO_TONE}
        stats={[
          { icon: Book02Icon, value: String(courses.length), label: "درس" },
          { icon: Calendar03Icon, value: String(totalUnits), label: "مجموع واحد" },
        ]}
      />

      <SearchBox value={query} onChange={setQuery} placeholder="جستجوی درس، استاد یا کد درس..." />

      <FilterChips
        options={courseGroups.map((g) => ({ value: g, label: g }))}
        value={group}
        onChange={setGroup}
      />

      <section id="content" className="space-y-3">
        <SectionHeading title="لیست دروس" subtitle={`${filtered.length} درس یافت شد`} />

        <div className="grid gap-3">
          {filtered.length === 0 ? (
            <EmptyState title="درسی یافت نشد" subtitle="عبارت یا فیلتر دیگری را امتحان کنید" />
          ) : (
            filtered.map((course) => {
              const full = course.enrolled >= course.capacity;
              const ratio = Math.min(100, Math.round((course.enrolled / course.capacity) * 100));
              return (
                <Card key={course.id} className="overflow-hidden p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-base font-bold leading-6 text-foreground">{course.title}</h3>
                      <p className="mt-1 font-mono text-xs text-muted-foreground">کد {course.code}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <Badge variant="soft" className="rounded-lg px-2.5 py-1 font-bold">
                        {course.units} واحد
                      </Badge>
                      <Badge variant="outline" className="rounded-lg bg-background/70 px-2 py-0.5 text-[10px]">
                        {course.group}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
                    <Row icon={UserIcon} text={course.professor} />
                    <Row icon={Clock01Icon} text={course.schedule} />
                    <Row icon={Location04Icon} text={course.room} />
                    <Row icon={Calendar03Icon} text={`امتحان: ${course.exam}`} />
                  </div>

                  {/* capacity */}
                  <div className="mt-3.5 border-t border-border pt-3">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <HugeiconsIcon icon={UserMultipleIcon} size={14} />
                        ظرفیت
                      </span>
                      <span className={cn("text-xs font-bold", full ? "text-destructive" : "text-foreground")}>
                        {course.enrolled} / {course.capacity}
                        {full && " · تکمیل"}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn("h-full rounded-full transition-all", full ? "bg-destructive" : "bg-primary")}
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

function Row({ icon, text }: { icon: Parameters<typeof HugeiconsIcon>[0]["icon"]; text: string }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <HugeiconsIcon icon={icon} size={15} className="shrink-0 text-primary/70" />
      <span className="truncate text-foreground/90">{text}</span>
    </div>
  );
}
