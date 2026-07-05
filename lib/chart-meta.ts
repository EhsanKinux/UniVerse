// Presentation metadata for the چارت آموزشی page. The API sends only a colour
// slug per department ("computer", "material", …); the Tailwind classes live here
// so the front end owns its own look — the same split the weekly schedule uses
// (see lib/schedule-meta.ts).
//
// Tailwind can only ship classes it SEES as literals, so each entry spells out its
// full class strings (no string interpolation). The slugs match the department
// colour tokens defined in app/globals.css (--color-<slug>).

export interface DepartmentTone {
  /** CSS custom property for inline tints (file icon, badge text). */
  color: string;
  /** Soft fill for the department/file icon box. */
  bgClass: string;
  /** Border for the department/file icon box. */
  borderClass: string;
}

export const DEPARTMENT_TONES: Record<string, DepartmentTone> = {
  computer: {
    color: "var(--color-computer)",
    bgClass: "bg-computer/10",
    borderClass: "border-computer/20",
  },
  material: {
    color: "var(--color-material)",
    bgClass: "bg-material/10",
    borderClass: "border-material/20",
  },
  mechanical: {
    color: "var(--color-mechanical)",
    bgClass: "bg-mechanical/10",
    borderClass: "border-mechanical/20",
  },
  mining: {
    color: "var(--color-mining)",
    bgClass: "bg-mining/10",
    borderClass: "border-mining/20",
  },
  chemical: {
    color: "var(--color-chemical)",
    bgClass: "bg-chemical/10",
    borderClass: "border-chemical/20",
  },
  biomedical: {
    color: "var(--color-biomedical)",
    bgClass: "bg-biomedical/10",
    borderClass: "border-biomedical/20",
  },
  electrical: {
    color: "var(--color-electrical)",
    bgClass: "bg-electrical/10",
    borderClass: "border-electrical/20",
  },
};

/** Look up a department tone, tolerating an unknown colour slug from the server. */
export function departmentTone(color: string): DepartmentTone {
  return DEPARTMENT_TONES[color] ?? DEPARTMENT_TONES.computer;
}
