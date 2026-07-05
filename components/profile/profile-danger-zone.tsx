"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, Alert02Icon, Loading03Icon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { useDeleteAccount } from "@/hooks/auth";

/**
 * The "danger zone" — permanently delete the account. Because it's irreversible,
 * we confirm in a bottom sheet that requires the current password (re-auth), and
 * spell out exactly what gets removed. The hook clears the session and redirects
 * on success.
 */
export function ProfileDangerZone() {
  const [open, setOpen] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const del = useDeleteAccount();

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setPassword("");
      del.reset();
    }
  }

  function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim() || del.isPending) return;
    del.mutate(password);
  }

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        onClick={() => setOpen(true)}
        className="h-12 w-full rounded-2xl border-destructive/30 text-base font-semibold text-destructive hover:bg-destructive/5 hover:text-destructive"
      >
        <HugeiconsIcon icon={Delete02Icon} size={20} />
        حذف حساب کاربری
      </Button>

      <Sheet
        open={open}
        onOpenChange={handleOpenChange}
        title="حذف حساب کاربری"
        description="این عمل قابل بازگشت نیست."
      >
        <form onSubmit={handleConfirm} className="space-y-4 pt-1 pb-5">
          <div className="flex gap-3 rounded-2xl border border-destructive/25 bg-destructive/5 p-3.5">
            <HugeiconsIcon icon={Alert02Icon} size={20} className="mt-0.5 shrink-0 text-destructive" />
            <p className="text-xs leading-6 text-foreground">
              با حذف حساب، همه اطلاعات شما شامل پروفایل، تصویر، برنامه هفتگی و تنظیمات برای همیشه پاک
              می‌شود و امکان بازیابی وجود ندارد.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-muted-foreground">
              برای تأیید، رمز عبور خود را وارد کنید
            </label>
            <input
              type="password"
              value={password}
              dir="ltr"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              aria-invalid={del.isError ? true : undefined}
              className={cn(
                "h-12 w-full rounded-2xl border bg-card/85 px-4 text-right text-sm font-medium text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground focus:border-destructive/40 focus:ring-2 focus:ring-destructive/10",
                del.isError ? "border-destructive/50" : "border-border",
              )}
            />
            {del.isError && (
              <p className="px-1 text-xs text-destructive">
                {del.error?.message ?? "حذف حساب ناموفق بود."}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => handleOpenChange(false)}
              className="h-11 flex-1 rounded-2xl"
            >
              انصراف
            </Button>
            <Button
              type="submit"
              variant="destructive"
              size="lg"
              disabled={!password.trim() || del.isPending}
              className="h-11 flex-1 rounded-2xl font-semibold"
            >
              <HugeiconsIcon
                icon={del.isPending ? Loading03Icon : Delete02Icon}
                size={18}
                className={cn(del.isPending && "animate-spin")}
              />
              حذف قطعی
            </Button>
          </div>
        </form>
      </Sheet>
    </>
  );
}
