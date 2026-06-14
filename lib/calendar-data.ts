export type EventStatus = "past" | "current" | "upcoming";

export type EventCategory = "registration" | "addDrop" | "exams" | "holiday" | "academic";

export interface CalendarEvent {
  id: string;
  title: string;
  dateLabel: string;
  month: string;
  category: EventCategory;
  status: EventStatus;
  description?: string;
}

export const eventCategories: Record<EventCategory, { label: string; color: string }> = {
  registration: { label: "انتخاب واحد", color: "var(--color-mechanical)" },
  addDrop: { label: "حذف و اضافه", color: "var(--color-electrical)" },
  exams: { label: "امتحانات", color: "var(--color-biomedical)" },
  holiday: { label: "تعطیلات", color: "var(--color-chemical)" },
  academic: { label: "آموزشی", color: "var(--color-computer)" },
};

export const academicTerm = {
  title: "نیمسال اول ۱۴۰۴ - ۱۴۰۵",
  subtitle: "تقویم آموزشی مصوب شورای آموزشی دانشگاه",
};

export const calendarEvents: CalendarEvent[] = [
  {
    id: "reg-start",
    title: "آغاز انتخاب واحد",
    dateLabel: "۲۵ شهریور",
    month: "شهریور ۱۴۰۴",
    category: "registration",
    status: "past",
    description: "انتخاب واحد دانشجویان بر اساس سنوات تحصیلی و از طریق سامانه گلستان انجام می‌شود.",
  },
  {
    id: "reg-end",
    title: "پایان انتخاب واحد",
    dateLabel: "۲۸ شهریور",
    month: "شهریور ۱۴۰۴",
    category: "registration",
    status: "past",
  },
  {
    id: "classes-start",
    title: "شروع کلاس‌ها",
    dateLabel: "۳۱ شهریور",
    month: "شهریور ۱۴۰۴",
    category: "academic",
    status: "past",
    description: "آغاز رسمی کلاس‌های نیمسال اول طبق برنامه هفتگی اعلام‌شده.",
  },
  {
    id: "add-drop",
    title: "حذف و اضافه",
    dateLabel: "۱۴ تا ۱۶ مهر",
    month: "مهر ۱۴۰۴",
    category: "addDrop",
    status: "current",
    description: "امکان حذف و اضافه دروس از طریق سامانه آموزشی در بازه تعیین‌شده فعال است.",
  },
  {
    id: "tuition",
    title: "مهلت پرداخت شهریه",
    dateLabel: "۳۰ مهر",
    month: "مهر ۱۴۰۴",
    category: "academic",
    status: "upcoming",
  },
  {
    id: "emergency-drop",
    title: "حذف اضطراری تک‌درس",
    dateLabel: "۱۰ تا ۱۴ آذر",
    month: "آذر ۱۴۰۴",
    category: "addDrop",
    status: "upcoming",
    description: "دانشجو می‌تواند یکی از دروس نظری خود را حذف کند، مشروط بر رعایت حد نصاب واحد.",
  },
  {
    id: "classes-end",
    title: "پایان کلاس‌ها",
    dateLabel: "۱۶ دی",
    month: "دی ۱۴۰۴",
    category: "academic",
    status: "upcoming",
  },
  {
    id: "exams",
    title: "امتحانات پایان‌ترم",
    dateLabel: "۲۰ دی تا ۴ بهمن",
    month: "دی ۱۴۰۴",
    category: "exams",
    status: "upcoming",
    description: "برنامه امتحانات پایان‌ترم از طریق سامانه گلستان قابل مشاهده است.",
  },
  {
    id: "winter-break",
    title: "تعطیلات بین دو نیمسال",
    dateLabel: "۵ تا ۱۵ بهمن",
    month: "بهمن ۱۴۰۴",
    category: "holiday",
    status: "upcoming",
  },
];
