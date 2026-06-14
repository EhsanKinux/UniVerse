import {
  Building05Icon,
  Globe02Icon,
  GraduationScrollIcon,
  Mail01Icon,
  RiceBowlIcon,
  Wallet01Icon,
  Book02Icon,
  ComputerIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

export interface SystemLink {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: IconSvgElement;
  tone: string;
}

export const systems: SystemLink[] = [
  {
    id: "golestan",
    title: "سامانه گلستان",
    description: "آموزش، انتخاب واحد و کارنامه",
    url: "https://golestan.example.ac.ir",
    icon: GraduationScrollIcon,
    tone: "text-violet-600 from-violet-500/15 border-violet-500/15 dark:text-violet-300",
  },
  {
    id: "lms",
    title: "سامانه یادگیری (LMS)",
    description: "کلاس‌های آنلاین و محتوای درسی",
    url: "https://lms.example.ac.ir",
    icon: ComputerIcon,
    tone: "text-sky-600 from-sky-500/15 border-sky-500/15 dark:text-sky-300",
  },
  {
    id: "library",
    title: "کتابخانه دیجیتال",
    description: "جستجو و امانت منابع علمی",
    url: "https://lib.example.ac.ir",
    icon: Book02Icon,
    tone: "text-emerald-600 from-emerald-500/15 border-emerald-500/15 dark:text-emerald-300",
  },
  {
    id: "email",
    title: "ایمیل دانشگاهی",
    description: "پست الکترونیک رسمی دانشجو",
    url: "https://mail.example.ac.ir",
    icon: Mail01Icon,
    tone: "text-rose-600 from-rose-500/15 border-rose-500/15 dark:text-rose-300",
  },
  {
    id: "food",
    title: "اتوماسیون تغذیه",
    description: "رزرو و خرید ژتون غذا",
    url: "https://food.example.ac.ir",
    icon: RiceBowlIcon,
    tone: "text-orange-600 from-orange-500/15 border-orange-500/15 dark:text-orange-300",
  },
  {
    id: "finance",
    title: "امور مالی و شهریه",
    description: "پرداخت شهریه و مشاهده صورتحساب",
    url: "https://finance.example.ac.ir",
    icon: Wallet01Icon,
    tone: "text-amber-600 from-amber-500/15 border-amber-500/15 dark:text-amber-300",
  },
  {
    id: "portal",
    title: "پورتال دانشگاه",
    description: "اخبار، اطلاعیه‌ها و خدمات",
    url: "https://www.example.ac.ir",
    icon: Building05Icon,
    tone: "text-indigo-600 from-indigo-500/15 border-indigo-500/15 dark:text-indigo-300",
  },
  {
    id: "net",
    title: "سامانه اینترنت (VPN)",
    description: "مدیریت حساب کاربری اینترنت",
    url: "https://net.example.ac.ir",
    icon: Globe02Icon,
    tone: "text-teal-600 from-teal-500/15 border-teal-500/15 dark:text-teal-300",
  },
];
