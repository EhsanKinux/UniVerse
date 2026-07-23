"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";

import { bottomTabs } from "@/lib/data/university-data";
import { cn } from "@/lib/utils";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NotificationBell } from "../notifications/notification-bell";
import { ProfileMenu } from "../profile/profile-menu";
import { AppSidebar } from "./app-sidebar";
import { PullToRefresh } from "./pull-to-refresh";

/**
 * Responsive app frame. Below lg: sticky header + floating bottom tab bar
 * (the original mobile shell, untouched). From lg up: the tab bar disappears
 * and AppSidebar provides navigation, with content in a centered column.
 */
export function AppShell({
  children,
  subtitle = "سامانه یکپارچه مدیریت دانشگاه",
}: {
  children: React.ReactNode;
  subtitle?: string;
}) {
  const pathname = usePathname();
  const activeIndex = bottomTabs.findIndex((tab) => tab.href === pathname);

  // Pull-to-refresh re-runs whatever queries the current screen is using.
  const queryClient = useQueryClient();
  const handleRefresh = React.useCallback(
    () => queryClient.refetchQueries({ type: "active" }),
    [queryClient],
  );

  return (
    <TooltipProvider>
      <SidebarProvider className="bg-background text-foreground">
        <AppSidebar />

        <div className="flex min-h-dvh w-full min-w-0 flex-1 flex-col">
          {/* Header */}
          <header
            className="
              safe-top sticky top-0 z-30
              border-b border-border
              bg-background/80
              px-4 pb-4
              backdrop-blur-xl
              supports-backdrop-filter:bg-background/70
              lg:px-8
            "
          >
            <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 lg:max-w-6xl">
              {/* Branding — the logo is a full "UniVerse" wordmark, so it stands in
                  for the title on its own; only the contextual subtitle sits beside it.
                  On lg+ the sidebar carries the branding, so the header keeps just the
                  sidebar trigger and the contextual subtitle. */}
              <div className="flex min-w-0 items-center gap-2.5">
                <SidebarTrigger className="hidden lg:inline-flex" />
                <Image
                  src="/icons/univers_logo.png"
                  alt="UniVerse"
                  width={156}
                  height={88}
                  className="h-9 w-auto shrink-0 object-contain lg:hidden"
                  priority
                />
                {subtitle && (
                  <p className="min-w-0 truncate text-[11px] leading-tight text-muted-foreground lg:text-xs">
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Notifications + profile */}
              <div className="flex shrink-0 items-center gap-2">
                <NotificationBell />
                <ProfileMenu />
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 px-4 py-4 lg:px-8 lg:py-6">
            <PullToRefresh onRefresh={handleRefresh}>
              <div className="mx-auto w-full max-w-3xl lg:max-w-6xl">{children}</div>
            </PullToRefresh>
          </main>

          {/* Bottom Navigation — floating, liquid-glass tab bar (mobile/tablet only).
              The <nav> is a transparent click-through layer; only the inner pill
              captures taps, so content stays visible/scrollable in the side gaps. */}
          <nav className="pointer-events-none sticky bottom-0 z-30 px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.85rem)] lg:hidden">
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

              {/* Sliding active indicator. App is RTL: `start-0` pins it to the
                  physical RIGHT edge, under array index 0. translateX is always
                  physical (unaffected by direction), so each step through the
                  array moves one slot to the LEFT — hence the negative sign. */}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-y-1.5 start-0 z-0 w-1/4 px-1.5 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  activeIndex < 0 && "opacity-0",
                )}
                style={{ transform: `translateX(-${Math.max(activeIndex, 0) * 100}%)` }}
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
      </SidebarProvider>
    </TooltipProvider>
  );
}
