"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/**
 * A slim, accent-coloured progress bar pinned to the top of the screen that
 * animates during route transitions — the "the app is working" cue you get in
 * native apps and sites like YouTube/GitHub.
 *
 * App Router gives no navigation-start event, so we detect the start ourselves:
 * an internal `<a>` click (fires synchronously, before React's transition) or a
 * back/forward `popstate`. We finish when `usePathname()` commits the new route.
 * A safety timeout closes the bar if a click never resolves to a path change.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = React.useState(0);
  const [state, setState] = React.useState<"idle" | "running" | "done">("idle");

  const running = React.useRef(false);
  const timers = React.useRef<number[]>([]);

  const clearTimers = React.useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current.forEach((t) => window.clearInterval(t));
    timers.current = [];
  }, []);

  const finish = React.useCallback(() => {
    if (!running.current) return;
    running.current = false;
    clearTimers();
    setProgress(100);
    setState("done");
    // Let the fill reach 100% and fade, then reset.
    const reset = window.setTimeout(() => {
      setState("idle");
      setProgress(0);
    }, 400);
    timers.current.push(reset);
  }, [clearTimers]);

  const start = React.useCallback(() => {
    if (running.current) return;
    running.current = true;
    clearTimers();
    setState("running");
    setProgress(8);

    // Trickle toward ~90% — fast at first, then crawling, so it never looks stuck
    // but also never completes before the route actually does.
    const trickle = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p;
        const step = p < 35 ? 9 : p < 65 ? 4 : 1.5;
        return Math.min(90, p + step);
      });
    }, 380);
    // Fail-safe: never leave the bar hanging if a click doesn't change the path.
    const safety = window.setTimeout(() => finish(), 10_000);
    timers.current.push(trickle, safety);
  }, [clearTimers, finish]);

  // Detect the start of a navigation.
  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      // Same path (hash-only jump or a no-op link) → no route change coming.
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      start();
    }

    document.addEventListener("click", onClick);
    window.addEventListener("popstate", start);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", start);
    };
  }, [start]);

  // Route committed → finish. (The `running` guard makes the mount run a no-op.)
  React.useEffect(() => {
    finish();
  }, [pathname, finish]);

  React.useEffect(() => clearTimers, [clearTimers]);

  if (state === "idle") return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px]"
    >
      <div
        className="h-full rounded-e-full bg-primary transition-[width,opacity] duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: state === "done" ? 0 : 1,
          boxShadow: "0 0 8px var(--primary), 0 0 4px var(--primary)",
        }}
      />
    </div>
  );
}
