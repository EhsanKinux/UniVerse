"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, Award01Icon, BookOpen01Icon, ChartLineData01Icon } from "@hugeicons/core-free-icons";

import { ModuleHero } from "@/components/module/module-hero";
import { InfoNote, SectionHeading } from "@/components/module/module-ui";
import { overall, terms, type Grade, type Term } from "@/lib/grades-data";
import { cn } from "@/lib/utils";

const HERO_TONE =
  "text-amber-600 border-amber-500/15 from-amber-500/18 via-amber-500/8 shadow-amber-500/25 dark:text-amber-300";

const faNumber = (n: number, digits = 2) =>
  n.toLocaleString("fa-IR", { minimumFractionDigits: digits, maximumFractionDigits: digits });

function scoreColor(grade: Grade) {
  if (grade.status === "pending" || grade.score === null) return "text-muted-foreground";
  if (grade.score < 10) return "text-destructive";
  if (grade.score < 14) return "text-amber-600 dark:text-amber-400";
  return "text-emerald-600 dark:text-emerald-400";
}

export default function GradesPage() {
  return (
    <div className="space-y-6">
      <ModuleHero
        backHref="/educational"
        backLabel="بخش آموزشی"
        icon={ChartLineData01Icon}
        title="نمرات"
        description="معدل کل، کارنامه ترمی و وضعیت دروس شما در یک نمای امن و خلاصه."
        status="خصوصی"
        tone={HERO_TONE}
      />

      {/* GPA summary */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card/85 p-5 shadow-sm backdrop-blur-xl">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-muted-foreground">
            <HugeiconsIcon icon={Award01Icon} size={16} className="text-primary" />
            <span className="text-xs font-medium">معدل کل</span>
          </div>
          <p className="mt-1 text-4xl font-black tracking-tight text-foreground">{faNumber(overall.gpa)}</p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border bg-background/70 px-3 py-2.5">
              <p className="text-lg font-bold text-foreground">{overall.passedUnits.toLocaleString("fa-IR")}</p>
              <p className="text-[10px] font-medium text-muted-foreground">واحد گذرانده</p>
            </div>
            <div className="rounded-2xl border border-border bg-background/70 px-3 py-2.5">
              <p className="text-lg font-bold text-foreground">{terms.length.toLocaleString("fa-IR")}</p>
              <p className="text-[10px] font-medium text-muted-foreground">نیمسال</p>
            </div>
          </div>
        </div>
      </section>

      <section id="content" className="space-y-3">
        <SectionHeading title="کارنامه ترمی" subtitle="روی هر نیمسال بزنید تا ریز نمرات را ببینید." />
        <div className="grid gap-3">
          {terms.map((term, i) => (
            <TermCard key={term.id} term={term} defaultOpen={i === terms.length - 1} />
          ))}
        </div>
      </section>

      <InfoNote title="حریم خصوصی">
        نمرات نمایش‌داده‌شده صرفاً برای شما قابل مشاهده است. مرجع رسمی نمرات و کارنامه، سامانه آموزشی گلستان دانشگاه
        می‌باشد.
      </InfoNote>
    </div>
  );
}

function TermCard({ term, defaultOpen }: { term: Term; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const termUnits = term.grades.reduce((s, g) => s + g.units, 0);

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card/85 shadow-sm backdrop-blur-xl">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 p-4 text-right transition-colors hover:bg-muted/40"
      >
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-background">
          <HugeiconsIcon icon={BookOpen01Icon} size={20} className="text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-foreground">{term.title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {term.grades.length.toLocaleString("fa-IR")} درس · {termUnits.toLocaleString("fa-IR")} واحد
          </p>
        </div>
        <div className="shrink-0 text-left">
          {term.gpa !== null ? (
            <>
              <p className="text-lg font-black text-foreground">{faNumber(term.gpa)}</p>
              <p className="text-[10px] text-muted-foreground">معدل ترم</p>
            </>
          ) : (
            <span className="rounded-lg bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary">جاری</span>
          )}
        </div>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={18}
          className={cn("shrink-0 text-muted-foreground transition-transform duration-300", open && "rotate-180")}
        />
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-1.5 border-t border-border p-3">
            {term.grades.map((g, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 rounded-2xl bg-background/60 px-3.5 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{g.course}</p>
                  <p className="text-[11px] text-muted-foreground">{g.units.toLocaleString("fa-IR")} واحد</p>
                </div>
                <span className={cn("shrink-0 text-base font-black tabular-nums", scoreColor(g))}>
                  {g.score === null ? "—" : faNumber(g.score)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
