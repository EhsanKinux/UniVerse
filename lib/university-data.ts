import {
  Calendar03Icon,
  Book02Icon,
  Building05Icon,
  GraduationScrollIcon,
  CallIcon,
  ArrowReloadHorizontalIcon,
  Notebook02Icon,
  SchoolIcon,
  Clock01Icon,
  UserGroupIcon,
  RiceBowlIcon,
  DashboardSquare03Icon,
  Home01Icon,
} from "@hugeicons/core-free-icons";

export const moduleGroups = {
  educational: [
    {
      title: "چارت آموزشی",
      href: "/chart",
      icon: GraduationScrollIcon,
      tone: "text-violet-600 border-violet-500/15 from-violet-500/18 via-violet-500/8 shadow-violet-500/25 dark:text-violet-300",
    },
    {
      title: "تقویم آموزشی",
      href: "/calendar",
      icon: Calendar03Icon,
      tone: "text-sky-600 border-sky-500/15 from-sky-500/18 via-sky-500/8 shadow-sky-500/25 dark:text-sky-300",
    },
    {
      title: "دروس ارائه‌شده",
      href: "/courses",
      icon: Book02Icon,
      tone: "text-emerald-600 border-emerald-500/15 from-emerald-500/18 via-emerald-500/8 shadow-emerald-500/25 dark:text-emerald-300",
    },
    {
      title: "نمرات",
      href: "/grades",
      icon: Notebook02Icon,
      tone: "text-amber-600 border-amber-500/15 from-amber-500/18 via-amber-500/8 shadow-amber-500/25 dark:text-amber-300",
    },
  ],

  services: [
    {
      title: "سامانه‌ها",
      href: "/systems",
      icon: Building05Icon,
      tone: "text-indigo-600 border-indigo-500/15 from-indigo-500/18 via-indigo-500/8 shadow-indigo-500/25 dark:text-indigo-300",
    },
    {
      title: "شماره‌های دانشگاه",
      href: "/phone-list",
      icon: CallIcon,
      tone: "text-rose-600 border-rose-500/15 from-rose-500/18 via-rose-500/8 shadow-rose-500/25 dark:text-rose-300",
    },
    {
      title: "حذف و اضافه",
      href: "/add-drop",
      icon: ArrowReloadHorizontalIcon,
      tone: "text-cyan-600 border-cyan-500/15 from-cyan-500/18 via-cyan-500/8 shadow-cyan-500/25 dark:text-cyan-300",
    },
  ],

  student: [
    {
      title: "غذای هفته",
      href: "/food-week",
      icon: RiceBowlIcon,
      tone: "text-orange-600 border-orange-500/15 from-orange-500/18 via-orange-500/8 shadow-orange-500/25 dark:text-orange-300",
    },
    {
      title: "برنامه هفتگی",
      href: "/weekly-schedule",
      icon: Clock01Icon,
      tone: "text-teal-600 border-teal-500/15 from-teal-500/18 via-teal-500/8 shadow-teal-500/25 dark:text-teal-300",
    },
    {
      title: "گروه‌ها",
      href: "/groups",
      icon: UserGroupIcon,
      tone: "text-fuchsia-600 border-fuchsia-500/15 from-fuchsia-500/18 via-fuchsia-500/8 shadow-fuchsia-500/25 dark:text-fuchsia-300",
    },
  ],
} as const;

export const sectionPages = {
  educational: {
    eyebrow: "امور آموزشی",
    title: "بخش آموزشی",
    description: "چارت، تقویم، درس‌ها و نمرات را در یک فضای سریع و منظم دنبال کنید.",
    modules: moduleGroups.educational,
    stats: ["۴ سرویس", "آماده توسعه", "موبایل‌فرست"],
  },
  services: {
    eyebrow: "خدمات دانشگاهی",
    title: "بخش خدمات دانشگاهی",
    description: "سامانه‌ها، تماس‌ها و فرایندهای اداری را با دسترسی مستقیم مدیریت کنید.",
    modules: moduleGroups.services,
    stats: ["۳ سرویس", "دسترسی فوری", "فرایندمحور"],
  },
  student: {
    eyebrow: "زندگی دانشجویی",
    title: "بخش دانشجویی",
    description: "غذا، برنامه هفتگی و گروه‌ها را برای کارهای روزانه دانشجو یکجا ببینید.",
    modules: moduleGroups.student,
    stats: ["۳ سرویس", "روزمره", "کاربردی"],
  },
} as const;

export const modulePages = {
  chart: {
    module: moduleGroups.educational[0],
    sectionHref: "/educational",
    sectionTitle: "بخش آموزشی",
    status: "به‌روز",
    description: "نمای کلی مسیر تحصیلی، پیش‌نیازها و درس‌های هر ترم را با ساختار خوانا دنبال کنید.",
    highlights: ["نمای ترمی دروس", "تفکیک پیش‌نیازها", "آماده اتصال به داده واقعی"],
    primaryAction: "مشاهده چارت",
  },
  calendar: {
    module: moduleGroups.educational[1],
    sectionHref: "/educational",
    sectionTitle: "بخش آموزشی",
    status: "فعال",
    description: "رویدادهای مهم آموزشی، بازه انتخاب واحد، حذف و اضافه و امتحانات را یکجا ببینید.",
    highlights: ["رویدادهای نیمسال", "یادآوری زمان‌های مهم", "مرتب برای اسکن سریع"],
    primaryAction: "مشاهده تقویم",
  },
  courses: {
    module: moduleGroups.educational[2],
    sectionHref: "/educational",
    sectionTitle: "بخش آموزشی",
    status: "آماده",
    description: "درس‌های ارائه‌شده، گروه‌ها، استادها و ظرفیت‌ها در این صفحه قابل توسعه هستند.",
    highlights: ["لیست گروه‌های درسی", "جست‌وجوی سریع", "فیلتر براساس ترم"],
    primaryAction: "مرور درس‌ها",
  },
  grades: {
    module: moduleGroups.educational[3],
    sectionHref: "/educational",
    sectionTitle: "بخش آموزشی",
    status: "خصوصی",
    description: "نمرات، معدل ترمی و وضعیت آموزشی دانشجو در یک نمای امن و خلاصه نمایش داده می‌شود.",
    highlights: ["نمای نمرات ترم", "خلاصه معدل", "حریم خصوصی دانشجو"],
    primaryAction: "مشاهده نمرات",
  },
  systems: {
    module: moduleGroups.services[0],
    sectionHref: "/services",
    sectionTitle: "بخش خدمات",
    status: "فعال",
    description: "لینک سامانه‌های پرکاربرد دانشگاه با اولویت‌بندی و دسترسی سریع در این بخش قرار می‌گیرد.",
    highlights: ["دسترسی مستقیم", "گروه‌بندی سامانه‌ها", "مناسب PWA"],
    primaryAction: "ورود به سامانه‌ها",
  },
  "phone-list": {
    module: moduleGroups.services[1],
    sectionHref: "/services",
    sectionTitle: "بخش خدمات",
    status: "به‌روز",
    description: "شماره‌های ضروری دانشگاه، داخلی‌ها و مسیر تماس با بخش‌های مختلف را سریع پیدا کنید.",
    highlights: ["تماس سریع", "دسته‌بندی واحدها", "جست‌وجوی داخلی"],
    primaryAction: "مشاهده شماره‌ها",
  },
  "add-drop": {
    module: moduleGroups.services[2],
    sectionHref: "/services",
    sectionTitle: "بخش خدمات",
    status: "زمان‌بندی‌شده",
    description: "فرایند حذف و اضافه، وضعیت درخواست‌ها و راهنمای انجام مراحل در این صفحه قرار می‌گیرد.",
    highlights: ["ثبت درخواست", "پیگیری وضعیت", "راهنمای مرحله‌ای"],
    primaryAction: "شروع فرایند",
  },
  "food-week": {
    module: moduleGroups.student[0],
    sectionHref: "/student",
    sectionTitle: "بخش دانشجویی",
    status: "روزانه",
    description: "برنامه غذای هفته، رزرو غذا و وضعیت وعده‌ها برای تجربه روزمره دانشجویی طراحی می‌شود.",
    highlights: ["برنامه هفتگی غذا", "رزرو سریع", "وضعیت وعده‌ها"],
    primaryAction: "مشاهده غذا",
  },
  "weekly-schedule": {
    module: moduleGroups.student[1],
    sectionHref: "/student",
    sectionTitle: "بخش دانشجویی",
    status: "شخصی",
    description: "برنامه کلاس‌ها، زمان‌ها و مکان‌ها در یک نمای موبایل‌فرست و قابل اسکن نمایش داده می‌شود.",
    highlights: ["کلاس‌های امروز", "نمای هفتگی", "جزئیات زمان و مکان"],
    primaryAction: "مشاهده برنامه",
  },
  groups: {
    module: moduleGroups.student[2],
    sectionHref: "/student",
    sectionTitle: "بخش دانشجویی",
    status: "اجتماعی",
    description: "گروه‌های کلاسی و دانشجویی، کانال‌های ارتباطی و لینک‌های مرتبط اینجا سازمان‌دهی می‌شوند.",
    highlights: ["گروه‌های کلاسی", "لینک‌های ارتباطی", "دسترسی سریع"],
    primaryAction: "مشاهده گروه‌ها",
  },
} as const;

export type ModulePageKey = keyof typeof modulePages;

export const bottomTabs = [
  {
    title: "خانه",
    href: "/",
    icon: Home01Icon,
  },
  {
    title: "آموزشی",
    href: "/educational",
    icon: DashboardSquare03Icon,
  },
  {
    title: "خدمات",
    href: "/services",
    icon: Building05Icon,
  },
  {
    title: "دانشجو",
    href: "/student",
    icon: SchoolIcon,
  },
] as const;
