import Cookies from "js-cookie";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "./auth-cookies";
import type { AuthResponse } from "./types";

// Tokens are stored in cookies (not localStorage) so that the Next.js `proxy`
// (ex-middleware) can read them on the server for optimistic route protection.
//
// Trade-off: the API delivers tokens in the JSON body and expects them back in
// the `Authorization` header, so these cookies are NOT httpOnly (JS must read
// them). We mitigate with `sameSite=lax` + `secure` on HTTPS. The refresh token
// is still only ever held as a SHA-256 hash on the server side.

// Whether the page is being served over HTTPS. Basing the cookie's `Secure`
// flag on the live connection — not NODE_ENV — is exactly the condition the
// browser enforces: a `Secure` cookie is rejected on an HTTP page. So a
// production build served over plain HTTP (e.g. a localhost/LAN demo before TLS
// is set up) still works, while any HTTPS deployment gets `Secure` automatically.
// Guard `window` so the module is safe to import in a server context (js-cookie
// itself only ever runs in the browser).
const isHttps = () =>
  typeof window !== "undefined" && window.location.protocol === "https:";

const cookieOptions = (): Cookies.CookieAttributes => ({
  // Bounded by the refresh-token lifetime (backend: 7d). The access token still
  // expires server-side after 15m regardless — the interceptor refreshes it.
  expires: 7,
  sameSite: "lax",
  secure: isHttps(),
  path: "/",
});

export const tokenStorage = {
  getAccessToken(): string | null {
    return Cookies.get(ACCESS_TOKEN_COOKIE) ?? null;
  },

  getRefreshToken(): string | null {
    return Cookies.get(REFRESH_TOKEN_COOKIE) ?? null;
  },

  setTokens({ accessToken, refreshToken }: Pick<AuthResponse, "accessToken" | "refreshToken">): void {
    Cookies.set(ACCESS_TOKEN_COOKIE, accessToken, cookieOptions());
    Cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, cookieOptions());
  },

  clearTokens(): void {
    Cookies.remove(ACCESS_TOKEN_COOKIE, { path: "/" });
    Cookies.remove(REFRESH_TOKEN_COOKIE, { path: "/" });
  },

  /** Optimistic "is there a session?" check — presence of a refresh token. */
  hasSession(): boolean {
    return Boolean(Cookies.get(REFRESH_TOKEN_COOKIE));
  },
};
