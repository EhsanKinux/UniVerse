import type { IconSvgElement } from "@hugeicons/react";
import {
  UserIcon,
  SmartPhone01Icon,
  IdentityCardIcon,
  BirthdayCakeIcon,
  UserGroupIcon,
  Location01Icon,
  GraduationScrollIcon,
  Building05Icon,
  Mortarboard01Icon,
  Calendar03Icon,
  Briefcase01Icon,
  Camera01Icon,
  PencilEdit02Icon,
  Call02Icon,
  Message01Icon,
} from "@hugeicons/core-free-icons";

import { toPersianDigits } from "@/lib/utils";
import type { ProfileData, UpdateProfilePayload } from "@/lib/api/types";

// -----------------------------------------------------------------------------
// Constrained values — MIRRORS univers-backend/src/profile/profile.constants.ts.
// Keep the labels and weights in sync with the server (it owns the real scoring).
// -----------------------------------------------------------------------------

export const GENDER_OPTIONS = [
  { value: "male", label: "مرد" },
  { value: "female", label: "زن" },
] as const;

export const DEGREE_OPTIONS = [
  { value: "associate", label: "کاردانی" },
  { value: "bachelor", label: "کارشناسی" },
  { value: "master", label: "کارشناسی ارشد" },
  { value: "phd", label: "دکتری" },
] as const;

/** Recent Jalali entry years, newest first (1385 … current ≈ 1405). */
export const ENTRY_YEAR_OPTIONS = Array.from({ length: 21 }, (_, i) => {
  const year = 1405 - i;
  return { value: String(year), label: toPersianDigits(year) };
});

const labelFor = (
  options: readonly { value: string; label: string }[],
  value: string | null,
): string | null => options.find((o) => o.value === value)?.label ?? value;

// -----------------------------------------------------------------------------
// Field registry
// -----------------------------------------------------------------------------

export type FieldInputKind = "text" | "tel" | "textarea" | "select";

/** One rendered input inside the edit form. `key` matches the PATCH payload. */
export interface FormInput {
  key: keyof UpdateProfilePayload;
  label: string;
  kind: FieldInputKind;
  placeholder?: string;
  dir?: "ltr" | "rtl";
  options?: readonly { value: string; label: string }[];
  maxLength?: number;
  /** Client-side format check (only runs on a non-empty value). */
  validate?: (value: string) => boolean;
  /** Error to show when `validate` fails. */
  error?: string;
}

/**
 * A "scored field": one point-bearing piece of the profile. Most map to a single
 * input, but a couple combine several (location = city + province). `isFilled`
 * and `points` MIRROR the backend scorer so the checklist matches the ring.
 */
export interface ScoredField {
  id: string;
  label: string;
  points: number;
  icon: IconSvgElement;
  inputs: FormInput[];
  /** Whether this field counts as complete — mirrors backend profile-scoring.ts. */
  isFilled: (p: ProfileData) => boolean;
  /** Ready-to-show value for the read-only cards, or null when empty. */
  format: (p: ProfileData) => string | null;
}

export interface ProfileSection {
  id: string;
  title: string;
  subtitle?: string;
  fields: ScoredField[];
}

const nationalIdOk = (v: string) => /^\d{10}$/.test(v);
const birthDateOk = (v: string) => /^[\d۰-۹]{4}\/[\d۰-۹]{1,2}\/[\d۰-۹]{1,2}$/.test(v);
const studentIdOk = (v: string) => /^[\d۰-۹]{5,15}$/.test(v);

export const profileSections: ProfileSection[] = [
  {
    id: "personal",
    title: "اطلاعات فردی",
    fields: [
      {
        id: "name",
        label: "نام و نام خانوادگی",
        points: 10,
        icon: UserIcon,
        isFilled: (p) => !!p.name,
        format: (p) => p.name,
        inputs: [
          {
            key: "name",
            label: "نام و نام خانوادگی",
            kind: "text",
            placeholder: "مثلاً علی رضایی",
            maxLength: 100,
          },
        ],
      },
      {
        id: "phone",
        label: "شماره تماس",
        points: 10,
        icon: SmartPhone01Icon,
        isFilled: (p) => !!p.phone,
        format: (p) => p.phone,
        inputs: [
          {
            key: "phone",
            label: "شماره تماس",
            kind: "tel",
            placeholder: "۰۹۱۲۳۴۵۶۷۸۹",
            dir: "ltr",
            maxLength: 20,
          },
        ],
      },
      {
        id: "nationalId",
        label: "کد ملی",
        points: 10,
        icon: IdentityCardIcon,
        isFilled: (p) => !!p.nationalId,
        format: (p) => (p.nationalId ? toPersianDigits(p.nationalId) : null),
        inputs: [
          {
            key: "nationalId",
            label: "کد ملی",
            kind: "text",
            placeholder: "۱۰ رقم",
            dir: "ltr",
            maxLength: 10,
            validate: nationalIdOk,
            error: "کد ملی باید ۱۰ رقم باشد.",
          },
        ],
      },
      {
        id: "birthDate",
        label: "تاریخ تولد",
        points: 5,
        icon: BirthdayCakeIcon,
        isFilled: (p) => !!p.birthDate,
        format: (p) => (p.birthDate ? toPersianDigits(p.birthDate) : null),
        inputs: [
          {
            key: "birthDate",
            label: "تاریخ تولد (شمسی)",
            kind: "text",
            placeholder: "۱۳۸۰/۰۵/۱۲",
            dir: "ltr",
            maxLength: 10,
            validate: birthDateOk,
            error: "قالب درست: ۱۳۸۰/۰۵/۱۲",
          },
        ],
      },
      {
        id: "gender",
        label: "جنسیت",
        points: 5,
        icon: UserGroupIcon,
        isFilled: (p) => !!p.gender,
        format: (p) => labelFor(GENDER_OPTIONS, p.gender),
        inputs: [
          { key: "gender", label: "جنسیت", kind: "select", options: GENDER_OPTIONS },
        ],
      },
      {
        id: "location",
        label: "استان و شهر",
        points: 5,
        icon: Location01Icon,
        isFilled: (p) => !!p.city,
        format: (p) =>
          p.city ? [p.city, p.province].filter(Boolean).join("، ") : p.province,
        inputs: [
          { key: "province", label: "استان", kind: "text", placeholder: "تهران", maxLength: 50 },
          { key: "city", label: "شهر", kind: "text", placeholder: "تهران", maxLength: 50 },
        ],
      },
    ],
  },
  {
    id: "academic",
    title: "اطلاعات تحصیلی",
    subtitle: "این اطلاعات را خودتان وارد و ویرایش می‌کنید.",
    fields: [
      {
        id: "studentId",
        label: "شماره دانشجویی",
        points: 10,
        icon: IdentityCardIcon,
        isFilled: (p) => !!p.studentId,
        format: (p) => (p.studentId ? toPersianDigits(p.studentId) : null),
        inputs: [
          {
            key: "studentId",
            label: "شماره دانشجویی",
            kind: "text",
            placeholder: "۴۰۳۹۲۱۰۸۷",
            dir: "ltr",
            maxLength: 15,
            validate: studentIdOk,
            error: "شماره دانشجویی نامعتبر است.",
          },
        ],
      },
      {
        id: "major",
        label: "رشته تحصیلی",
        points: 10,
        icon: GraduationScrollIcon,
        isFilled: (p) => !!p.major,
        format: (p) => p.major,
        inputs: [
          { key: "major", label: "رشته تحصیلی", kind: "text", placeholder: "مهندسی کامپیوتر", maxLength: 100 },
        ],
      },
      {
        id: "faculty",
        label: "دانشکده",
        points: 5,
        icon: Building05Icon,
        isFilled: (p) => !!p.faculty,
        format: (p) => p.faculty,
        inputs: [
          { key: "faculty", label: "دانشکده", kind: "text", placeholder: "دانشکده فنی و مهندسی", maxLength: 100 },
        ],
      },
      {
        id: "degree",
        label: "مقطع تحصیلی",
        points: 5,
        icon: Mortarboard01Icon,
        isFilled: (p) => !!p.degree,
        format: (p) => labelFor(DEGREE_OPTIONS, p.degree),
        inputs: [
          { key: "degree", label: "مقطع تحصیلی", kind: "select", options: DEGREE_OPTIONS },
        ],
      },
      {
        id: "entryYear",
        label: "سال ورود",
        points: 5,
        icon: Calendar03Icon,
        isFilled: (p) => p.entryYear != null,
        format: (p) => (p.entryYear != null ? toPersianDigits(p.entryYear) : null),
        inputs: [
          { key: "entryYear", label: "سال ورود", kind: "select", options: ENTRY_YEAR_OPTIONS },
        ],
      },
      {
        id: "advisor",
        label: "استاد راهنما",
        points: 5,
        icon: Briefcase01Icon,
        isFilled: (p) => !!p.advisor,
        format: (p) => p.advisor,
        inputs: [
          { key: "advisor", label: "استاد راهنما", kind: "text", placeholder: "دکتر سارا محمدی", maxLength: 100 },
        ],
      },
    ],
  },
  {
    id: "extra",
    title: "درباره و تماس اضطراری",
    fields: [
      {
        id: "bio",
        label: "درباره من",
        points: 5,
        icon: PencilEdit02Icon,
        isFilled: (p) => !!p.bio,
        format: (p) => p.bio,
        inputs: [
          {
            key: "bio",
            label: "درباره من",
            kind: "textarea",
            placeholder: "چند جمله درباره خودتان…",
            maxLength: 300,
          },
        ],
      },
      {
        id: "emergency",
        label: "تماس اضطراری",
        points: 5,
        icon: Call02Icon,
        isFilled: (p) => !!p.emergencyPhone,
        format: (p) =>
          p.emergencyPhone
            ? [p.emergencyName, toPersianDigits(p.emergencyPhone)].filter(Boolean).join(" — ")
            : p.emergencyName,
        inputs: [
          { key: "emergencyName", label: "نام مخاطب اضطراری", kind: "text", placeholder: "مثلاً مریم رضایی", maxLength: 100 },
          { key: "emergencyPhone", label: "شماره اضطراری", kind: "tel", placeholder: "۰۹۱۲۰۰۰۰۰۰۰", dir: "ltr", maxLength: 20 },
        ],
      },
      {
        id: "telegram",
        label: "شناسه پیام‌رسان",
        points: 5,
        icon: Message01Icon,
        isFilled: (p) => !!p.telegram,
        format: (p) => p.telegram,
        inputs: [
          { key: "telegram", label: "شناسه تلگرام", kind: "text", placeholder: "ali_rezaei", dir: "ltr", maxLength: 60 },
        ],
      },
    ],
  },
];

/** The avatar isn't an input field, but it IS a scored item (worth 15). */
export const AVATAR_POINTS = 15;
export const AVATAR_ICON = Camera01Icon;

/** Flat list of every scored field across all sections. */
export const allScoredFields = profileSections.flatMap((s) => s.fields);
