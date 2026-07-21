import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import { env } from "@/lib/env";
import { ApiError, normalizeError } from "./errors";
import { tokenStorage } from "./token-storage";
import type { AuthResponse } from "./types";

// -----------------------------------------------------------------------------
// Unauthorized handler
// -----------------------------------------------------------------------------
// When a refresh ultimately fails we must drop the session and send the user to
// sign-in. That UI concern lives in React (router + query cache), so the app
// registers a callback here at startup (see QueryProvider).

type UnauthorizedHandler = () => void;
let onUnauthorized: UnauthorizedHandler | null = null;

export function registerUnauthorizedHandler(handler: UnauthorizedHandler): void {
  onUnauthorized = handler;
}

function handleUnauthorized(): void {
  tokenStorage.clearTokens();
  if (onUnauthorized) {
    onUnauthorized();
  } else if (typeof window !== "undefined") {
    // Fallback for code paths that run before the handler is registered.
    window.location.assign("/sign-in");
  }
}

// -----------------------------------------------------------------------------
// Axios instance
// -----------------------------------------------------------------------------

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: { "Content-Type": "application/json" },
  // Send cookies on cross-origin requests (backend has CORS credentials: true).
  withCredentials: true,
  // Without a timeout a request can hang until the OS gives up (minutes) — on a
  // flaky campus connection the app just spins with no error at all. 20s is far
  // beyond any healthy response and turns a hang into a clear TIMEOUT.
  timeout: 20_000,
});

// Request: attach the current access token as a Bearer header.
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.getAccessToken();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// -----------------------------------------------------------------------------
// Silent refresh (single-flight)
// -----------------------------------------------------------------------------
// While one refresh is in flight, concurrent 401s await the SAME promise instead
// of each firing their own /auth/refresh (which would rotate tokens repeatedly
// and invalidate each other).

let refreshPromise: Promise<string> | null = null;

async function performRefresh(): Promise<string> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) {
    throw new ApiError({
      message: "نشست شما به پایان رسیده است. دوباره وارد شوید.",
      status: 401,
      code: "REFRESH_REJECTED",
      serverMessage: "No refresh token in storage",
    });
  }

  try {
    // Use a bare axios call (no interceptors) so the request interceptor doesn't
    // overwrite the Authorization header with the *access* token. The refresh
    // endpoint authenticates with the REFRESH token in the Bearer header.
    const { data } = await axios.post<AuthResponse>(`${env.apiBaseUrl}/auth/refresh`, null, {
      headers: { Authorization: `Bearer ${refreshToken}` },
      withCredentials: true,
      timeout: 20_000,
    });

    tokenStorage.setTokens(data); // persist the rotated pair
    return data.accessToken;
  } catch (error) {
    // Normalize here so the caller can inspect WHY it failed — that distinction
    // is the whole point (see below).
    throw normalizeError(error);
  }
}

/**
 * Did the refresh fail because the session is genuinely over — or because
 * something transient got in the way?
 *
 * This distinction was the bug. The old code signed the student out on ANY
 * refresh failure, so a rate-limited refresh, a 30-second backend restart or a
 * dropped Wi-Fi packet all read as "your session expired": the app wiped the
 * tokens and bounced them to sign-in. They'd then try to log back in — and,
 * because the same rate limit was still counting, that login could fail too.
 *
 * Only the server explicitly REFUSING the refresh token ends a session.
 */
function refreshFailureEndsSession(error: ApiError): boolean {
  if (error.code === "RATE_LIMITED" || error.code === "TIMEOUT") return false;
  if (error.code === "NETWORK_UNREACHABLE") return false;
  if (error.status >= 500 || error.status === 0) return false;
  // 401/403 from /auth/refresh: the token is expired, revoked or superseded.
  return error.status === 401 || error.status === 403;
}

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

function isAuthFlowRequest(url: string | undefined): boolean {
  const path = url ?? "";
  return (
    path.includes("/auth/login") ||
    path.includes("/auth/register") ||
    path.includes("/auth/refresh")
  );
}

// Response: on a 401, try exactly one silent refresh, then replay the request.
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;

    const cannotRetry =
      error.response?.status !== 401 ||
      !original ||
      original._retry ||
      isAuthFlowRequest(original.url) ||
      tokenStorage.getRefreshToken() == null;

    if (cannotRetry) {
      return Promise.reject(normalizeError(error));
    }

    // A 401 the refresh flow can't fix: the account is gone, or the token was
    // already rejected as revoked. Retrying would just fail again.
    const original401 = normalizeError(error);
    if (original401.code === "ACCOUNT_GONE") {
      handleUnauthorized();
      return Promise.reject(original401);
    }

    // `original` is now narrowed to a defined config.
    original._retry = true;

    try {
      refreshPromise ??= performRefresh().finally(() => {
        refreshPromise = null;
      });
      const newAccessToken = await refreshPromise;

      original.headers.set("Authorization", `Bearer ${newAccessToken}`);
      return await apiClient(original);
    } catch (refreshError) {
      const failure = normalizeError(refreshError);

      if (refreshFailureEndsSession(failure)) {
        handleUnauthorized();
        return Promise.reject(failure);
      }

      // Transient: keep the session intact and report the REAL reason (rate
      // limited / server down / offline) instead of a misleading "session
      // expired". The next attempt can succeed without signing in again.
      return Promise.reject(failure);
    }
  },
);
