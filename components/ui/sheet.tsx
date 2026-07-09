"use client";

import { Dialog } from "@base-ui/react/dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";

/**
 * A mobile bottom sheet on top of Base UI's Dialog (same primitive family as
 * our Switch/Button/Input), so focus trapping, Esc-to-close, and portal
 * layering come for free — we only style it as a sheet.
 */
export function Sheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop
          className={cn(
            "fixed inset-0 z-[70] bg-black/45 backdrop-blur-[2px]",
            "transition-opacity duration-300 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
          )}
        />
        <Dialog.Popup
          className={cn(
            "fixed inset-x-0 bottom-0 z-[80] mx-auto w-full max-w-md",
            "max-h-[88dvh] overflow-y-auto overscroll-contain rounded-t-3xl border border-b-0 border-border bg-background shadow-2xl outline-none",
            "pb-[max(env(safe-area-inset-bottom),1rem)]",
            "transition-transform duration-300 ease-out data-[starting-style]:translate-y-full data-[ending-style]:translate-y-full",
            // Larger screens: float as a centered card instead of a full-bleed
            // phone sheet (slide distance grows to cover the bottom gap).
            "sm:bottom-6 sm:max-w-lg sm:rounded-3xl sm:border-b",
            "sm:data-[starting-style]:translate-y-[calc(100%+1.5rem)] sm:data-[ending-style]:translate-y-[calc(100%+1.5rem)]",
            className,
          )}
        >
          {/* drag-handle affordance */}
          <div className="sticky top-0 z-10 bg-background/95 px-5 pt-3 pb-3 backdrop-blur-xl">
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-muted" />
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Dialog.Title className="text-base font-bold text-foreground">{title}</Dialog.Title>
                {description && (
                  <Dialog.Description className="mt-0.5 text-xs text-muted-foreground">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              <Dialog.Close
                aria-label="بستن"
                className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} />
              </Dialog.Close>
            </div>
          </div>

          <div className="px-5">{children}</div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
