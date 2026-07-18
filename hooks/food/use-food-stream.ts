"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { foodApi } from "@/lib/api/food.api";
import { foodKeys } from "@/lib/api/query-keys";
import type { FoodAnnouncement, FoodStreamEvent } from "@/lib/api/types";

/**
 * Subscribes to the food announcements SSE stream and keeps the app live:
 *
 *  • ANY change (created / updated / deleted) invalidates the food hub query, so
 *    the تغذیه page re-renders with fresh data on its own.
 *  • A brand-new published announcement also fires `onCreated`, which the
 *    notification layer turns into a toast + a bell entry.
 *
 * `EventSource` reconnects automatically if the connection drops. The callback is
 * held in a ref so changing it never tears down and reopens the connection.
 * Mirrors use-dorm-stream.ts.
 */
export function useFoodStream(onCreated?: (item: FoodAnnouncement) => void) {
  const queryClient = useQueryClient();

  const onCreatedRef = useRef(onCreated);
  useEffect(() => {
    onCreatedRef.current = onCreated;
  }, [onCreated]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof EventSource === "undefined") {
      return;
    }

    const source = new EventSource(foodApi.streamUrl());

    source.onmessage = (event: MessageEvent<string>) => {
      let payload: FoodStreamEvent;
      try {
        payload = JSON.parse(event.data) as FoodStreamEvent;
      } catch {
        return; // ignore malformed frames
      }

      if (payload.type === "ping") return; // keep-alive heartbeat

      // Any change refreshes the hub (and any open detail page reads from it).
      void queryClient.invalidateQueries({ queryKey: foodKeys.all });

      if (payload.type === "created") {
        onCreatedRef.current?.(payload.item);
      }
    };

    // On error the browser retries on its own; closing here would stop that.
    source.onerror = () => {};

    return () => source.close();
  }, [queryClient]);
}
