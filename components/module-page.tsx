import Link from "next/link";
import { notFound } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";

import { buttonVariants } from "@/components/ui/button";
import { modulePages, type ModulePageKey } from "@/lib/university-data";
import { cn } from "@/lib/utils";

export function ModulePage({ id }: { id: ModulePageKey }) {
  const page = modulePages[id];

  if (!page) {
    notFound();
  }

  const { module } = page;

  return (
    <div className="space-y-6">
      <Link
        href={page.sectionHref}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-2 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-xl transition-colors hover:text-foreground"
      >
        <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
        بازگشت به {page.sectionTitle}
      </Link>

      <section className="relative overflow-hidden rounded-3xl border border-border bg-card/85 p-5 shadow-sm backdrop-blur-xl">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent" />

        <div className="relative z-10 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div
              className={cn(
                "relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-[1.4rem] border bg-linear-to-br to-background shadow-lg",
                module.tone,
              )}
            >
              <div className="absolute inset-1 rounded-[inherit] bg-current opacity-[0.08] blur-md" />
              <HugeiconsIcon icon={module.icon} size={30} className="relative z-10" />
            </div>

            <span className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {page.status}
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold leading-9 tracking-tight text-foreground">{module.title}</h1>
            <p className="text-sm leading-7 text-muted-foreground">{page.description}</p>
          </div>

          <Link
            href={`${module.href}#content`}
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-12 w-full rounded-3xl text-sm font-semibold shadow-md shadow-primary/15",
            )}
          >
            {page.primaryAction}
          </Link>
        </div>
      </section>

      <section id="content" className="space-y-3">
        <div className="px-1">
          <h2 className="text-lg font-bold tracking-tight text-foreground">ساختار پیشنهادی صفحه</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            این صفحه آماده اتصال به API، فرم‌ها و داده واقعی دانشگاه است.
          </p>
        </div>

        <div className="grid gap-3">
          {page.highlights.map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-3xl border border-border bg-card/80 p-4 shadow-sm backdrop-blur-xl">
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-2xl border bg-linear-to-br to-background shadow-sm",
                  module.tone,
                )}
              >
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={21} />
              </div>
              <span className="text-sm font-medium text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-dashed border-border bg-muted/40 p-5">
        <h2 className="text-base font-bold text-foreground">مرحله بعدی توسعه</h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          محتوای اختصاصی این ماژول را داخل همین Route نگه دارید و منطق مشترک مثل هدر، اکشن اصلی و وضعیت را در
          `ModulePage` مدیریت کنید. این ساختار برای PWA تمیز، قابل نگهداری و قابل توسعه می‌ماند.
        </p>
      </section>
    </div>
  );
}
