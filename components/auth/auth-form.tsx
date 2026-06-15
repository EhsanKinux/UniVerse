"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, UserIcon, Idea01Icon } from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { signInMock } from "@/lib/auth";
import { signInSchema, signUpSchema, type AuthFormValues } from "@/lib/validations/auth";
import { FormField } from "./form-field";
import { PasswordField } from "./password-field";
import { ModeSwitch } from "./mode-switch";
import { SocialAuth, type SsoProvider } from "./social-auth";

type Mode = "sign-in" | "sign-up";

const COPY: Record<Mode, { title: string; subtitle: string; cta: string; emailLabel: string; switchText: string; switchHref: string; switchCta: string }> = {
  "sign-in": {
    title: "خوش آمدید 👋",
    subtitle: "برای ادامه وارد حساب کاربری خود شوید",
    cta: "ورود",
    emailLabel: "ایمیل یا شماره دانشجویی",
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

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const copy = COPY[mode];
  const isSignUp = mode === "sign-up";
  const [ssoPending, setSsoPending] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
    defaultValues: { name: "", email: "", password: "", terms: false },
    mode: "onTouched",
  });

  const busy = isSubmitting || ssoPending;

  async function onSubmit(values: AuthFormValues) {
    // Mock auth: fake a short round-trip, persist the user, then enter the app.
    await new Promise((resolve) => setTimeout(resolve, 700));
    signInMock({ name: values.name?.trim() || values.email.split("@")[0] || "کاربر", email: values.email });
    router.replace("/");
  }

  function onSso(provider: SsoProvider) {
    setSsoPending(true);
    window.setTimeout(() => {
      signInMock({ name: `کاربر ${provider}`, email: `${provider.toLowerCase()}@universe.app` });
      router.replace("/");
    }, 700);
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
          {isSignUp && (
            <FormField
              label="نام و نام خانوادگی"
              icon={UserIcon}
              placeholder="مثلاً علی رضایی"
              autoComplete="name"
              error={errors.name?.message}
              {...register("name")}
            />
          )}

          <FormField
            label={copy.emailLabel}
            icon={Mail01Icon}
            type={isSignUp ? "email" : "text"}
            placeholder="you@university.ac.ir"
            autoComplete={isSignUp ? "email" : "username"}
            dir="ltr"
            error={errors.email?.message}
            {...register("email")}
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
            {...register("password")}
          />

          {/* Demo hint */}
          <div className="flex items-start gap-2 rounded-xl bg-primary/8 px-3 py-2 text-[11px] leading-5 text-muted-foreground">
            <HugeiconsIcon icon={Idea01Icon} className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.8} />
            <span>حالت نمایشی است؛ با هر ایمیل و رمزی می‌توانید وارد شوید.</span>
          </div>

          {isSignUp && (
            <div className="space-y-1">
              <label className="flex items-start gap-2 text-[11px] leading-5 text-muted-foreground">
                <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[var(--primary)]" {...register("terms")} />
                <span>
                  با <span className="text-foreground">قوانین و حریم خصوصی</span> موافقم.
                </span>
              </label>
              {errors.terms?.message && <p className="text-xs text-destructive">{errors.terms.message}</p>}
            </div>
          )}

          <Button type="submit" size="lg" disabled={busy} className="h-12 w-full rounded-2xl text-base font-semibold shadow-md shadow-primary/20">
            {isSubmitting ? <Spinner /> : copy.cta}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          یا ادامه با
          <span className="h-px flex-1 bg-border" />
        </div>

        <SocialAuth disabled={busy} onSelect={onSso} />
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
