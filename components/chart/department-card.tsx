"use client";

import { useState } from "react";
import { ArrowDown01Icon, Download04Icon, File01Icon, ViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { chartApi } from "@/lib/api/chart.api";
import type { ChartDepartment } from "@/lib/api/types";
import { departmentTone } from "@/lib/meta/chart-meta";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DepartmentCardProps {
  department: ChartDepartment;
  index: number;
}

export function DepartmentCard({ department, index }: DepartmentCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tone = departmentTone(department.color);

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all duration-300",
        isOpen ? "shadow-md" : "hover:shadow-md",
      )}
      style={{ animation: "fade-in-up 0.5s ease-out both", animationDelay: `${index * 60}ms` }}
    >
      {/* Header - Clickable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-4 p-4 text-right transition-colors hover:bg-muted/40"
      >
        {/* Icon */}
        <div
          className={cn(
            "flex size-14 shrink-0 items-center justify-center rounded-2xl border shadow-sm transition-transform duration-300",
            tone.bgClass,
            tone.borderClass,
            isOpen && "scale-105",
          )}
        >
          <span className="text-2xl">{department.icon}</span>
        </div>

        {/* Title & Count */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold text-foreground">{department.title}</h3>
          <p className="mt-0.5 text-xs font-medium text-muted-foreground">
            {department.files.length} چارت آموزشی
          </p>
        </div>

        {/* Chevron */}
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background transition-all duration-300",
            isOpen && "rotate-180 border-primary/20 bg-primary/10",
          )}
        >
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={18}
            className={cn("text-muted-foreground transition-colors", isOpen && "text-primary")}
          />
        </div>
      </button>

      {/* Content - CSS grid accordion (no extra keyframes needed) */}
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border px-4 pt-3 pb-4">
            <div className="space-y-2.5">
              {department.files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3.5 transition-colors hover:bg-muted/50"
                >
                  {/* PDF Icon */}
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-xl border shadow-sm",
                      tone.bgClass,
                      tone.borderClass,
                    )}
                  >
                    <HugeiconsIcon icon={File01Icon} size={18} style={{ color: tone.color }} />
                  </div>

                  {/* PDF Info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-6 text-foreground">{file.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      {file.badge && (
                        <span
                          className={cn(
                            "inline-block rounded-full px-2 py-0.5 text-[10px] font-medium",
                            tone.bgClass,
                          )}
                          style={{ color: tone.color }}
                        >
                          {file.badge}
                        </span>
                      )}
                      <span className="text-[10px] text-muted-foreground">{file.sizeLabel}</span>
                    </div>
                  </div>

                  {/* Actions: view inline + download */}
                  <div className="flex shrink-0 items-center gap-1.5">
                    <FileAction href={chartApi.fileUrl(file.id)} icon={ViewIcon} title="مشاهده" />
                    <FileAction
                      href={chartApi.fileUrl(file.id, { download: true })}
                      icon={Download04Icon}
                      title="دانلود"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function FileAction({
  href,
  icon,
  title,
}: {
  href: string;
  icon: typeof ViewIcon;
  title: string;
}) {
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
