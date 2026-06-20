// Shared API types. These mirror the NestJS backend DTOs exactly
// (see univers-backend/src/auth/dto). Keep them in sync with the server.

/** The "safe" user shape returned by the API (no password / refresh hash). */
export interface User {
  id: string;
  email: string;
  name: string | null;
  /** ISO date string (a `Date` serialized over JSON). */
  createdAt: string;
}

/** Returned by POST /auth/register, /auth/login and /auth/refresh. */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

/** Body of POST /auth/login. */
export interface LoginPayload {
  email: string;
  password: string;
}

/** Body of POST /auth/register. `name` is optional on the backend. */
export interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
}

/** Shape of a NestJS error body (from HttpException / ValidationPipe). */
export interface ApiErrorBody {
  statusCode: number;
  /** A single message, or an array of validation messages. */
  message: string | string[];
  error?: string;
}
