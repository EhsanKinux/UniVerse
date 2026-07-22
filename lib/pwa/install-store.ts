// Holds Chromium's deferred install prompt and lets React subscribe to it.
//
// `beforeinstallprompt` fires **once**, shortly after the page loads — often
// before React has hydrated. A listener registered inside `useEffect` therefore
// races the browser and, on a fast connection or a warm service worker, loses:
// the event is gone and the install button never lights up. That was the bug.
//
// The fix is `INSTALL_BOOTSTRAP_SCRIPT` below, inlined at the top of <body> so
// it runs during HTML parse. It parks the event on `window` and re-broadcasts a
// custom event, which this store turns into a `useSyncExternalStore` snapshot.

/** `beforeinstallprompt` is Chromium-only and absent from the DOM lib types. */
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

declare global {
  interface Window {
    __universeInstallPrompt?: BeforeInstallPromptEvent | null;
  }
}

const INSTALLABLE_EVENT = "universe:installable";
const INSTALLED_EVENT = "universe:installed";

/**
 * Inline, render-blocking bootstrap. Kept as a plain ES5 string because it runs
 * before any bundle — no JSX, no modern syntax, no imports. Must stay in sync
 * with the event/global names above.
 */
export const INSTALL_BOOTSTRAP_SCRIPT = `(function(){
var w=window;w.__universeInstallPrompt=null;
w.addEventListener('beforeinstallprompt',function(e){e.preventDefault();w.__universeInstallPrompt=e;w.dispatchEvent(new Event('${INSTALLABLE_EVENT}'));});
w.addEventListener('appinstalled',function(){w.__universeInstallPrompt=null;w.dispatchEvent(new Event('${INSTALLED_EVENT}'));});
})();`;

/** Re-runs the callback whenever the one-tap install becomes (un)available. */
export function subscribeInstallability(onChange: () => void): () => void {
  window.addEventListener(INSTALLABLE_EVENT, onChange);
  window.addEventListener(INSTALLED_EVENT, onChange);
  return () => {
    window.removeEventListener(INSTALLABLE_EVENT, onChange);
    window.removeEventListener(INSTALLED_EVENT, onChange);
  };
}

/** Re-runs the callback when the app starts (or stops) running standalone. */
export function subscribeStandalone(onChange: () => void): () => void {
  const media = window.matchMedia("(display-mode: standalone)");
  media.addEventListener("change", onChange);
  window.addEventListener(INSTALLED_EVENT, onChange);
  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener(INSTALLED_EVENT, onChange);
  };
}

/** Snapshot: is Chromium's one-tap install available right now? */
export function hasDeferredPrompt(): boolean {
  return typeof window !== "undefined" && !!window.__universeInstallPrompt;
}

export type InstallOutcome = "accepted" | "dismissed" | "unavailable";

/**
 * Fire the native install dialog. The deferred event is single-use: once
 * `prompt()` has been called the browser will not hand it back, so we clear it
 * either way and let the UI fall back to the manual guide.
 */
export async function promptInstall(): Promise<InstallOutcome> {
  const event = typeof window === "undefined" ? null : window.__universeInstallPrompt;
  if (!event) return "unavailable";

  window.__universeInstallPrompt = null;
  window.dispatchEvent(new Event(INSTALLABLE_EVENT));

  try {
    await event.prompt();
    const { outcome } = await event.userChoice;
    return outcome;
  } catch {
    return "unavailable";
  }
}
