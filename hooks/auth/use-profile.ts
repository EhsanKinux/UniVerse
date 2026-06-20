"use client";

import { useAuth } from "./use-auth";
import { getLocalProfile } from "@/lib/local-profile";
import { getInitials } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";

/**
 * The display model for profile UI: the server user merged with local-only
 * extras (phone, optional name override). Read this re-runs on every render, so
 * UI reflects local edits without a reload.
 */
export function useProfile() {
  const mounted = useMounted();
  const { user, isLoading } = useAuth();
  const local = mounted ? getLocalProfile() : {};

  const name =
    local.name?.trim() ||
    user?.name?.trim() ||
    user?.email?.split("@")[0] ||
    "کاربر";

  return {
    user,
    name,
    email: user?.email ?? "—",
    phone: local.phone,
    initials: getInitials(name),
    isLoading,
    mounted,
  };
}
