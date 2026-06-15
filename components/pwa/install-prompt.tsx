"use client";

import * as React from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";

// `beforeinstallprompt` isn't in the standard DOM lib types.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISS_KEY = "universe_install_dismissed_v1";

/** Custom Android/Chrome install banner. Captures the deferred install prompt and
 *  surfaces a branded "نصب اپلیکیشن" CTA instead of relying on the mini-infobar. */
export function InstallPrompt() {
  const [deferred, setDeferred] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    // Don't nag if already dismissed or already running as an installed app.
    if (localStorage.getItem(DISMISS_KEY)) return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const onPrompt = (e: Event) => {
      e.preventDefault(); // keep the browser's mini-infobar from showing
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    const onInstalled = () => {
      setVisible(false);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
    setDeferred(null);
  }

  function handleDismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
      <div className="mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-border bg-card/95 p-3 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-300">
        <div className="shrink-0 rounded-xl border border-border bg-background p-1.5">
          <Image
            src="/icons/u-192x192.png"
            alt="Universe"
            width={40}
            height={40}
            className="h-10 w-10 rounded-lg object-contain"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">نصب اپلیکیشن</p>
          <p className="truncate text-xs text-muted-foreground">دسترسی سریع‌تر، تجربه‌ای مثل اپ بومی</p>
        </div>

        <Button type="button" size="sm" onClick={handleInstall} className="h-9 shrink-0 rounded-xl">
          <HugeiconsIcon icon={Download01Icon} className="h-4 w-4" strokeWidth={1.8} />
          نصب
        </Button>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="بستن"
          className="shrink-0 rounded-lg p-1 text-muted-foreground transition hover:text-foreground"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="h-5 w-5" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}
