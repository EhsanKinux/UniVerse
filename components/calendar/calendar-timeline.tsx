import { SectionHeading } from "@/components/module/module-ui";
import { statusStyles } from "@/lib/meta/calendar-meta";
import type { CalendarEvent } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { CalendarEventCard } from "./calendar-event-card";

/** Group events by their Jalali month label, preserving the server's order. */
function groupByMonth(events: CalendarEvent[]): [string, CalendarEvent[]][] {
  const map = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const list = map.get(event.monthLabel) ?? [];
    list.push(event);
    map.set(event.monthLabel, list);
  }
  return Array.from(map.entries());
}

export function CalendarTimeline({ events }: { events: CalendarEvent[] }) {
  const groups = groupByMonth(events);

  return (
    <div className="space-y-5">
      {groups.map(([month, monthEvents]) => (
        <section key={month} className="space-y-3">
          <SectionHeading title={month} />
          <div className="relative space-y-3 pr-4">
            {/* timeline rail */}
            <div className="absolute top-2 bottom-2 right-[7px] w-px bg-border" />
            {monthEvents.map((event) => {
              const status = statusStyles[event.status];
              return (
                <div key={event.id} className="relative">
                  {/* timeline node */}
                  <span
                    className={cn(
                      "absolute top-5 -right-4 z-10 flex size-3.5 items-center justify-center rounded-full border-2 bg-background",
                      status.ring,
                    )}
                  >
                    <span className={cn("size-1.5 rounded-full", status.dot)} />
                  </span>
                  <CalendarEventCard event={event} />
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
