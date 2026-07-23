"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, MotionConfig } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, UserIcon, AlertCircleIcon } from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { useLogin, useRegister } from "@/hooks/auth";
import { toPersianDigits } from "@/lib/utils";
import { signInSchema, signUpSchema, type AuthFormValues } from "@/lib/validations/auth";
import { FormField } from "./form-field";
import { PasswordField } from "./password-field";
import { ModeSwitch } from "./mode-switch";
import { SocialAuth } from "./social-auth";

type Mode = "sign-in" | "sign-up";

const COPY: Record<Mode, { title: string; subtitle: string; cta: string; emailLabel: string; switchText: string; switchHref: string; switchCta: string }> = {
  "sign-in": {
    title: "خوش آمدید",
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

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 26 } },
} as const;

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
  const serverError = activeMutation.error ?? null;

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
            if (err.code === "EMAIL_TAKEN") setError("email", { message: err.message });
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
    <MotionConfig reducedMotion="user">
    <motion.div initial="hidden" animate="show" variants={container}>
      {/* Brand moment */}
      <motion.div variants={item} className="mb-7 flex flex-col items-center text-center">
        <div className="relative mb-4">
          {/* Accent glow behind the mark */}
          <div className="absolute inset-0 -z-10 rounded-[1.6rem] bg-primary/40 blur-2xl" />
          <div className="rounded-[1.6rem] border border-white/50 bg-card/60 p-3.5 shadow-xl shadow-primary/10 backdrop-blur-xl dark:border-white/10">
            <Image src="/icons/u-192x192.png" alt="Universe" width={192} height={192} className="h-14 w-14" priority />
          </div>
        </div>
        <h1 className="text-[1.7rem] font-black tracking-tight text-balance">
          {copy.title} <span aria-hidden>👋</span>
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground text-balance">{copy.subtitle}</p>
      </motion.div>

      {/* Card */}
      <motion.div
        variants={item}
        className="rounded-[1.75rem] border border-white/50 bg-card/60 p-5 shadow-2xl shadow-primary/5 backdrop-blur-2xl dark:border-white/10 dark:bg-card/50"
      >
        <ModeSwitch mode={mode} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
          {/* Server / network error banner */}
          {serverError && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-2xl border border-destructive/30 bg-destructive/8 px-3 py-2.5 text-xs leading-5 text-destructive"
            >
              <HugeiconsIcon icon={AlertCircleIcon} className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} />
              <div className="min-w-0 space-y-1">
                <p>{serverError.message}</p>
                {serverError.retryAfter != null && (
                  <p className="opacity-90">
                    لطفاً {formatWait(serverError.retryAfter)} دیگر دوباره تلاش کنید.
                  </p>
                )}
                {/* The technical line. Meaningless to most students, but it is
                    what turns "it says there's an error" into a report we can
                    actually trace — the code plus the server-side request id. */}
                <p dir="ltr" className="font-mono text-[10px] opacity-60">
                  {serverError.diagnostic}
                </p>
              </div>
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

          <Button
            type="submit"
            size="lg"
            loading={busy}
            className="h-12 w-full rounded-2xl text-base font-semibold shadow-lg shadow-primary/25 transition active:scale-[0.98]"
          >
            {copy.cta}
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
      </motion.div>

      {/* Switch */}
      <motion.p variants={item} className="mt-5 text-center text-sm text-muted-foreground">
        {copy.switchText}{" "}
        <Link href={copy.switchHref} className="font-semibold text-primary hover:underline">
          {copy.switchCta}
        </Link>
      </motion.p>
    </motion.div>
    </MotionConfig>
  );
}

/** Seconds → a Persian wait the student can act on ("۵ دقیقه", "۴۵ ثانیه"). */
function formatWait(seconds: number): string {
  if (seconds < 90) return `${toPersianDigits(Math.max(1, Math.round(seconds)))} ثانیه`;
  return `${toPersianDigits(Math.ceil(seconds / 60))} دقیقه`;
}
