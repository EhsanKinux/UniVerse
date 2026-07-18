"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  ArrowUpRight01Icon,
  Call02Icon,
  Clock01Icon,
  Location04Icon,
} from "@hugeicons/core-free-icons";

import { Badge } from "@/components/ui/badge";
import type { FoodPlace } from "@/lib/api/types";
import { cn } from "@/lib/utils";

/** Emoji per place category — matches CATEGORY_MARKERS in food-map.tsx. */
const CATEGORY_EMOJI: Record<string, string> = {
  restaurant: "🍽️",
  fast_food: "🍔",
  cafe: "☕",
  food_court: "🍱",
  ice_cream: "🍦",
  bakery: "🥖",
  confectionery: "🍰",
  supermarket: "🛒",
  other: "🍴",
};

/** Universal cross-platform directions link (opens the native maps app when one
 *  claims the URL, the web map otherwise). */
function directionsUrl(place: FoodPlace): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
}

/** A Snappfood search deep link for ordering — OSM has no delivery ids, so the
 *  best stable jump-off is a name search. */
function snappfoodUrl(place: FoodPlace): string {
  return `https://snappfood.ir/search?query=${encodeURIComponent(place.name)}`;
}

/**
 * One nearby place in the list under the map. Tapping the card selects its pin;
 * the action buttons are real links (call / route / order) and stop propagation
 * so they don't retrigger selection.
 */
export function FoodPlaceCard({
  place,
  selected,
  onSelect,
}: {
  place: FoodPlace;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "cursor-pointer rounded-2xl border bg-card/70 p-3.5 text-right transition-all",
        selected
          ? "border-primary/40 bg-primary/5 shadow-sm ring-2 ring-primary/10"
          : "border-border hover:border-primary/20",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/50 text-xl">
          {CATEGORY_EMOJI[place.category] ?? CATEGORY_EMOJI.other}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-bold text-foreground">{place.name}</p>
            <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
              {place.distanceLabel}
            </span>
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <Badge variant="soft" className="px-2 py-0.5 text-[10px]">
              {place.categoryLabel}
            </Badge>
            {place.openNow !== null && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                  place.openNow
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    place.openNow ? "bg-emerald-500" : "bg-rose-500",
                  )}
                />
                {place.openNow ? "باز است" : "بسته است"}
              </span>
            )}
            {place.openingHours && (
              <span
                dir="ltr"
                className="inline-flex items-center gap-1 text-[10px] text-muted-foreground"
                title="ساعات کاری (OpenStreetMap)"
              >
                <HugeiconsIcon icon={Clock01Icon} size={11} />
                {place.openingHours}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <ActionLink href={directionsUrl(place)} icon={Location04Icon} label="مسیریابی" />
        {place.phone && <ActionLink href={`tel:${place.phone}`} icon={Call02Icon} label="تماس" />}
        <ActionLink href={snappfoodUrl(place)} icon={ArrowUpRight01Icon} label="اسنپ‌فود" />
        {place.website && (
          <ActionLink href={place.website} icon={ArrowUpRight01Icon} label="وب‌سایت" />
        )}
      </div>
    </div>
  );
}

function ActionLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: IconSvgElement;
  label: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("tel:") ? undefined : "_blank"}
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary active:scale-95"
    >
      <HugeiconsIcon icon={icon} size={13} />
      {label}
    </a>
  );
}
