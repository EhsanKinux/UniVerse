"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { SquareUnlock01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";

import { useMounted } from "@/hooks/use-mounted";

const DISMISS_KEY = "universe_insecure_hint_dismissed_v1";

/**
 * Transitional notice for users who still open the app over plain `http://`.
 *
 * PWA features (install, offline, push) require a **secure context** — HTTPS or
 * localhost — so on an insecure remote origin the install prompt is intentionally
 * suppressed. This slim banner explains why and nudges them to the `https://` URL.
 * Shows only when `window.isSecureContext` is false (so never on HTTPS or
 * localhost), and is independently dismissible. See docs/https-setup.md.
 */
export function InsecureContextHint() {
  const mounted = useMounted();
  const [dismissed, setDismissed] = React.useState(false);

  // Client-only reads, derived at render time (not copied into state via a sync
  // effect — the project's `react-hooks/set-state-in-effect` rule; see useMounted).
  const { insecure, alreadyDismissed } = React.useMemo(() => {
    if (!mounted) return { insecure: false, alreadyDismissed: false };
    return {
      insecure: !window.isSecureContext,
      alreadyDismissed: localStorage.getItem(DISMISS_KEY) === "1",
    };
  }, [mounted]);

  function handleDismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  if (!mounted || dismissed || alreadyDismissed || !insecure) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
      <div className="mx-auto flex max-w-md items-start gap-3 rounded-2xl border border-destructive/25 bg-card/95 p-3 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-300">
        <div className="shrink-0 rounded-xl bg-destructive/10 p-2 text-destructive">
          <HugeiconsIcon icon={SquareUnlock01Icon} className="size-5" strokeWidth={2} />
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-sm font-semibold">اتصال شما امن نیست</p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            برای نصب اپلیکیشن و استفادهٔ کامل (کارکرد آفلاین و اعلان‌ها)، سایت را با نشانی امن
            <span dir="ltr" className="mx-1 font-medium text-foreground">
              https://
            </span>
            باز کنید.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="بستن"
          className="-me-1 -mt-1 shrink-0 rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
