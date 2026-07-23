import { ModuleHeroSkeleton } from "@/components/module/module-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <ModuleHeroSkeleton stats={2} />
      <div className="space-y-3">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-52 rounded-3xl" />
      </div>
    </div>
  );
}
