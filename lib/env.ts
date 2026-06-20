// Centralized, typed access to public environment variables.
// `NEXT_PUBLIC_*` values are inlined at build time, so they're safe to read in
// both server and client components.

function readApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!url) {
    // The backend defaults to http://localhost:3001 in development. In production
    // this must be set explicitly, so surface a warning if it's missing.
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[env] NEXT_PUBLIC_API_BASE_URL is not set — falling back to http://localhost:3001",
      );
    }
    return "http://localhost:3001";
  }

  // Strip a trailing slash so callers can safely build `${apiBaseUrl}/auth/login`.
  return url.replace(/\/+$/, "");
}

export const env = {
  apiBaseUrl: readApiBaseUrl(),
} as const;
