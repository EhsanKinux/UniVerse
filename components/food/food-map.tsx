"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./food-map.css";

import type { FoodPlace } from "@/lib/api/types";
import { cn } from "@/lib/utils";

/**
 * The Leaflet map behind the «خوراکی‌های اطراف» section. Deliberately a thin,
 * imperative wrapper around plain Leaflet (no react-leaflet — one less peer
 * dependency, and this is the app's only map). It is client-only: the parent
 * imports it with `next/dynamic` + `ssr: false`, because Leaflet touches
 * `window` at import time.
 *
 * Pins are emoji `divIcon`s (self-contained — no marker-image assets to serve),
 * colour-coded per category, with the selected place enlarged. Selection flows
 * BOTH ways: tapping a pin calls `onSelect`, and a `selectedId` change from the
 * card list pans the map to that pin.
 */

export interface MapPoint {
  lat: number;
  lng: number;
}

interface FoodMapProps {
  /** The search centre (user location or campus fallback). */
  center: MapPoint;
  /** The user's actual location, when granted — shown as a pulsing blue dot. */
  userLocation: MapPoint | null;
  /** The search radius in metres, drawn as a dashed circle around the centre. */
  radius: number;
  places: FoodPlace[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  className?: string;
}

/** Emoji + accent colour per normalised place category (must cover every slug
 *  the backend's FoodPlacesService can emit). */
const CATEGORY_MARKERS: Record<string, { emoji: string; color: string }> = {
  restaurant: { emoji: "🍽️", color: "#ea580c" },
  fast_food: { emoji: "🍔", color: "#dc2626" },
  cafe: { emoji: "☕", color: "#92400e" },
  food_court: { emoji: "🍱", color: "#c026d3" },
  ice_cream: { emoji: "🍦", color: "#0284c7" },
  bakery: { emoji: "🥖", color: "#ca8a04" },
  confectionery: { emoji: "🍰", color: "#db2777" },
  supermarket: { emoji: "🛒", color: "#16a34a" },
  other: { emoji: "🍴", color: "#64748b" },
};

function markerIcon(place: FoodPlace, selected: boolean): L.DivIcon {
  const { emoji, color } = CATEGORY_MARKERS[place.category] ?? CATEGORY_MARKERS.other;
  const size = selected ? 44 : 34;
  // Inline styles only: divIcon HTML lives outside the React tree, so Tailwind
  // classes generated at build time can't be relied on here.
  const html = `
    <div style="
      width:${size}px;height:${size}px;border-radius:9999px;
      display:flex;align-items:center;justify-content:center;
      background:#fff;border:2.5px solid ${color};
      box-shadow:0 2px 8px rgba(0,0,0,${selected ? 0.35 : 0.2})${selected ? `,0 0 0 4px ${color}33` : ""};
      font-size:${selected ? 22 : 17}px;line-height:1;
      transition:all .15s ease;
    ">${emoji}</div>`;
  return L.divIcon({
    html,
    className: "", // drop Leaflet's default white-square divIcon chrome
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const USER_DOT_ICON = L.divIcon({
  html: `
    <div class="food-map-user-dot" style="
      width:16px;height:16px;border-radius:9999px;
      background:#3b82f6;border:2.5px solid #fff;
      box-shadow:0 1px 6px rgba(0,0,0,.35);
    "></div>`,
  className: "",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

/** Zoom that comfortably frames the given radius on a phone screen. */
function zoomForRadius(radius: number): number {
  if (radius <= 600) return 16;
  if (radius <= 1500) return 15;
  if (radius <= 3000) return 14;
  return 13;
}

export function FoodMap({
  center,
  userLocation,
  radius,
  places,
  selectedId,
  onSelect,
  className,
}: FoodMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef(new Map<string, L.Marker>());
  const circleRef = useRef<L.Circle | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // The click handler lives in a ref so marker rebuilds never depend on its
  // identity (a new callback each render must not churn the map).
  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  // ---- Create the map once ----
  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;

    const markers = markersRef.current;
    const map = L.map(container, {
      center: [center.lat, center.lng],
      zoom: zoomForRadius(radius),
      // The page scrolls; a stray two-finger pan shouldn't hijack it badly, but
      // normal touch-drag panning stays on.
      scrollWheelZoom: false,
    });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    mapRef.current = map;

    // The map often mounts inside a container that is still animating/layouting;
    // re-measure whenever the box changes so tiles don't render half-blank.
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(container);

    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
      markers.clear();
      circleRef.current = null;
      userMarkerRef.current = null;
    };
    // Initial view only — later center/radius changes are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Follow the search centre + radius ----
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setView([center.lat, center.lng], zoomForRadius(radius));

    if (circleRef.current) circleRef.current.remove();
    circleRef.current = L.circle([center.lat, center.lng], {
      radius,
      color: "#f97316",
      weight: 1.5,
      dashArray: "6 8",
      fillColor: "#f97316",
      fillOpacity: 0.05,
      interactive: false,
    }).addTo(map);
  }, [center.lat, center.lng, radius]);

  // ---- The user's own location dot ----
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
    if (userLocation) {
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: USER_DOT_ICON,
        interactive: false,
        // Above the place pins, so it never hides behind them.
        zIndexOffset: 1000,
      }).addTo(map);
    }
  }, [userLocation]);

  // ---- Place pins (rebuilt on data or selection change; ≤60 markers) ----
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    for (const marker of markersRef.current.values()) marker.remove();
    markersRef.current.clear();

    for (const place of places) {
      const selected = place.id === selectedId;
      const marker = L.marker([place.lat, place.lng], {
        icon: markerIcon(place, selected),
        // Selected pin on top of its neighbours.
        zIndexOffset: selected ? 500 : 0,
      })
        .on("click", () => onSelectRef.current(place.id))
        .addTo(map);
      markersRef.current.set(place.id, marker);
    }
  }, [places, selectedId]);

  // ---- Pan to a selection made from the card list ----
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    const place = places.find((p) => p.id === selectedId);
    if (place) {
      map.panTo([place.lat, place.lng], { animate: true });
    }
  }, [selectedId, places]);

  return (
    <div
      ref={containerRef}
      dir="ltr" // Leaflet's controls/attribution assume LTR layout
      className={cn("z-0 h-72 w-full overflow-hidden rounded-3xl border border-border md:h-96", className)}
      role="application"
      aria-label="نقشهٔ خوراکی‌های اطراف"
    />
  );
}
