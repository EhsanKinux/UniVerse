import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import { env } from "@/lib/env";
import { normalizeError } from "./errors";
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
  if (!refreshToken) throw new Error("No refresh token available");

  // Use a bare axios call (no interceptors) so the request interceptor doesn't
  // overwrite the Authorization header with the *access* token. The refresh
  // endpoint authenticates with the REFRESH token in the Bearer header.
  const { data } = await axios.post<AuthResponse>(`${env.apiBaseUrl}/auth/refresh`, null, {
    headers: { Authorization: `Bearer ${refreshToken}` },
    withCredentials: true,
  });

  tokenStorage.setTokens(data); // persist the rotated pair
  return data.accessToken;
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

    // `original` is now narrowed to a defined config.
    original._retry = true;

    try {
      refreshPromise ??= performRefresh().finally(() => {
        refreshPromise = null;
      });
      const newAccessToken = await refreshPromise;

      original.headers.set("Authorization", `Bearer ${newAccessToken}`);
      return await apiClient(original);
    } catch {
      // Refresh failed (expired/revoked/rotated) — end the session.
      handleUnauthorized();
      return Promise.reject(normalizeError(error));
    }
  },
);
