import {
  ModuleHeroSkeleton,
  SkeletonCardGrid,
  SkeletonSearchBox,
} from "@/components/module/module-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <ModuleHeroSkeleton stats={2} />
      <SkeletonSearchBox />
      <div className="space-y-3">
        <Skeleton className="h-6 w-40 rounded-lg" />
        <SkeletonCardGrid count={4} cardClassName="h-[88px]" className="grid gap-3 md:grid-cols-2" />
      </div>
    </div>
  );
}
