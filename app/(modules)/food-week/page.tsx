"use client";

import { useMemo } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Attachment01Icon,
  Megaphone01Icon,
  RiceBowlIcon,
} from "@hugeicons/core-free-icons";

import { FoodCoverBanner } from "@/components/food/food-cover-banner";
import { FoodMenuCard } from "@/components/food/food-menu-card";
import { FoodPlacesSection } from "@/components/food/food-places-section";
import { ModuleHero } from "@/components/module/module-hero";
import { EmptyState, ErrorState, SectionHeading } from "@/components/module/module-ui";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useFood } from "@/hooks/food/use-food";
import type { FoodAnnouncement } from "@/lib/api/types";
import { toPersianDigits } from "@/lib/utils";

const HERO_TONE =
  "text-orange-600 border-orange-500/15 from-orange-500/18 via-orange-500/8 shadow-orange-500/25 dark:text-orange-300";

/**
 * The تغذیه hub. Reservation itself lives in the university's own اتوماسیون
 * تغذیه (no API access), so this page is everything AROUND it: the staff-uploaded
 * weekly menu, a live map of nearby food the student can buy, and the
 * اطلاعیه‌های تغذیه feed (which also arrives as push notifications).
 */
export default function FoodWeekPage() {
  const { data, isLoading, isError, refetch } = useFood();

  const announcements = useMemo(() => data?.announcements ?? [], [data]);

  return (
    <div className="space-y-6">
      <ModuleHero
        backHref="/student"
        backLabel="بخش دانشجویی"
        icon={RiceBowlIcon}
        title="تغذیه"
        description="منوی هفتگی سلف، اطلاعیه‌های تغذیه و نقشهٔ خوراکی‌های اطراف — رزرو غذا از سامانهٔ رسمی دانشگاه انجام می‌شود."
        status="فعال"
        tone={HERO_TONE}
        stats={
          announcements.length
            ? [{ icon: Megaphone01Icon, value: toPersianDigits(announcements.length), label: "اطلاعیه" }]
            : []
        }
      />

      {/* Weekly menu (staff-uploaded file) */}
      <section id="content" className="space-y-3">
        <SectionHeading
          title="منوی این هفته"
          subtitle="منوی رسمی سلف که امور تغذیه بارگذاری می‌کند"
        />
        {isLoading ? (
          <div className="h-40 animate-pulse rounded-3xl border border-border bg-card/50" />
        ) : isError ? (
          <ErrorState
            title="دریافت اطلاعات تغذیه ناموفق بود"
            subtitle="اتصال به سرور برقرار نشد. دوباره تلاش کنید."
            onRetry={() => {
              refetch();
            }}
          />
        ) : (
          <FoodMenuCard menu={data?.menu ?? null} />
        )}
      </section>

      {/* Live nearby-food map (independent of the hub request) */}
      <FoodPlacesSection />

      {/* Announcements */}
      <section className="space-y-3">
        <SectionHeading
          title="اطلاعیه‌های تغذیه"
          subtitle="تغییر منو، ساعات کاری سلف و اطلاعیه‌های رسمی — اطلاعیهٔ جدید به‌صورت اعلان ارسال می‌شود"
        />
        {isLoading ? (
          <AnnouncementsSkeleton />
        ) : isError ? null : announcements.length === 0 ? (
          <EmptyState
            icon={Megaphone01Icon}
            title="اطلاعیه‌ای ثبت نشده است"
            subtitle="به‌محض انتشار اطلاعیه توسط امور تغذیه، اینجا نمایش داده می‌شود."
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
            {announcements.map((item) => (
              <AnnouncementCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function AnnouncementCard({ item }: { item: FoodAnnouncement }) {
  return (
    <Link
      href={`/food-week/announcements/${item.id}`}
      className="block h-full transition-transform active:scale-[0.99]"
    >
      <Card className="h-full overflow-hidden p-4">
        {item.hasCover && <FoodCoverBanner id={item.id} alt={item.title} />}

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {item.pinned && (
              <Badge variant="outline" className="px-2 py-0.5 text-[10px]">
                📌 مهم
              </Badge>
            )}
            <Badge variant="soft">{item.categoryLabel}</Badge>
          </div>
          <time className="shrink-0 text-xs text-muted-foreground">{item.dateLabel}</time>
        </div>

        <h3 className="mt-3 line-clamp-1 text-base font-bold text-foreground">{item.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-muted-foreground">{item.body}</p>

        {item.attachmentCount > 0 && (
          <div className="mt-3 flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <HugeiconsIcon icon={Attachment01Icon} size={14} />
              {toPersianDigits(item.attachmentCount)} پیوست
            </span>
          </div>
        )}
      </Card>
    </Link>
  );
}

function AnnouncementsSkeleton() {
  return (
    <div className="grid gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-36 animate-pulse rounded-3xl border border-border bg-card/50" />
      ))}
    </div>
  );
}
