"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ApiError } from "@/lib/api/errors";
import { scheduleApi } from "@/lib/api/schedule.api";
import { scheduleKeys } from "@/lib/api/query-keys";
import type { Course, CourseFormPayload } from "@/lib/api/types";

/**
 * Create / update / delete mutations for courses. All three simply invalidate
 * the one weekly-schedule query on success — the payload is small, so a fresh
 * GET is simpler and safer than hand-patching the cache in three places.
 */
export function useCourseMutations() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: scheduleKeys.weekly() });

  const createCourse = useMutation<Course, ApiError, CourseFormPayload>({
    mutationFn: scheduleApi.createCourse,
    onSuccess: invalidate,
  });

  const updateCourse = useMutation<Course, ApiError, { id: string; payload: CourseFormPayload }>({
    mutationFn: ({ id, payload }) => scheduleApi.updateCourse(id, payload),
    onSuccess: invalidate,
  });

  const deleteCourse = useMutation<void, ApiError, string>({
    mutationFn: scheduleApi.deleteCourse,
    onSuccess: invalidate,
  });

  return { createCourse, updateCourse, deleteCourse };
}
