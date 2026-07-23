import { ArticleDetailSkeleton } from "@/components/module/module-skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6 lg:mx-auto lg:w-full lg:max-w-3xl">
      <Skeleton className="h-9 w-32 rounded-full" />
      <ArticleDetailSkeleton />
    </div>
  );
}
