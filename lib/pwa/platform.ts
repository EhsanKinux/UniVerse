// Which browser/OS combination the user is on, from the point of view of
// "how does one install this PWA here?".
//
// Only Chromium exposes a programmatic install (`beforeinstallprompt`). Every
// other engine requires the user to pick a menu item themselves, and each one
// names and hides that item differently — so we can't show a single generic
// "use your browser menu" message and call it done. This module is the single
// source of truth for that branch; the UI just renders what it returns.

export type InstallPlatform =
  /** Chrome / Edge / Brave / Opera on Android — fires `beforeinstallprompt`. */
  | "chromium-android"
  /** Chrome / Edge / Brave / Vivaldi on desktop — fires `beforeinstallprompt`. */
  | "chromium-desktop"
  /** Samsung Internet — fires the event, but its menu wording differs. */
  | "samsung"
  /** Safari on iOS/iPadOS — Share → Add to Home Screen. */
  | "ios-safari"
  /** Chrome/Firefox/Edge on iOS — WebKit under the hood; share-menu install. */
  | "ios-third-party"
  /** Safari on macOS — File → Add to Dock (Sonoma / Safari 17+). */
  | "safari-desktop"
  /** Firefox on Android — menu → Install / Add to Home screen. */
  | "firefox-android"
  /** Firefox on desktop — no web-app install at all. */
  | "firefox-desktop"
  | "unknown";

/**
 * Best-effort platform sniff. Client-only — returns `"unknown"` on the server.
 *
 * UA sniffing is normally a smell, but install UX genuinely has no feature
 * detection: there is no API that answers "can this browser install me, and
 * where is the button?". `beforeinstallprompt` only ever tells us *yes* on
 * Chromium and stays silent everywhere else, which is exactly the case we need
 * to explain. Order matters below — iOS first (every iOS browser carries
 * "Safari" in its UA), then the tokens that are supersets of others.
 */
export function detectInstallPlatform(): InstallPlatform {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;

  const isIOS =
    /iphone|ipad|ipod/i.test(ua) ||
    // iPadOS 13+ requests desktop sites and reports as macOS — a touch-capable
    // "Macintosh" is really an iPad.
    (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1);

  if (isIOS) {
    // All iOS browsers are WebKit, so they *can* install (iOS 16.4+), but the
    // share-sheet wording and placement differ enough to be worth splitting.
    return /crios|fxios|edgios|opios|opt\//i.test(ua) ? "ios-third-party" : "ios-safari";
  }

  if (/samsungbrowser/i.test(ua)) return "samsung";
  if (/firefox\//i.test(ua)) return /android/i.test(ua) ? "firefox-android" : "firefox-desktop";
  if (/edg\/|chrome|chromium/i.test(ua)) {
    return /android/i.test(ua) ? "chromium-android" : "chromium-desktop";
  }
  // Safari is the only major engine left that still claims "Safari" by itself.
  if (/safari/i.test(ua)) return "safari-desktop";

  return "unknown";
}

/**
 * Whether installing is possible on this platform at all.
 *
 * Desktop Firefox is the one hard "no" — it removed its Site-Specific-Browser
 * work and ships no install path, so we tell the user to switch browsers
 * instead of sending them hunting through a menu that has no such item.
 */
export function platformSupportsInstall(platform: InstallPlatform): boolean {
  return platform !== "firefox-desktop";
}

/** True when the page is already running as an installed app. */
export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches ||
    // iOS Safari's non-standard flag, set when launched from the Home Screen.
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/**
 * Service workers, push and `beforeinstallprompt` all require a secure context
 * (HTTPS or localhost).
 *
 * The one exception is iOS "Add to Home Screen", which is a Safari bookmark
 * feature rather than a web-platform install — it works over plain http and
 * still launches standalone via the apple-mobile-web-app meta tags. So an
 * insecure origin must *not* hide the iOS guide, only the rest.
 */
export function isSecureContext(): boolean {
  return typeof window === "undefined" ? true : window.isSecureContext;
}
