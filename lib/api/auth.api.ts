import { apiClient } from "./client";
import type { AuthResponse, LoginPayload, RegisterPayload, User } from "./types";

// Thin, typed wrappers around the auth endpoints. All token handling and error
// normalization happens in the axios client; these just describe the contract.

export const authApi = {
  register(payload: RegisterPayload): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/auth/register", payload).then((res) => res.data);
  },

  login(payload: LoginPayload): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/auth/login", payload).then((res) => res.data);
  },

  logout(): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>("/auth/logout").then((res) => res.data);
  },

  getMe(): Promise<User> {
    return apiClient.get<User>("/auth/me").then((res) => res.data);
  },
};
