// Shared presentation helpers for the notification UI (toast + bell).

// A subtle colour accent per news category, applied to the icon tile.
const CATEGORY_TONES: Record<string, string> = {
  academic: "text-sky-600 bg-sky-500/10 border-sky-500/15 dark:text-sky-300",
  services: "text-amber-600 bg-amber-500/10 border-amber-500/15 dark:text-amber-300",
  student: "text-emerald-600 bg-emerald-500/10 border-emerald-500/15 dark:text-emerald-300",
  general: "text-primary bg-primary/10 border-primary/15",
};

export function categoryTone(category: string): string {
  return CATEGORY_TONES[category] ?? CATEGORY_TONES.general;
}

/** An external link opens in a new tab; an internal one uses client navigation. */
export function isExternalLink(href: string): boolean {
  return /^https?:\/\//i.test(href);
}
