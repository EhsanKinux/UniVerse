import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Two-letter (or single fallback) initials for an avatar, RTL-safe. */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "؟"
  if (parts.length === 1) return parts[0].slice(0, 2)
  return parts[0][0] + parts[1][0]
}

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]

/** Convert ASCII digits in a number/string to Persian (۰-۹) for display. */
export function toPersianDigits(value: number | string): string {
  return String(value).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)])
}

/**
 * Convert Persian (۰-۹) and Arabic-Indic (٠-٩) digits to ASCII (0-9). Used before
 * sending numeric fields (phone, national id, …) to the API, which validates
 * ASCII digits.
 */
export function toEnglishDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
}
