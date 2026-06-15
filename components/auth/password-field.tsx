"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { LockPasswordIcon, EyeIcon, EyeOffIcon } from "@hugeicons/core-free-icons";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PasswordFieldProps = React.ComponentProps<"input"> & {
  label?: string;
  error?: string;
  /** Optional node rendered next to the label (e.g. a "forgot password?" link). */
  action?: React.ReactNode;
};

export function PasswordField({
  label = "رمز عبور",
  error,
  action,
  id = "password",
  className,
  ref,
  ...props
}: PasswordFieldProps) {
  const [show, setShow] = React.useState(false);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-medium text-foreground/80">
          {label}
        </label>
        {action}
      </div>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 inset-s-3 flex items-center text-muted-foreground">
          <HugeiconsIcon icon={LockPasswordIcon} className="h-5 w-5" strokeWidth={1.8} />
        </span>
        <Input
          id={id}
          ref={ref}
          type={show ? "text" : "password"}
          dir="ltr"
          aria-invalid={!!error}
          className={cn("h-12 rounded-xl ps-10 pe-11 text-sm", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "پنهان کردن رمز" : "نمایش رمز"}
          className="absolute inset-y-0 inset-e-2 flex items-center rounded-lg px-1.5 text-muted-foreground transition hover:text-foreground"
        >
          <HugeiconsIcon icon={show ? EyeOffIcon : EyeIcon} className="h-5 w-5" strokeWidth={1.8} />
        </button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
