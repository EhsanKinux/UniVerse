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

export const newsKeys = {
  all: ["news"] as const,
  list: () => [...newsKeys.all, "list"] as const,
  detail: (id: string) => [...newsKeys.all, "detail", id] as const,
};

export const scheduleKeys = {
  all: ["schedule"] as const,
  weekly: () => [...scheduleKeys.all, "weekly"] as const,
};

export const profileKeys = {
  all: ["profile"] as const,
  me: () => [...profileKeys.all, "me"] as const,
};
