"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { dormApi } from "@/lib/api/dorm.api";
import { dormKeys } from "@/lib/api/query-keys";
import type { DormAnnouncement, DormStreamEvent } from "@/lib/api/types";

/**
 * Subscribes to the dorm announcements SSE stream and keeps the app live:
 *
 *  • ANY change (created / updated / deleted) invalidates the dorm hub query, so
 *    the خوابگاه page re-renders with fresh data on its own.
 *  • A brand-new published announcement also fires `onCreated`, which the
 *    notification layer turns into a toast + a bell entry.
 *
 * `EventSource` reconnects automatically if the connection drops. The callback is
 * held in a ref so changing it never tears down and reopens the connection.
 * Mirrors use-news-stream.ts.
 */
export function useDormStream(onCreated?: (item: DormAnnouncement) => void) {
  const queryClient = useQueryClient();

  const onCreatedRef = useRef(onCreated);
  useEffect(() => {
    onCreatedRef.current = onCreated;
  }, [onCreated]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof EventSource === "undefined") {
      return;
    }

    const source = new EventSource(dormApi.streamUrl());

    source.onmessage = (event: MessageEvent<string>) => {
      let payload: DormStreamEvent;
      try {
        payload = JSON.parse(event.data) as DormStreamEvent;
      } catch {
        return; // ignore malformed frames
      }

      if (payload.type === "ping") return; // keep-alive heartbeat

      // Any change refreshes the hub (and any open detail page reads from it).
      void queryClient.invalidateQueries({ queryKey: dormKeys.all });

      if (payload.type === "created") {
        onCreatedRef.current?.(payload.item);
      }
    };

    // On error the browser retries on its own; closing here would stop that.
    source.onerror = () => {};

    return () => source.close();
  }, [queryClient]);
}
