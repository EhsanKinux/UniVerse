import { apiClient } from "./client";
import type {
  Course,
  CourseFormPayload,
  ScheduleSettings,
  ScheduleSettingsPayload,
  WeeklySchedule,
} from "./types";

// Thin, typed wrappers around the weekly-schedule endpoints (see
// univers-backend/src/schedule). All routes require a logged-in user; the axios
// client attaches the access token and handles the silent-refresh dance.

export const scheduleApi = {
  /** The caller's full schedule: courses + settings + today's index. */
  getWeeklySchedule(): Promise<WeeklySchedule> {
    return apiClient.get<WeeklySchedule>("/schedule").then((res) => res.data);
  },

  createCourse(payload: CourseFormPayload): Promise<Course> {
    return apiClient.post<Course>("/schedule/courses", payload).then((res) => res.data);
  },

  updateCourse(id: string, payload: CourseFormPayload): Promise<Course> {
    return apiClient.patch<Course>(`/schedule/courses/${id}`, payload).then((res) => res.data);
  },

  deleteCourse(id: string): Promise<void> {
    return apiClient.delete(`/schedule/courses/${id}`).then(() => undefined);
  },

  updateSettings(payload: ScheduleSettingsPayload): Promise<ScheduleSettings> {
    return apiClient
      .patch<ScheduleSettings>("/schedule/settings", payload)
      .then((res) => res.data);
  },
};
