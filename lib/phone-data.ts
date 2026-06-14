import {
  Book02Icon,
  GraduationScrollIcon,
  RiceBowlIcon,
  SchoolIcon,
  SecurityCheckIcon,
  ComputerIcon,
  AmbulanceIcon,
  Building05Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

export interface Contact {
  name: string;
  phone: string;
  ext?: string;
}

export interface ContactGroup {
  id: string;
  title: string;
  icon: IconSvgElement;
  contacts: Contact[];
}

export const contactGroups: ContactGroup[] = [
  {
    id: "education",
    title: "معاونت آموزشی",
    icon: GraduationScrollIcon,
    contacts: [
      { name: "دفتر معاونت آموزشی", phone: "02133334455", ext: "۲۱۰" },
      { name: "اداره ثبت‌نام و امتحانات", phone: "02133334456", ext: "۲۱۵" },
      { name: "اداره فارغ‌التحصیلان", phone: "02133334457", ext: "۲۲۰" },
    ],
  },
  {
    id: "students",
    title: "امور دانشجویی",
    icon: SchoolIcon,
    contacts: [
      { name: "اداره خوابگاه‌ها", phone: "02133334460", ext: "۳۱۰" },
      { name: "صندوق رفاه دانشجویان", phone: "02133334461", ext: "۳۱۵" },
      { name: "مرکز مشاوره", phone: "02133334462", ext: "۳۲۰" },
    ],
  },
  {
    id: "library",
    title: "کتابخانه مرکزی",
    icon: Book02Icon,
    contacts: [
      { name: "میز امانت", phone: "02133334470", ext: "۴۱۰" },
      { name: "بخش مرجع و پایان‌نامه", phone: "02133334471", ext: "۴۱۵" },
    ],
  },
  {
    id: "food",
    title: "اداره تغذیه",
    icon: RiceBowlIcon,
    contacts: [
      { name: "سلف مرکزی", phone: "02133334480", ext: "۵۱۰" },
      { name: "واحد رزرو غذا", phone: "02133334481", ext: "۵۱۵" },
    ],
  },
  {
    id: "it",
    title: "فناوری اطلاعات",
    icon: ComputerIcon,
    contacts: [
      { name: "پشتیبانی سامانه‌ها", phone: "02133334490", ext: "۶۱۰" },
      { name: "پشتیبانی اینترنت و شبکه", phone: "02133334491", ext: "۶۱۵" },
    ],
  },
  {
    id: "security",
    title: "حراست",
    icon: SecurityCheckIcon,
    contacts: [{ name: "دفتر حراست دانشگاه", phone: "02133334400", ext: "۱۰۰" }],
  },
  {
    id: "emergency",
    title: "اورژانس و درمانگاه",
    icon: AmbulanceIcon,
    contacts: [
      { name: "درمانگاه دانشگاه", phone: "02133334411", ext: "۱۱۰" },
      { name: "اورژانس (شبانه‌روزی)", phone: "115" },
    ],
  },
  {
    id: "main",
    title: "تلفن‌خانه مرکزی",
    icon: Building05Icon,
    contacts: [{ name: "روابط عمومی دانشگاه", phone: "02133334000" }],
  },
];
