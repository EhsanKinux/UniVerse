import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";

import { cn } from "@/lib/utils";

type SectionModule = {
  title: string;
  href: string;
  icon: IconSvgElement;
  tone?: string;
};

type SectionPageProps = {
  title: string;
  description?: string;
  modules: readonly SectionModule[];
  variant?: "cards" | "apps";
};

export function SectionPage({
  title,
  description,
  modules,
  variant = "cards",
}: SectionPageProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-1 px-1">
        <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>

        {description && <p className="text-sm leading-6 text-muted-foreground">{description}</p>}
      </div>

      <div className={cn(variant === "apps" ? "grid grid-cols-4 gap-x-3 gap-y-5" : "grid grid-cols-2 gap-3")}>
        {modules.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group relative transition-all duration-200 active:scale-[0.97]",
              variant === "apps"
                ? "flex min-w-0 flex-col items-center gap-2 rounded-2xl p-1 text-center"
                : `
                  overflow-hidden rounded-3xl border border-border bg-card/80 p-4 shadow-sm
                  backdrop-blur-xl hover:border-primary/20 hover:bg-card hover:shadow-md
                `,
            )}
          >
            {variant === "cards" && (
              <div className="absolute inset-0 bg-linear-to-br from-primary/6 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            )}

            <div className={cn("relative z-10", variant === "apps" && "flex flex-col items-center gap-2")}>
              <div
                className={cn(
                  "relative flex items-center justify-center overflow-hidden transition-all duration-200",
                  variant === "apps"
                    ? `
                      size-14 rounded-[1.25rem] border bg-linear-to-br to-background shadow-sm
                      group-hover:-translate-y-0.5 group-hover:shadow-lg
                    `
                    : "h-11 w-11 rounded-2xl border bg-linear-to-br to-background shadow-sm",
                  item.tone ??
                    "border-primary/10 from-primary/15 via-primary/8 text-primary shadow-primary/10",
                )}
              >
                <div className="absolute inset-1 rounded-[inherit] bg-current opacity-[0.06] blur-md transition-opacity duration-200 group-hover:opacity-[0.12]" />
                <HugeiconsIcon icon={item.icon} size={variant === "apps" ? 25 : 22} className="relative z-10" />
              </div>

              <p
                className={cn(
                  "font-medium text-foreground",
                  variant === "apps" ? "line-clamp-2 min-h-9 text-xs leading-4" : "mt-6 leading-6",
                )}
              >
                {item.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function SectionLandingPage({
  eyebrow,
  title,
  description,
  modules,
  stats,
}: {
  eyebrow: string;
  title: string;
  description: string;
  modules: readonly SectionModule[];
  stats: readonly string[];
}) {
  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card/85 p-5 shadow-sm backdrop-blur-xl">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {eyebrow}
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold leading-9 tracking-tight text-foreground">{title}</h1>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {stats.map((stat) => (
              <div key={stat} className="rounded-2xl border border-border bg-background/70 px-3 py-2 text-center shadow-xs">
                <span className="block truncate text-xs font-medium text-foreground">{stat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionPage title="امکانات این بخش" modules={modules} variant="apps" />
    </div>
  );
}
