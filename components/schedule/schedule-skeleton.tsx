import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Loading placeholder mirroring the schedule layout (hero · days · timeline). */
export function ScheduleSkeleton() {
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
            <Skeleton className="h-7 w-44" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-14 flex-1 rounded-2xl" />
            <Skeleton className="h-14 flex-1 rounded-2xl" />
            <Skeleton className="h-14 flex-1 rounded-2xl" />
          </div>
        </Card>
      </div>

      {/* toolbar */}
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>

      {/* day chips */}
      <div className="grid grid-cols-6 gap-1.5">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-16 rounded-2xl" />
        ))}
      </div>

      {/* session cards */}
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Card key={i} className="flex gap-3 p-4">
            <div className="flex flex-col items-center gap-1">
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-10 w-1 rounded-full" />
              <Skeleton className="h-3 w-8" />
            </div>
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-24 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
