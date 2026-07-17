"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Calendar03Icon, LinkSquare02Icon } from "@hugeicons/core-free-icons";

import { DormAttachmentCard } from "@/components/dorm/dorm-attachment-card";
import { NewsBody } from "@/components/news/news-body";
import { ErrorState, SectionHeading } from "@/components/module/module-ui";
import { Badge } from "@/components/ui/badge";
import { useDormAnnouncement } from "@/hooks/dorm/use-dorm-announcement";
import { dormApi } from "@/lib/api/dorm.api";
import { isExternalLink } from "@/lib/notifications/ui";
import { toPersianDigits } from "@/lib/utils";

export default function DormAnnouncementDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const { data, isLoading, isError, refetch } = useDormAnnouncement(id);

  return (
    <div className="space-y-6 lg:mx-auto lg:w-full lg:max-w-3xl">
      <Link
        href="/dormitory"
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-2 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-xl transition-colors hover:text-foreground"
      >
        <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
        بازگشت به خوابگاه
      </Link>

      {isLoading ? (
        <DetailSkeleton />
      ) : isError || !data ? (
        <ErrorState
          title="این اطلاعیه یافت نشد"
          subtitle="ممکن است حذف شده یا هنوز منتشر نشده باشد."
          onRetry={() => {
            refetch();
          }}
        />
      ) : (
        <article className="space-y-5">
          {data.hasCover && <CoverImage id={data.id} alt={data.title} />}

          <div className="flex items-center justify-between gap-3">
            <Badge variant="soft">{data.categoryLabel}</Badge>
            <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
              <HugeiconsIcon icon={Calendar03Icon} size={14} />
              {data.dateLabel}
            </span>
          </div>

          <h1 className="text-2xl font-bold leading-9 tracking-tight text-foreground">{data.title}</h1>

          <NewsBody>{data.body}</NewsBody>

          {data.link && <ReadMoreLink href={data.link} />}

          {data.attachments.length > 0 && (
            <section className="space-y-3 border-t border-border pt-5">
              <SectionHeading
                title="پیوست‌ها"
                subtitle={`${toPersianDigits(data.attachments.length)} فایل`}
              />
              <div className="grid gap-2.5 md:grid-cols-2">
                {data.attachments.map((attachment) => (
                  <DormAttachmentCard key={attachment.id} attachment={attachment} />
                ))}
              </div>
            </section>
          )}
        </article>
      )}
    </div>
  );
}

/** The «مشاهدهٔ بیشتر» button — external links open a new tab, internal ones use
 *  client-side navigation. */
function ReadMoreLink({ href }: { href: string }) {
  const className =
    "inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:brightness-95 active:scale-[0.98]";
  const inner = (
    <>
      <HugeiconsIcon icon={LinkSquare02Icon} size={18} />
      مشاهدهٔ بیشتر
    </>
  );

  return isExternalLink(href) ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}

/** The hero/cover image. Served inline by the backend; hides itself if it fails
 *  to load so the article still reads cleanly. */
function CoverImage({ id, alt }: { id: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-muted">
      {/* eslint-disable-next-line @next/next/no-img-element -- backend-served image; next/image would need remotePatterns for the dynamic API host */}
      <img
        src={dormApi.coverUrl(id)}
        alt={alt}
        className="aspect-video w-full object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-5">
      <div className="aspect-video w-full animate-pulse rounded-3xl border border-border bg-card/50" />
      <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
      <div className="h-8 w-3/4 animate-pulse rounded-xl bg-muted" />
      <div className="space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-4 w-full animate-pulse rounded bg-muted" />
        ))}
      </div>
    </div>
  );
}
