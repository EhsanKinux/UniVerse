"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-3 px-1", className)}>
      <div className="min-w-0">
        <h2 className="text-lg font-bold tracking-tight text-foreground">{title}</h2>
        {subtitle && <p className="mt-1 text-sm leading-6 text-muted-foreground">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <HugeiconsIcon
        icon={Search01Icon}
        size={18}
        className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-12 w-full rounded-2xl border border-border bg-card/85 pr-11 pl-4",
          "text-sm font-medium text-foreground placeholder:text-muted-foreground",
          "shadow-sm backdrop-blur-xl outline-none",
          "transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10",
        )}
      />
    </div>
  );
}

export function EmptyState({
  icon = Search01Icon,
  title,
  subtitle,
}: {
  icon?: IconSvgElement;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/40 p-10 text-center">
      <HugeiconsIcon icon={icon} size={40} className="mb-3 text-muted-foreground/40" />
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-all active:scale-95",
              active
                ? "border-primary/20 bg-primary/12 text-primary shadow-sm"
                : "border-border bg-card/70 text-muted-foreground hover:text-foreground",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function InfoNote({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-dashed border-border bg-muted/40 p-5">
      <h2 className="text-base font-bold text-foreground">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-muted-foreground">{children}</p>
    </section>
  );
}
