import {
  ModuleHeroSkeleton,
  SkeletonCardGrid,
  SkeletonFilterChips,
} from "@/components/module/module-skeletons";

export default function Loading() {
  return (
    <div className="space-y-6">
      <ModuleHeroSkeleton />
      <div className="space-y-4">
        <SkeletonFilterChips count={5} />
        <SkeletonCardGrid count={6} cardClassName="h-32" />
      </div>
    </div>
  );
}
