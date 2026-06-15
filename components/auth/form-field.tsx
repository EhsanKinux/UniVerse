import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FormFieldProps = React.ComponentProps<"input"> & {
  label: string;
  icon: IconSvgElement;
  error?: string;
};

export function FormField({ label, icon, error, id, className, ref, ...props }: FormFieldProps) {
  // Fall back to the field's `name` (from react-hook-form's register) so the
  // label stays associated even when no explicit id is passed.
  const fieldId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className="text-xs font-medium text-foreground/80">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-muted-foreground">
          <HugeiconsIcon icon={icon} className="h-5 w-5" strokeWidth={1.8} />
        </span>
        <Input
          id={fieldId}
          ref={ref}
          aria-invalid={!!error}
          className={cn("h-12 rounded-xl ps-10 text-sm", className)}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
