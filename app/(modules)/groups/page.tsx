import { HugeiconsIcon } from "@hugeicons/react";
import { LinkSquare01Icon, UserGroupIcon, UserMultipleIcon } from "@hugeicons/core-free-icons";

import { ModuleHero } from "@/components/module/module-hero";
import { SectionHeading } from "@/components/module/module-ui";
import { Card } from "@/components/ui/card";
import { groupCategories, platformMeta } from "@/lib/groups-data";
import { cn } from "@/lib/utils";

const HERO_TONE =
  "text-fuchsia-600 border-fuchsia-500/15 from-fuchsia-500/18 via-fuchsia-500/8 shadow-fuchsia-500/25 dark:text-fuchsia-300";

const formatMembers = (n: number) =>
  n >= 1000 ? `${(n / 1000).toLocaleString("fa-IR", { maximumFractionDigits: 1 })} هزار` : n.toLocaleString("fa-IR");

export default function GroupsPage() {
  const totalGroups = groupCategories.reduce((s, c) => s + c.groups.length, 0);

  return (
    <div className="space-y-6">
      <ModuleHero
        backHref="/student"
        backLabel="بخش دانشجویی"
        icon={UserGroupIcon}
        title="گروه‌ها"
        description="کانال‌های رسمی، گروه‌های کلاسی و انجمن‌های دانشجویی را پیدا کنید و عضو شوید."
        status="اجتماعی"
        tone={HERO_TONE}
        stats={[{ icon: UserGroupIcon, value: String(totalGroups), label: "گروه و کانال" }]}
      />

      <section id="content" className="space-y-5">
        {groupCategories.map((category) => (
          <div key={category.id} className="space-y-3">
            <SectionHeading title={category.title} />
            <div className="grid gap-3">
              {category.groups.map((group) => {
                const meta = platformMeta[group.platform];
                return (
                  <Card key={group.id} className="overflow-hidden p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex size-12 shrink-0 items-center justify-center rounded-2xl border",
                          meta.className,
                        )}
                      >
                        <HugeiconsIcon icon={meta.icon} size={24} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold leading-6 text-foreground">{group.title}</h3>
                        <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
                          {group.description}
                        </p>
                        <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <HugeiconsIcon icon={UserMultipleIcon} size={13} />
                            {formatMembers(group.members)} عضو
                          </span>
                          <span className={cn("rounded-md px-1.5 py-0.5 font-medium", meta.className)}>
                            {meta.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={group.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3.5 flex h-10 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-background text-sm font-semibold text-foreground transition-all hover:border-primary/30 hover:bg-primary/5 active:scale-[0.98]"
                    >
                      {meta.cta}
                      <HugeiconsIcon icon={LinkSquare01Icon} size={15} className="text-muted-foreground" />
                    </a>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
