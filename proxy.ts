import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { REFRESH_TOKEN_COOKIE } from "@/lib/api/auth-cookies";

// Next.js 16 renamed the `middleware` convention to `proxy` (same capability).
// Per the docs, Proxy should only do *optimistic* auth checks — the real
// enforcement is the API + axios refresh interceptor. Here we just keep
// logged-out users out of the app shell and logged-in users out of the auth
// pages, based on the presence of the refresh-token cookie.

const AUTH_ROUTES = ["/sign-in", "/sign-up"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(REFRESH_TOKEN_COOKIE);
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Not signed in and trying to reach a protected route → go to sign-in.
  if (!hasSession && !isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    // Remember where they were headed so we can return there after login.
    if (pathname !== "/") url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Already signed in but on an auth page → send to the home shell.
  if (hasSession && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except API routes, Next internals, the offline fallback,
  // and any path with a file extension (static assets: images, sw.js, manifest,
  // fonts, etc.).
  matcher: ["/((?!api|_next|offline|.*\\..*).*)"],
};
