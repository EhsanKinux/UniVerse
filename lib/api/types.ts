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

// -----------------------------------------------------------------------------
// Profile (GET/PATCH /profile, avatar upload) — authenticated
// -----------------------------------------------------------------------------
// Mirrors univers-backend/src/profile/dto. Keep in sync with the server.

export type ProfileGender = "male" | "female";
export type ProfileDegree = "associate" | "bachelor" | "master" | "phd";

/** The level tier a student reaches from their score. */
export interface ProfileLevel {
  key: string;
  label: string;
}

/** Score / completion summary — drives the ring, point badge and level. */
export interface ProfileCompletion {
  score: number;
  maxScore: number;
  /** 0-100. */
  percent: number;
  filledCount: number;
  totalCount: number;
  level: ProfileLevel;
  /** Which scored fields are complete, keyed by scored-field id. */
  filled: Record<string, boolean>;
}

/** Full payload of GET /profile — identity + profile fields + completion. */
export interface ProfileData {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;

  // personal
  phone: string | null;
  nationalId: string | null;
  birthDate: string | null;
  gender: string | null;
  province: string | null;
  city: string | null;

  // academic
  studentId: string | null;
  major: string | null;
  faculty: string | null;
  degree: string | null;
  entryYear: number | null;
  advisor: string | null;

  // bio & emergency
  bio: string | null;
  emergencyName: string | null;
  emergencyPhone: string | null;
  telegram: string | null;

  /** Relative URL (with a cache-busting ?v=) to stream the avatar, or null. */
  avatarUrl: string | null;

  completion: ProfileCompletion;
}

/**
 * Body of PATCH /profile — send only what changed. `null` (or "") clears a field
 * and its points; omit a field to leave it unchanged.
 */
export interface UpdateProfilePayload {
  name?: string | null;
  phone?: string | null;
  nationalId?: string | null;
  birthDate?: string | null;
  gender?: string | null;
  province?: string | null;
  city?: string | null;
  studentId?: string | null;
  major?: string | null;
  faculty?: string | null;
  degree?: string | null;
  entryYear?: number | null;
  advisor?: string | null;
  bio?: string | null;
  emergencyName?: string | null;
  emergencyPhone?: string | null;
  telegram?: string | null;
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
// Educational chart / چارت آموزشی (GET /chart)
// -----------------------------------------------------------------------------
// Mirrors univers-backend/src/chart/dto/chart.dto.ts. Keep in sync with the
// server. A department (رشته) carries one or more downloadable chart PDFs.

/** One downloadable chart PDF. Build its URL with `chartApi.fileUrl(id)`. */
export interface ChartFile {
  id: string;
  title: string;
  /** Optional era/entry-year pill, e.g. «قبل ۱۴۰۳». Null when none. */
  badge: string | null;
  /** The original filename; the suggested name when downloaded. */
  originalName: string;
  mimeType: string;
  /** File size in bytes. */
  size: number;
  /** Ready-to-show Persian size, e.g. «۵۰۰ کیلوبایت». */
  sizeLabel: string;
}

/** One department with its chart PDFs — the shape the PWA renders as a card. */
export interface ChartDepartment {
  id: string;
  /** Stable colour-token key + React list key, e.g. "computer". */
  slug: string;
  title: string;
  /** Emoji shown in the card avatar, e.g. "💻". */
  icon: string;
  /** Colour slug; widen to string so an unknown server value never breaks the type. */
  color: string;
  files: ChartFile[];
}

// -----------------------------------------------------------------------------
// Phone book / شماره‌های دانشگاه (GET /phone-book)
// -----------------------------------------------------------------------------
// Mirrors univers-backend/src/phone-book/dto/phone-book.dto.ts. Keep in sync with
// the server. A contact group (واحد) carries one or more phone numbers.

/** One phone number in the directory. */
export interface PhoneContact {
  id: string;
  name: string;
  /** The number exactly as staff typed it; used verbatim in a `tel:` link. */
  phone: string;
  /** Optional internal extension, shown as «داخلی ۲۱۵». Null when none. */
  ext: string | null;
  /** Optional one-line note shown under the name. Null when none. */
  note: string | null;
  /** Optional email, rendered as a mailto link. Null when none. */
  email: string | null;
}

/** One group with its numbers — the shape the PWA renders as a titled card. */
export interface PhoneBookGroup {
  id: string;
  title: string;
  /** Icon key; widen to string so an unknown server value never breaks the type. */
  icon: string;
  contacts: PhoneContact[];
}

// -----------------------------------------------------------------------------
// Groups & channels / گروه‌ها (GET /groups)
// -----------------------------------------------------------------------------
// Mirrors univers-backend/src/groups/dto/groups.dto.ts. Keep in sync with the
// server. A three-level tree: category → group card → join option.

/** How to join a group. One payload field is meaningful per kind (see below). */
export type GroupLinkKind = "link" | "handle" | "qr";

/**
 * One way to join a group:
 *   • kind="link"   → `url` is set (open it).
 *   • kind="handle" → `handle` is set (tap to copy an @id / invite code).
 *   • kind="qr"     → `hasQr` is true; show the image from `groupsApi.qrUrl(id)`.
 */
export interface GroupLink {
  id: string;
  /** Widen to string so an unknown server kind never breaks the type. */
  kind: GroupLinkKind | string;
  /** Optional button label; null → the PWA uses a default per kind. */
  label: string | null;
  url: string | null;
  handle: string | null;
  hasQr: boolean;
}

/** One joinable group/channel — the shape the PWA renders as a card. */
export interface Group {
  id: string;
  title: string;
  description: string | null;
  /** Free-text platform badge staff typed (e.g. «تلگرام»); null → no badge. */
  platform: string | null;
  links: GroupLink[];
}

/** One category with its group cards — a titled section on the PWA. */
export interface GroupCategory {
  id: string;
  title: string;
  groups: Group[];
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
  /** Whether this item has a cover image (stream it via `newsApi.coverUrl`). */
  hasCover: boolean;
  /** How many files are attached to this item. */
  attachmentCount: number;
}

/** One file attached to a news item. Build its URL with `newsApi.attachmentUrl(id)`. */
export interface NewsAttachment {
  id: string;
  /** Original filename; the suggested name when downloaded. */
  originalName: string;
  mimeType: string;
  /** File size in bytes. */
  size: number;
  /** Ready-to-show Persian size, e.g. «۵۰۰ کیلوبایت». */
  sizeLabel: string;
}

/** Full payload of GET /news/:id — the list fields plus the attachments list. */
export interface NewsDetail extends NewsItem {
  attachments: NewsAttachment[];
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
// Dormitory / خوابگاه (GET /dorm, SSE GET /dorm/announcements/stream)
// -----------------------------------------------------------------------------
// Mirrors univers-backend/src/dorm/dto/dorm.dto.ts. Keep in sync with the server.

export type DormAnnouncementCategory =
  | "general"
  | "facility"
  | "financial"
  | "event"
  | "maintenance";

/** One dorm announcement, pre-formatted by the server for display. Deliberately
 *  the SAME shape as NewsItem so it can flow through the shared notification UI. */
export interface DormAnnouncement {
  id: string;
  title: string;
  /** Slug; widen to string so an unknown server category never breaks the type. */
  category: DormAnnouncementCategory | string;
  categoryLabel: string;
  body: string;
  link: string | null;
  pinned: boolean;
  publishedAt: string;
  dateLabel: string;
  /** Whether this item has a cover image (stream it via `dormApi.coverUrl`). */
  hasCover: boolean;
  attachmentCount: number;
}

/** One file attached to a dorm announcement. Build its URL with `dormApi.attachmentUrl(id)`. */
export interface DormAnnouncementAttachment {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  sizeLabel: string;
}

/** Full payload of GET /dorm/announcements/:id — the list fields plus files. */
export interface DormAnnouncementDetail extends DormAnnouncement {
  attachments: DormAnnouncementAttachment[];
}

/** One rule or facility row (the قوانین/امکانات lists share this shape). */
export interface DormInfoItem {
  id: string;
  title: string;
  /** Optional secondary line (hours / elaboration). */
  detail: string | null;
}

/** One downloadable dorm form. Build its URL with `dormApi.formFileUrl(id)`. */
export interface DormForm {
  id: string;
  title: string;
  description: string | null;
  originalName: string;
  mimeType: string;
  size: number;
  sizeLabel: string;
}

/** Full payload of GET /dorm — the whole خوابگاه hub in one call. */
export interface DormHub {
  announcements: DormAnnouncement[];
  rules: DormInfoItem[];
  facilities: DormInfoItem[];
  forms: DormForm[];
}

/**
 * One frame from the SSE stream GET /dorm/announcements/stream. `created`/`updated`
 * carry the full item; `deleted` carries only its id; `ping` is a keep-alive.
 */
export type DormStreamEvent =
  | { type: "created" | "updated"; item: DormAnnouncement }
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
