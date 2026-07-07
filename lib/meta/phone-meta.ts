// Presentation metadata for the شماره‌های دانشگاه page. The API sends only an icon
// KEY per group ("education", "library", …); the actual HugeIcons line icon lives
// here so the front end owns its own look — the same split the چارت آموزشی page
// uses (see lib/chart-meta.ts).
//
// The keys MUST stay in step with CONTACT_GROUP_ICONS on the backend
// (univers-backend/src/phone-book/dto/contact-icons.ts). To add an icon: add its
// key + label there, then map the key to a HugeIcons icon here.

import {
  AmbulanceIcon,
  Book02Icon,
  Building05Icon,
  Call02Icon,
  ComputerIcon,
  GraduationScrollIcon,
  Home01Icon,
  RiceBowlIcon,
  SchoolIcon,
  SecurityCheckIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

const CONTACT_ICONS: Record<string, IconSvgElement> = {
  education: GraduationScrollIcon,
  students: SchoolIcon,
  library: Book02Icon,
  food: RiceBowlIcon,
  it: ComputerIcon,
  security: SecurityCheckIcon,
  emergency: AmbulanceIcon,
  dorm: Home01Icon,
  groups: UserGroupIcon,
  building: Building05Icon,
  phone: Call02Icon,
};

/** Look up a group's icon, tolerating an unknown key from the server. */
export function contactGroupIcon(key: string): IconSvgElement {
  return CONTACT_ICONS[key] ?? CONTACT_ICONS.phone;
}
