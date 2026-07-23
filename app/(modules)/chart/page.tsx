"use client";

import { useMemo, useState } from "react";
import { BookOpen01Icon, GraduationScrollIcon, SparklesIcon } from "@hugeicons/core-free-icons";

import { DepartmentCard } from "@/components/chart/department-card";
import { ModuleHero } from "@/components/module/module-hero";
import { EmptyState, ErrorState, InfoNote, SearchBox, SectionHeading } from "@/components/module/module-ui";
import { SkeletonCardGrid, SkeletonSearchBox } from "@/components/module/module-skeletons";
import { LoadSwap } from "@/components/ui/load-swap";
import { Skeleton } from "@/components/ui/skeleton";
import { useChart } from "@/hooks/chart/use-chart";
import { toPersianDigits } from "@/lib/utils";

const HERO_TONE = "text-violet-600 border-violet-500/15 from-violet-500/18 via-violet-500/8 shadow-violet-500/25 dark:text-violet-300";

export default function ChartPage() {
  const { data, isLoading, isError, refetch } = useChart();
  const [searchQuery, setSearchQuery] = useState("");

  const departments = useMemo(() => data ?? [], [data]);
  const totalPdfs = useMemo(
    () => departments.reduce((sum, dept) => sum + dept.files.length, 0),
    [departments],
  );

  const filteredDepartments = useMemo(() => {
    const query = searchQuery.trim();
    if (!query) return departments;
    return departments.filter(
      (dept) =>
        dept.title.includes(query) ||
        dept.files.some((file) => file.title.includes(query) || file.badge?.includes(query)),
    );
  }, [departments, searchQuery]);

  return (
    <div className="space-y-6">
      <ModuleHero
        backHref="/educational"
        backLabel="بخش آموزشی"
        icon={GraduationScrollIcon}
        title="چارت آموزشی"
        description="چارت‌های آموزشی رشته‌های مختلف دانشگاه را مشاهده و دانلود کنید. هر رشته شامل نقشه راه دروس و پیش‌نیازها است."
        status="فعال"
        tone={HERO_TONE}
        stats={
          departments.length
            ? [
                { icon: BookOpen01Icon, value: toPersianDigits(departments.length), label: "رشته تحصیلی" },
                { icon: SparklesIcon, value: toPersianDigits(totalPdfs), label: "چارت آموزشی" },
              ]
            : []
        }
      />

      <LoadSwap loading={isLoading} skeleton={<ChartSkeleton />}>
        {isError ? (
          <ErrorState
            title="دریافت چارت‌ها ناموفق بود"
            subtitle="اتصال به سرور برقرار نشد. دوباره تلاش کنید."
            onRetry={() => {
              refetch();
            }}
          />
        ) : departments.length === 0 ? (
          <EmptyState
            icon={GraduationScrollIcon}
            title="هنوز چارتی ثبت نشده است"
            subtitle="به‌محض بارگذاری چارت رشته‌ها توسط دانشگاه، اینجا نمایش داده می‌شود."
          />
        ) : (
          <div className="space-y-6">
            <div className="md:max-w-md">
              <SearchBox
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="جستجوی رشته یا چارت آموزشی..."
              />
            </div>

            <section id="content" className="space-y-3">
              <SectionHeading
                title="رشته‌های تحصیلی"
                subtitle="روی هر رشته بزنید تا چارت‌های آموزشی آن را ببینید و دانلود کنید."
              />

              <div className="grid items-start gap-3 md:grid-cols-2">
                {filteredDepartments.length > 0 ? (
                  filteredDepartments.map((dept, index) => (
                    <DepartmentCard key={dept.id} department={dept} index={index} />
                  ))
                ) : (
                  <EmptyState title="نتیجه‌ای یافت نشد" subtitle="عبارت دیگری را جستجو کنید" />
                )}
              </div>
            </section>
          </div>
        )}
      </LoadSwap>

      <InfoNote title="💡 راهنما">
        چارت آموزشی نقشه‌ای از دروس هر رشته به همراه پیش‌نیازها و هم‌نیازها است. با دانلود چارت رشته خود، مسیر
        تحصیلی‌تان را بهتر برنامه‌ریزی کنید. در صورت تغییر سرفصل‌ها، چارت‌ها به‌روزرسانی خواهند شد.
      </InfoNote>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="space-y-6">
      <SkeletonSearchBox />
      <div className="space-y-3">
        <Skeleton className="h-6 w-40 rounded-lg" />
        <SkeletonCardGrid count={4} cardClassName="h-[88px]" className="grid gap-3 md:grid-cols-2" />
      </div>
    </div>
  );
}
