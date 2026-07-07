import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, UserGroup03Icon } from "@hugeicons/core-free-icons";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { categoryMeta } from "@/lib/meta/calendar-meta";
import type { CalendarEvent } from "@/lib/api/types";
import { cn, toPersianDigits } from "@/lib/utils";

/** Status / countdown pill shown at the top-start of each event card. */
function StatusPill({ event }: { event: CalendarEvent }) {
  if (event.status === "current") {
    return <Badge variant="success">در جریان</Badge>;
  }
  if (event.status === "past") {
    return <Badge variant="outline">برگزار شد</Badge>;
  }
  // upcoming — surface the countdown the backend pre-computes.
  const label =
    event.daysUntil && event.daysUntil > 0
      ? `${toPersianDigits(event.daysUntil)} روز مانده`
      : "پیش‌رو";
  return <Badge variant="soft">{label}</Badge>;
}

export function CalendarEventCard({ event }: { event: CalendarEvent }) {
  const category = categoryMeta(event.category);

  return (
    <Card
      className={cn(
        "p-4 transition-all",
        event.status === "current" && "border-emerald-500/30 ring-1 ring-emerald-500/10",
      )}
    >
      {/* category · status / countdown */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="inline-block size-2 shrink-0 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          <span className="truncate text-xs font-medium" style={{ color: category.color }}>
            {category.label}
          </span>
        </div>
        <StatusPill event={event} />
      </div>

      <h3 className="mt-2 text-base font-bold text-foreground">{event.title}</h3>

      {event.cohort && (
        <Badge variant="outline" className="mt-2 gap-1.5">
          <HugeiconsIcon icon={UserGroup03Icon} size={13} />
          {event.cohort}
        </Badge>
      )}

      <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <HugeiconsIcon icon={Calendar03Icon} size={14} className="shrink-0" />
        <span>
          {event.weekday} · {event.dateLabel}
        </span>
      </div>

      {event.description && (
        <p className="mt-2.5 text-sm leading-6 text-muted-foreground">{event.description}</p>
      )}
    </Card>
  );
}
