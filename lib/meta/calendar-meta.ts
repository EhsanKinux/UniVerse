import type { EventCategory, EventStatus } from "@/lib/api/types";

/**
 * Presentation metadata for the calendar. The API sends only the category key
 * and a status; the labels, accent colours and timeline styling live here so the
 * front end owns its own look. Category keys mirror the backend's
 * `EVENT_CATEGORIES` (see univers-backend/src/calendar/dto).
 */
export const eventCategories: Record<EventCategory, { label: string; color: string }> = {
  registration: { label: "انتخاب واحد", color: "var(--color-mechanical)" },
  addDrop: { label: "حذف و اضافه", color: "var(--color-electrical)" },
  exams: { label: "امتحانات", color: "var(--color-biomedical)" },
  holiday: { label: "تعطیلات", color: "var(--color-chemical)" },
  academic: { label: "آموزشی", color: "var(--color-computer)" },
};

const fallbackCategory = { label: "رویداد", color: "var(--color-primary)" } as const;

/** Look up a category's label + colour, tolerating an unknown key from the server. */
export function categoryMeta(category: string): { label: string; color: string } {
  return eventCategories[category as EventCategory] ?? fallbackCategory;
}

/** Timeline node + label styling per event status. */
export const statusStyles: Record<EventStatus, { label: string; dot: string; ring: string }> = {
  past: { label: "برگزار شد", dot: "bg-muted-foreground/40", ring: "border-border" },
  current: { label: "در جریان", dot: "bg-emerald-500", ring: "border-emerald-500/40" },
  upcoming: { label: "پیش‌رو", dot: "bg-primary", ring: "border-primary/30" },
};
