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
