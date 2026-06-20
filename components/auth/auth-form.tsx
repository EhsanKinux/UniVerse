"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, UserIcon, AlertCircleIcon } from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { useLogin, useRegister } from "@/hooks/auth";
import { signInSchema, signUpSchema, type AuthFormValues } from "@/lib/validations/auth";
import { FormField } from "./form-field";
import { PasswordField } from "./password-field";
import { ModeSwitch } from "./mode-switch";
import { SocialAuth } from "./social-auth";

type Mode = "sign-in" | "sign-up";

const COPY: Record<Mode, { title: string; subtitle: string; cta: string; emailLabel: string; switchText: string; switchHref: string; switchCta: string }> = {
  "sign-in": {
    title: "خوش آمدید 👋",
    subtitle: "برای ادامه وارد حساب کاربری خود شوید",
    cta: "ورود",
    emailLabel: "ایمیل",
    switchText: "حساب کاربری ندارید؟",
    switchHref: "/sign-up",
    switchCta: "ثبت‌نام",
  },
  "sign-up": {
    title: "ساخت حساب کاربری",
    subtitle: "در چند ثانیه حساب خود را بسازید",
    cta: "ثبت‌نام",
    emailLabel: "ایمیل",
    switchText: "قبلاً ثبت‌نام کرده‌اید؟",
    switchHref: "/sign-in",
    switchCta: "ورود",
  },
};

/** Only allow internal, absolute paths as a post-login redirect (no open redirects). */
function safeRedirectTarget(): string {
  if (typeof window === "undefined") return "/";
  const target = new URLSearchParams(window.location.search).get("redirect");
  if (target && target.startsWith("/") && !target.startsWith("//")) return target;
  return "/";
}

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const copy = COPY[mode];
  const isSignUp = mode === "sign-up";

  const login = useLogin();
  const register = useRegister();
  const [ssoNote, setSsoNote] = React.useState<string | null>(null);

  const {
    register: registerField,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
    defaultValues: { name: "", email: "", password: "", terms: false },
    mode: "onTouched",
  });

  const activeMutation = isSignUp ? register : login;
  const busy = activeMutation.isPending;
  const serverError = activeMutation.error?.message ?? null;

  function onSubmit(values: AuthFormValues) {
    setSsoNote(null);
    const email = values.email.trim();
    const password = values.password;

    if (isSignUp) {
      register.mutate(
        { email, password, name: values.name.trim() || undefined },
        {
          onSuccess: () => router.replace(safeRedirectTarget()),
          onError: (err) => {
            // Surface "email already in use" right on the field.
            if (err.status === 409) setError("email", { message: err.message });
          },
        },
      );
    } else {
      login.mutate(
        { email, password },
        { onSuccess: () => router.replace(safeRedirectTarget()) },
      );
    }
  }

  function onSso() {
    setSsoNote("ورود با شبکه‌های اجتماعی به‌زودی فعال می‌شود.");
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Brand */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-3 rounded-3xl border border-border bg-card/60 p-3 shadow-sm backdrop-blur-xl">
          <Image src="/icons/univers_logo.png" alt="Universe" width={56} height={56} className="h-14 w-14 object-contain" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{copy.title}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{copy.subtitle}</p>
      </div>

      {/* Card */}
      <div className="rounded-3xl border border-border bg-card/70 p-5 shadow-xl backdrop-blur-xl">
        <ModeSwitch mode={mode} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
          {/* Server / network error banner */}
          {serverError && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/8 px-3 py-2.5 text-xs leading-5 text-destructive"
            >
              <HugeiconsIcon icon={AlertCircleIcon} className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} />
              <span>{serverError}</span>
            </div>
          )}

          {isSignUp && (
            <FormField
              label="نام و نام خانوادگی"
              icon={UserIcon}
              placeholder="مثلاً علی رضایی"
              autoComplete="name"
              error={errors.name?.message}
              {...registerField("name")}
            />
          )}

          <FormField
            label={copy.emailLabel}
            icon={Mail01Icon}
            type="email"
            placeholder="you@university.ac.ir"
            autoComplete="email"
            dir="ltr"
            error={errors.email?.message}
            {...registerField("email")}
          />

          <PasswordField
            placeholder="••••••••"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            error={errors.password?.message}
            action={
              !isSignUp ? (
                <Link href="/sign-in" className="text-xs text-primary hover:underline">
                  فراموشی رمز؟
                </Link>
              ) : null
            }
            {...registerField("password")}
          />

          {isSignUp && (
            <div className="space-y-1">
              <label className="flex items-start gap-2 text-[11px] leading-5 text-muted-foreground">
                <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[var(--primary)]" {...registerField("terms")} />
                <span>
                  با <span className="text-foreground">قوانین و حریم خصوصی</span> موافقم.
                </span>
              </label>
              {errors.terms?.message && <p className="text-xs text-destructive">{errors.terms.message}</p>}
            </div>
          )}

          <Button type="submit" size="lg" disabled={busy} className="h-12 w-full rounded-2xl text-base font-semibold shadow-md shadow-primary/20">
            {busy ? <Spinner /> : copy.cta}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          یا ادامه با
          <span className="h-px flex-1 bg-border" />
        </div>

        <SocialAuth disabled={busy} onSelect={onSso} />
        {ssoNote && <p className="mt-3 text-center text-[11px] text-muted-foreground">{ssoNote}</p>}
      </div>

      {/* Switch */}
      <p className="mt-5 text-center text-sm text-muted-foreground">
        {copy.switchText}{" "}
        <Link href={copy.switchHref} className="font-semibold text-primary hover:underline">
          {copy.switchCta}
        </Link>
      </p>
    </div>
  );
}

function Spinner() {
  return (
    <span
      className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground"
      aria-label="در حال پردازش"
    />
  );
}
