"use client";

import { DepartmentCard } from "@/components/chart/department-card";
import { ModulePage } from "@/components/module-page";
import { departments } from "@/lib/chart-data";
import { cn } from "@/lib/utils";
import { ArrowRight, BookOpen, GraduationCap, Search, Sparkles } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState } from "react";

export default function ChartPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDepartments = departments.filter((dept) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.trim();
    return (
      dept.title.includes(query) || dept.pdfs.some((pdf) => pdf.title.includes(query) || pdf.badge?.includes(query))
    );
  });

  const totalPdfs = departments.reduce((sum, dept) => sum + dept.pdfs.length, 0);

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-surface-dim pb-8">
      {/* Top bar area */}
      <div className="sticky top-0 z-30 bg-surface-dim/80 px-4 pt-4 pb-2 backdrop-blur-xl">
        <Link
          href="/educational"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-card px-3 py-2 text-xs font-medium text-text-secondary shadow-sm backdrop-blur-xl transition-colors hover:text-text"
        >
          <HugeiconsIcon icon={ArrowRight} size={16} />
          بازگشت به آموزشی
        </Link>
      </div>

      <div className="space-y-5 px-4">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-surface-card p-5 shadow-sm backdrop-blur-xl">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent" />
          <div className="absolute top-0 left-0 h-32 w-32 -translate-x-8 -translate-y-8 rounded-full bg-primary/5 blur-2xl" />
          <div className="absolute bottom-0 right-0 h-24 w-24 translate-x-6 translate-y-6 rounded-full bg-primary/5 blur-2xl" />

          <div className="relative z-10 space-y-5">
            {/* Icon & Status */}
            <div className="flex items-start justify-between gap-4">
              <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-[1.4rem] border border-primary/20 bg-gradient-to-br from-primary/15 to-surface shadow-lg">
                <div className="absolute inset-1 rounded-[inherit] bg-primary opacity-[0.08] blur-md" />
                <HugeiconsIcon icon={GraduationCap} size={30} className="relative z-10 text-primary" />
              </div>
              <span className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                فعال
              </span>
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold leading-9 tracking-tight text-text">چارت آموزشی</h1>
              <p className="text-sm leading-7 text-text-secondary">
                چارت‌های آموزشی رشته‌های مختلف دانشگاه را مشاهده و دانلود کنید. هر رشته شامل نقشه راه دروس و پیش‌نیازها
                است.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3">
              <div className="flex flex-1 items-center gap-2.5 rounded-2xl border border-border bg-surface/80 px-3 py-2.5">
                <HugeiconsIcon icon={BookOpen} size={16} className="shrink-0 text-primary" />
                <div>
                  <p className="text-lg font-bold text-text">{departments.length}</p>
                  <p className="text-[10px] font-medium text-text-muted">رشته تحصیلی</p>
                </div>
              </div>
              <div className="flex flex-1 items-center gap-2.5 rounded-2xl border border-border bg-surface/80 px-3 py-2.5">
                <HugeiconsIcon icon={Sparkles} size={16} className="shrink-0 text-primary" />
                <div>
                  <p className="text-lg font-bold text-text">{totalPdfs}</p>
                  <p className="text-[10px] font-medium text-text-muted">چارت آموزشی</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Bar */}
        <div className="relative">
          <HugeiconsIcon
            icon={Search}
            size={18}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی رشته یا چارت آموزشی..."
            className={cn(
              "h-12 w-full rounded-2xl border border-border bg-surface-card pr-11 pl-4",
              "text-sm font-medium text-text placeholder:text-text-muted",
              "shadow-sm backdrop-blur-xl outline-none",
              "transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10",
            )}
          />
        </div>

        {/* Departments List */}
        <section id="content" className="space-y-3">
          <div className="px-1">
            <h2 className="text-lg font-bold tracking-tight text-text">رشته‌های تحصیلی</h2>
            <p className="mt-1 text-sm leading-6 text-text-secondary">
              روی هر رشته بزنید تا چارت‌های آموزشی آن را ببینید و دانلود کنید.
            </p>
          </div>

          <div className="grid gap-3">
            {filteredDepartments.length > 0 ? (
              filteredDepartments.map((dept, index) => <DepartmentCard key={dept.id} department={dept} index={index} />)
            ) : (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface-card p-10 text-center">
                <HugeiconsIcon icon={Search} size={40} className="mb-3 text-text-muted/50" />
                <p className="text-sm font-semibold text-text-secondary">نتیجه‌ای یافت نشد</p>
                <p className="mt-1 text-xs text-text-muted">عبارت دیگری را جستجو کنید</p>
              </div>
            )}
          </div>
        </section>

        {/* Footer Info */}
        <section className="rounded-3xl border border-dashed border-border bg-surface-card/40 p-5">
          <h2 className="text-base font-bold text-text">💡 راهنما</h2>
          <p className="mt-2 text-sm leading-7 text-text-secondary">
            چارت آموزشی نقشه‌ای از دروس هر رشته به همراه پیش‌نیازها و هم‌نیازها است. با دانلود چارت رشته خود، مسیر
            تحصیلی‌تان را بهتر برنامه‌ریزی کنید. در صورت تغییر سرفصل‌ها، چارت‌ها به‌روزرسانی خواهند شد.
          </p>
        </section>
      </div>
    </div>
  );
}
