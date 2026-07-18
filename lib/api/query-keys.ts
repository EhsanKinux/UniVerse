// Centralized React Query keys. Using a single factory keeps cache
// invalidation consistent and avoids stringly-typed keys scattered around.

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export const calendarKeys = {
  all: ["calendar"] as const,
  active: () => [...calendarKeys.all, "active"] as const,
};

export const documentKeys = {
  all: ["documents"] as const,
  category: (category: string) => [...documentKeys.all, category] as const,
};

export const chartKeys = {
  all: ["chart"] as const,
  list: () => [...chartKeys.all, "list"] as const,
};

export const phoneBookKeys = {
  all: ["phone-book"] as const,
  list: () => [...phoneBookKeys.all, "list"] as const,
};

export const groupsKeys = {
  all: ["groups"] as const,
  list: () => [...groupsKeys.all, "list"] as const,
};

export const newsKeys = {
  all: ["news"] as const,
  list: () => [...newsKeys.all, "list"] as const,
  detail: (id: string) => [...newsKeys.all, "detail", id] as const,
};

export const dormKeys = {
  all: ["dorm"] as const,
  hub: () => [...dormKeys.all, "hub"] as const,
  announcement: (id: string) => [...dormKeys.all, "announcement", id] as const,
};

export const foodKeys = {
  all: ["food"] as const,
  hub: () => [...foodKeys.all, "hub"] as const,
  announcement: (id: string) => [...foodKeys.all, "announcement", id] as const,
  // Places are keyed by the rounded search point so a small GPS drift reuses the
  // cache instead of refetching (the server rounds the same way).
  places: (lat: number, lng: number, radius: number) =>
    [...foodKeys.all, "places", lat.toFixed(3), lng.toFixed(3), radius] as const,
};

export const scheduleKeys = {
  all: ["schedule"] as const,
  weekly: () => [...scheduleKeys.all, "weekly"] as const,
};

export const profileKeys = {
  all: ["profile"] as const,
  me: () => [...profileKeys.all, "me"] as const,
};
