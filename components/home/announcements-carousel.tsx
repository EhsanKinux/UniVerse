"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Megaphone01Icon } from "@hugeicons/core-free-icons";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useNews } from "@/hooks/news/use-news";

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
            <Card className="h-full p-4">
              <div className="flex items-center justify-between gap-3">
                <Badge variant="soft">{item.categoryLabel}</Badge>
                <time className="shrink-0 text-xs text-muted-foreground">{item.dateLabel}</time>
              </div>

              <h3 className="mt-4 line-clamp-1 text-base font-bold text-foreground">{item.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
            </Card>
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
