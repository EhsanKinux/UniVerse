import { apiClient } from "./client";

/** The subset of a browser PushSubscription the backend stores. */
export interface PushSubscriptionPayload {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

// Thin wrapper around the public push endpoints (see univers-backend/src/push).
export const pushApi = {
  /** The server's VAPID public key, or null if push is disabled server-side. */
  getPublicKey(): Promise<string | null> {
    return apiClient
      .get<{ publicKey: string | null }>("/push/public-key")
      .then((res) => res.data.publicKey);
  },

  /** Register (or refresh) this browser's subscription. */
  subscribe(payload: PushSubscriptionPayload): Promise<void> {
    return apiClient.post("/push/subscribe", payload).then(() => undefined);
  },

  /** Drop this browser's subscription. */
  unsubscribe(endpoint: string): Promise<void> {
    return apiClient.post("/push/unsubscribe", { endpoint }).then(() => undefined);
  },
};
