import * as React from "react"

// "Mobile" for the app shell means anything below Tailwind's `lg` breakpoint:
// that's where the bottom tab bar navigates and the sidebar is not rendered.
// Must stay in sync with the lg: classes in components/ui/sidebar.tsx.
const MOBILE_BREAKPOINT = 1024
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    // SSR/first paint: assume desktop — the sidebar/tab bar are CSS-gated by
    // lg: classes anyway, so nothing mis-renders before hydration.
    () => false,
  )
}
