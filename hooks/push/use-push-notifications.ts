"use client";

import { useCallback, useEffect, useState } from "react";

import { pushApi } from "@/lib/api/push.api";
import { isPushSupported, urlBase64ToUint8Array } from "@/lib/push/helpers";
import { getNotificationsEnabled } from "@/lib/storage/preferences";

export interface PushNotifications {
  /** API support AND an active service worker (false in `next dev`). */
  supported: boolean;
  /** Browser permission: "default" | "granted" | "denied". */
  permission: NotificationPermission;
  /** Whether this browser currently has a registered push subscription. */
  active: boolean;
  busy: boolean;
  /** Request permission + subscribe + register. Returns whether it succeeded. */
  enable: () => Promise<boolean>;
  /** Unsubscribe locally and remove the subscription server-side. */
  disable: () => Promise<void>;
}

/** Pull {endpoint, keys} out of a PushSubscription, or null if incomplete. */
function toPayload(sub: PushSubscription) {
  const json = sub.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) return null;
  return {
    endpoint: json.endpoint,
    keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
  };
}

/**
 * Owns the Web Push subscribe lifecycle for the current browser. Uses
 * `getRegistration()` (not `.ready`, which hangs forever when no service worker
 * is registered — e.g. `next dev`), so `supported` is only true when push can
 * actually work. The in-app notification preference is managed by the caller.
 */
export function usePushNotifications(): PushNotifications {
  const [supported, setSupported] = useState(false);
  // Lazily read the current permission (client-only) so we don't call setState
  // synchronously inside the effect below.
  const [permission, setPermission] = useState<NotificationPermission>(() =>
    isPushSupported() ? Notification.permission : "default",
  );
  const [active, setActive] = useState(false);
  const [busy, setBusy] = useState(false);

  // Detect capabilities + current subscription on mount, and re-register any
  // existing subscription (covers the browser rotating it while we were away).
  useEffect(() => {
    if (!isPushSupported()) return;

    let cancelled = false;
    void (async () => {
      const reg = await navigator.serviceWorker.getRegistration();
      if (cancelled) return;
      if (!reg) {
        setSupported(false); // API exists but no SW (dev) → push can't run
        return;
      }
      setSupported(true);
      let sub = await reg.pushManager.getSubscription();
      if (cancelled) return;

      // Self-heal: permission is already granted and notifications are on, but
      // this browser has no subscription (first open after install, cleared
      // site data, or a rotation we missed). Subscribing now shows no prompt,
      // so it's safe to do without a user gesture.
      if (!sub && Notification.permission === "granted" && getNotificationsEnabled()) {
        try {
          const publicKey = await pushApi.getPublicKey();
          if (publicKey && !cancelled) {
            sub = await reg.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(publicKey),
            });
          }
        } catch {
          /* stay unsubscribed; the profile toggle can retry with feedback */
        }
      }
      if (cancelled) return;

      setActive(Boolean(sub));
      if (sub) {
        const payload = toPayload(sub);
        if (payload) await pushApi.subscribe(payload).catch(() => undefined);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const enable = useCallback(async (): Promise<boolean> => {
    if (!isPushSupported()) return false;
    setBusy(true);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") return false;

      const reg = await navigator.serviceWorker.getRegistration();
      if (!reg) return false;

      const publicKey = await pushApi.getPublicKey();
      if (!publicKey) return false; // push disabled server-side

      const sub =
        (await reg.pushManager.getSubscription()) ??
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        }));

      const payload = toPayload(sub);
      if (!payload) return false;

      await pushApi.subscribe(payload);
      setActive(true);
      return true;
    } catch {
      return false;
    } finally {
      setBusy(false);
    }
  }, []);

  const disable = useCallback(async (): Promise<void> => {
    if (!isPushSupported()) return;
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        const { endpoint } = sub;
        await sub.unsubscribe().catch(() => undefined);
        await pushApi.unsubscribe(endpoint).catch(() => undefined);
      }
      setActive(false);
    } finally {
      setBusy(false);
    }
  }, []);

  return { supported, permission, active, busy, enable, disable };
}
