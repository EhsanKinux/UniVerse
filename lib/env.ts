// Centralized, typed access to environment configuration.
//
// The browser never talks to the backend directly. It calls THIS app's own
// origin under `apiBaseUrl` (default `/api`), and the Next.js server proxies
// those requests to the real backend (see `rewrites()` + `BACKEND_ORIGIN` in
// next.config.ts). Benefits: the backend stays private on loopback, there's no
// CORS, and the backend address is configured server-side instead of being
// frozen into the client bundle at build time.

function readApiBaseUrl(): string {
  // `NEXT_PUBLIC_*` is inlined at build time, so we default to a same-origin,
  // deployment-independent prefix — nothing environment-specific gets baked in.
  // Override only if the API is served from a separate public origin.
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "/api";

  // Strip trailing slashes so callers can safely build `${apiBaseUrl}/auth/login`.
  return raw.replace(/\/+$/, "");
}

export const env = {
  apiBaseUrl: readApiBaseUrl(),
} as const;
