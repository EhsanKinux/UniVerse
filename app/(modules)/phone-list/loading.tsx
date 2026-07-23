import {
  ModuleHeroSkeleton,
  SkeletonSearchBox,
  SkeletonSections,
} from "@/components/module/module-skeletons";

export default function Loading() {
  return (
    <div className="space-y-6">
      <ModuleHeroSkeleton />
      <SkeletonSearchBox />
      <SkeletonSections sections={4} perSection={1} cardClassName="h-36" gridClassName="grid gap-3" />
    </div>
  );
}
