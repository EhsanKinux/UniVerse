"use client";

import { useState } from "react";
import { ArrowDown01Icon, Download01Icon, File01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Department } from "@/lib/chart-data";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DepartmentCardProps {
  department: Department;
  index: number;
}

export function DepartmentCard({ department, index }: DepartmentCardProps) {
  const [isOpen, setIsOpen] = useState(false);

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
            department.bgClass,
            department.borderClass,
            isOpen && "scale-105",
          )}
        >
          <span className="text-2xl">{department.icon}</span>
        </div>

        {/* Title & Count */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold text-foreground">{department.title}</h3>
          <p className="mt-0.5 text-xs font-medium text-muted-foreground">{department.pdfs.length} چارت آموزشی</p>
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
              {department.pdfs.map((pdf, pdfIndex) => (
                <a
                  key={pdfIndex}
                  href={pdf.url}
                  download={pdf.fileName}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border border-border bg-background p-3.5",
                    "transition-all duration-200 hover:bg-muted/50 hover:shadow-sm active:scale-[0.98]",
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
                    <HugeiconsIcon icon={File01Icon} size={18} style={{ color: department.color }} />
                  </div>

                  {/* PDF Info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-6 text-foreground">{pdf.title}</p>
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
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary/15">
                    <HugeiconsIcon icon={Download01Icon} size={16} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
