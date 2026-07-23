import { cn } from "@/lib/utils";

/**
 * A minimal, colour-inheriting spinner (a rotating arc in `currentColor`).
 * Size and colour come from the parent's font-size/text colour or `className`
 * — e.g. `<Spinner className="size-5 text-primary" />`.
 */
export function Spinner({
  className,
  label = "در حال بارگذاری",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        "inline-block size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent",
        className,
      )}
    />
  );
}
