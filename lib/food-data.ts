export interface Meal {
  items: string[];
  sideItems: string[];
  reserved: boolean;
  available: boolean;
}

export interface FoodDay {
  id: string;
  label: string;
  date: string;
  isToday?: boolean;
  lunch: Meal;
  dinner: Meal;
}

export const foodWeek: FoodDay[] = [
  {
    id: "sat",
    label: "شنبه",
    date: "۱۲ مهر",
    lunch: { items: ["چلوکباب کوبیده"], sideItems: ["ماست", "نوشابه", "نان"], reserved: true, available: true },
    dinner: { items: ["عدس‌پلو با گوشت"], sideItems: ["سالاد", "ترشی"], reserved: false, available: true },
  },
  {
    id: "sun",
    label: "یکشنبه",
    date: "۱۳ مهر",
    isToday: true,
    lunch: { items: ["زرشک‌پلو با مرغ"], sideItems: ["ماست", "سالاد"], reserved: true, available: true },
    dinner: { items: ["ماکارونی"], sideItems: ["سالاد فصل", "نوشابه"], reserved: false, available: true },
  },
  {
    id: "mon",
    label: "دوشنبه",
    date: "۱۴ مهر",
    lunch: { items: ["قورمه‌سبزی"], sideItems: ["برنج", "ترشی"], reserved: false, available: true },
    dinner: { items: ["کوکوسبزی"], sideItems: ["نان", "سالاد"], reserved: false, available: true },
  },
  {
    id: "tue",
    label: "سه‌شنبه",
    date: "۱۵ مهر",
    lunch: { items: ["چلوخورشت قیمه"], sideItems: ["ماست", "سالاد"], reserved: false, available: true },
    dinner: { items: ["الویه"], sideItems: ["نان", "خیارشور"], reserved: false, available: true },
  },
  {
    id: "wed",
    label: "چهارشنبه",
    date: "۱۶ مهر",
    lunch: { items: ["باقالی‌پلو با ماهیچه"], sideItems: ["ماست", "سالاد"], reserved: false, available: true },
    dinner: { items: ["پیتزا"], sideItems: ["نوشابه", "سس"], reserved: false, available: true },
  },
  {
    id: "thu",
    label: "پنجشنبه",
    date: "۱۷ مهر",
    lunch: { items: ["چلوجوجه‌کباب"], sideItems: ["دوغ", "سالاد"], reserved: false, available: false },
    dinner: { items: ["—"], sideItems: [], reserved: false, available: false },
  },
];
