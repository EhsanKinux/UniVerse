import { Megaphone01Icon, TelegramIcon, UserGroupIcon, WhatsappIcon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

export type Platform = "telegram" | "whatsapp" | "channel" | "community";

export const platformMeta: Record<
  Platform,
  { label: string; icon: IconSvgElement; className: string; cta: string }
> = {
  telegram: {
    label: "تلگرام",
    icon: TelegramIcon,
    className: "text-sky-600 bg-sky-500/10 border-sky-500/20 dark:text-sky-400",
    cta: "عضویت",
  },
  whatsapp: {
    label: "واتساپ",
    icon: WhatsappIcon,
    className: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400",
    cta: "عضویت",
  },
  channel: {
    label: "کانال",
    icon: Megaphone01Icon,
    className: "text-violet-600 bg-violet-500/10 border-violet-500/20 dark:text-violet-400",
    cta: "دنبال کردن",
  },
  community: {
    label: "انجمن",
    icon: UserGroupIcon,
    className: "text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-400",
    cta: "پیوستن",
  },
};

export interface Group {
  id: string;
  title: string;
  description: string;
  members: number;
  platform: Platform;
  url: string;
}

export interface GroupCategory {
  id: string;
  title: string;
  groups: Group[];
}

export const groupCategories: GroupCategory[] = [
  {
    id: "official",
    title: "کانال‌های رسمی",
    groups: [
      {
        id: "g1",
        title: "اطلاع‌رسانی آموزش دانشگاه",
        description: "اخبار رسمی، اطلاعیه‌ها و رویدادهای آموزشی",
        members: 8420,
        platform: "channel",
        url: "https://t.me/example_edu",
      },
      {
        id: "g2",
        title: "انجمن علمی مهندسی کامپیوتر",
        description: "کارگاه‌ها، مسابقات و فرصت‌های شغلی",
        members: 2150,
        platform: "channel",
        url: "https://t.me/example_cs",
      },
    ],
  },
  {
    id: "class",
    title: "گروه‌های کلاسی",
    groups: [
      {
        id: "g3",
        title: "ورودی ۱۴۰۳ - مهندسی کامپیوتر",
        description: "هماهنگی کلاس‌ها و تکالیف هم‌ورودی‌ها",
        members: 96,
        platform: "telegram",
        url: "https://t.me/example_1403",
      },
      {
        id: "g4",
        title: "گروه درس ساختمان داده‌ها",
        description: "پرسش و پاسخ و منابع درس",
        members: 41,
        platform: "whatsapp",
        url: "https://chat.whatsapp.com/example",
      },
    ],
  },
  {
    id: "community",
    title: "انجمن‌ها و تشکل‌ها",
    groups: [
      {
        id: "g5",
        title: "انجمن برنامه‌نویسی دانشگاه",
        description: "دورهمی‌های فنی و پروژه‌های گروهی",
        members: 560,
        platform: "community",
        url: "https://t.me/example_dev",
      },
      {
        id: "g6",
        title: "کانون فرهنگی و هنری",
        description: "رویدادهای فرهنگی، اردوها و کارگاه‌ها",
        members: 1180,
        platform: "community",
        url: "https://t.me/example_culture",
      },
    ],
  },
];
