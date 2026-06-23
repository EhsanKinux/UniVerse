import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function EventCardSkeleton() {
  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-6 w-32 rounded-full" />
      <Skeleton className="h-4 w-40" />
    </Card>
  );
}

/** Loading placeholder that mirrors the calendar layout (hero · chips · timeline). */
export function CalendarSkeleton() {
  return (
    <div className="space-y-6">
      {/* hero */}
      <div className="space-y-5">
        <Skeleton className="h-9 w-40 rounded-full" />
        <Card className="space-y-5 p-5">
          <div className="flex items-start justify-between">
            <Skeleton className="size-16 rounded-[1.4rem]" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-14 flex-1 rounded-2xl" />
            <Skeleton className="h-14 flex-1 rounded-2xl" />
          </div>
        </Card>
      </div>

      {/* filter chips */}
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-20 rounded-full" />
        ))}
      </div>

      {/* events */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-28" />
        {Array.from({ length: 3 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
