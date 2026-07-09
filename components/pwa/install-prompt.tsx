"use client";

import * as React from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Download01Icon,
  Cancel01Icon,
  SquareArrowUp01Icon,
  PlusSignSquareIcon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";

// `beforeinstallprompt` isn't in the standard DOM lib types.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISS_KEY = "universe_install_dismissed_v1";

/** True when the app is already running as an installed PWA. */
function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari exposes this non-standard flag when launched from the home screen.
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/** iOS Safari never fires `beforeinstallprompt`; installing is a manual
 *  Share → "Add to Home Screen" flow, and only Safari can do it. */
function isIOSSafari(): boolean {
  const ua = window.navigator.userAgent;
  const ios =
    /iphone|ipad|ipod/i.test(ua) ||
    // iPadOS 13+ reports as desktop Safari — disambiguate by touch support.
    (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
  const safari = /safari/i.test(ua) && !/crios|fxios|edgios|android/i.test(ua);
  return ios && safari;
}

/**
 * Branded install banner.
 *
 * - **Android/Chromium:** captures the deferred `beforeinstallprompt` and offers a
 *   one-tap install button instead of the browser's mini-infobar.
 * - **iOS Safari:** shows a short Share → "Add to Home Screen" guide, since Safari
 *   has no programmatic install.
 *
 * Hidden when already installed (`display-mode: standalone`) or previously dismissed.
 *
 * NOTE: service workers + install prompts only run in a **secure context** (HTTPS,
 * or localhost). Over plain `http://` on a remote origin the browser blocks both, so
 * this banner won't appear — serve the app behind HTTPS (see docs/https-setup.md).
 */
export function InstallPrompt() {
  const mounted = useMounted();
  const [deferred, setDeferred] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = React.useState(false);

  // Client-only environment reads, derived at render time (never copied into state
  // via a sync effect — the project's `react-hooks/set-state-in-effect` rule errors
  // on that; see the useMounted hook).
  const env = React.useMemo(() => {
    if (!mounted) {
      return { standalone: false, iosSafari: false, alreadyDismissed: false };
    }
    return {
      standalone: isStandalone(),
      iosSafari: isIOSSafari(),
      alreadyDismissed: localStorage.getItem(DISMISS_KEY) === "1",
    };
  }, [mounted]);

  // Capture Chromium's deferred install prompt (never fires on iOS).
  React.useEffect(() => {
    if (env.standalone || env.alreadyDismissed || env.iosSafari) return;

    const onPrompt = (e: Event) => {
      e.preventDefault(); // suppress the mini-infobar; we render our own banner
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setDeferred(null);
      localStorage.setItem(DISMISS_KEY, "1");
      setDismissed(true);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [env.standalone, env.alreadyDismissed, env.iosSafari]);

  async function handleInstall() {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") {
      localStorage.setItem(DISMISS_KEY, "1");
      setDismissed(true);
    }
    setDeferred(null);
  }

  function handleDismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  const hidden = !mounted || dismissed || env.alreadyDismissed || env.standalone;
  const mode: "ios" | "android" | null = hidden
    ? null
    : env.iosSafari
      ? "ios"
      : deferred
        ? "android"
        : null;

  if (!mode) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
      <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-border bg-card/95 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Soft brand glow behind the header. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -end-12 h-40 w-40 rounded-full bg-primary/15 blur-3xl"
        />

        <div className="relative p-4">
          <div className="flex items-start gap-3">
            <div className="shrink-0 rounded-2xl border border-border bg-background p-2 shadow-sm">
              <Image
                src="/icons/u-192x192.png"
                alt="یونیورس"
                width={44}
                height={44}
                className="size-11 rounded-xl object-contain"
              />
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-[0.95rem] font-bold leading-tight">یونیورس را نصب کنید</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {mode === "ios"
                  ? "در چند ثانیه، یونیورس را به صفحهٔ اصلی دستگاهتان اضافه کنید:"
                  : "دسترسی سریع‌تر، دریافت اعلان‌ها و استفادهٔ آفلاین — درست مثل یک اپ واقعی."}
              </p>
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              aria-label="بستن"
              className="-me-1 -mt-1 shrink-0 rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="size-4" strokeWidth={2} />
            </button>
          </div>

          {mode === "android" ? (
            <Button
              type="button"
              onClick={handleInstall}
              className="mt-4 h-11 w-full rounded-xl text-sm font-semibold"
            >
              <HugeiconsIcon icon={Download01Icon} className="size-5" strokeWidth={2} />
              نصب اپلیکیشن
            </Button>
          ) : (
            <div className="mt-3.5 space-y-2.5 rounded-2xl border border-border bg-background/60 p-3">
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[0.7rem] font-bold text-primary">
                  ۱
                </span>
                <span className="leading-relaxed">
                  دکمهٔ
                  <span className="mx-1 inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 align-middle font-medium text-foreground">
                    <HugeiconsIcon icon={SquareArrowUp01Icon} className="size-3.5" strokeWidth={2} />
                    اشتراک‌گذاری
                  </span>
                  را در نوار سافاری بزنید.
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[0.7rem] font-bold text-primary">
                  ۲
                </span>
                <span className="leading-relaxed">
                  گزینهٔ
                  <span className="mx-1 inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 align-middle font-medium text-foreground">
                    <HugeiconsIcon icon={PlusSignSquareIcon} className="size-3.5" strokeWidth={2} />
                    افزودن به صفحهٔ اصلی
                  </span>
                  را انتخاب کنید.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
