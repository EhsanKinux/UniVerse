"use client";

import * as React from "react";

const THRESHOLD = 72; // px pulled (after resistance) needed to trigger a refresh
const MAX_PULL = 120; // px the indicator/content can travel
const RESISTANCE = 0.5; // finger travel → visual travel (rubber-band damping)

/**
 * Native-style pull-to-refresh for the window scroller. Only engages when the
 * page is at the very top and the gesture is a deliberate downward, vertical
 * pull (so horizontal chip scrolling and normal scrolling are untouched). The
 * body already has `overscroll-behavior: none`, so we're not fighting a native
 * refresh — we own the whole gesture.
 *
 * Returns the live pull distance and refreshing flag for the UI to render.
 */
export function usePullToRefresh(onRefresh: () => Promise<unknown> | void) {
  const [pull, setPull] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);

  const pullRef = React.useRef(0);
  const startY = React.useRef<number | null>(null);
  const startX = React.useRef(0);
  const activeRef = React.useRef(false);
  const refreshingRef = React.useRef(false);

  // Keep the latest callback without re-subscribing the listeners each render.
  const onRefreshRef = React.useRef(onRefresh);
  React.useEffect(() => {
    onRefreshRef.current = onRefresh;
  });

  React.useEffect(() => {
    const scroller = () => document.scrollingElement ?? document.documentElement;
    const atTop = () => (scroller()?.scrollTop ?? 0) <= 0;
    const set = (v: number) => {
      pullRef.current = v;
      setPull(v);
    };

    function onStart(e: TouchEvent) {
      if (refreshingRef.current || e.touches.length !== 1 || !atTop()) {
        startY.current = null;
        return;
      }
      startY.current = e.touches[0].clientY;
      startX.current = e.touches[0].clientX;
      activeRef.current = false;
    }

    function onMove(e: TouchEvent) {
      if (refreshingRef.current || startY.current == null) return;
      const dy = e.touches[0].clientY - startY.current;
      const dx = e.touches[0].clientX - startX.current;

      // Give up if scrolling up, no longer at the top, or the gesture is more
      // horizontal than vertical (e.g. a chip carousel swipe).
      if (dy <= 6 || !atTop() || Math.abs(dx) > dy) {
        if (activeRef.current) {
          activeRef.current = false;
          set(0);
        }
        return;
      }

      activeRef.current = true;
      if (e.cancelable) e.preventDefault();
      set(Math.min(MAX_PULL, dy * RESISTANCE));
    }

    async function onEnd() {
      if (startY.current == null) return;
      startY.current = null;
      if (!activeRef.current) {
        set(0);
        return;
      }
      activeRef.current = false;

      if (pullRef.current >= THRESHOLD) {
        refreshingRef.current = true;
        setRefreshing(true);
        set(THRESHOLD); // rest at the threshold while the refresh runs
        try {
          await onRefreshRef.current();
        } finally {
          refreshingRef.current = false;
          setRefreshing(false);
          set(0);
        }
      } else {
        set(0);
      }
    }

    // touchmove must be non-passive so we can preventDefault the pull.
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
    window.addEventListener("touchcancel", onEnd);
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
    };
  }, []);

  return { pull, refreshing, threshold: THRESHOLD };
}
