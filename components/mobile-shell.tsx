"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";

import { bottomTabs } from "@/lib/university-data";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./theme-toggleButton";
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

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      {/* Header */}
      <header
        className="
          safe-top sticky top-0 z-30
          border-b border-border
          bg-background/80
          px-4 pt-3 pb-4
          backdrop-blur-xl
          supports-backdrop-filter:bg-background/70
        "
      >
        <div className="flex items-center justify-between gap-3">
          {/* Branding */}
          <div className="min-w-0">
            <Image src="/icons/univers_logo.png" alt="Logo" width={102} height={102} />

            {/* <p className="truncate text-xs text-muted-foreground">{subtitle}</p> */}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ModeToggle />

            {/* Status Badge */}
            <div
              className="
                flex items-center gap-2
                rounded-2xl border border-border
                bg-card/80 px-3 py-2
                text-xs font-medium
                text-muted-foreground
                shadow-sm
                backdrop-blur-xl
              "
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              آنلاین
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-4">{children}</main>

      {/* Bottom Navigation */}
      <nav
        className="
          safe-bottom sticky bottom-0 z-30
          border-t border-border
          bg-background/85
          px-3 py-2
          backdrop-blur-xl
          supports-backdrop-filter:bg-background/75
        "
      >
        <div className="grid grid-cols-4 gap-2">
          {bottomTabs.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  `
                    group relative flex flex-col items-center
                    justify-center gap-1 overflow-hidden
                    rounded-2xl px-2 py-2
                    text-[11px] font-medium
                    transition-all duration-200
                    active:scale-95
                  `,
                  active
                    ? `
                      bg-primary/12
                      text-primary
                      shadow-sm
                    `
                    : `
                      text-muted-foreground
                      hover:bg-accent
                      hover:text-accent-foreground
                    `,
                )}
              >
                {/* Active Glow */}
                {active && <div className="absolute inset-0 bg-linear-to-t from-primary/10 to-transparent" />}

                <HugeiconsIcon
                  icon={item.icon}
                  className={cn(
                    "relative z-10 h-5 w-5 transition-all duration-200",
                    active ? "scale-110 text-primary" : "group-hover:scale-105",
                  )}
                />

                <span className="relative z-10">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
