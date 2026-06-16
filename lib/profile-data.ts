import type { IconSvgElement } from "@hugeicons/react";
import {
  IdentityCardIcon,
  GraduationScrollIcon,
  Building05Icon,
  Mortarboard01Icon,
  Calendar03Icon,
  Briefcase01Icon,
  Location01Icon,
  Sun02Icon,
  Moon02Icon,
  ComputerIcon,
  Notebook02Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";

import { overall, terms } from "./grades-data";

// Academic identity is "owned" by the university (read-only here), unlike the
// name/email/phone which the student edits on the profile page.
export const academicProfile = {
  studentId: "۴۰۳۹۲۱۰۸۷",
  major: "مهندسی کامپیوتر",
  faculty: "دانشکده فنی و مهندسی",
  degree: "کارشناسی پیوسته",
  entryYear: "۱۴۰۳",
  advisor: "دکتر سارا محمدی",
  campus: "پردیس مرکزی",
  status: "دانشجوی فعال",
} as const;

export type AcademicFieldKey = keyof typeof academicProfile;

export type InfoField = {
  key: AcademicFieldKey;
  label: string;
  icon: IconSvgElement;
  /** Show a copy-to-clipboard affordance (e.g. the student ID). */
  copyable?: boolean;
};

export const academicFields: InfoField[] = [
  { key: "studentId", label: "شماره دانشجویی", icon: IdentityCardIcon, copyable: true },
  { key: "major", label: "رشته تحصیلی", icon: GraduationScrollIcon },
  { key: "faculty", label: "دانشکده", icon: Building05Icon },
  { key: "degree", label: "مقطع تحصیلی", icon: Mortarboard01Icon },
  { key: "entryYear", label: "سال ورود", icon: Calendar03Icon },
  { key: "advisor", label: "استاد راهنما", icon: Briefcase01Icon },
  { key: "campus", label: "پردیس", icon: Location01Icon },
];

const faNum = (n: number, digits = 0) =>
  n.toLocaleString("fa-IR", { minimumFractionDigits: digits, maximumFractionDigits: digits });

// Academic snapshot — derived from the same mock source as the grades page so
// the numbers stay consistent across the app.
export const academicStats = [
  { key: "gpa", label: "معدل کل", value: faNum(overall.gpa, 2) },
  { key: "passed", label: "واحد گذرانده", value: faNum(overall.passedUnits) },
  { key: "terms", label: "نیمسال", value: faNum(terms.length) },
] as const;

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
  { href: "/grades", label: "نمرات", hint: "کارنامه و معدل", icon: Notebook02Icon, tone: "text-amber-600 dark:text-amber-300" },
  { href: "/weekly-schedule", label: "برنامه هفتگی", hint: "کلاس‌های شما", icon: Clock01Icon, tone: "text-teal-600 dark:text-teal-300" },
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
