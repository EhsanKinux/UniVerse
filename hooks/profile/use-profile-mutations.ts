"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ApiError } from "@/lib/api/errors";
import { profileApi } from "@/lib/api/profile.api";
import { authKeys, profileKeys } from "@/lib/api/query-keys";
import type { ProfileData, UpdateProfilePayload } from "@/lib/api/types";

/**
 * Update / avatar-upload / avatar-delete mutations. Each returns the fresh
 * ProfileData, so we prime the cache directly (no refetch) and also invalidate
 * `/auth/me` because the display name lives on the user record too.
 */
export function useProfileMutations() {
  const queryClient = useQueryClient();

  const onSuccess = (data: ProfileData) => {
    queryClient.setQueryData(profileKeys.me(), data);
    queryClient.invalidateQueries({ queryKey: authKeys.me() });
  };

  const update = useMutation<ProfileData, ApiError, UpdateProfilePayload>({
    mutationFn: profileApi.updateProfile,
    onSuccess,
  });

  const uploadAvatar = useMutation<ProfileData, ApiError, File>({
    mutationFn: profileApi.uploadAvatar,
    onSuccess,
  });

  const deleteAvatar = useMutation<ProfileData, ApiError, void>({
    mutationFn: () => profileApi.deleteAvatar(),
    onSuccess,
  });

  return { update, uploadAvatar, deleteAvatar };
}
