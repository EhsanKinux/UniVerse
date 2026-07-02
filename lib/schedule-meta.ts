import type { Course, CourseSession, SessionParity, SessionType } from "@/lib/api/types";

// Presentation metadata + tiny time helpers for the weekly schedule. The API
// sends only slugs ("teal", "theory", "odd"); the labels and Tailwind classes
// live here so the front end owns its own look.

// -----------------------------------------------------------------------------
// Week days (Saturday–Thursday university week)
// -----------------------------------------------------------------------------

export interface WeekDay {
  /** API index: 0 = شنبه … 5 = پنجشنبه. */
  index: number;
  label: string;
  short: string;
}

export const WEEK_DAYS: WeekDay[] = [
  { index: 0, label: "شنبه", short: "ش" },
  { index: 1, label: "یکشنبه", short: "ی" },
  { index: 2, label: "دوشنبه", short: "د" },
  { index: 3, label: "سه‌شنبه", short: "س" },
  { index: 4, label: "چهارشنبه", short: "چ" },
  { index: 5, label: "پنجشنبه", short: "پ" },
];

// -----------------------------------------------------------------------------
// Course colour palette
// -----------------------------------------------------------------------------
// Tailwind can only ship classes it SEES as literals, so each palette entry
// spells out its full class strings (no string interpolation).

export interface CourseTone {
  /** Solid swatch for the colour picker. */
  swatch: string;
  /** Timetable block: soft fill + readable text + border. */
  block: string;
  /** Accent text (icons, time rail). */
  text: string;
  /** Soft chip for badges tinted by the course colour. */
  chip: string;
}

export const COURSE_TONES: Record<string, CourseTone> = {
  teal: {
    swatch: "bg-teal-500",
    block: "bg-teal-500/15 border-teal-500/30 text-teal-700 dark:text-teal-300",
    text: "text-teal-600 dark:text-teal-300",
    chip: "bg-teal-500/10 text-teal-700 dark:text-teal-300",
  },
  sky: {
    swatch: "bg-sky-500",
    block: "bg-sky-500/15 border-sky-500/30 text-sky-700 dark:text-sky-300",
    text: "text-sky-600 dark:text-sky-300",
    chip: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  },
  violet: {
    swatch: "bg-violet-500",
    block: "bg-violet-500/15 border-violet-500/30 text-violet-700 dark:text-violet-300",
    text: "text-violet-600 dark:text-violet-300",
    chip: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  },
  amber: {
    swatch: "bg-amber-500",
    block: "bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-300",
    text: "text-amber-600 dark:text-amber-300",
    chip: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  rose: {
    swatch: "bg-rose-500",
    block: "bg-rose-500/15 border-rose-500/30 text-rose-700 dark:text-rose-300",
    text: "text-rose-600 dark:text-rose-300",
    chip: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  },
  emerald: {
    swatch: "bg-emerald-500",
    block: "bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300",
    text: "text-emerald-600 dark:text-emerald-300",
    chip: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  indigo: {
    swatch: "bg-indigo-500",
    block: "bg-indigo-500/15 border-indigo-500/30 text-indigo-700 dark:text-indigo-300",
    text: "text-indigo-600 dark:text-indigo-300",
    chip: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  },
  fuchsia: {
    swatch: "bg-fuchsia-500",
    block: "bg-fuchsia-500/15 border-fuchsia-500/30 text-fuchsia-700 dark:text-fuchsia-300",
    text: "text-fuchsia-600 dark:text-fuchsia-300",
    chip: "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300",
  },
};

/** Look up a course tone, tolerating an unknown slug from the server. */
export function courseTone(color: string): CourseTone {
  return COURSE_TONES[color] ?? COURSE_TONES.teal;
}

// -----------------------------------------------------------------------------
// Labels
// -----------------------------------------------------------------------------

export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  theory: "نظری",
  practical: "عملی",
};

export const PARITY_LABELS: Record<SessionParity, string> = {
  all: "هر هفته",
  odd: "هفته فرد",
  even: "هفته زوج",
};

/** Short badge for parity-limited sessions, e.g. «ف» / «ز». */
export const PARITY_SHORT: Record<Exclude<SessionParity, "all">, string> = {
  odd: "ف",
  even: "ز",
};

// -----------------------------------------------------------------------------
// Time helpers
// -----------------------------------------------------------------------------

/** "10:05" → 605 minutes from midnight. */
export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":");
  return Number(h) * 60 + Number(m);
}

/** Latin digits → Persian digits, keeping everything else (e.g. ":") intact. */
export function faDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

/** Total weekly hours of a session list, as a Persian label like «۱۴٫۵». */
export function weeklyHoursLabel(sessions: { start: string; end: string }[]): string {
  const minutes = sessions.reduce((sum, s) => sum + (toMinutes(s.end) - toMinutes(s.start)), 0);
  const hours = minutes / 60;
  return hours.toLocaleString("fa-IR", { maximumFractionDigits: 1 });
}

// -----------------------------------------------------------------------------
// Derived shapes
// -----------------------------------------------------------------------------

/** A session flattened together with its parent course — what the views render. */
export interface FlatSession extends CourseSession {
  course: Course;
}

/** All sessions of all courses, flattened and sorted by day then start time. */
export function flattenSessions(courses: Course[]): FlatSession[] {
  return courses
    .flatMap((course) => course.sessions.map((session) => ({ ...session, course })))
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek || toMinutes(a.start) - toMinutes(b.start));
}

/**
 * Whether a session is shown under the given parity view. "all" view shows
 * everything; a specific week view hides the opposite parity's sessions.
 */
export function matchesParity(session: CourseSession, view: SessionParity): boolean {
  return view === "all" || session.parity === "all" || session.parity === view;
}
