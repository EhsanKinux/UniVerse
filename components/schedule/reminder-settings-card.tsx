"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification03Icon, RepeatIcon } from "@hugeicons/core-free-icons";

import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { usePushNotifications } from "@/hooks/push/use-push-notifications";
import { useUpdateScheduleSettings } from "@/hooks/schedule/use-schedule-settings";
import type { ScheduleSettings } from "@/lib/api/types";
import { faDigits } from "@/lib/meta/schedule-meta";
import { cn } from "@/lib/utils";

const LEAD_OPTIONS = [5, 10, 15, 30, 60] as const;

/**
 * Reminder + week-parity preferences. The switch drives BOTH layers involved in
 * a class reminder: browser push permission/subscription (device-level) and the
 * `remindersEnabled` flag on the server (account-level). The parity selector
 * tells the backend what this week is, so زوج/فرد sessions notify correctly.
 */
export function ReminderSettingsCard({ settings }: { settings: ScheduleSettings }) {
  const push = usePushNotifications();
  const updateSettings = useUpdateScheduleSettings();
  const [pushHint, setPushHint] = useState<string | null>(null);

  const remindersOn = settings.remindersEnabled && push.active;
  const busy = push.busy || updateSettings.isPending;

  async function toggleReminders(next: boolean) {
    setPushHint(null);

    if (!next) {
      // Only the account flag — the push subscription stays for news broadcasts.
      updateSettings.mutate({ remindersEnabled: false });
      return;
    }

    if (!push.supported) {
      setPushHint(
        "این مرورگر از اعلان پشتیبانی نمی‌کند. در iOS ابتدا اپ را به صفحه اصلی اضافه کنید (Add to Home Screen).",
      );
      return;
    }

    const ok = await push.enable();
    if (!ok) {
      setPushHint(
        push.permission === "denied"
          ? "اجازه اعلان در مرورگر رد شده است. از تنظیمات مرورگر اعلان‌ها را برای این سایت فعال کنید."
          : "فعال‌سازی اعلان ناموفق بود. دوباره تلاش کنید.",
      );
      return;
    }
    updateSettings.mutate({ remindersEnabled: true });
  }

  return (
    <Card className="space-y-4 p-4">
      {/* Master switch */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-background text-primary">
            <HugeiconsIcon icon={Notification03Icon} size={19} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground">یادآوری کلاس‌ها</p>
            <p className="text-[11px] leading-5 text-muted-foreground">
              قبل از شروع هر کلاس، اعلان دریافت کنید — حتی وقتی اپ بسته است.
            </p>
          </div>
        </div>
        <Switch
          checked={remindersOn}
          onCheckedChange={(checked) => void toggleReminders(checked)}
          disabled={busy}
          aria-label="یادآوری کلاس‌ها"
        />
      </div>

      {pushHint && (
        <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-[11px] leading-5 text-amber-700 dark:text-amber-300">
          {pushHint}
        </p>
      )}

      {/* Lead time */}
      {remindersOn && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-foreground/80">چند دقیقه قبل از کلاس؟</p>
          <div className="flex gap-1.5">
            {LEAD_OPTIONS.map((minutes) => {
              const active = settings.reminderLeadMinutes === minutes;
              return (
                <button
                  key={minutes}
                  onClick={() => updateSettings.mutate({ reminderLeadMinutes: minutes })}
                  disabled={updateSettings.isPending}
                  className={cn(
                    "flex-1 rounded-xl border py-2 text-xs font-bold transition-all active:scale-95",
                    active
                      ? "border-primary/20 bg-primary/12 text-primary"
                      : "border-border bg-background text-muted-foreground hover:text-foreground",
                  )}
                >
                  {faDigits(minutes)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Week parity declaration */}
      <div className="space-y-2 border-t border-border pt-3">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={RepeatIcon} size={15} className="text-primary" />
          <p className="text-xs font-medium text-foreground/80">
            این هفته {settings.currentWeekParity === null && "— هنوز تعیین نشده"}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {(["odd", "even"] as const).map((parity) => {
            const active = settings.currentWeekParity === parity;
            return (
              <button
                key={parity}
                onClick={() => updateSettings.mutate({ currentWeekParity: parity })}
                disabled={updateSettings.isPending}
                className={cn(
                  "rounded-xl border py-2 text-xs font-bold transition-all active:scale-95",
                  active
                    ? "border-primary/20 bg-primary/12 text-primary"
                    : "border-border bg-background text-muted-foreground hover:text-foreground",
                )}
              >
                هفته {parity === "odd" ? "فرد" : "زوج"} است
              </button>
            );
          })}
        </div>
        <p className="text-[10px] leading-4 text-muted-foreground">
          برای درس‌هایی که یک هفته در میان برگزار می‌شوند لازم است؛ هفته‌های بعدی خودکار محاسبه می‌شود.
        </p>
      </div>
    </Card>
  );
}
