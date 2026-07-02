"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { newsApi } from "@/lib/api/news.api";
import { newsKeys } from "@/lib/api/query-keys";
import type { NewsItem, NewsStreamEvent } from "@/lib/api/types";

/**
 * Subscribes to the backend's Server-Sent Events stream and keeps the app live:
 *
 *  • ANY change (created / updated / deleted) invalidates the news query, so the
 *    carousel re-renders with fresh data on its own.
 *  • A brand-new published item also fires `onCreated`, which the notification
 *    layer turns into a toast + a bell entry.
 *
 * `EventSource` reconnects automatically if the connection drops, so there's no
 * polling and no manual retry logic. The callback is held in a ref so changing
 * it never tears down and reopens the connection.
 */
export function useNewsStream(onCreated?: (item: NewsItem) => void) {
  const queryClient = useQueryClient();

  // Hold the callback in a ref (synced via an effect, not during render) so the
  // SSE effect below can stay mounted while the callback identity changes.
  const onCreatedRef = useRef(onCreated);
  useEffect(() => {
    onCreatedRef.current = onCreated;
  }, [onCreated]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof EventSource === "undefined") {
      return;
    }

    const source = new EventSource(newsApi.streamUrl());

    source.onmessage = (event: MessageEvent<string>) => {
      let payload: NewsStreamEvent;
      try {
        payload = JSON.parse(event.data) as NewsStreamEvent;
      } catch {
        return; // ignore malformed frames
      }

      if (payload.type === "ping") return; // keep-alive heartbeat

      // Any change refreshes the cached list → the carousel updates live.
      void queryClient.invalidateQueries({ queryKey: newsKeys.list() });

      if (payload.type === "created") {
        onCreatedRef.current?.(payload.item);
      }
    };

    // On error the browser retries on its own; closing here would stop that.
    source.onerror = () => {};

    return () => source.close();
  }, [queryClient]);
}
