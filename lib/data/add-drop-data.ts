export const addDropWindow = {
  isOpen: true,
  rangeLabel: "۱۴ تا ۱۶ مهر ۱۴۰۴",
  closesLabel: "۱۶ مهر، ساعت ۲۳:۵۹",
};

export type StepStatus = "done" | "current" | "todo";

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  status: StepStatus;
}

export const steps: ProcessStep[] = [
  {
    id: "s1",
    title: "ورود به سامانه گلستان",
    description: "با نام کاربری و رمز عبور دانشجویی وارد سامانه آموزشی شوید.",
    status: "done",
  },
  {
    id: "s2",
    title: "انتخاب منوی حذف و اضافه",
    description: "از مسیر «ثبت‌نام / حذف و اضافه» وارد فرم مربوطه شوید.",
    status: "done",
  },
  {
    id: "s3",
    title: "افزودن یا حذف درس",
    description: "درس مورد نظر را با توجه به ظرفیت و پیش‌نیاز اضافه یا حذف کنید.",
    status: "current",
  },
  {
    id: "s4",
    title: "تأیید نهایی و دریافت تأییدیه",
    description: "تغییرات را نهایی کرده و تأییدیه ثبت‌نام را ذخیره کنید.",
    status: "todo",
  },
];

export type RequestStatus = "approved" | "pending" | "rejected";

export interface AddDropRequest {
  id: string;
  course: string;
  action: "add" | "drop";
  status: RequestStatus;
}

export const requests: AddDropRequest[] = [
  { id: "r1", course: "هوش مصنوعی", action: "add", status: "approved" },
  { id: "r2", course: "پایگاه داده‌ها", action: "add", status: "pending" },
  { id: "r3", course: "مدارهای منطقی", action: "drop", status: "approved" },
  { id: "r4", course: "ریاضی عمومی ۲", action: "add", status: "rejected" },
];

export const rules: string[] = [
  "حداکثر تعداد واحد مجاز در هر نیمسال ۲۰ واحد است (برای مشروطی‌ها ۱۴ واحد).",
  "حذف درس نباید تعداد واحد را به کمتر از حد نصاب (۱۲ واحد) برساند.",
  "افزودن درس منوط به نداشتن تداخل زمانی و رعایت پیش‌نیاز است.",
  "پس از پایان بازه، امکان هیچ‌گونه تغییری وجود ندارد.",
];
