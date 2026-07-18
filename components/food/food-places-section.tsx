"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { HugeiconsIcon } from "@hugeicons/react";
import { Location01Icon, RiceBowlIcon } from "@hugeicons/core-free-icons";

import { FoodPlaceCard } from "@/components/food/food-place-card";
import { EmptyState, ErrorState, SectionHeading } from "@/components/module/module-ui";
import { useFoodPlaces } from "@/hooks/food/use-food-places";
import { env } from "@/lib/env";
import { cn, toPersianDigits } from "@/lib/utils";

import type { MapPoint } from "./food-map";

// Leaflet touches `window` at import time, so the map must never be part of the
// server render (see the Next lazy-loading guide: `ssr: false` inside a client
// component).
const FoodMap = dynamic(() => import("./food-map").then((m) => m.FoodMap), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

const RADIUS_OPTIONS = [
  { value: 500, label: "۵۰۰ متر" },
  { value: 1500, label: "۱٫۵ کیلومتر" },
  { value: 3000, label: "۳ کیلومتر" },
] as const;

/** How many cards show before the «نمایش بیشتر» button. */
const LIST_PREVIEW_COUNT = 8;

type LocationState = "locating" | "granted" | "fallback";

interface LocationResult {
  center: MapPoint;
  user: MapPoint | null;
  state: Exclude<LocationState, "locating">;
}

/** Try the browser's geolocation; settle on the campus fallback when it's
 *  missing, denied, or times out. Always resolves — never rejects. */
function resolveLocation(): Promise<LocationResult> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve({ center: env.campusCenter, user: null, state: "fallback" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const point = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        resolve({ center: point, user: point, state: "granted" });
      },
      () => resolve({ center: env.campusCenter, user: null, state: "fallback" }),
      { timeout: 8000, maximumAge: 5 * 60_000 },
    );
  });
}

/**
 * The «خوراکی‌های اطراف» section: an OSM map + place list fed live from the
 * backend's Overpass proxy. Centres on the user's location when they grant it,
 * otherwise falls back to the campus coordinates from the environment. The pin
 * on the map and the card in the list select each other.
 */
export function FoodPlacesSection() {
  const [center, setCenter] = useState<MapPoint | null>(null);
  const [userLocation, setUserLocation] = useState<MapPoint | null>(null);
  const [locationState, setLocationState] = useState<LocationState>("locating");
  const [radius, setRadius] = useState<number>(1500);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  // All state updates happen inside geolocation/promise callbacks — never
  // synchronously in the effect body (the repo lint forbids setState-in-effect).
  const requestLocation = useCallback(() => {
    void resolveLocation().then((result) => {
      setUserLocation(result.user);
      setCenter(result.center);
      setLocationState(result.state);
    });
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const { data: places, isLoading, isError, refetch } = useFoodPlaces(center, radius);

  // The filter chips only offer categories that actually exist in the results.
  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    for (const place of places ?? []) {
      if (!seen.has(place.category)) seen.set(place.category, place.categoryLabel);
    }
    return [...seen.entries()].map(([value, label]) => ({ value, label }));
  }, [places]);

  const filtered = useMemo(() => {
    const all = places ?? [];
    return categoryFilter ? all.filter((p) => p.category === categoryFilter) : all;
  }, [places, categoryFilter]);

  const visible = expanded ? filtered : filtered.slice(0, LIST_PREVIEW_COUNT);

  // Selecting a pin on the map scrolls its card into view.
  const cardRefs = useRef(new Map<string, HTMLDivElement>());
  const selectFromMap = useCallback((id: string) => {
    setSelectedId(id);
    setExpanded(true);
    // Wait a frame so a card hidden behind «نمایش بیشتر» exists before scrolling.
    requestAnimationFrame(() => {
      cardRefs.current.get(id)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  }, []);

  return (
    <section className="space-y-3">
      <SectionHeading
        title="خوراکی‌های اطراف"
        subtitle="رستوران‌ها، کافه‌ها و فروشگاه‌های نزدیک شما — به‌صورت زنده از OpenStreetMap"
        action={
          <button
            onClick={() => {
              // Event handler, so the immediate feedback state is fine here.
              setLocationState("locating");
              requestLocation();
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card/70 px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary active:scale-95"
          >
            <HugeiconsIcon icon={Location01Icon} size={14} />
            موقعیت من
          </button>
        }
      />

      {/* Where the search is centred + the radius selector */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <p className="text-xs text-muted-foreground">
          {locationState === "locating"
            ? "در حال یافتن موقعیت شما…"
            : locationState === "granted"
              ? "بر اساس موقعیت فعلی شما"
              : "اطراف دانشگاه (دسترسی موقعیت داده نشد)"}
        </p>
        <div className="flex gap-1.5">
          {RADIUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setRadius(option.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all active:scale-95",
                radius === option.value
                  ? "border-primary/20 bg-primary/12 text-primary"
                  : "border-border bg-card/70 text-muted-foreground hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {center === null ? (
        <MapSkeleton />
      ) : (
        <FoodMap
          center={center}
          userLocation={userLocation}
          radius={radius}
          places={filtered}
          selectedId={selectedId}
          onSelect={selectFromMap}
        />
      )}

      {/* Category filter chips (only once results exist) */}
      {categories.length > 1 && (
        <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden">
          <FilterChip
            label="همه"
            active={categoryFilter === null}
            onClick={() => setCategoryFilter(null)}
          />
          {categories.map((category) => (
            <FilterChip
              key={category.value}
              label={category.label}
              active={categoryFilter === category.value}
              onClick={() =>
                setCategoryFilter(categoryFilter === category.value ? null : category.value)
              }
            />
          ))}
        </div>
      )}

      {isLoading || center === null ? (
        <ListSkeleton />
      ) : isError ? (
        <ErrorState
          title="دریافت مکان‌های اطراف ناموفق بود"
          subtitle="اتصال به OpenStreetMap برقرار نشد. کمی بعد دوباره تلاش کنید."
          onRetry={() => {
            refetch();
          }}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={RiceBowlIcon}
          title="جایی در این شعاع پیدا نشد"
          subtitle="شعاع جستجو را بزرگ‌تر کنید یا فیلتر دسته را بردارید."
        />
      ) : (
        <>
          <div className="grid gap-2.5 md:grid-cols-2">
            {visible.map((place) => (
              <div
                key={place.id}
                ref={(node) => {
                  if (node) cardRefs.current.set(place.id, node);
                  else cardRefs.current.delete(place.id);
                }}
              >
                <FoodPlaceCard
                  place={place}
                  selected={place.id === selectedId}
                  onSelect={() => setSelectedId(place.id)}
                />
              </div>
            ))}
          </div>

          {!expanded && filtered.length > LIST_PREVIEW_COUNT && (
            <button
              onClick={() => setExpanded(true)}
              className="w-full rounded-2xl border border-dashed border-border bg-card/40 py-3 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              نمایش {toPersianDigits(filtered.length - LIST_PREVIEW_COUNT)} مکان دیگر
            </button>
          )}
        </>
      )}
    </section>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all active:scale-95",
        active
          ? "border-primary/20 bg-primary/12 text-primary"
          : "border-border bg-card/70 text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

function MapSkeleton() {
  return (
    <div className="h-72 w-full animate-pulse rounded-3xl border border-border bg-card/50 md:h-96" />
  );
}

function ListSkeleton() {
  return (
    <div className="grid gap-2.5 md:grid-cols-2">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-24 animate-pulse rounded-2xl border border-border bg-card/50" />
      ))}
    </div>
  );
}
