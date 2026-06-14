export interface Course {
  id: string;
  code: string;
  title: string;
  units: number;
  professor: string;
  schedule: string;
  room: string;
  exam: string;
  enrolled: number;
  capacity: number;
  group: "تخصصی" | "پایه" | "عمومی";
}

export const courses: Course[] = [
  {
    id: "c1",
    code: "۲۲۱۴۰۳۱",
    title: "ساختمان داده‌ها و الگوریتم‌ها",
    units: 3,
    professor: "دکتر رضایی",
    schedule: "شنبه و دوشنبه ۱۰:۰۰ - ۱۱:۳۰",
    room: "کلاس ۲۰۴",
    exam: "۲۲ دی ۱۴۰۴",
    enrolled: 38,
    capacity: 40,
    group: "تخصصی",
  },
  {
    id: "c2",
    code: "۲۲۱۴۰۱۲",
    title: "ریاضی عمومی ۲",
    units: 3,
    professor: "دکتر موسوی",
    schedule: "یکشنبه و سه‌شنبه ۸:۰۰ - ۹:۳۰",
    room: "کلاس ۱۰۱",
    exam: "۲۵ دی ۱۴۰۴",
    enrolled: 45,
    capacity: 45,
    group: "پایه",
  },
  {
    id: "c3",
    code: "۲۲۱۴۰۴۵",
    title: "پایگاه داده‌ها",
    units: 3,
    professor: "دکتر کریمی",
    schedule: "شنبه و دوشنبه ۱۳:۰۰ - ۱۴:۳۰",
    room: "آزمایشگاه نرم‌افزار",
    exam: "۲۸ دی ۱۴۰۴",
    enrolled: 30,
    capacity: 35,
    group: "تخصصی",
  },
  {
    id: "c4",
    code: "۲۲۱۴۰۵۱",
    title: "مهندسی نرم‌افزار",
    units: 3,
    professor: "دکتر احمدی",
    schedule: "یکشنبه و سه‌شنبه ۱۰:۰۰ - ۱۱:۳۰",
    room: "کلاس ۳۰۲",
    exam: "۱ بهمن ۱۴۰۴",
    enrolled: 28,
    capacity: 40,
    group: "تخصصی",
  },
  {
    id: "c5",
    code: "۲۲۱۴۰۲۲",
    title: "مدارهای منطقی",
    units: 3,
    professor: "دکتر صادقی",
    schedule: "شنبه ۱۵:۰۰ - ۱۷:۰۰",
    room: "کلاس ۲۱۰",
    exam: "۳۰ دی ۱۴۰۴",
    enrolled: 33,
    capacity: 40,
    group: "پایه",
  },
  {
    id: "c6",
    code: "۹۹۹۰۰۱۲",
    title: "اندیشه اسلامی ۱",
    units: 2,
    professor: "دکتر حسینی",
    schedule: "چهارشنبه ۸:۰۰ - ۹:۳۰",
    room: "کلاس ۱۰۵",
    exam: "۲۰ دی ۱۴۰۴",
    enrolled: 50,
    capacity: 60,
    group: "عمومی",
  },
  {
    id: "c7",
    code: "۲۲۱۴۰۶۳",
    title: "هوش مصنوعی",
    units: 3,
    professor: "دکتر رضایی",
    schedule: "دوشنبه و چهارشنبه ۱۳:۰۰ - ۱۴:۳۰",
    room: "کلاس ۳۰۵",
    exam: "۴ بهمن ۱۴۰۴",
    enrolled: 36,
    capacity: 40,
    group: "تخصصی",
  },
  {
    id: "c8",
    code: "۹۹۹۰۰۴۵",
    title: "تربیت بدنی ۱",
    units: 1,
    professor: "استاد علوی",
    schedule: "سه‌شنبه ۱۵:۰۰ - ۱۶:۳۰",
    room: "سالن ورزشی",
    exam: "—",
    enrolled: 24,
    capacity: 30,
    group: "عمومی",
  },
];

export const courseGroups = ["همه", "تخصصی", "پایه", "عمومی"] as const;
