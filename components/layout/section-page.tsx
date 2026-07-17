import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";
import { modulePages, sectionPages, type ModulePageKey } from "@/lib/data/university-data";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

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
  /** Overrides the responsive grid classes — the defaults track viewport width,
      which is wrong inside narrow containers like the home page's desktop rail. */
  gridClassName?: string;
};

export function SectionPage({
  title,
  description,
  modules,
  variant = "cards",
  gridClassName,
}: SectionPageProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-1 px-1">
        <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>

        {description && <p className="text-sm leading-6 text-muted-foreground">{description}</p>}
      </div>

      <div
        className={cn(
          gridClassName ??
            (variant === "apps"
              ? "grid grid-cols-4 gap-x-3 gap-y-5 sm:grid-cols-5 md:grid-cols-6 xl:grid-cols-8"
              : "grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4"),
        )}
      >
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

const FALLBACK_TONE = "border-primary/10 from-primary/15 via-primary/8 text-primary shadow-primary/10";

/** Section landing (tab) page: aura hero, one rich card per service, cross-links
    to the other sections. Card copy comes from `modulePages`, so the preview here
    always matches the hero the user lands on after tapping through. */
export function SectionLandingPage({
  href,
  icon,
  eyebrow,
  title,
  description,
  modules,
  aura,
}: {
  href: string;
  icon: IconSvgElement;
  eyebrow: string;
  title: string;
  description: string;
  modules: readonly SectionModule[];
  /** One glow class per module, same order/hue as the modules themselves. */
  aura: readonly string[];
}) {
  const otherSections = Object.values(sectionPages).filter((section) => section.href !== href);

  return (
    <div className="space-y-7">
      <Card className="relative overflow-hidden p-5 md:p-8 motion-safe:animate-fade-in-up">
        {/* The section's identity is the sum of its services: one toned glow each. */}
        <div aria-hidden className={cn("absolute -top-20 -end-14 size-56 rounded-full blur-3xl", aura[0])} />
        <div aria-hidden className={cn("absolute -bottom-24 start-1/3 size-60 rounded-full blur-3xl", aura[1])} />
        <div aria-hidden className={cn("absolute -bottom-20 -start-14 size-52 rounded-full blur-3xl", aura[2])} />
        <div aria-hidden className="absolute inset-0 bg-linear-to-br from-primary/6 via-transparent to-transparent" />
        <HugeiconsIcon
          icon={icon}
          size={180}
          aria-hidden
          className="absolute -bottom-12 -start-12 rotate-12 text-foreground opacity-[0.04]"
        />

        <div className="relative z-10 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-[1.25rem] border border-primary/15 bg-linear-to-br from-primary/15 via-primary/8 to-background text-primary shadow-lg shadow-primary/10">
              <HugeiconsIcon icon={icon} size={26} />
            </span>
            <Badge variant="soft">{eyebrow}</Badge>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold leading-9 tracking-tight text-foreground md:text-3xl md:leading-11">
              {title}
            </h1>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground md:text-base md:leading-7">
              {description}
            </p>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <div className="flex -space-x-2">
              {modules.map((item) => (
                <span
                  key={item.href}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-xl border bg-linear-to-br to-background ring-2 ring-card",
                    item.tone ?? FALLBACK_TONE,
                  )}
                >
                  <HugeiconsIcon icon={item.icon} size={15} />
                </span>
              ))}
            </div>
            <p className="text-xs font-medium text-muted-foreground">
              {modules.length.toLocaleString("fa-IR")} سرویس در این بخش
            </p>
          </div>
        </div>
      </Card>

      <section className="space-y-4">
        <h2 className="px-1 text-lg font-bold tracking-tight text-foreground md:text-xl">
          امکانات این بخش
        </h2>

        <div className="grid gap-3.5 md:grid-cols-3">
          {modules.map((item, index) => {
            const details = modulePages[item.href.slice(1) as ModulePageKey];

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-border bg-card/80 p-5 shadow-sm backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md active:scale-[0.98] motion-safe:animate-fade-in-up"
                style={{ animationDelay: `${120 + index * 70}ms` }}
              >
                <HugeiconsIcon
                  icon={item.icon}
                  size={110}
                  aria-hidden
                  className={cn(
                    "absolute -bottom-7 -end-7 opacity-[0.05] transition-opacity duration-300 group-hover:opacity-10",
                    item.tone ?? FALLBACK_TONE,
                  )}
                />

                <div className="flex items-start justify-between gap-3">
                  <span
                    className={cn(
                      "flex size-12 shrink-0 items-center justify-center rounded-2xl border bg-linear-to-br to-background shadow-sm",
                      item.tone ?? FALLBACK_TONE,
                    )}
                  >
                    <HugeiconsIcon icon={item.icon} size={23} />
                  </span>
                  {details?.status && <Badge variant="outline">{details.status}</Badge>}
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-bold text-foreground">{item.title}</h3>
                  {details?.description && (
                    <p className="line-clamp-2 text-[13px] leading-6 text-muted-foreground">
                      {details.description}
                    </p>
                  )}
                </div>

                {details?.highlights && (
                  <ul className="space-y-1.5">
                    {details.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex items-center gap-2 text-xs leading-5 text-muted-foreground"
                      >
                        <span
                          aria-hidden
                          className={cn("size-1.5 shrink-0 rounded-full bg-current", item.tone ?? FALLBACK_TONE)}
                        />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-auto flex items-center justify-between border-t border-border/70 pt-3.5">
                  <span className="text-xs font-semibold text-primary">
                    {details?.primaryAction ?? "مشاهده"}
                  </span>
                  <span className="flex size-7 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground transition-all duration-200 group-hover:-translate-x-0.5 group-hover:border-primary/25 group-hover:text-primary">
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="space-y-3 motion-safe:animate-fade-in-up motion-safe:[animation-delay:340ms]">
        <h2 className="px-1 text-sm font-semibold text-muted-foreground">سایر بخش‌ها</h2>

        <div className="grid gap-3 sm:grid-cols-2">
          {otherSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group flex items-center gap-3.5 rounded-3xl border border-border bg-card/80 p-4 shadow-xs backdrop-blur-xl transition-all duration-200 hover:border-primary/20 hover:shadow-sm active:scale-[0.98]"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-primary/10 bg-primary/8 text-primary">
                <HugeiconsIcon icon={section.icon} size={21} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-foreground">{section.title}</span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">{section.eyebrow}</span>
              </span>
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                size={16}
                className="shrink-0 text-muted-foreground transition-transform duration-200 group-hover:-translate-x-0.5"
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
