"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { Cancel01Icon, Mail01Icon, SmartPhone01Icon, Tick02Icon, UserIcon } from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { updateMockUser, type MockUser } from "@/lib/auth";

const emailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const phoneValid = (v: string) => v.trim() === "" || /^[0-9۰-۹+\s()-]{6,}$/.test(v.trim());

export function ProfileEditCard({
  user,
  onCancel,
  onSaved,
}: {
  user: MockUser | null;
  onCancel: () => void;
  onSaved: (user: MockUser) => void;
}) {
  const [name, setName] = React.useState(user?.name ?? "");
  const [email, setEmail] = React.useState(user?.email ?? "");
  const [phone, setPhone] = React.useState(user?.phone ?? "");
  const [submitted, setSubmitted] = React.useState(false);

  const nameOk = name.trim().length >= 2;
  const eOk = emailValid(email);
  const pOk = phoneValid(phone);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nameOk || !eOk || !pOk) {
      setSubmitted(true);
      return;
    }
    const updated = updateMockUser({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
    });
    if (updated) onSaved(updated);
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
          onChange={setEmail}
          placeholder="you@university.ac.ir"
          type="email"
          dir="ltr"
          autoComplete="email"
          error={submitted && !eOk ? "ایمیل معتبر نیست." : undefined}
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
          aria-invalid={error ? true : undefined}
          className={cn(
            "h-12 w-full rounded-2xl border bg-card/85 pr-11 pl-4 text-sm font-medium text-foreground",
            "shadow-sm outline-none transition-all placeholder:text-muted-foreground",
            "focus:border-primary/40 focus:ring-2 focus:ring-primary/10",
            error ? "border-destructive/50 focus:border-destructive/50 focus:ring-destructive/10" : "border-border",
          )}
        />
      </div>
      {error && <p className="px-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
