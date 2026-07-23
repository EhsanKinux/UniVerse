import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Loading placeholder for `ModuleHero` — same back-pill, icon-tile, title and
 * stats geometry, so a route's `loading.tsx` previews the real header rather
 * than flashing an unrelated block. Compose it with a content skeleton below.
 */
export function ModuleHeroSkeleton({ stats = 1 }: { stats?: number }) {
  return (
    <div className="space-y-5">
      <Skeleton className="h-9 w-32 rounded-full" />

      <Card className="relative overflow-hidden p-5 md:p-7">
        <div className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <Skeleton className="size-16 rounded-[1.4rem]" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>

          <div className="space-y-2.5">
            <Skeleton className="h-7 w-48 md:h-8" />
            <Skeleton className="h-4 w-full max-w-md" />
            <Skeleton className="h-4 w-2/3 max-w-sm" />
          </div>

          {stats > 0 && (
            <div className="flex gap-3 md:max-w-2xl">
              {Array.from({ length: stats }, (_, i) => (
                <Skeleton key={i} className="h-14 flex-1 rounded-2xl" />
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

/** A grid of identical placeholder cards — the workhorse content shape. */
export function SkeletonCardGrid({
  count = 6,
  cardClassName = "h-28",
  className = "grid gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3",
}: {
  count?: number;
  cardClassName?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className={cn("rounded-2xl", cardClassName)} />
      ))}
    </div>
  );
}

/** A scrollable row of pill placeholders, matching `FilterChips`. */
export function SkeletonFilterChips({ count = 4 }: { count?: number }) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className="h-9 w-20 shrink-0 rounded-full" />
      ))}
    </div>
  );
}

/** A rounded search field placeholder, matching `SearchBox`. */
export function SkeletonSearchBox({ className }: { className?: string }) {
  return <Skeleton className={cn("h-12 w-full rounded-2xl md:max-w-md", className)} />;
}

/**
 * An article/announcement detail placeholder: cover, meta row, title and a few
 * body lines — shared by the news and dorm/food announcement detail routes.
 */
export function ArticleDetailSkeleton({ cover = true }: { cover?: boolean }) {
  return (
    <div className="space-y-5">
      {cover && <Skeleton className="aspect-video w-full rounded-3xl" />}
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-8 w-3/4 rounded-lg" />
      <div className="space-y-2.5 pt-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

/** Sections, each a heading followed by a grid of cards (groups, contacts…). */
export function SkeletonSections({
  sections = 2,
  perSection = 2,
  cardClassName = "h-32",
  gridClassName = "grid gap-3 md:grid-cols-2 xl:grid-cols-3",
}: {
  sections?: number;
  perSection?: number;
  cardClassName?: string;
  gridClassName?: string;
}) {
  return (
    <div className="space-y-5">
      {Array.from({ length: sections }, (_, s) => (
        <div key={s} className="space-y-3">
          <Skeleton className="h-6 w-40 rounded-lg" />
          <div className={gridClassName}>
            {Array.from({ length: perSection }, (_, c) => (
              <Skeleton key={c} className={cn("rounded-2xl", cardClassName)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
