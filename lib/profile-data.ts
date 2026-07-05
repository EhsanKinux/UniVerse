import type { IconSvgElement } from "@hugeicons/react";
import {
  Calendar03Icon,
  Sun02Icon,
  Moon02Icon,
  ComputerIcon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";

// The academic identity used to be hard-coded mock data here. It now lives in
// the backend profile (see lib/profile-fields.ts + the /profile API), because the
// student fills it in themselves. This file keeps only the static UI metadata.

export type QuickLink = {
  href: string;
  label: string;
  hint: string;
  icon: IconSvgElement;
  /** Tailwind text-color classes for the icon. */
  tone: string;
};

// Shortcuts from the profile to the student's own pages.
export const quickLinks: QuickLink[] = [
  { href: "/weekly-schedule", label: "برنامه هفتگی", hint: "کلاس‌ها و یادآوری‌ها", icon: Clock01Icon, tone: "text-teal-600 dark:text-teal-300" },
  { href: "/calendar", label: "تقویم آموزشی", hint: "رویدادهای نیمسال", icon: Calendar03Icon, tone: "text-sky-600 dark:text-sky-300" },
];

export type ThemeOption = {
  value: "light" | "dark" | "system";
  label: string;
  icon: IconSvgElement;
};

export const themeOptions: ThemeOption[] = [
  { value: "light", label: "روشن", icon: Sun02Icon },
  { value: "dark", label: "تیره", icon: Moon02Icon },
  { value: "system", label: "سیستم", icon: ComputerIcon },
];

// App + support metadata shown on the profile page.
export const APP_VERSION = "۱.۰.۰";
export const SUPPORT_EMAIL = "support@universe.app";
export const SUPPORT_PHONE = "+982112345678";
export const SUPPORT_PHONE_DISPLAY = "۰۲۱-۱۲۳۴۵۶۷۸";
