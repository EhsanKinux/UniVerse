export interface ClassSession {
  id: string;
  course: string;
  professor: string;
  start: string;
  end: string;
  room: string;
  type: "نظری" | "عملی";
}

export interface ScheduleDay {
  id: string;
  label: string;
  short: string;
  isToday?: boolean;
  sessions: ClassSession[];
}

export const weeklySchedule: ScheduleDay[] = [
  {
    id: "sat",
    label: "شنبه",
    short: "ش",
    sessions: [
      { id: "sa1", course: "ساختمان داده‌ها", professor: "دکتر رضایی", start: "10:00", end: "11:30", room: "کلاس ۲۰۴", type: "نظری" },
      { id: "sa2", course: "پایگاه داده‌ها", professor: "دکتر کریمی", start: "13:00", end: "14:30", room: "آز. نرم‌افزار", type: "عملی" },
      { id: "sa3", course: "مدارهای منطقی", professor: "دکتر صادقی", start: "15:00", end: "17:00", room: "کلاس ۲۱۰", type: "نظری" },
    ],
  },
  {
    id: "sun",
    label: "یکشنبه",
    short: "ی",
    isToday: true,
    sessions: [
      { id: "su1", course: "ریاضی عمومی ۲", professor: "دکتر موسوی", start: "08:00", end: "09:30", room: "کلاس ۱۰۱", type: "نظری" },
      { id: "su2", course: "مهندسی نرم‌افزار", professor: "دکتر احمدی", start: "10:00", end: "11:30", room: "کلاس ۳۰۲", type: "نظری" },
    ],
  },
  {
    id: "mon",
    label: "دوشنبه",
    short: "د",
    sessions: [
      { id: "mo1", course: "ساختمان داده‌ها", professor: "دکتر رضایی", start: "10:00", end: "11:30", room: "کلاس ۲۰۴", type: "نظری" },
      { id: "mo2", course: "پایگاه داده‌ها", professor: "دکتر کریمی", start: "13:00", end: "14:30", room: "کلاس ۳۰۱", type: "نظری" },
      { id: "mo3", course: "هوش مصنوعی", professor: "دکتر رضایی", start: "13:00", end: "14:30", room: "کلاس ۳۰۵", type: "نظری" },
    ],
  },
  {
    id: "tue",
    label: "سه‌شنبه",
    short: "س",
    sessions: [
      { id: "tu1", course: "ریاضی عمومی ۲", professor: "دکتر موسوی", start: "08:00", end: "09:30", room: "کلاس ۱۰۱", type: "نظری" },
      { id: "tu2", course: "مهندسی نرم‌افزار", professor: "دکتر احمدی", start: "10:00", end: "11:30", room: "کلاس ۳۰۲", type: "نظری" },
      { id: "tu3", course: "تربیت بدنی ۱", professor: "استاد علوی", start: "15:00", end: "16:30", room: "سالن ورزشی", type: "عملی" },
    ],
  },
  {
    id: "wed",
    label: "چهارشنبه",
    short: "چ",
    sessions: [
      { id: "we1", course: "اندیشه اسلامی ۱", professor: "دکتر حسینی", start: "08:00", end: "09:30", room: "کلاس ۱۰۵", type: "نظری" },
      { id: "we2", course: "هوش مصنوعی", professor: "دکتر رضایی", start: "13:00", end: "14:30", room: "کلاس ۳۰۵", type: "نظری" },
    ],
  },
];
