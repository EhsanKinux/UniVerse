import withSerwistInit from "@serwist/next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.4"],
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
