"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ApiError } from "@/lib/api/errors";
import { scheduleApi } from "@/lib/api/schedule.api";
import { scheduleKeys } from "@/lib/api/query-keys";
import type {
  ScheduleSettings,
  ScheduleSettingsPayload,
  WeeklySchedule,
} from "@/lib/api/types";

/**
 * PATCHes reminder/parity settings. The server responds with the fresh settings
 * object, so instead of refetching the whole schedule we surgically swap the
 * `settings` slice into the cached weekly payload — toggles feel instant.
 */
export function useUpdateScheduleSettings() {
  const queryClient = useQueryClient();

  return useMutation<ScheduleSettings, ApiError, ScheduleSettingsPayload>({
    mutationFn: scheduleApi.updateSettings,
    onSuccess: (settings) => {
      queryClient.setQueryData<WeeklySchedule>(scheduleKeys.weekly(), (prev) =>
        prev ? { ...prev, settings } : prev,
      );
    },
  });
}
