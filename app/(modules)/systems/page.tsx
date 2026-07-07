import { HugeiconsIcon } from "@hugeicons/react";
import { Building05Icon, LinkSquare01Icon } from "@hugeicons/core-free-icons";

import { ModuleHero } from "@/components/module/module-hero";
import { systems } from "@/lib/data/systems-data";
import { cn } from "@/lib/utils";

const HERO_TONE =
  "text-indigo-600 border-indigo-500/15 from-indigo-500/18 via-indigo-500/8 shadow-indigo-500/25 dark:text-indigo-300";

export default function SystemsPage() {
  return (
    <div className="space-y-6">
      <ModuleHero
        backHref="/services"
        backLabel="بخش خدمات"
        icon={Building05Icon}
        title="سامانه‌ها"
        description="دسترسی سریع به سامانه‌های پرکاربرد دانشگاه. هر کارت شما را به سامانه مربوطه هدایت می‌کند."
        status="فعال"
        tone={HERO_TONE}
        stats={[{ icon: Building05Icon, value: String(systems.length), label: "سامانه فعال" }]}
      />

      <section id="content" className="grid grid-cols-2 gap-3">
        {systems.map((system) => (
          <a
            key={system.id}
            href={system.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col gap-3 overflow-hidden rounded-3xl border border-border bg-card/85 p-4 shadow-sm backdrop-blur-xl transition-all hover:border-primary/20 hover:shadow-md active:scale-[0.98]"
          >
            <div className="flex items-start justify-between">
              <div
                className={cn(
                  "flex size-12 items-center justify-center rounded-2xl border bg-linear-to-br to-background shadow-sm transition-transform group-hover:-translate-y-0.5",
                  system.tone,
                )}
              >
                <HugeiconsIcon icon={system.icon} size={24} className="relative z-10" />
              </div>
              <HugeiconsIcon
                icon={LinkSquare01Icon}
                size={16}
                className="text-muted-foreground/50 transition-colors group-hover:text-primary"
              />
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-foreground">{system.title}</h3>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{system.description}</p>
            </div>
          </a>
        ))}
      </section>
    </div>
  );
}
