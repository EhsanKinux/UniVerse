"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpRight01Icon,
  Calendar03Icon,
  Download04Icon,
  Pdf01Icon,
  RiceBowlIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";

import { EmptyState } from "@/components/module/module-ui";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { foodApi } from "@/lib/api/food.api";
import type { FoodMenu } from "@/lib/api/types";
import { systems } from "@/lib/data/systems-data";

/** The official reservation system's link (رزرو ژتون stays outside this app). */
const foodSystem = systems.find((s) => s.id === "food");

/**
 * The «منوی این هفته» card: the staff-uploaded menu file. Images render inline
 * (that's how most menus arrive — a photographed/exported table); PDFs get a
 * view/download row. Below it, a link out to the official اتوماسیون تغذیه for
 * the actual reservation, which this app cannot integrate with.
 */
export function FoodMenuCard({ menu }: { menu: FoodMenu | null }) {
  if (!menu) {
    return (
      <div className="space-y-3">
        <EmptyState
          icon={RiceBowlIcon}
          title="منوی این هفته هنوز بارگذاری نشده"
          subtitle="به‌محض بارگذاری توسط امور تغذیه، اینجا نمایش داده می‌شود."
        />
        <ReservationLink />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Card className="overflow-hidden p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl border border-border bg-background text-primary">
              <HugeiconsIcon icon={RiceBowlIcon} size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                {menu.weekLabel ? `منوی ${menu.weekLabel}` : "منوی این هفته"}
              </h3>
              <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <HugeiconsIcon icon={Calendar03Icon} size={12} />
                بروزرسانی: {menu.dateLabel}
              </p>
            </div>
          </div>
          <Badge variant="success" className="px-2.5 py-0.5 text-[11px]">
            جدید
          </Badge>
        </div>

        <div className="mt-3">
          {menu.isImage ? (
            <MenuImage menu={menu} />
          ) : (
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-3.5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/50 text-primary">
                <HugeiconsIcon icon={Pdf01Icon} size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <p dir="ltr" className="truncate text-right text-sm font-semibold text-foreground">
                  {menu.originalName}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{menu.sizeLabel}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 flex gap-2">
          <a
            href={foodApi.menuFileUrl(menu.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary text-xs font-bold text-primary-foreground shadow-sm transition-all hover:brightness-95 active:scale-[0.98]"
          >
            <HugeiconsIcon icon={ViewIcon} size={15} />
            مشاهدهٔ کامل
          </a>
          <a
            href={foodApi.menuFileUrl(menu.id, { download: true })}
            className="flex h-10 items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary active:scale-[0.98]"
          >
            <HugeiconsIcon icon={Download04Icon} size={15} />
            دانلود
          </a>
        </div>
      </Card>

      <ReservationLink />
    </div>
  );
}

/** Inline preview of an image menu; hides itself on load failure so the card
 *  still offers the view/download buttons. */
function MenuImage({ menu }: { menu: FoodMenu }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-muted">
      {/* eslint-disable-next-line @next/next/no-img-element -- backend-served image; next/image would need remotePatterns for the dynamic API host */}
      <img
        src={foodApi.menuFileUrl(menu.id)}
        alt={menu.weekLabel ? `منوی ${menu.weekLabel}` : "منوی این هفته"}
        loading="lazy"
        className="max-h-[420px] w-full object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

/** «رزرو غذا» lives in the university's own system; link out to it. */
function ReservationLink() {
  if (!foodSystem) return null;
  return (
    <a
      href={foodSystem.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card/70 p-3.5 transition-colors hover:border-primary/25"
    >
      <div className="min-w-0">
        <p className="text-sm font-bold text-foreground">رزرو غذا در {foodSystem.title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          رزرو و خرید ژتون فقط از سامانهٔ رسمی دانشگاه انجام می‌شود.
        </p>
      </div>
      <HugeiconsIcon icon={ArrowUpRight01Icon} size={18} className="shrink-0 text-muted-foreground" />
    </a>
  );
}
