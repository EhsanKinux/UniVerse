import axios from "axios";
import type { ApiErrorBody } from "./types";

/**
 * A normalized error every API caller can rely on. The axios interceptor
 * rejects with this, so hooks/components read `error.message` (already in
 * Persian) without re-parsing the raw NestJS response.
 */
export class ApiError extends Error {
  /** HTTP status (0 means the request never reached the server). */
  readonly status: number;
  /** Individual validation messages from the server, when present. */
  readonly fieldMessages: string[];

  constructor(message: string, status: number, fieldMessages: string[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldMessages = fieldMessages;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Map well-known (endpoint, status) pairs to friendly Persian copy. Returns
 * `undefined` to fall back to the server's own message.
 */
function friendlyMessage(status: number, url: string | undefined): string | undefined {
  const path = url ?? "";

  if (status === 0) return "ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید.";
  if (path.includes("/auth/login") && status === 401) return "ایمیل یا رمز عبور نادرست است.";
  if (path.includes("/auth/register") && status === 409) return "حساب کاربری با این ایمیل قبلاً ساخته شده است.";
  if (status === 401) return "نشست شما منقضی شده است. دوباره وارد شوید.";
  if (status === 429) return "تعداد درخواست‌ها زیاد است. کمی بعد دوباره تلاش کنید.";
  if (status >= 500) return "خطای سرور. لطفاً بعداً دوباره تلاش کنید.";
  return undefined;
}

/** Convert any thrown value (usually an AxiosError) into an `ApiError`. */
export function normalizeError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    const body = error.response?.data as ApiErrorBody | undefined;

    const raw = body?.message;
    const fieldMessages = Array.isArray(raw) ? raw : raw ? [raw] : [];

    const message =
      friendlyMessage(status, error.config?.url) ??
      fieldMessages[0] ??
      "خطایی رخ داد. لطفاً دوباره تلاش کنید.";

    return new ApiError(message, status, fieldMessages);
  }

  if (error instanceof ApiError) return error;

  return new ApiError("خطای ناشناخته‌ای رخ داد.", 0);
}
