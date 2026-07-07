"use client";

import { useSyncExternalStore } from "react";

// Device-level "has the user seen the app intro?" flag. Stored in localStorage
// (per-install, not per-account) so the welcome flow only plays for genuinely
// new visitors. It's deliberately decoupled from the auth identity, but it IS
// reset as part of the session teardown (logout / delete account) so a fresh
// start replays the welcome flow — see `useClearSession`.

const SEEN_KEY = "universe_onboarding_seen_v1";

// The native `storage` event only fires in *other* tabs, so we bridge same-tab
// updates with our own event. The gate subscribes to both.
const CHANGE_EVENT = "universe:onboarding-change";

function read(): boolean {
  try {
    return localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    // Private mode / storage disabled: treat as "seen" so we don't trap the
    // user in an onboarding loop they can't dismiss persistently.
    return true;
  }
}

function write(seen: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (seen) localStorage.setItem(SEEN_KEY, "1");
    else localStorage.removeItem(SEEN_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Persist that the intro has been completed (or skipped). */
export function markOnboardingSeen(): void {
  write(true);
}

/** Clear the flag so the intro replays on the next launch. */
export function resetOnboarding(): void {
  write(false);
}

function subscribe(callback: () => void): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key === SEEN_KEY) callback();
  };
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}

/**
 * Reactive read of the onboarding-seen flag. Re-renders when the flag changes
 * in this tab (via `markOnboardingSeen` / `resetOnboarding`) or another tab.
 *
 * The server snapshot is `true` so the intro never renders during SSR/hydration;
 * consumers should still gate on `useMounted` to avoid a first-paint flash.
 */
export function useHasSeenOnboarding(): boolean {
  return useSyncExternalStore(subscribe, read, () => true);
}
