"use client";

import { useMemo } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  Attachment01Icon,
  Building03Icon,
  Clock01Icon,
  Download04Icon,
  File01Icon,
  Legal01Icon,
  Megaphone01Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";

import { ModuleHero } from "@/components/module/module-hero";
import { EmptyState, ErrorState, SectionHeading } from "@/components/module/module-ui";
import { DormCoverBanner } from "@/components/dorm/dorm-cover-banner";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useDorm } from "@/hooks/dorm/use-dorm";
import { dormApi } from "@/lib/api/dorm.api";
import type { DormAnnouncement, DormForm, DormInfoItem } from "@/lib/api/types";
import { cn, toPersianDigits } from "@/lib/utils";

const HERO_TONE =
  "text-cyan-600 border-cyan-500/15 from-cyan-500/18 via-cyan-500/8 shadow-cyan-500/25 dark:text-cyan-300";

export default function DormitoryPage() {
  const { data, isLoading, isError, refetch } = useDorm();

  const announcements = useMemo(() => data?.announcements ?? [], [data]);
  const rules = useMemo(() => data?.rules ?? [], [data]);
  const facilities = useMemo(() => data?.facilities ?? [], [data]);
  const forms = useMemo(() => data?.forms ?? [], [data]);

  return (
    <div className="space-y-6">
      <ModuleHero
        backHref="/services"
        backLabel="بخش خدمات"
        icon={Building03Icon}
        title="خوابگاه"
        description="اطلاعیه‌ها، قوانین، امکانات و فرم‌های خوابگاه دانشجویی را در یک صفحه دنبال کنید. اطلاعیه‌های جدید به‌صورت اعلان به شما ارسال می‌شود."
        status="فعال"
        tone={HERO_TONE}
        stats={
          announcements.length
            ? [{ icon: Megaphone01Icon, value: toPersianDigits(announcements.length), label: "اطلاعیه" }]
            : []
        }
      />

      {isLoading ? (
        <DormSkeleton />
      ) : isError ? (
        <ErrorState
          title="دریافت اطلاعات خوابگاه ناموفق بود"
          subtitle="اتصال به سرور برقرار نشد. دوباره تلاش کنید."
          onRetry={() => {
            refetch();
          }}
        />
      ) : (
        <>
          {/* Announcements */}
          <section id="content" className="space-y-3">
            <SectionHeading title="اطلاعیه‌های خوابگاه" subtitle="آخرین خبرها و اطلاعیه‌های خوابگاه" />
            {announcements.length === 0 ? (
              <EmptyState
                icon={Megaphone01Icon}
                title="اطلاعیه‌ای ثبت نشده است"
                subtitle="به‌محض انتشار اطلاعیه توسط مسئولان خوابگاه، اینجا نمایش داده می‌شود."
              />
            ) : (
              <div className="grid gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
                {announcements.map((item) => (
                  <AnnouncementCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </section>

          {/* Rules + facilities sit side by side on desktop */}
          <div className="space-y-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:space-y-0">
            <InfoSection
              icon={Legal01Icon}
              title="قوانین و مقررات"
              subtitle="مقررات اسکان و زندگی در خوابگاه"
              items={rules}
              emptyLabel="قوانینی ثبت نشده است"
            />
            <InfoSection
              icon={Clock01Icon}
              title="امکانات و ساعات کاری"
              subtitle="خدمات خوابگاه و ساعت‌های ارائه"
              items={facilities}
              emptyLabel="امکاناتی ثبت نشده است"
            />
          </div>

          {/* Forms */}
          {forms.length > 0 && (
            <section className="space-y-3">
              <SectionHeading title="فرم‌ها و مدارک" subtitle="دریافت فرم‌های موردنیاز خوابگاه" />
              <div className="grid gap-2.5 md:grid-cols-2">
                {forms.map((form) => (
                  <FormCard key={form.id} form={form} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function AnnouncementCard({ item }: { item: DormAnnouncement }) {
  return (
    <Link
      href={`/dormitory/announcements/${item.id}`}
      className="block h-full transition-transform active:scale-[0.99]"
    >
      <Card className="h-full overflow-hidden p-4">
        {item.hasCover && <DormCoverBanner id={item.id} alt={item.title} />}

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

function InfoSection({
  icon,
  title,
  subtitle,
  items,
  emptyLabel,
}: {
  icon: IconSvgElement;
  title: string;
  subtitle: string;
  items: DormInfoItem[];
  emptyLabel: string;
}) {
  return (
    <section className="space-y-3">
      <SectionHeading title={title} subtitle={subtitle} />
      {items.length === 0 ? (
        <EmptyState icon={icon} title={emptyLabel} />
      ) : (
        <Card className="overflow-hidden">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className={cn(
                "flex items-start gap-3 p-3.5",
                idx !== items.length - 1 && "border-b border-border",
              )}
            >
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50 text-primary">
                <HugeiconsIcon icon={icon} size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                {item.detail && (
                  <p className="mt-0.5 text-xs leading-6 text-muted-foreground">{item.detail}</p>
                )}
              </div>
            </div>
          ))}
        </Card>
      )}
    </section>
  );
}

function FormCard({ form }: { form: DormForm }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/70 p-3.5">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/50 text-primary">
        <HugeiconsIcon icon={File01Icon} size={22} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{form.title}</p>
        {form.description ? (
          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{form.description}</p>
        ) : (
          <p className="mt-0.5 text-xs text-muted-foreground">{form.sizeLabel}</p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <IconLink href={dormApi.formFileUrl(form.id)} icon={ViewIcon} title="مشاهده" />
        <IconLink href={dormApi.formFileUrl(form.id, { download: true })} icon={Download04Icon} title="دانلود" />
      </div>
    </div>
  );
}

function IconLink({ href, icon, title }: { href: string; icon: IconSvgElement; title: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      aria-label={title}
      className="flex size-9 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:text-primary active:scale-95"
    >
      <HugeiconsIcon icon={icon} size={16} />
    </a>
  );
}

function DormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl border border-border bg-card/50" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl border border-border bg-card/50" />
        ))}
      </div>
    </div>
  );
}
