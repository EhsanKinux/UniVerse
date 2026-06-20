// Centralized React Query keys. Using a single factory keeps cache
// invalidation consistent and avoids stringly-typed keys scattered around.

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};
