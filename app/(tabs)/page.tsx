import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Megaphone01Icon } from "@hugeicons/core-free-icons";

import { moduleGroups } from "@/lib/data/university-data";
import { SectionPage } from "@/components/layout/section-page";
import { AnnouncementsCarousel } from "@/components/home/announcements-carousel";
import { HomeHero } from "@/components/home/home-hero";
import { TodayClassesCard } from "@/components/home/today-classes-card";
import { InstallCard } from "@/components/pwa/install-card";

const quickAccessModules = [
  moduleGroups.educational[1], // تقویم آموزشی
  moduleGroups.student[0], // غذای هفته
  moduleGroups.student[1], // برنامه هفتگی
  moduleGroups.student[2], // گروه‌ها
] as const;

export default function HomeTab() {
  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] lg:items-start lg:gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(0,23rem)]">
      <div className="space-y-7">
        {/* Renders itself away once installed / dismissed, so it doesn't push
            the hero down for users who already have the app. */}
        <InstallCard />

        <HomeHero />

        <div className="lg:hidden motion-safe:animate-fade-in-up motion-safe:[animation-delay:100ms]">
          <TodayClassesCard />
        </div>

        <section className="space-y-4 motion-safe:animate-fade-in-up motion-safe:[animation-delay:160ms]">
          <div className="flex items-end justify-between gap-3 px-1">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                <HugeiconsIcon icon={Megaphone01Icon} size={19} />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold tracking-tight text-foreground md:text-xl">
                  اخبار و اطلاعیه‌ها
                </h2>
                <p className="mt-0.5 truncate text-xs text-muted-foreground md:text-sm">
                  آخرین پیام‌های مهم دانشگاه
                </p>
              </div>
            </div>

            <Link
              href="/news"
              className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-primary shadow-xs transition-colors hover:border-primary/25 hover:bg-primary/5"
            >
              مشاهده همه
              <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
            </Link>
          </div>

          <AnnouncementsCarousel />
        </section>

        <div className="lg:hidden motion-safe:animate-fade-in-up motion-safe:[animation-delay:220ms]">
          <SectionPage title="دسترسی سریع" modules={quickAccessModules} variant="apps" />
        </div>
      </div>

      {/* Desktop side rail */}
      <aside className="hidden space-y-7 lg:block motion-safe:animate-fade-in-up motion-safe:[animation-delay:140ms]">
        <TodayClassesCard />
        <SectionPage
          title="دسترسی سریع"
          modules={quickAccessModules}
          variant="apps"
          gridClassName="grid grid-cols-4 gap-x-3 gap-y-5"
        />
      </aside>
    </div>
  );
}
