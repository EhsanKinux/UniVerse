"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";

import { bottomTabs } from "@/lib/university-data";
import { cn } from "@/lib/utils";
import { ProfileMenu } from "./profile-menu";
import Image from "next/image";

export function MobileShell({
  children,
  title = "Universe",
  subtitle = "سامانه یکپارچه مدیریت دانشگاه",
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const pathname = usePathname();
  const activeIndex = bottomTabs.findIndex((tab) => tab.href === pathname);

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      {/* Header */}
      <header
        className="
          safe-top sticky top-0 z-30
          border-b border-border
          bg-background/80
          px-4 pb-4
          backdrop-blur-xl
          supports-backdrop-filter:bg-background/70
        "
      >
        <div className="flex items-center justify-between gap-3">
          {/* Branding */}
          <div className="flex min-w-0 items-center gap-2.5">
            <Image
              src="/icons/univers_logo.png"
              alt="Universe"
              width={40}
              height={40}
              className="size-10 shrink-0 object-contain"
              priority
            />
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-bold tracking-tight text-foreground">{title}</p>
              <p className="truncate text-[11px] text-muted-foreground">{subtitle}</p>
            </div>
          </div>

          {/* Profile */}
          <ProfileMenu />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-4">{children}</main>

      {/* Bottom Navigation — floating, liquid-glass tab bar.
          The <nav> is a transparent click-through layer; only the inner pill
          captures taps, so content stays visible/scrollable in the side gaps. */}
      <nav className="pointer-events-none sticky bottom-0 z-30 px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.85rem)]">
        <div
          className="
            pointer-events-auto relative mx-auto grid max-w-md grid-cols-4
            overflow-hidden rounded-4xl
            border border-white/40 ring-1 ring-black/5
            bg-background/70 backdrop-blur-2xl backdrop-saturate-150
            shadow-[0_12px_32px_-10px_rgba(0,0,0,0.30),inset_0_1px_0_0_rgba(255,255,255,0.30)]
            dark:border-white/10 dark:bg-background/55 dark:ring-white/5
            dark:shadow-[0_12px_36px_-10px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.12)]
          "
        >
          {/* Glass edge highlight catching the light along the top rim */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-white/70 to-transparent dark:via-white/25"
          />

          {/* Sliding active indicator. App is RTL, so array index 0 sits at the
              far right — translate from the inline-start (physical left) edge. */}
          <span
            aria-hidden
            className={cn(
              "absolute inset-y-1.5 start-0 z-0 w-1/4 px-1.5 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              activeIndex < 0 && "opacity-0",
            )}
            style={{ transform: `translateX(${(bottomTabs.length - 1 - Math.max(activeIndex, 0)) * 100}%)` }}
          >
            <span className="block size-full rounded-3xl border border-primary/20 bg-primary/12 shadow-sm" />
          </span>

          {bottomTabs.map((item, i) => {
            const active = i === activeIndex;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative z-10 flex flex-col items-center justify-center gap-1 py-2.5",
                  "text-[11px] font-medium transition-[color,transform] duration-200 active:scale-90",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <HugeiconsIcon
                  icon={item.icon}
                  className={cn("size-5 transition-transform duration-300 ease-out", active && "scale-110")}
                />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
