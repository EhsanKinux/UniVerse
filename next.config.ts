import withSerwistInit from "@serwist/next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import type { NextConfig } from "next";

// The backend runs privately on the same host (loopback). The browser never
// hits it directly — it calls this app's own origin under `/api`, and Next
// proxies those requests here, server-side, to the real backend. This keeps the
// backend off the public network, avoids CORS, and works identically for phones
// and other devices (they only ever reach this app's origin).
//
// NOTE: `rewrites()` is evaluated when `next build` / `next dev` runs (the result
// is baked into the routes manifest), so to override the default you must set
// BACKEND_ORIGIN *before building* — not merely in the pm2 runtime env.
const BACKEND_ORIGIN = (process.env.BACKEND_ORIGIN ?? "http://127.0.0.1:3001").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  // Bare hostnames only — Next strips protocol/port from the request Origin
  // before matching, so entries like "http://x:3000" never match.
  allowedDevOrigins: ["192.168.1.2", "192.168.1.4", "192.168.56.1"],

  async rewrites() {
    return [
      {
        // Same-origin API prefix (see `NEXT_PUBLIC_API_BASE_URL`) → real backend.
        source: "/api/:path*",
        destination: `${BACKEND_ORIGIN}/:path*`,
      },
    ];
  },
};

// `@serwist/next` injects a webpack config, which Next 16's default Turbopack
// rejects (and it logs a Turbopack warning the moment it's initialized). We only
// need the service worker for production builds (run with `next build --webpack`),
// so we initialize + apply Serwist ONLY during the production build phase. `next dev`
// and `next start` keep a clean, Turbopack-compatible config with no warnings.
export default function config(phase: string): NextConfig {
  if (phase === PHASE_PRODUCTION_BUILD) {
    const withSerwist = withSerwistInit({
      swSrc: "app/sw.ts",
      swDest: "public/sw.js",
      reloadOnOnline: true,
    });
    return withSerwist(nextConfig);
  }
  return nextConfig;
}
