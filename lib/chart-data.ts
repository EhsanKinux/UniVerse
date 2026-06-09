export interface ChartPdf {
  title: string;
  fileName: string;
  url: string;
  badge?: string;
}

export interface Department {
  id: string;
  title: string;
  icon: string;
  color: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  pdfs: ChartPdf[];
}

export const departments: Department[] = [
  {
    id: "computer",
    title: "مهندسی کامپیوتر",
    icon: "💻",
    color: "var(--color-computer)",
    colorClass: "text-computer",
    bgClass: "bg-computer/10",
    borderClass: "border-computer/20",
    pdfs: [
      {
        title: "کارشناسی مهندسی نرم‌افزار قبل ۱۴۰۳",
        fileName: "software-eng-before-1403.pdf",
        url: "#",
        badge: "قبل ۱۴۰۳",
      },
      {
        title: "کارشناسی مهندسی کامپیوتر ورودی ۱۴۰۳ به بعد",
        fileName: "computer-eng-1403-onward.pdf",
        url: "#",
        badge: "۱۴۰۳ به بعد",
      },
      {
        title: "کارشناسی مهندسی فناوری اطلاعات قبل ۱۴۰۳",
        fileName: "it-eng-before-1403.pdf",
        url: "#",
        badge: "قبل ۱۴۰۳",
      },
    ],
  },
  {
    id: "material",
    title: "مهندسی مواد",
    icon: "🔬",
    color: "var(--color-material)",
    colorClass: "text-material",
    bgClass: "bg-material/10",
    borderClass: "border-material/20",
    pdfs: [
      {
        title: "کارشناسی مهندسی مواد و متالورژی قبل ۱۴۰۳",
        fileName: "material-eng-before-1403.pdf",
        url: "#",
        badge: "قبل ۱۴۰۳",
      },
      {
        title: "کارشناسی مهندسی مواد و متالورژی ورودی ۱۴۰۳ به بعد",
        fileName: "material-eng-1403-onward.pdf",
        url: "#",
        badge: "۱۴۰۳ به بعد",
      },
    ],
  },
  {
    id: "mechanical",
    title: "مهندسی مکانیک",
    icon: "⚙️",
    color: "var(--color-mechanical)",
    colorClass: "text-mechanical",
    bgClass: "bg-mechanical/10",
    borderClass: "border-mechanical/20",
    pdfs: [
      {
        title: "کارشناسی مهندسی مکانیک قبل ۱۴۰۳",
        fileName: "mechanical-eng-before-1403.pdf",
        url: "#",
        badge: "قبل ۱۴۰۳",
      },
      {
        title: "کارشناسی مهندسی مکانیک ورودی ۱۴۰۳ به بعد",
        fileName: "mechanical-eng-1403-onward.pdf",
        url: "#",
        badge: "۱۴۰۳ به بعد",
      },
    ],
  },
  {
    id: "mining",
    title: "مهندسی معدن",
    icon: "⛏️",
    color: "var(--color-mining)",
    colorClass: "text-mining",
    bgClass: "bg-mining/10",
    borderClass: "border-mining/20",
    pdfs: [
      {
        title: "کارشناسی مهندسی معدن قبل ۱۴۰۳",
        fileName: "mining-eng-before-1403.pdf",
        url: "#",
        badge: "قبل ۱۴۰۳",
      },
      {
        title: "کارشناسی مهندسی معدن ورودی ۱۴۰۳ به بعد",
        fileName: "mining-eng-1403-onward.pdf",
        url: "#",
        badge: "۱۴۰۳ به بعد",
      },
    ],
  },
  {
    id: "chemical",
    title: "مهندسی شیمی",
    icon: "🧪",
    color: "var(--color-chemical)",
    colorClass: "text-chemical",
    bgClass: "bg-chemical/10",
    borderClass: "border-chemical/20",
    pdfs: [
      {
        title: "کارشناسی مهندسی شیمی قبل ۱۴۰۳",
        fileName: "chemical-eng-before-1403.pdf",
        url: "#",
        badge: "قبل ۱۴۰۳",
      },
      {
        title: "کارشناسی مهندسی شیمی ورودی ۱۴۰۳ به بعد",
        fileName: "chemical-eng-1403-onward.pdf",
        url: "#",
        badge: "۱۴۰۳ به بعد",
      },
    ],
  },
  {
    id: "biomedical",
    title: "مهندسی پزشکی",
    icon: "🏥",
    color: "var(--color-biomedical)",
    colorClass: "text-biomedical",
    bgClass: "bg-biomedical/10",
    borderClass: "border-biomedical/20",
    pdfs: [
      {
        title: "کارشناسی مهندسی پزشکی (بیوالکتریک) قبل ۱۴۰۳",
        fileName: "biomedical-eng-before-1403.pdf",
        url: "#",
        badge: "قبل ۱۴۰۳",
      },
      {
        title: "کارشناسی مهندسی پزشکی ورودی ۱۴۰۳ به بعد",
        fileName: "biomedical-eng-1403-onward.pdf",
        url: "#",
        badge: "۱۴۰۳ به بعد",
      },
    ],
  },
  {
    id: "electrical",
    title: "مهندسی برق",
    icon: "⚡",
    color: "var(--color-electrical)",
    colorClass: "text-electrical",
    bgClass: "bg-electrical/10",
    borderClass: "border-electrical/20",
    pdfs: [
      {
        title: "کارشناسی مهندسی برق (الکترونیک) قبل ۱۴۰۳",
        fileName: "electrical-electronics-before-1403.pdf",
        url: "#",
        badge: "قبل ۱۴۰۳",
      },
      {
        title: "کارشناسی مهندسی برق ورودی ۱۴۰۳ به بعد",
        fileName: "electrical-eng-1403-onward.pdf",
        url: "#",
        badge: "۱۴۰۳ به بعد",
      },
      {
        title: "کارشناسی مهندسی برق (قدرت) قبل ۱۴۰۳",
        fileName: "electrical-power-before-1403.pdf",
        url: "#",
        badge: "قبل ۱۴۰۳",
      },
    ],
  },
];
