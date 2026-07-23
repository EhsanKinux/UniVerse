"use client";

import { MotionConfig } from "motion/react";

import { ThemeProvider } from "./theme-provider";
import { NotificationProvider } from "@/components/notifications/notification-provider";
import { QueryProvider } from "./query-provider";
import { NavigationProgress } from "@/components/layout/navigation-progress";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {/* One place to honour the OS "reduce motion" setting for every Framer
            Motion animation in the app (loaders, onboarding, auth, …). */}
        <MotionConfig reducedMotion="user">
          {/* Top-of-screen progress bar for route transitions. */}
          <NavigationProgress />
          {/* Lives inside QueryProvider (it reads the news query) and renders the
              global toast stack; the news SSE subscription runs here, app-wide. */}
          <NotificationProvider>{children}</NotificationProvider>
        </MotionConfig>
      </ThemeProvider>
    </QueryProvider>
  );
}
