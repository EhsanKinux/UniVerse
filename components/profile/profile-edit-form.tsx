"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Tick02Icon,
  Mail01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";

import { cn, toEnglishDigits } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ProfileData, UpdateProfilePayload } from "@/lib/api/types";
import { type FormInput, profileSections } from "@/lib/meta/profile-fields";
import { useProfileMutations } from "@/hooks/profile";

// Numeric fields the backend validates as ASCII digits — normalise before send.
const NUMERIC_KEYS = new Set<keyof UpdateProfilePayload>([
  "phone",
  "nationalId",
  "birthDate",
  "studentId",
  "emergencyPhone",
  "entryYear",
]);

type Values = Record<string, string>;

/** Seed the form state from the current profile (everything as a string). */
function initialValues(profile: ProfileData): Values {
  const values: Values = {};
  for (const section of profileSections) {
    for (const field of section.fields) {
      for (const input of field.inputs) {
        const raw = profile[input.key as keyof ProfileData];
        values[input.key] = raw == null ? "" : String(raw);
      }
    }
  }
  return values;
}

/**
 * The full profile editor. Every field is optional: clearing one (the × button,
 * or emptying it) sends `null` to the API, which removes the value and its
 * points. On save we PATCH the whole managed set — blank = clear, filled = set.
 */
export function ProfileEditForm({
  profile,
  onDone,
}: {
  profile: ProfileData;
  onDone: () => void;
}) {
  const { update } = useProfileMutations();
  const [values, setValues] = React.useState<Values>(() => initialValues(profile));
  const [submitted, setSubmitted] = React.useState(false);

  const setValue = (key: string, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  // Per-input client-side errors (only shown after a submit attempt).
  const errors = React.useMemo(() => {
    const map: Record<string, string> = {};
    for (const section of profileSections) {
      for (const field of section.fields) {
        for (const input of field.inputs) {
          const v = values[input.key]?.trim() ?? "";
          if (v !== "" && input.validate && !input.validate(v)) {
            map[input.key] = input.error ?? "مقدار نامعتبر است.";
          }
        }
      }
    }
    return map;
  }, [values]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;

    const payload: UpdateProfilePayload = {};
    for (const section of profileSections) {
      for (const field of section.fields) {
        for (const input of field.inputs) {
          const key = input.key;
          let v = (values[key] ?? "").trim();
          if (NUMERIC_KEYS.has(key)) v = toEnglishDigits(v);
          if (key === "entryYear") {
            payload.entryYear = v === "" ? null : Number(v);
          } else {
            (payload as Record<string, string | null>)[key] = v === "" ? null : v;
          }
        }
      }
    }

    update.mutate(payload, { onSuccess: onDone });
  }

  return (
    <Card className="overflow-hidden p-5">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold tracking-tight text-foreground">ویرایش پروفایل</h1>
        <Button variant="ghost" size="icon-sm" onClick={onDone} aria-label="انصراف">
          <HugeiconsIcon icon={Cancel01Icon} size={18} />
        </Button>
      </div>

      {update.isError && (
        <div className="mb-4 rounded-xl border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-xs font-medium text-destructive">
          {update.error?.message ?? "ذخیره اطلاعات ناموفق بود. دوباره تلاش کنید."}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Read-only account email */}
        <ReadOnlyEmail email={profile.email} />

        {profileSections.map((section) => (
          <fieldset key={section.id} className="space-y-3">
            <legend className="text-sm font-bold text-foreground">{section.title}</legend>
            {section.fields.flatMap((field) =>
              field.inputs.map((input) => (
                <EditField
                  key={input.key}
                  input={input}
                  value={values[input.key] ?? ""}
                  onChange={(v) => setValue(input.key, v)}
                  onClear={() => setValue(input.key, "")}
                  error={submitted ? errors[input.key] : undefined}
                />
              )),
            )}
          </fieldset>
        ))}

        <div className="flex gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onDone}
            className="h-11 flex-1 rounded-2xl"
          >
            انصراف
          </Button>
          <Button
            type="submit"
            size="lg"
            loading={update.isPending}
            className="h-11 flex-1 rounded-2xl font-semibold shadow-sm shadow-primary/20"
          >
            <HugeiconsIcon icon={Tick02Icon} size={18} />
            ذخیره
          </Button>
        </div>
      </form>
    </Card>
  );
}

function ReadOnlyEmail({ email }: { email: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-muted-foreground">ایمیل</label>
      <div className="relative">
        <HugeiconsIcon
          icon={Mail01Icon}
          size={18}
          className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-muted-foreground"
        />
        <input
          value={email}
          dir="ltr"
          readOnly
          className="h-12 w-full cursor-not-allowed rounded-2xl border border-border bg-muted/40 pr-11 pl-4 text-right text-sm font-medium text-muted-foreground outline-none"
        />
      </div>
      <p className="px-1 text-[11px] text-muted-foreground">ایمیل حساب قابل تغییر نیست.</p>
    </div>
  );
}

const FIELD_BASE =
  "w-full rounded-2xl border bg-card/85 px-4 text-sm font-medium text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/10";

function EditField({
  input,
  value,
  onChange,
  onClear,
  error,
}: {
  input: FormInput;
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
  error?: string;
}) {
  const showClear = value.trim() !== "";

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-muted-foreground">{input.label}</label>
      <div className="relative">
        {input.kind === "textarea" ? (
          <textarea
            value={value}
            dir={input.dir}
            maxLength={input.maxLength}
            onChange={(e) => onChange(e.target.value)}
            placeholder={input.placeholder}
            rows={3}
            aria-invalid={error ? true : undefined}
            className={cn(
              FIELD_BASE,
              "resize-none py-3 pe-10",
              error ? "border-destructive/50 focus:border-destructive/50 focus:ring-destructive/10" : "border-border",
            )}
          />
        ) : input.kind === "select" ? (
          <>
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              aria-invalid={error ? true : undefined}
              className={cn(
                FIELD_BASE,
                "h-12 appearance-none pe-10",
                value === "" && "text-muted-foreground",
                error ? "border-destructive/50" : "border-border",
              )}
            >
              <option value="">انتخاب کنید…</option>
              {input.options?.map((opt) => (
                <option key={opt.value} value={opt.value} className="text-foreground">
                  {opt.label}
                </option>
              ))}
            </select>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              size={18}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground"
            />
          </>
        ) : (
          <>
            <input
              type={input.kind === "tel" ? "tel" : "text"}
              value={value}
              dir={input.dir}
              maxLength={input.maxLength}
              inputMode={input.kind === "tel" ? "tel" : undefined}
              onChange={(e) => onChange(e.target.value)}
              placeholder={input.placeholder}
              aria-invalid={error ? true : undefined}
              className={cn(
                FIELD_BASE,
                "h-12 pe-10",
                error ? "border-destructive/50 focus:border-destructive/50 focus:ring-destructive/10" : "border-border",
              )}
            />
            {showClear && (
              <button
                type="button"
                onClick={onClear}
                aria-label="پاک کردن"
                className="absolute top-1/2 left-3 -translate-y-1/2 flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:scale-90"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={14} />
              </button>
            )}
          </>
        )}
      </div>
      {error && <p className="px-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
