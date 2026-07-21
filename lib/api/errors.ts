import axios from "axios";
import type { ApiErrorBody, ApiErrorCode } from "./types";

/**
 * A normalized error every API caller can rely on. The axios interceptor
 * rejects with this, so hooks/components read `error.message` (already in
 * Persian) without re-parsing the raw NestJS response.
 *
 * The important field is `code`: it is the SAME vocabulary the backend uses, so
 * UI logic ("should I sign the user out?", "should I offer a retry?") branches
 * on a stable value instead of guessing from an HTTP status or matching text.
 */
export class ApiError extends Error {
  /** HTTP status (0 means the request never reached the server). */
  readonly status: number;
  /** Stable machine-readable cause — branch on this. */
  readonly code: ApiErrorCode;
  /** Individual validation messages from the server, when present. */
  readonly fieldMessages: string[];
  /** Seconds to wait before retrying (429 only), else null. */
  readonly retryAfter: number | null;
  /** Server-side correlation id, shown to the student so they can quote it. */
  readonly requestId: string | null;
  /** The server's own (English) message — for the console, never for the UI. */
  readonly serverMessage: string | null;

  constructor(init: {
    message: string;
    status: number;
    code: ApiErrorCode;
    fieldMessages?: string[];
    retryAfter?: number | null;
    requestId?: string | null;
    serverMessage?: string | null;
  }) {
    super(init.message);
    this.name = "ApiError";
    this.status = init.status;
    this.code = init.code;
    this.fieldMessages = init.fieldMessages ?? [];
    this.retryAfter = init.retryAfter ?? null;
    this.requestId = init.requestId ?? null;
    this.serverMessage = init.serverMessage ?? null;
  }

  /**
   * A short, technical line to show UNDER the friendly message.
   *
   * This exists because of a real support problem: students reported "it says
   * there's an error" and there was nothing to go on. Now the screen carries
   * the status, the code and the request id — enough to find the exact server
   * log line without asking them to reproduce anything.
   */
  get diagnostic(): string {
    const parts: string[] = [this.code];
    if (this.status) parts.push(String(this.status));
    if (this.requestId) parts.push(`#${this.requestId}`);
    return parts.join(" · ");
  }

  /** True when retrying the same request might genuinely succeed. */
  get isRetryable(): boolean {
    return (
      this.code === "NETWORK_UNREACHABLE" ||
      this.code === "TIMEOUT" ||
      this.code === "RATE_LIMITED" ||
      this.code === "DATABASE_UNAVAILABLE" ||
      this.status >= 500
    );
  }

  /** True when the session is genuinely over and the user must sign in again. */
  get endsSession(): boolean {
    return this.code === "REFRESH_REJECTED" || this.code === "ACCOUNT_GONE";
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/** Persian copy per failure cause. One place, one wording per situation. */
const MESSAGES: Record<ApiErrorCode, string> = {
  VALIDATION_FAILED: "اطلاعات وارد شده معتبر نیست.",
  BAD_REQUEST: "درخواست نامعتبر بود.",
  INVALID_CREDENTIALS: "ایمیل یا رمز عبور نادرست است.",
  TOKEN_MISSING: "برای این کار باید وارد حساب خود شوید.",
  TOKEN_EXPIRED: "نشست شما منقضی شده است. دوباره وارد شوید.",
  TOKEN_INVALID: "نشست شما معتبر نیست. دوباره وارد شوید.",
  REFRESH_REJECTED: "نشست شما به پایان رسیده است. دوباره وارد شوید.",
  ACCOUNT_GONE: "این حساب کاربری دیگر وجود ندارد.",
  UNAUTHORIZED: "دسترسی مجاز نیست.",
  FORBIDDEN: "اجازهٔ انجام این کار را ندارید.",
  WRONG_PASSWORD: "رمز عبور نادرست است.",
  NOT_FOUND: "موردی که خواستید پیدا نشد.",
  EMAIL_TAKEN: "حساب کاربری با این ایمیل قبلاً ساخته شده است.",
  CONFLICT: "این مقدار قبلاً ثبت شده است.",
  PAYLOAD_TOO_LARGE: "حجم فایل بیش از حد مجاز است.",
  UNSUPPORTED_MEDIA_TYPE: "این نوع فایل پشتیبانی نمی‌شود.",
  RATE_LIMITED: "تلاش‌های زیادی انجام شده است. کمی صبر کنید و دوباره تلاش کنید.",
  DATABASE_UNAVAILABLE: "سرور موقتاً در دسترس نیست. لطفاً کمی بعد دوباره تلاش کنید.",
  INTERNAL_ERROR: "خطای سرور. لطفاً بعداً دوباره تلاش کنید.",
  NETWORK_UNREACHABLE: "ارتباط با سرور برقرار نشد. اتصال اینترنت خود را بررسی کنید.",
  TIMEOUT: "پاسخی از سرور دریافت نشد. لطفاً دوباره تلاش کنید.",
  UNKNOWN: "خطایی رخ داد. لطفاً دوباره تلاش کنید.",
};

/** Wording that only makes sense on a specific endpoint. */
function contextualMessage(code: ApiErrorCode, url: string): string | undefined {
  if (code === "RATE_LIMITED" && url.includes("/auth/login")) {
    return "به دلیل تلاش‌های ناموفق زیاد، ورود به این حساب موقتاً محدود شده است.";
  }
  if (code === "NETWORK_UNREACHABLE" && url.includes("/auth/")) {
    // The most-reported symptom. Say plainly that the request never arrived,
    // rather than blaming the student's internet when it may well be the server.
    return "ارتباط با سرور برقرار نشد. اینترنت خود را بررسی کنید؛ اگر وصل هستید، سرور در دسترس نیست.";
  }
  return undefined;
}

/**
 * Map an HTTP status to a code, for responses that predate the `code` envelope
 * (or come from a proxy/CDN rather than our API).
 */
function codeFromStatus(status: number, url: string): ApiErrorCode {
  if (status === 0) return "NETWORK_UNREACHABLE";
  if (status === 400) return "VALIDATION_FAILED";
  if (status === 401) {
    return url.includes("/auth/login") ? "INVALID_CREDENTIALS" : "TOKEN_EXPIRED";
  }
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 409) return url.includes("/auth/register") ? "EMAIL_TAKEN" : "CONFLICT";
  if (status === 413) return "PAYLOAD_TOO_LARGE";
  if (status === 415) return "UNSUPPORTED_MEDIA_TYPE";
  if (status === 429) return "RATE_LIMITED";
  if (status === 503) return "DATABASE_UNAVAILABLE";
  if (status >= 500) return "INTERNAL_ERROR";
  return "UNKNOWN";
}

const KNOWN_CODES = new Set(Object.keys(MESSAGES));

/** Convert any thrown value (usually an AxiosError) into an `ApiError`. */
export function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    const url = error.config?.url ?? "";
    const body = error.response?.data as ApiErrorBody | undefined;

    // Trust the server's code when it sent one we understand; otherwise derive
    // it from the status. A timeout/abort has no response at all.
    const isTimeout = !error.response && (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT");
    const code: ApiErrorCode =
      body?.code && KNOWN_CODES.has(body.code)
        ? body.code
        : isTimeout
          ? "TIMEOUT"
          : codeFromStatus(status, url);

    const raw = body?.message;
    const fieldMessages = Array.isArray(raw)
      ? raw
      : body?.details?.length
        ? body.details
        : raw
          ? [raw]
          : [];

    const retryAfterHeader = Number(error.response?.headers?.["retry-after"]);
    const retryAfter =
      body?.retryAfter ?? (Number.isFinite(retryAfterHeader) ? retryAfterHeader : null);

    return new ApiError({
      message: contextualMessage(code, url) ?? MESSAGES[code],
      status,
      code,
      fieldMessages,
      retryAfter,
      requestId: body?.requestId ?? (error.response?.headers?.["x-request-id"] as string) ?? null,
      serverMessage: typeof raw === "string" ? raw : (fieldMessages[0] ?? null),
    });
  }

  return new ApiError({
    message: MESSAGES.UNKNOWN,
    status: 0,
    code: "UNKNOWN",
    serverMessage: error instanceof Error ? error.message : null,
  });
}
