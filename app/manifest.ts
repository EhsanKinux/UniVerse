import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Universe - سامانه یکپارچه مدیریت دانشگاه",
    short_name: "Universe",
    description: "اپلیکیشن یکپارچه مدیریت دانشگاه به زبان فارسی",
    start_url: "/",
    scope: "/",
    display: "standalone",
    // Prefer the most app-like display mode the platform supports, falling back gracefully.
    display_override: ["standalone", "minimal-ui"],
    orientation: "portrait",
    background_color: "#081120",
    theme_color: "#081120",
    lang: "fa",
    dir: "rtl",
    categories: ["education", "productivity", "utilities"],
    icons: [
      { src: "/icons/u-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/u512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // Maskable icons: the mark within the ~80% safe zone so Android adaptive
      // (circle / squircle) masks never clip it.
      { src: "/icons/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    // Long-press launcher menu (Android) / jump list.
    shortcuts: [
      {
        name: "برنامه هفتگی",
        short_name: "برنامه",
        url: "/weekly-schedule",
        icons: [{ src: "/icons/u-192x192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "تقویم آموزشی",
        short_name: "تقویم",
        url: "/calendar",
        icons: [{ src: "/icons/u-192x192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "منوی غذا",
        short_name: "غذا",
        url: "/food-week",
        icons: [{ src: "/icons/u-192x192.png", sizes: "192x192", type: "image/png" }],
      },
    ],
    // Shown in the richer Android install dialog. `form_factor: "narrow"` = phone.
    screenshots: [
      {
        src: "/screenshots/home.jpg",
        sizes: "824x1830",
        type: "image/jpeg",
        form_factor: "narrow",
        label: "صفحه اصلی",
      },
      {
        src: "/screenshots/sign-in.jpg",
        sizes: "824x1830",
        type: "image/jpeg",
        form_factor: "narrow",
        label: "ورود به حساب",
      },
      {
        src: "/screenshots/sign-up.jpg",
        sizes: "824x1830",
        type: "image/jpeg",
        form_factor: "narrow",
        label: "ثبت‌نام",
      },
    ],
  };
}
