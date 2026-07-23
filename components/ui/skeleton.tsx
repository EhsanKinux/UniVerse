import { cn } from "@/lib/utils"

/**
 * Loading placeholder. A muted block with a gleam sweeping across it (see
 * `.skeleton-shimmer` in globals.css) — theme-aware and reduced-motion-safe.
 * Pass sizing/shape via `className`; the shimmer surface is built in.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("skeleton-shimmer rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
