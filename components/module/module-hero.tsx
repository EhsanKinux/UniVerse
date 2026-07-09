import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export type HeroStat = {
  icon: IconSvgElement;
  value: string;
  label: string;
};

export function ModuleHero({
  backHref,
  backLabel,
  icon,
  title,
  description,
  status,
  tone,
  stats,
  children,
}: {
  backHref: string;
  backLabel: string;
  icon: IconSvgElement;
  title: string;
  description: string;
  status?: string;
  /** Tailwind classes for the icon tile gradient/border/text, e.g. moduleGroups tone string */
  tone?: string;
  stats?: HeroStat[];
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-5">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-2 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-xl transition-colors hover:text-foreground"
      >
        <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
        بازگشت به {backLabel}
      </Link>

      <Card className="relative overflow-hidden p-5 md:p-7">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent" />
        <div className="absolute -top-8 -start-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
        <div className="absolute -bottom-6 -end-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />

        <div className="relative z-10 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div
              className={cn(
                "relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-[1.4rem] border bg-linear-to-br to-background text-primary shadow-lg",
                tone ?? "border-primary/15 from-primary/18 via-primary/8 shadow-primary/20",
              )}
            >
              <div className="absolute inset-1 rounded-[inherit] bg-current opacity-[0.08] blur-md" />
              <HugeiconsIcon icon={icon} size={30} className="relative z-10" />
            </div>

            {status && <Badge variant="soft">{status}</Badge>}
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold leading-9 tracking-tight text-foreground md:text-3xl md:leading-11">
              {title}
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">{description}</p>
          </div>

          {stats && stats.length > 0 && (
            <div className="flex items-center gap-3 md:max-w-2xl">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-1 items-center gap-2.5 rounded-2xl border border-border bg-background/70 px-3 py-2.5"
                >
                  <HugeiconsIcon icon={stat.icon} size={16} className="shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="truncate text-lg font-bold leading-tight text-foreground">{stat.value}</p>
                    <p className="truncate text-[10px] font-medium text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {children}
        </div>
      </Card>
    </div>
  );
}
