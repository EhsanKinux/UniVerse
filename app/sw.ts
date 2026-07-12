import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
  CacheableResponsePlugin,
  ExpirationPlugin,
  NetworkOnly,
  Serwist,
  StaleWhileRevalidate,
} from "serwist";

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this is `self.__SW_MANIFEST`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// Where the browser sends API calls — mirrors `lib/env.ts`. Inlined at build
// time. Either a same-origin prefix ("/api", proxied by Next) or an absolute
// public origin (e.g. "https://unib.dowloadfiles.ir" when the browser calls the
// backend directly). Resolving against the SW's own origin makes both forms
// comparable as full URLs, so the matchers below work in either deployment.
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "/api").replace(/\/+$/, "");
const apiUrl = (path: string) => new URL(`${API_BASE}${path}`, self.location.origin).href;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      // Academic calendar. Stale-while-revalidate keeps the last-known calendar
      // available offline while it refreshes in the background.
      matcher: ({ url, request }) =>
        request.method === "GET" && url.href === apiUrl("/calendar/active"),
      handler: new StaleWhileRevalidate({
        cacheName: "calendar-active",
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({ maxEntries: 8, maxAgeSeconds: 24 * 60 * 60 }),
        ],
      }),
    },
    {
      // Everything else on the API is live data (and the news SSE stream) — never
      // cache it, so the SW can't serve a stale API response or buffer the stream.
      matcher: ({ url }) => url.href.startsWith(apiUrl("/")),
      handler: new NetworkOnly(),
    },
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        // Shown when a navigation request fails and nothing is cached.
        url: "/offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();

// -----------------------------------------------------------------------------
// Web Push — OS notifications (work even when the PWA is closed)
// -----------------------------------------------------------------------------
// The backend (PushService) sends an encrypted JSON payload; we render it as a
// system notification and, on click, focus an existing tab or open a new one at
// the target URL.

interface PushPayload {
  title?: string;
  body?: string;
  url?: string;
  tag?: string;
}

self.addEventListener("push", (event) => {
  let payload: PushPayload = {};
  try {
    payload = (event.data?.json() as PushPayload) ?? {};
  } catch {
    payload = { body: event.data?.text() };
  }

  const title = payload.title || "دانشگاه";
  const url = payload.url || "/";

  event.waitUntil(
    self.registration.showNotification(title, {
      body: payload.body,
      icon: "/icons/u-192x192.png",
      badge: "/icons/u-192x192.png",
      dir: "rtl",
      lang: "fa",
      // A tag collapses repeats of the same item into one notification.
      tag: payload.tag,
      data: { url },
    }),
  );
});

// The browser can rotate a push subscription on its own (browser/WebAPK update,
// push-service key rollover). Pages only repair this while open; handling it
// here keeps the backend's endpoint current even when the app is closed —
// otherwise every send returns 410, the row is pruned, and pushes silently
// stop until the next app open.
interface PushSubscriptionChangeEvent extends ExtendableEvent {
  readonly oldSubscription: PushSubscription | null;
  readonly newSubscription: PushSubscription | null;
}

const postJson = (path: string, body: unknown) =>
  fetch(apiUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

self.addEventListener("pushsubscriptionchange", ((event: PushSubscriptionChangeEvent) => {
  event.waitUntil(
    (async () => {
      let sub = event.newSubscription;
      if (!sub) {
        // No replacement provided — renew with the key the old subscription
        // used. Without that key there's nothing to renew with; the app
        // self-heals on its next open instead.
        const applicationServerKey = event.oldSubscription?.options.applicationServerKey;
        if (!applicationServerKey) return;
        try {
          sub = await self.registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey,
          });
        } catch {
          return;
        }
      }

      const json = sub.toJSON();
      if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) return;

      await postJson("/push/subscribe", {
        endpoint: json.endpoint,
        keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
      }).catch(() => undefined);

      if (event.oldSubscription && event.oldSubscription.endpoint !== json.endpoint) {
        await postJson("/push/unsubscribe", {
          endpoint: event.oldSubscription.endpoint,
        }).catch(() => undefined);
      }
    })(),
  );
}) as EventListener);

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification.data as { url?: string } | undefined;
  const targetUrl = data?.url || "/";

  event.waitUntil(
    (async () => {
      const windowClients = (await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      })) as WindowClient[];

      // Focus an already-open window (and steer it to the target) if we can…
      for (const client of windowClients) {
        await client.focus();
        try {
          await client.navigate(targetUrl);
        } catch {
          /* navigation may be disallowed; focusing is enough */
        }
        return;
      }

      // …otherwise open a fresh one.
      if (self.clients.openWindow) {
        await self.clients.openWindow(targetUrl);
      }
    })(),
  );
});
