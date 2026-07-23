import { ModuleHeroSkeleton, SkeletonCardGrid } from "@/components/module/module-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <ModuleHeroSkeleton stats={1} />

      {/* Weekly menu */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-40 rounded-lg" />
        <Skeleton className="h-40 w-full rounded-3xl" />
      </div>

      {/* Nearby-food map */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-48 rounded-lg" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>

      {/* Announcements */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-40 rounded-lg" />
        <SkeletonCardGrid count={3} cardClassName="h-36" />
      </div>
    </div>
  );
}
