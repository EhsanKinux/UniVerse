'use client";'

import { useState } from "react";
import { ChevronDown, Download, FileText } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Department } from "@/lib/chart-data";
import { cn } from "@/lib/utils";

interface DepartmentCardProps {
  department: Department;
  index: number;
}

export function DepartmentCard({ department, index }: DepartmentCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={cn(
        "group overflow-hidden rounded-3xl border bg-surface-card shadow-sm backdrop-blur-xl transition-all duration-300",
        isOpen ? "border-border shadow-md" : "border-border hover:shadow-md",
      )}
      style={{
        animationDelay: `${index * 60}ms`,
        animation: "fadeInUp 0.5s ease-out both",
      }}
    >
      {/* Header - Clickable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-4 p-4 text-right transition-colors hover:bg-surface-dim/50"
      >
        {/* Icon */}
        <div
          className={cn(
            "flex size-14 shrink-0 items-center justify-center rounded-2xl border shadow-sm transition-transform duration-300",
            department.bgClass,
            department.borderClass,
            isOpen && "scale-105",
          )}
        >
          <span className="text-2xl">{department.icon}</span>
        </div>

        {/* Title & Count */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-text truncate">{department.title}</h3>
          <p className="mt-0.5 text-xs font-medium text-text-muted">{department.pdfs.length} چارت آموزشی</p>
        </div>

        {/* Chevron */}
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl border border-border bg-surface transition-all duration-300",
            isOpen && "rotate-180 bg-primary/10 border-primary/20",
          )}
        >
          <HugeiconsIcon
            icon={ChevronDown}
            className={cn("text-text-muted transition-colors", isOpen && "text-primary")}
          />
        </div>
      </button>

      {/* Content - Accordion */}
      <div className={cn("accordion-content", isOpen && "open")}>
        <div>
          <div className="border-t border-border-light px-4 pb-4 pt-3">
            <div className="space-y-2.5">
              {department.pdfs.map((pdf, pdfIndex) => (
                <a
                  key={pdfIndex}
                  href={pdf.url}
                  download={pdf.fileName}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border p-3.5 transition-all duration-200",
                    "bg-surface hover:bg-surface-dim",
                    "border-border-light hover:border-border",
                    "hover:shadow-sm active:scale-[0.98]",
                  )}
                >
                  {/* PDF Icon */}
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-xl border shadow-sm",
                      department.bgClass,
                      department.borderClass,
                    )}
                  >
                    <HugeiconsIcon icon={FileText} size={18} style={{ color: department.color }} />
                  </div>

                  {/* PDF Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-6 text-text">{pdf.title}</p>
                    {pdf.badge && (
                      <span
                        className={cn(
                          "mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium",
                          department.bgClass,
                        )}
                        style={{ color: department.color }}
                      >
                        {pdf.badge}
                      </span>
                    )}
                  </div>

                  {/* Download Icon */}
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all hover:bg-primary/20">
                    <HugeiconsIcon icon={Download} size={16} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
