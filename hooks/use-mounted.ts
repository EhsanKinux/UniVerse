"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns `false` during SSR and the first (hydration) render, then `true`.
 *
 * A hydration-safe replacement for the `useState(false)` + `useEffect(setMounted(true))`
 * pattern. Because it derives from an external store, it avoids the
 * `react-hooks/set-state-in-effect` rule while guaranteeing the server and the
 * first client render agree, so client-only values (localStorage, theme) can be
 * gated behind it without a hydration mismatch.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
