"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Attachment01Icon, Megaphone01Icon } from "@hugeicons/core-free-icons";

import { NewsCoverBanner } from "@/components/news/news-cover-banner";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useNews } from "@/hooks/news/use-news";
import { toPersianDigits } from "@/lib/utils";

/**
 * The home-page «اخبار و اطلاعیه‌ها» carousel, fed live by GET /news. The SSE
 * subscription in NotificationProvider invalidates the query when staff publish,
 * so this re-renders on its own — no refresh, no polling.
 */
export function AnnouncementsCarousel() {
  const { data, isLoading } = useNews();
  const items = data ?? [];

  if (isLoading) {
    return <AnnouncementsSkeleton />;
  }

  if (items.length === 0) {
    return (
      <Card className="flex items-center gap-3 p-5 text-muted-foreground">
        <HugeiconsIcon icon={Megaphone01Icon} size={20} className="shrink-0" />
        <p className="text-sm">فعلاً خبر یا اطلاعیه‌ای ثبت نشده است.</p>
      </Card>
    );
  }

  return (
    <Carousel opts={{ align: "start", direction: "rtl" }} className="w-full">
      <CarouselContent className="-ms-3">
        {items.map((item) => (
          <CarouselItem key={item.id} className="basis-[86%] ps-3">
            <Link
              href={`/news/${item.id}`}
              className="block h-full transition-transform active:scale-[0.99]"
            >
              <Card className="flex h-full flex-col overflow-hidden p-4">
                {item.hasCover && <NewsCoverBanner id={item.id} alt={item.title} />}

                <div className="flex items-center justify-between gap-3">
                  <Badge variant="soft">{item.categoryLabel}</Badge>
                  <time className="shrink-0 text-xs text-muted-foreground">{item.dateLabel}</time>
                </div>

                <h3 className="mt-4 line-clamp-1 text-base font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{item.body}</p>

                {item.attachmentCount > 0 && (
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <HugeiconsIcon icon={Attachment01Icon} size={13} />
                      {toPersianDigits(item.attachmentCount)} پیوست
                    </span>
                  </div>
                )}
              </Card>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

function AnnouncementsSkeleton() {
  return (
    <div className="-ms-3 flex" aria-hidden>
      {[0, 1].map((i) => (
        <div key={i} className="basis-[86%] ps-3">
          <div className="h-32 animate-pulse rounded-2xl border border-border bg-card/50" />
        </div>
      ))}
    </div>
  );
}
