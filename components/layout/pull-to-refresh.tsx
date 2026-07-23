"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

import { Spinner } from "@/components/ui/spinner";
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh";
import { cn } from "@/lib/utils";

/**
 * Wraps scrollable content with a native-feel pull-to-refresh. An indicator
 * emerges from the top and follows the finger; past the threshold its arrow
 * flips and, on release, it spins until `onRefresh` settles. The content itself
 * rubber-bands down with the pull. Touch-only — pointer devices never see it.
 */
export function PullToRefresh({
  onRefresh,
  children,
}: {
  onRefresh: () => Promise<unknown> | void;
  children: React.ReactNode;
}) {
  const { pull, refreshing, threshold } = usePullToRefresh(onRefresh);

  const progress = Math.min(1, pull / threshold);
  const ready = pull >= threshold;
  const offset = refreshing ? threshold : pull;
  // Animate back/snap when not actively dragging; track the finger 1:1 while pulling.
  const settling = refreshing || pull === 0;

  return (
    <>
      <div
        aria-hidden={!refreshing}
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center",
          settling && "transition-[transform,opacity] duration-300 ease-out",
        )}
        style={{
          transform: `translateY(${offset - 6}px)`,
          opacity: refreshing ? 1 : progress,
        }}
      >
        <div className="mt-3 flex size-9 items-center justify-center rounded-full border border-border bg-card/90 text-primary shadow-md backdrop-blur-xl">
          {refreshing ? (
            <Spinner className="size-4" />
          ) : (
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              size={18}
              className={cn("transition-transform duration-200", ready && "rotate-180")}
            />
          )}
        </div>
      </div>

      <div
        className={cn(settling && "transition-transform duration-300 ease-out", pull > 0 && "will-change-transform")}
        style={{ transform: offset ? `translateY(${offset}px)` : undefined }}
      >
        {children}
      </div>
    </>
  );
}
