import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowReloadHorizontalIcon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  MinusSignCircleIcon,
  PlusSignCircleIcon,
} from "@hugeicons/core-free-icons";

import { ModuleHero } from "@/components/module/module-hero";
import { SectionHeading } from "@/components/module/module-ui";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { addDropWindow, requests, rules, steps, type RequestStatus } from "@/lib/data/add-drop-data";
import { cn } from "@/lib/utils";

const HERO_TONE =
  "text-cyan-600 border-cyan-500/15 from-cyan-500/18 via-cyan-500/8 shadow-cyan-500/25 dark:text-cyan-300";

const requestStatusMap: Record<RequestStatus, { label: string; className: string; icon: typeof CheckmarkCircle02Icon }> = {
  approved: {
    label: "تأیید شد",
    className: "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400",
    icon: CheckmarkCircle02Icon,
  },
  pending: {
    label: "در انتظار",
    className: "text-amber-600 bg-amber-500/10 dark:text-amber-400",
    icon: Clock01Icon,
  },
  rejected: {
    label: "رد شد",
    className: "text-destructive bg-destructive/10",
    icon: Cancel01Icon,
  },
};

export default function AddDropPage() {
  return (
    <div className="space-y-6">
      <ModuleHero
        backHref="/services"
        backLabel="بخش خدمات"
        icon={ArrowReloadHorizontalIcon}
        title="حذف و اضافه"
        description="فرایند حذف و اضافه دروس، وضعیت درخواست‌ها و راهنمای گام‌به‌گام را در این صفحه دنبال کنید."
        status="زمان‌بندی‌شده"
        tone={HERO_TONE}
      />

      {/* Status banner */}
      <section
        className={cn(
          "flex items-center gap-3 rounded-3xl border p-4 shadow-sm backdrop-blur-xl",
          addDropWindow.isOpen
            ? "border-emerald-500/25 bg-emerald-500/5"
            : "border-border bg-card/85",
        )}
      >
        <span className="relative flex size-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex size-3 rounded-full bg-emerald-500" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-foreground">بازه حذف و اضافه فعال است</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {addDropWindow.rangeLabel} · بسته می‌شود: {addDropWindow.closesLabel}
          </p>
        </div>
      </section>

      {/* Steps + requests sit side by side on desktop */}
      <div className="space-y-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:space-y-0">
      {/* Steps */}
      <section id="content" className="space-y-3">
        <SectionHeading title="مراحل انجام" subtitle="گام‌های لازم برای ثبت حذف و اضافه" />
        <div className="relative space-y-3 pr-4">
          <div className="absolute top-2 bottom-2 right-[7px] w-px bg-border" />
          {steps.map((step) => {
            const done = step.status === "done";
            const current = step.status === "current";
            return (
              <div key={step.id} className="relative">
                <span
                  className={cn(
                    "absolute top-5 -right-4 z-10 flex size-3.5 items-center justify-center rounded-full border-2 bg-background",
                    done && "border-emerald-500/50",
                    current && "border-primary/40",
                    !done && !current && "border-border",
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      done && "bg-emerald-500",
                      current && "bg-primary",
                      !done && !current && "bg-muted-foreground/40",
                    )}
                  />
                </span>
                <Card className={cn("p-4", current && "border-primary/30 ring-1 ring-primary/10")}>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-bold text-foreground">{step.title}</h3>
                    {done && (
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} className="shrink-0 text-emerald-500" />
                    )}
                    {current && (
                      <Badge variant="soft" className="rounded-lg px-2 py-0.5 text-[10px]">
                        مرحله فعلی
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{step.description}</p>
                </Card>
              </div>
            );
          })}
        </div>
      </section>

      {/* Requests */}
      <section className="space-y-3">
        <SectionHeading title="درخواست‌های من" subtitle="وضعیت تغییرات ثبت‌شده در این بازه" />
        <div className="grid gap-2.5">
          {requests.map((req) => {
            const status = requestStatusMap[req.status];
            const isAdd = req.action === "add";
            return (
              <Card key={req.id} className="flex items-center gap-3 rounded-2xl p-3.5">
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-xl border",
                    isAdd
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400",
                  )}
                >
                  <HugeiconsIcon icon={isAdd ? PlusSignCircleIcon : MinusSignCircleIcon} size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{req.course}</p>
                  <p className="text-xs text-muted-foreground">{isAdd ? "افزودن درس" : "حذف درس"}</p>
                </div>
                <span
                  className={cn(
                    "flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium",
                    status.className,
                  )}
                >
                  <HugeiconsIcon icon={status.icon} size={13} />
                  {status.label}
                </span>
              </Card>
            );
          })}
        </div>
      </section>
      </div>

      {/* Rules */}
      <section className="rounded-3xl border border-dashed border-border bg-muted/40 p-5">
        <h2 className="text-base font-bold text-foreground">قوانین حذف و اضافه</h2>
        <ul className="mt-3 space-y-2.5">
          {rules.map((rule) => (
            <li key={rule} className="flex gap-2.5 text-sm leading-6 text-muted-foreground">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/60" />
              {rule}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
