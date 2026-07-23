import { ModuleHeroSkeleton, SkeletonCardGrid } from "@/components/module/module-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <ModuleHeroSkeleton stats={1} />

      {/* Announcements */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-48 rounded-lg" />
        <SkeletonCardGrid count={3} cardClassName="h-28" />
      </div>

      {/* Rules + facilities */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    </div>
  );
}
