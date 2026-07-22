"use client";

import * as React from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  CloudOffIcon,
  Download01Icon,
  Notification03Icon,
  ZapIcon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { InstallGuideSheet } from "@/components/pwa/install-guide-sheet";
import { useInstall } from "@/hooks/pwa/use-install";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

const DISMISS_KEY = "universe_install_dismissed_v2";

const PERKS = [
  { icon: ZapIcon, label: "باز شدن سریع" },
  { icon: Notification03Icon, label: "اعلان‌های فوری" },
  { icon: CloudOffIcon, label: "کارکرد آفلاین" },
] as const;

/**
 * Rendered twice with complementary breakpoints: stacked, the ✕ belongs beside
 * the title; in a row it belongs after the CTA, where a single absolutely
 * positioned one would collide with the button. Only ever one is displayed, so
 * only one reaches the accessibility tree.
 */
function DismissButton({ className, onClick }: { className: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="بستن پیشنهاد نصب"
      className={cn(
        "shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} />
    </button>
  );
}

/**
 * The app's primary install entry point — a banner at the top of the home page,
 * directly under the header.
 *
 * It replaces the old floating bottom banner, which only ever appeared on
 * Chromium (it waited for `beforeinstallprompt`) and sat on top of the bottom
 * tab bar. This one renders on **every** browser that can install: Chromium
 * gets the native one-tap dialog, everyone else gets a platform-specific guide
 * sheet. Hidden once the app is actually installed, or once dismissed — the
 * profile menu keeps a permanent entry for anyone who dismissed it.
 */
export function InstallCard() {
  const mounted = useMounted();
  const { ready, platform, installed, secure, canPromptDirectly, supported, install } = useInstall();

  const [guideOpen, setGuideOpen] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);

  // Client-only read, derived at render (never copied into state via a sync
  // effect — the project's `react-hooks/set-state-in-effect` rule; see useMounted).
  const alreadyDismissed = React.useMemo(() => {
    if (!mounted) return false;
    try {
      return localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  }, [mounted]);

  function handleDismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* private mode: dismissal just won't persist */
    }
    setDismissed(true);
  }

  async function handleInstall() {
    // Chromium's deferred prompt is single-use and can go stale (the browser
    // revokes it once the mini-infobar times out), so fall back to the guide
    // rather than leaving a dead button.
    if (canPromptDirectly && (await install()) !== "unavailable") return;
    setGuideOpen(true);
  }

  if (!ready || installed || dismissed || alreadyDismissed) return null;

  return (
    <>
      <section
        className="
          relative overflow-hidden rounded-3xl border border-primary/20
          bg-card/85 shadow-sm backdrop-blur-xl
          motion-safe:animate-fade-in-up
        "
      >
        {/* Brand glow, anchored to the inline-start corner in both directions. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -start-16 size-48 rounded-full bg-primary/20 blur-3xl"
        />

        <div className="relative flex flex-col gap-3.5 p-4 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-3.5">
            <div className="shrink-0 rounded-2xl border border-border bg-background p-2 shadow-sm">
              <Image
                src="/icons/u-192x192.png"
                alt=""
                width={40}
                height={40}
                className="size-10 rounded-xl object-contain"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold leading-tight text-foreground">
                یونیورس را روی دستگاهتان نصب کنید
              </p>
              <ul className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                {PERKS.map((perk) => (
                  <li
                    key={perk.label}
                    className="flex items-center gap-1.5 text-[0.7rem] text-muted-foreground"
                  >
                    <HugeiconsIcon icon={perk.icon} size={13} className="text-primary" />
                    {perk.label}
                  </li>
                ))}
              </ul>
            </div>

            <DismissButton onClick={handleDismiss} className="-me-1 -mt-1 self-start sm:hidden" />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              size="lg"
              onClick={handleInstall}
              className="h-10 flex-1 rounded-xl px-4 text-[0.8rem] font-semibold sm:flex-none"
            >
              <HugeiconsIcon icon={Download01Icon} data-icon="inline-start" strokeWidth={2} />
              {supported ? "نصب اپلیکیشن" : "راهنمای نصب"}
            </Button>

            <DismissButton onClick={handleDismiss} className="hidden sm:inline-flex" />
          </div>
        </div>
      </section>

      <InstallGuideSheet
        open={guideOpen}
        onOpenChange={setGuideOpen}
        platform={platform}
        secure={secure}
      />
    </>
  );
}
