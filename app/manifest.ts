import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Universe - سامانه یکپارچه مدیریت دانشگاه",
    short_name: "Universe",
    description: "اپلیکیشن یکپارچه مدیریت دانشگاه به زبان فارسی",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#081120",
    theme_color: "#081120",
    lang: "fa",
    dir: "rtl",
    icons: [
      {
        src: "/icons/u-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/u512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/u512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}