import Link from "next/link";

import { moduleGroups } from "@/lib/university-data";
import { SectionPage } from "@/components/section-page";
import { AnnouncementsCarousel } from "@/components/home/announcements-carousel";
import { TodayClassesCard } from "@/components/home/today-classes-card";

const quickAccessModules = [
  moduleGroups.educational[1], // تقویم آموزشی
  moduleGroups.student[0], // غذای هفته
  moduleGroups.student[1], // برنامه هفتگی
  moduleGroups.student[2], // گروه‌ها
] as const;

export default function HomeTab() {
  return (
    <div className="space-y-7">
      <section className="relative isolate overflow-hidden rounded-3xl border border-border bg-muted shadow-sm">
        <div className="aspect-video w-full bg-[url('/imgs/HUT.webp')] bg-cover bg-center sm:aspect-21/9" />
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-black/5" />

        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <div className="mb-3 inline-flex rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-md">
            خوش آمدید
          </div>

          <h2 className="max-w-xs text-2xl font-bold leading-9 tracking-tight">همه چیز دانشگاه در یک اپ</h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-white/80">
            امور آموزشی، خدمات، غذا، برنامه هفتگی و اطلاعات دانشجویی را سریع و یکجا مدیریت کنید.
          </p>
        </div>
      </section>

      <TodayClassesCard />

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3 px-1">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">اخبار و اطلاعیه‌ها</h2>
            <p className="mt-1 text-sm text-muted-foreground">آخرین پیام‌های مهم دانشگاه</p>
          </div>

          <Link href="/news" className="shrink-0 text-xs font-medium text-primary transition-colors hover:text-primary/80">
            مشاهده همه
          </Link>
        </div>

        <AnnouncementsCarousel />
      </section>

      <SectionPage title="دسترسی سریع" modules={quickAccessModules} variant="apps" />
    </div>
  );
}
