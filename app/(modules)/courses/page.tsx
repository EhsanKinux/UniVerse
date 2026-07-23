"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  Book02Icon,
  Calendar03Icon,
  Download04Icon,
  Pdf01Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";

import { ModuleHero } from "@/components/module/module-hero";
import { EmptyState, ErrorState, InfoNote, SectionHeading } from "@/components/module/module-ui";
import { ModuleHeroSkeleton } from "@/components/module/module-skeletons";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategoryDocuments } from "@/hooks/documents/use-category-documents";
import { documentsApi } from "@/lib/api/documents.api";
import type { DocumentMeta } from "@/lib/api/types";
import { cn, toPersianDigits } from "@/lib/utils";

const HERO_TONE =
  "text-emerald-600 border-emerald-500/15 from-emerald-500/18 via-emerald-500/8 shadow-emerald-500/25 dark:text-emerald-300";

// This page is backed by a single managed file (the official Golestan PDF) that
// staff upload from /admin, rather than a hardcoded course list. See the
// "documents" feature in univers-backend.
const CATEGORY = "courses";

export default function CoursesPage() {
  const { data, isLoading, isError, error, refetch } = useCategoryDocuments(CATEGORY);

  if (isLoading) {
    return <CoursesSkeleton />;
  }

  const active = data?.active ?? null;
  const archive = data?.archive ?? [];

  // Hero stats only make sense once there's a published file.
  const heroStats = active
    ? [
        ...(active.pageCount
          ? [{ icon: Book02Icon, value: toPersianDigits(active.pageCount), label: "صفحه" }]
          : []),
        { icon: Pdf01Icon, value: active.sizeLabel, label: "حجم فایل" },
      ]
    : [];

  return (
    <div className="space-y-6">
      <ModuleHero
        backHref="/educational"
        backLabel="بخش آموزشی"
        icon={Book02Icon}
        title="دروس ارائه‌شده"
        description={
          active
            ? "فهرست رسمی دروس ارائه‌شدهٔ نیمسال جاری و شرایط اخذ آن‌ها را مشاهده یا دانلود کنید."
            : "فهرست رسمی دروس ارائه‌شده، به‌محض انتشار توسط آموزش دانشگاه، اینجا قرار می‌گیرد."
        }
        status={active ? "به‌روز" : undefined}
        tone={HERO_TONE}
        stats={heroStats}
      />

      {isError ? (
        <ErrorState
          title="دریافت فایل ناموفق بود"
          subtitle={error?.message}
          onRetry={() => {
            refetch();
          }}
        />
      ) : !active && archive.length === 0 ? (
        <EmptyState
          icon={Pdf01Icon}
          title="هنوز فایلی منتشر نشده است"
          subtitle="به‌محض بارگذاری فهرست دروس ارائه‌شده توسط آموزش دانشگاه، اینجا نمایش داده می‌شود."
        />
      ) : (
        <>
          {active && (
            <section id="content" className="space-y-3">
              <SectionHeading title="فایل جاری" subtitle="آخرین نسخهٔ منتشرشده" />
              <ActiveDocumentCard doc={active} />
            </section>
          )}

          {archive.length > 0 && (
            <section className="space-y-3">
              <SectionHeading
                title="نسخه‌های پیشین"
                subtitle={`${toPersianDigits(archive.length)} فایل بایگانی‌شده`}
              />
              <div className="grid gap-3 md:grid-cols-2">
                {archive.map((doc) => (
                  <ArchiveRow key={doc.id} doc={doc} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <InfoNote title="دربارهٔ این فهرست">
        این فایل، فهرست رسمی دروس ارائه‌شده و شرایط اخذ آن‌هاست که از سامانهٔ جامع دانشگاهی گلستان
        تهیه شده است. مرجع نهایی برای انتخاب واحد، همان سامانهٔ گلستان دانشگاه است.
      </InfoNote>
    </div>
  );
}

/** The prominent card for the currently published file, with view + download. */
function ActiveDocumentCard({ doc }: { doc: DocumentMeta }) {
  return (
    <Card className="overflow-hidden p-5">
      <div className="flex items-start gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/15 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
          <HugeiconsIcon icon={Pdf01Icon} size={28} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold leading-6 text-foreground">{doc.title}</h3>
          {doc.description && (
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{doc.description}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
            <span dir="ltr" className="font-mono">
              {doc.originalName}
            </span>
            <span aria-hidden>·</span>
            <span>{doc.sizeLabel}</span>
            {doc.pageCount ? (
              <>
                <span aria-hidden>·</span>
                <span>{toPersianDigits(doc.pageCount)} صفحه</span>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 border-t border-border pt-4 text-xs text-muted-foreground">
        <HugeiconsIcon icon={Calendar03Icon} size={14} />
        به‌روزرسانی: {doc.updatedAtLabel}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 md:max-w-md">
        <DocAction href={documentsApi.fileUrl(doc.id)} icon={ViewIcon} label="مشاهده" primary />
        <DocAction
          href={documentsApi.fileUrl(doc.id, { download: true })}
          icon={Download04Icon}
          label="دانلود"
        />
      </div>
    </Card>
  );
}

/** A compact archived-version row with icon-only view + download actions. */
function ArchiveRow({ doc }: { doc: DocumentMeta }) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/50 text-muted-foreground">
        <HugeiconsIcon icon={Pdf01Icon} size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-foreground">{doc.title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {doc.updatedAtLabel} · {doc.sizeLabel}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <IconLink href={documentsApi.fileUrl(doc.id)} icon={ViewIcon} title="مشاهده" />
        <IconLink
          href={documentsApi.fileUrl(doc.id, { download: true })}
          icon={Download04Icon}
          title="دانلود"
        />
      </div>
    </Card>
  );
}

/** A link styled as a primary/secondary button (opens the file in a new tab). */
function DocAction({
  href,
  icon,
  label,
  primary,
}: {
  href: string;
  icon: IconSvgElement;
  label: string;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition-all active:scale-[0.98]",
        primary
          ? "bg-primary text-primary-foreground shadow-sm hover:brightness-95"
          : "border border-border bg-card/70 text-foreground hover:text-primary",
      )}
    >
      <HugeiconsIcon icon={icon} size={18} />
      {label}
    </a>
  );
}

/** A small square icon-only link, used for archived rows. */
function IconLink({ href, icon, title }: { href: string; icon: IconSvgElement; title: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      aria-label={title}
      className="flex size-9 items-center justify-center rounded-xl border border-border bg-card/70 text-muted-foreground transition-colors hover:text-primary"
    >
      <HugeiconsIcon icon={icon} size={16} />
    </a>
  );
}

function CoursesSkeleton() {
  return (
    <div className="space-y-6">
      <ModuleHeroSkeleton stats={2} />
      <div className="space-y-3">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-52 rounded-3xl" />
      </div>
    </div>
  );
}
