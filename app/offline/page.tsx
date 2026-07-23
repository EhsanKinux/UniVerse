import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "آفلاین",
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="rounded-[2rem] border border-border bg-card/60 p-6 shadow-xl backdrop-blur-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/u-192x192.png" alt="Universe" className="h-20 w-20" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">اتصال اینترنت برقرار نیست</h1>
        <p className="max-w-sm text-sm leading-6 text-muted-foreground">
          در حال حاضر آفلاین هستید. لطفاً اتصال خود را بررسی کنید و دوباره تلاش کنید. صفحاتی که قبلاً باز کرده‌اید
          همچنان در دسترس‌اند.
        </p>
      </div>

      {/* Static page (no client JS); the SW intercepts this navigation and serves
          the cached home page once connectivity returns. */}
      <Link
        href="/"
        className="rounded-2xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition active:scale-95"
      >
        تلاش مجدد
      </Link>
    </div>
  );
}
