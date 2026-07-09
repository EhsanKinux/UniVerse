"use client";

import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon, Coffee01Icon, RiceBowlIcon, Sun01Icon } from "@hugeicons/core-free-icons";

import { ModuleHero } from "@/components/module/module-hero";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { foodWeek, type Meal } from "@/lib/data/food-data";
import { cn } from "@/lib/utils";

const HERO_TONE =
  "text-orange-600 border-orange-500/15 from-orange-500/18 via-orange-500/8 shadow-orange-500/25 dark:text-orange-300";

export default function FoodWeekPage() {
  const todayId = useMemo(() => foodWeek.find((d) => d.isToday)?.id ?? foodWeek[0].id, []);
  const [activeId, setActiveId] = useState(todayId);
  // Local reservation overrides keyed by `${dayId}:${meal}`
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});

  const activeDay = foodWeek.find((d) => d.id === activeId) ?? foodWeek[0];

  const isReserved = (dayId: string, meal: "lunch" | "dinner", fallback: boolean) =>
    overrides[`${dayId}:${meal}`] ?? fallback;

  const toggle = (dayId: string, meal: "lunch" | "dinner", current: boolean) =>
    setOverrides((prev) => ({ ...prev, [`${dayId}:${meal}`]: !current }));

  const reservedCount = foodWeek.reduce((sum, day) => {
    let n = 0;
    if (isReserved(day.id, "lunch", day.lunch.reserved)) n++;
    if (isReserved(day.id, "dinner", day.dinner.reserved)) n++;
    return sum + n;
  }, 0);

  return (
    <div className="space-y-6">
      <ModuleHero
        backHref="/student"
        backLabel="بخش دانشجویی"
        icon={RiceBowlIcon}
        title="غذای هفته"
        description="برنامه غذایی هفته را ببینید و وعده‌های خود را رزرو کنید. روزها را از نوار بالا انتخاب کنید."
        status="روزانه"
        tone={HERO_TONE}
        stats={[
          { icon: RiceBowlIcon, value: String(foodWeek.length), label: "روز هفته" },
          { icon: CheckmarkCircle02Icon, value: String(reservedCount), label: "رزرو شده" },
        ]}
      />

      {/* Day selector */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden">
        {foodWeek.map((day) => {
          const active = day.id === activeId;
          return (
            <button
              key={day.id}
              onClick={() => setActiveId(day.id)}
              className={cn(
                "flex min-w-16 shrink-0 flex-col items-center gap-0.5 rounded-2xl border px-3.5 py-2.5 transition-all active:scale-95",
                active
                  ? "border-primary/20 bg-primary/12 text-primary shadow-sm"
                  : "border-border bg-card/70 text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="text-sm font-bold">{day.label}</span>
              <span className="text-[10px] opacity-80">{day.date}</span>
              {day.isToday && (
                <span className={cn("mt-0.5 size-1.5 rounded-full", active ? "bg-primary" : "bg-emerald-500")} />
              )}
            </button>
          );
        })}
      </div>

      <section id="content" className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <h2 className="text-lg font-bold text-foreground">{activeDay.label}</h2>
          <span className="text-sm text-muted-foreground">{activeDay.date}</span>
          {activeDay.isToday && (
            <Badge variant="success" className="px-2.5 py-0.5 text-[11px]">
              امروز
            </Badge>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2 md:gap-4">
          <MealCard
            title="ناهار"
            icon={Sun01Icon}
            meal={activeDay.lunch}
            reserved={isReserved(activeDay.id, "lunch", activeDay.lunch.reserved)}
            onToggle={() => toggle(activeDay.id, "lunch", isReserved(activeDay.id, "lunch", activeDay.lunch.reserved))}
          />
          <MealCard
            title="شام"
            icon={Coffee01Icon}
            meal={activeDay.dinner}
            reserved={isReserved(activeDay.id, "dinner", activeDay.dinner.reserved)}
            onToggle={() => toggle(activeDay.id, "dinner", isReserved(activeDay.id, "dinner", activeDay.dinner.reserved))}
          />
        </div>
      </section>
    </div>
  );
}

function MealCard({
  title,
  icon,
  meal,
  reserved,
  onToggle,
}: {
  title: string;
  icon: Parameters<typeof HugeiconsIcon>[0]["icon"];
  meal: Meal;
  reserved: boolean;
  onToggle: () => void;
}) {
  return (
    <Card className="overflow-hidden p-4">
      <div className="flex items-center gap-2.5">
        <div className="flex size-9 items-center justify-center rounded-xl border border-border bg-background text-primary">
          <HugeiconsIcon icon={icon} size={18} />
        </div>
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
      </div>

      <div className="mt-3">
        <p className="text-lg font-bold text-foreground">{meal.items.join("، ")}</p>
        {meal.sideItems.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {meal.sideItems.map((side) => (
              <span
                key={side}
                className="rounded-full border border-border bg-background/70 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                {side}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4">
        {!meal.available ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted/40 px-4 py-2.5 text-center text-xs font-medium text-muted-foreground">
            رزرو این وعده در دسترس نیست
          </div>
        ) : (
          <button
            onClick={onToggle}
            className={cn(
              "flex h-11 w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition-all active:scale-[0.98]",
              reserved
                ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90",
            )}
          >
            {reserved ? (
              <>
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />
                رزرو شد · لغو رزرو
              </>
            ) : (
              "رزرو این وعده"
            )}
          </button>
        )}
      </div>
    </Card>
  );
}
