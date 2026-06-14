export type GradeStatus = "pass" | "fail" | "pending";

export interface Grade {
  course: string;
  units: number;
  score: number | null;
  status: GradeStatus;
}

export interface Term {
  id: string;
  title: string;
  gpa: number | null;
  grades: Grade[];
}

export const terms: Term[] = [
  {
    id: "t1",
    title: "نیمسال اول ۱۴۰۳ - ۱۴۰۴",
    gpa: 17.45,
    grades: [
      { course: "ریاضی عمومی ۱", units: 3, score: 18.5, status: "pass" },
      { course: "مبانی کامپیوتر و برنامه‌سازی", units: 3, score: 19.0, status: "pass" },
      { course: "فیزیک ۱", units: 3, score: 15.75, status: "pass" },
      { course: "فارسی عمومی", units: 3, score: 17.0, status: "pass" },
      { course: "کارگاه کامپیوتر", units: 1, score: 20.0, status: "pass" },
    ],
  },
  {
    id: "t2",
    title: "نیمسال دوم ۱۴۰۳ - ۱۴۰۴",
    gpa: 16.2,
    grades: [
      { course: "ریاضی عمومی ۲", units: 3, score: 14.5, status: "pass" },
      { course: "برنامه‌سازی پیشرفته", units: 3, score: 18.25, status: "pass" },
      { course: "فیزیک ۲", units: 3, score: 9.5, status: "fail" },
      { course: "زبان عمومی", units: 3, score: 16.0, status: "pass" },
      { course: "اندیشه اسلامی ۱", units: 2, score: 17.5, status: "pass" },
    ],
  },
  {
    id: "t3",
    title: "نیمسال اول ۱۴۰۴ - ۱۴۰۵",
    gpa: null,
    grades: [
      { course: "ساختمان داده‌ها", units: 3, score: null, status: "pending" },
      { course: "پایگاه داده‌ها", units: 3, score: null, status: "pending" },
      { course: "مدارهای منطقی", units: 3, score: null, status: "pending" },
      { course: "مهندسی نرم‌افزار", units: 3, score: null, status: "pending" },
    ],
  },
];

function computeOverall() {
  let totalPoints = 0;
  let totalUnits = 0;
  let passedUnits = 0;
  for (const term of terms) {
    for (const g of term.grades) {
      if (g.score === null) continue;
      totalPoints += g.score * g.units;
      totalUnits += g.units;
      if (g.status === "pass") passedUnits += g.units;
    }
  }
  return {
    gpa: totalUnits ? totalPoints / totalUnits : 0,
    passedUnits,
    totalUnits,
  };
}

export const overall = computeOverall();
