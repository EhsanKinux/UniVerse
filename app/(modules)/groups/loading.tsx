import { ModuleHeroSkeleton, SkeletonSections } from "@/components/module/module-skeletons";

export default function Loading() {
  return (
    <div className="space-y-6">
      <ModuleHeroSkeleton />
      <SkeletonSections sections={2} perSection={2} cardClassName="h-32" />
    </div>
  );
}
