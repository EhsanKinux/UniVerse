"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification03Icon, PaintBoardIcon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { themeOptions } from "@/lib/profile-data";
import { getNotificationsEnabled, setNotificationsEnabled } from "@/lib/preferences";
import { SectionHeading } from "./profile-ui";

export function ProfilePreferences() {
  const mounted = useMounted();
  // Override wins after the user toggles this session; otherwise read from storage.
  const [notifOverride, setNotifOverride] = React.useState<boolean | null>(null);
  const storedNotif = React.useMemo(() => (mounted ? getNotificationsEnabled() : true), [mounted]);
  const notifications = notifOverride ?? storedNotif;

  function toggleNotifications(next: boolean) {
    setNotifOverride(next);
    setNotificationsEnabled(next);
  }

  return (
    <section className="space-y-3">
      <SectionHeading title="تنظیمات" />
      <Card className="space-y-4 p-4">
        {/* Appearance */}
        <div>
          <div className="mb-2.5 flex items-center gap-2">
            <HugeiconsIcon icon={PaintBoardIcon} size={17} className="text-primary" />
            <span className="text-sm font-semibold text-foreground">ظاهر برنامه</span>
          </div>
          <ThemeSelector mounted={mounted} />
        </div>

        <div className="border-t border-border" />

        {/* Notifications */}
        <label className="flex cursor-pointer items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background">
            <HugeiconsIcon icon={Notification03Icon} size={18} className="text-primary" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-foreground">اعلان‌ها</span>
            <span className="block text-[11px] text-muted-foreground">دریافت یادآوری‌ها و اطلاعیه‌ها</span>
          </span>
          <Switch checked={mounted ? notifications : false} onCheckedChange={toggleNotifications} aria-label="اعلان‌ها" />
        </label>
      </Card>
    </section>
  );
}

function ThemeSelector({ mounted }: { mounted: boolean }) {
  const { theme, setTheme } = useTheme();
  const active = mounted ? theme : undefined;

  return (
    <div className="grid grid-cols-3 gap-1.5 rounded-2xl border border-border bg-background/60 p-1.5">
      {themeOptions.map((opt) => {
        const selected = active === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setTheme(opt.value)}
            aria-pressed={selected}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-xl py-2.5 text-xs font-medium transition-all active:scale-95",
              selected
                ? "bg-primary/12 text-primary shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <HugeiconsIcon icon={opt.icon} size={18} />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
