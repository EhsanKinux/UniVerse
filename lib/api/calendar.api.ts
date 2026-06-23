import { apiClient } from "./client";
import type { ActiveCalendar } from "./types";

// Thin, typed wrapper around the public calendar endpoint. It needs no auth, but
// going through `apiClient` keeps the base URL and error normalization
// consistent with the rest of the app.
export const calendarApi = {
  getActive(): Promise<ActiveCalendar> {
    return apiClient.get<ActiveCalendar>("/calendar/active").then((res) => res.data);
  },
};
