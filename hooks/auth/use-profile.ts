"use client";

import { useAuth } from "./use-auth";
import { useProfileDetails } from "@/hooks/profile";
import { resolveAvatarSrc } from "@/lib/api/profile.api";
import { getInitials } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";

/**
 * The display model for profile UI: the authenticated user merged with their
 * fetched profile (name, phone, avatar). Built on the cached `/auth/me` and
 * `/profile` queries, so it's cheap to call from the header menu and the
 * profile page alike.
 */
export function useProfile() {
  const mounted = useMounted();
  const { user, isLoading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfileDetails();

  const name =
    profile?.name?.trim() ||
    user?.name?.trim() ||
    user?.email?.split("@")[0] ||
    "کاربر";

  return {
    user,
    profile: profile ?? null,
    name,
    email: profile?.email ?? user?.email ?? "—",
    phone: profile?.phone ?? undefined,
    avatarSrc: resolveAvatarSrc(profile?.avatarUrl),
    initials: getInitials(name),
    isLoading: authLoading || profileLoading,
    mounted,
  };
}
