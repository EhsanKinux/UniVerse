"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { Cancel01Icon, Mail01Icon, SmartPhone01Icon, Tick02Icon, UserIcon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLocalProfile, updateLocalProfile } from "@/lib/local-profile";

const phoneValid = (v: string) => v.trim() === "" || /^[0-9۰-۹+\s()-]{6,}$/.test(v.trim());

export function ProfileEditCard({
  email,
  serverName,
  onCancel,
  onSaved,
}: {
  /** Account email — read-only (the backend has no profile-update endpoint). */
  email: string;
  /** Display name from the server, used as the default when no local override. */
  serverName: string | null;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const local = getLocalProfile();
  const [name, setName] = React.useState(local.name ?? serverName ?? "");
  const [phone, setPhone] = React.useState(local.phone ?? "");
  const [submitted, setSubmitted] = React.useState(false);

  const nameOk = name.trim().length >= 2;
  const pOk = phoneValid(phone);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nameOk || !pOk) {
      setSubmitted(true);
      return;
    }
    updateLocalProfile({
      name: name.trim(),
      phone: phone.trim() || undefined,
    });
    onSaved();
  }

  return (
    <Card className="overflow-hidden p-5">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold tracking-tight text-foreground">ویرایش پروفایل</h1>
        <Button variant="ghost" size="icon-sm" onClick={onCancel} aria-label="انصراف">
          <HugeiconsIcon icon={Cancel01Icon} size={18} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <EditField
          label="نام و نام خانوادگی"
          icon={UserIcon}
          value={name}
          onChange={setName}
          placeholder="مثلاً علی رضایی"
          autoComplete="name"
          error={submitted && !nameOk ? "نام را کامل وارد کنید." : undefined}
        />
        <EditField
          label="ایمیل"
          icon={Mail01Icon}
          value={email}
          onChange={() => {}}
          placeholder="you@university.ac.ir"
          type="email"
          dir="ltr"
          autoComplete="email"
          readOnly
          hint="ایمیل حساب قابل تغییر نیست."
        />
        <EditField
          label="شماره تماس (اختیاری)"
          icon={SmartPhone01Icon}
          value={phone}
          onChange={setPhone}
          placeholder="۰۹۱۲۳۴۵۶۷۸۹"
          type="tel"
          dir="ltr"
          autoComplete="tel"
          error={submitted && !pOk ? "شماره تماس معتبر نیست." : undefined}
        />

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="outline" size="lg" onClick={onCancel} className="h-11 flex-1 rounded-2xl">
            انصراف
          </Button>
          <Button type="submit" size="lg" className="h-11 flex-1 rounded-2xl font-semibold shadow-sm shadow-primary/20">
            <HugeiconsIcon icon={Tick02Icon} size={18} />
            ذخیره
          </Button>
        </div>
      </form>
    </Card>
  );
}

function EditField({
  label,
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
  dir,
  autoComplete,
  error,
  readOnly,
  hint,
}: {
  label: string;
  icon: IconSvgElement;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  dir?: "ltr" | "rtl";
  autoComplete?: string;
  error?: string;
  readOnly?: boolean;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-muted-foreground">{label}</label>
      <div className="relative">
        <HugeiconsIcon
          icon={icon}
          size={18}
          className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type={type}
          value={value}
          dir={dir}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          readOnly={readOnly}
          aria-invalid={error ? true : undefined}
          className={cn(
            "h-12 w-full rounded-2xl border bg-card/85 pr-11 pl-4 text-sm font-medium text-foreground",
            "shadow-sm outline-none transition-all placeholder:text-muted-foreground",
            "focus:border-primary/40 focus:ring-2 focus:ring-primary/10",
            readOnly && "cursor-not-allowed bg-muted/40 text-muted-foreground focus:border-border focus:ring-0",
            error ? "border-destructive/50 focus:border-destructive/50 focus:ring-destructive/10" : "border-border",
          )}
        />
      </div>
      {error && <p className="px-1 text-xs text-destructive">{error}</p>}
      {!error && hint && <p className="px-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}
