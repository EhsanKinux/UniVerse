import { z } from "zod";

import { COURSE_COLORS } from "@/lib/api/types";
import { toMinutes } from "@/lib/schedule-meta";

// Validation for the add/edit-course form. Messages are in Persian to match the
// UI. Mirrors the backend DTO rules (univers-backend/src/schedule/dto):
// required name, palette colour, 1–20 sessions, HH:mm times with end > start.

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

export const sessionSchema = z
  .object({
    dayOfWeek: z.number().int().min(0).max(5),
    start: z.string().regex(HHMM, { message: "ساعت شروع را انتخاب کنید" }),
    end: z.string().regex(HHMM, { message: "ساعت پایان را انتخاب کنید" }),
    room: z.string().trim().max(100, { message: "حداکثر ۱۰۰ کاراکتر" }),
    type: z.enum(["theory", "practical"]),
    parity: z.enum(["all", "odd", "even"]),
  })
  .refine((s) => !HHMM.test(s.start) || !HHMM.test(s.end) || toMinutes(s.end) > toMinutes(s.start), {
    message: "پایان کلاس باید بعد از شروع آن باشد",
    path: ["end"],
  });

export const courseFormSchema = z.object({
  name: z.string().trim().min(1, { message: "نام درس را وارد کنید" }).max(100, { message: "حداکثر ۱۰۰ کاراکتر" }),
  professor: z.string().trim().max(100, { message: "حداکثر ۱۰۰ کاراکتر" }),
  color: z.enum(COURSE_COLORS),
  sessions: z.array(sessionSchema).min(1, { message: "حداقل یک جلسه برای درس ثبت کنید" }).max(20),
});

export type CourseFormValues = z.infer<typeof courseFormSchema>;

/** A fresh session row for the form's "افزودن جلسه" button. */
export function emptySession(dayOfWeek = 0): CourseFormValues["sessions"][number] {
  return { dayOfWeek, start: "08:00", end: "09:30", room: "", type: "theory", parity: "all" };
}
