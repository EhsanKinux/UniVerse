// Shared API types. These mirror the NestJS backend DTOs exactly
// (see univers-backend/src/auth/dto). Keep them in sync with the server.

/** The "safe" user shape returned by the API (no password / refresh hash). */
export interface User {
  id: string;
  email: string;
  name: string | null;
  /** ISO date string (a `Date` serialized over JSON). */
  createdAt: string;
}

/** Returned by POST /auth/register, /auth/login and /auth/refresh. */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

/** Body of POST /auth/login. */
export interface LoginPayload {
  email: string;
  password: string;
}

/** Body of POST /auth/register. `name` is optional on the backend. */
export interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
}

/** Shape of a NestJS error body (from HttpException / ValidationPipe). */
export interface ApiErrorBody {
  statusCode: number;
  /** A single message, or an array of validation messages. */
  message: string | string[];
  error?: string;
}

// -----------------------------------------------------------------------------
// Calendar (GET /calendar/active)
// -----------------------------------------------------------------------------
// Mirrors univers-backend/src/calendar/dto/active-calendar.dto.ts. Keep in sync
// with the server.

/** Event categories the PWA knows how to colour and filter. */
export type EventCategory = "registration" | "addDrop" | "exams" | "academic" | "holiday";

/** Where an event sits relative to today. */
export type EventStatus = "past" | "current" | "upcoming";

/** One calendar row, pre-formatted by the server so the client needs no date logic. */
export interface CalendarEvent {
  id: string;
  title: string;
  category: EventCategory;
  /** Who the event applies to, e.g. «ورودی ۴۰۲ و ماقبل». Null when it's for everyone. */
  cohort: string | null;
  description: string | null;
  /** Gregorian ISO date-only, e.g. "2026-02-15". */
  startDate: string;
  /** Gregorian ISO end date for ranges; null for a single day. */
  endDate: string | null;
  /** Ready-to-show Jalali label (single day or range), e.g. «۲۶ بهمن ۱۴۰۴». */
  dateLabel: string;
  /** Persian weekday of the start, e.g. «یکشنبه». */
  weekday: string;
  /** Jalali month + year for grouping, e.g. «بهمن ۱۴۰۴». */
  monthLabel: string;
  status: EventStatus;
  /** Whole days until the start; 0 if in progress, null if past. */
  daysUntil: number | null;
}

/** Lightweight header describing the active term. */
export interface ActiveSemester {
  id: string;
  title: string;
  subtitle: string | null;
}

/** Full payload of GET /calendar/active. */
export interface ActiveCalendar {
  semester: ActiveSemester;
  events: CalendarEvent[];
}

// -----------------------------------------------------------------------------
// Documents (GET /documents/:category)
// -----------------------------------------------------------------------------
// Mirrors univers-backend/src/documents/dto/document.dto.ts. Keep in sync with
// the server. These back staff-managed files (e.g. the «دروس ارائه‌شده» PDF).

/** One staff-managed file, pre-formatted by the server for display. */
export interface DocumentMeta {
  id: string;
  category: string;
  title: string;
  description: string | null;
  /** The original filename; the suggested name when downloaded. */
  originalName: string;
  mimeType: string;
  /** File size in bytes. */
  size: number;
  /** Ready-to-show Persian size, e.g. «۴٫۲ مگابایت». */
  sizeLabel: string;
  /** Page count when staff provided one; null otherwise. */
  pageCount: number | null;
  isActive: boolean;
  /** ISO timestamp of the last change. */
  updatedAt: string;
  /** Ready-to-show Persian date of the last change, e.g. «۳ تیر ۱۴۰۵». */
  updatedAtLabel: string;
}

/** Full payload of GET /documents/:category — the active file plus the archive. */
export interface CategoryDocuments {
  category: string;
  categoryLabel: string;
  active: DocumentMeta | null;
  archive: DocumentMeta[];
}

// -----------------------------------------------------------------------------
// News / announcements (GET /news, SSE GET /news/stream)
// -----------------------------------------------------------------------------
// Mirrors univers-backend/src/news/dto/news.dto.ts. Keep in sync with the server.

export type NewsCategory = "academic" | "services" | "student" | "general";

/** One news item, pre-formatted by the server for display. */
export interface NewsItem {
  id: string;
  title: string;
  /** Slug; widen to string so an unknown server category never breaks the type. */
  category: NewsCategory | string;
  /** Persian category label, e.g. «آموزشی». */
  categoryLabel: string;
  body: string;
  /** Optional "read more" link (internal route or external URL). */
  link: string | null;
  pinned: boolean;
  /** ISO publish timestamp. */
  publishedAt: string;
  /** Ready-to-show Persian date, e.g. «شنبه ۱۶ خرداد». */
  dateLabel: string;
}

/**
 * One frame from the SSE stream GET /news/stream. `created`/`updated` carry the
 * full item; `deleted` carries only its id; `ping` is a keep-alive to ignore.
 */
export type NewsStreamEvent =
  | { type: "created" | "updated"; item: NewsItem }
  | { type: "deleted"; id: string }
  | { type: "ping" };

// -----------------------------------------------------------------------------
// Weekly schedule (GET/POST/PATCH/DELETE /schedule/…) — authenticated
// -----------------------------------------------------------------------------
// Mirrors univers-backend/src/schedule/dto. Keep in sync with the server.

/** Session kind: نظری یا عملی. */
export type SessionType = "theory" | "practical";

/** Week parity of a session: every week, odd (فرد) weeks, or even (زوج) weeks. */
export type SessionParity = "all" | "odd" | "even";

/** Palette slugs the schedule UI can render. Mirrors the backend's COURSE_COLORS. */
export const COURSE_COLORS = [
  "teal",
  "sky",
  "violet",
  "amber",
  "rose",
  "emerald",
  "indigo",
  "fuchsia",
] as const;
export type CourseColor = (typeof COURSE_COLORS)[number];

/** One weekly meeting of a course. Times are "HH:mm" (Tehran wall clock). */
export interface CourseSession {
  id: string;
  /** 0 = شنبه … 5 = پنجشنبه. */
  dayOfWeek: number;
  start: string;
  end: string;
  room: string | null;
  type: SessionType;
  parity: SessionParity;
}

/** A course with its weekly sessions (sorted by day, then start time). */
export interface Course {
  id: string;
  name: string;
  professor: string | null;
  /** Palette slug; widen to string so an unknown server value never breaks the type. */
  color: CourseColor | string;
  sessions: CourseSession[];
}

export interface ScheduleSettings {
  remindersEnabled: boolean;
  reminderLeadMinutes: number;
  /** Parity of the current week in Tehran; null until the student declares it. */
  currentWeekParity: "odd" | "even" | null;
}

/** Full payload of GET /schedule. */
export interface WeeklySchedule {
  courses: Course[];
  settings: ScheduleSettings;
  /** Today in Tehran: 0 = شنبه … 6 = جمعه. */
  todayIndex: number;
}

/** Body of POST /schedule/courses and PATCH /schedule/courses/:id. */
export interface CourseFormPayload {
  name: string;
  professor?: string;
  color: string;
  sessions: {
    dayOfWeek: number;
    start: string;
    end: string;
    room?: string;
    type: SessionType;
    parity: SessionParity;
  }[];
}

/** Body of PATCH /schedule/settings — send only what changed. */
export interface ScheduleSettingsPayload {
  remindersEnabled?: boolean;
  reminderLeadMinutes?: number;
  /** Declare what THIS week is; the server derives its anchor date from it. */
  currentWeekParity?: "odd" | "even";
}
