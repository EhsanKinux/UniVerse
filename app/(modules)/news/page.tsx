"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Attachment01Icon, Image01Icon, Megaphone01Icon } from "@hugeicons/core-free-icons";

import { ModuleHero } from "@/components/module/module-hero";
import { EmptyState, ErrorState, FilterChips } from "@/components/module/module-ui";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useNews } from "@/hooks/news/use-news";
import type { NewsItem } from "@/lib/api/types";
import { toPersianDigits } from "@/lib/utils";

const HERO_TONE = "text-primary border-primary/15 from-primary/18 via-primary/8 shadow-primary/25";

const CATEGORY_FILTERS = [
  { value: "all", label: "همه" },
  { value: "academic", label: "آموزشی" },
  { value: "services", label: "خدمات" },
  { value: "student", label: "دانشجویی" },
  { value: "general", label: "عمومی" },
] as const;

type FilterValue = (typeof CATEGORY_FILTERS)[number]["value"];

export default function NewsListPage() {
  const { data, isLoading, isError, error, refetch } = useNews();
  const [filter, setFilter] = useState<FilterValue>("all");

  const items = useMemo(() => data ?? [], [data]);
  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.category === filter)),
    [items, filter],
  );

  return (
    <div className="space-y-6">
      <ModuleHero
        backHref="/"
        backLabel="خانه"
        icon={Megaphone01Icon}
        title="اخبار و اطلاعیه‌ها"
        description="آخرین خبرها و اطلاعیه‌های دانشگاه. برای مشاهدهٔ جزئیات و پیوست‌ها روی هر مورد بزنید."
        tone={HERO_TONE}
        stats={
          items.length
            ? [{ icon: Megaphone01Icon, value: toPersianDigits(items.length), label: "خبر و اطلاعیه" }]
            : []
        }
      />

      {isLoading ? (
        <NewsListSkeleton />
      ) : isError ? (
        <ErrorState
          title="دریافت اخبار ناموفق بود"
          subtitle={error?.message}
          onRetry={() => {
            refetch();
          }}
        />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Megaphone01Icon}
          title="خبری ثبت نشده است"
          subtitle="به‌محض انتشار خبر یا اطلاعیه، اینجا نمایش داده می‌شود."
        />
      ) : (
        <>
          <FilterChips options={[...CATEGORY_FILTERS]} value={filter} onChange={setFilter} />

          {filtered.length === 0 ? (
            <EmptyState
              icon={Megaphone01Icon}
              title="خبری در این دسته نیست"
              subtitle="دستهٔ دیگری را انتخاب کنید."
            />
          ) : (
            <section id="content" className="space-y-3">
              {filtered.map((item) => (
                <NewsRow key={item.id} item={item} />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}

function NewsRow({ item }: { item: NewsItem }) {
  return (
    <Link href={`/news/${item.id}`} className="block transition-transform active:scale-[0.99]">
      <Card className="p-4">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="soft">{item.categoryLabel}</Badge>
          <time className="shrink-0 text-xs text-muted-foreground">{item.dateLabel}</time>
        </div>

        <h3 className="mt-3 line-clamp-1 text-base font-bold text-foreground">{item.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-muted-foreground">{item.body}</p>

        {(item.hasCover || item.attachmentCount > 0) && (
          <div className="mt-3 flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
            {item.hasCover && (
              <span className="inline-flex items-center gap-1">
                <HugeiconsIcon icon={Image01Icon} size={14} /> تصویر
              </span>
            )}
            {item.attachmentCount > 0 && (
              <span className="inline-flex items-center gap-1">
                <HugeiconsIcon icon={Attachment01Icon} size={14} />
                {toPersianDigits(item.attachmentCount)} پیوست
              </span>
            )}
          </div>
        )}
      </Card>
    </Link>
  );
}

function NewsListSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-28 animate-pulse rounded-2xl border border-border bg-card/50" />
      ))}
    </div>
  );
}
