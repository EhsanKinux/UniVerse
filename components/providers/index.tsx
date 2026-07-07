"use client";

import { ThemeProvider } from "./theme-provider";
import { NotificationProvider } from "@/components/notifications/notification-provider";
import { QueryProvider } from "./query-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {/* Lives inside QueryProvider (it reads the news query) and renders the
            global toast stack; the news SSE subscription runs here, app-wide. */}
        <NotificationProvider>{children}</NotificationProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
