"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkBadge01Icon,
  PencilEdit02Icon,
  SmartPhone01Icon,
  Camera01Icon,
  Delete02Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn, getInitials, toPersianDigits } from "@/lib/utils";
import type { ProfileData } from "@/lib/api/types";
import { useProfileMutations } from "@/hooks/profile";

// Max avatar size accepted client-side (mirrors the backend's 5MB cap).
const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const ACCEPT = "image/png,image/jpeg,image/webp";

export function ProfileIdentityCard({
  profile,
  name,
  avatarSrc,
  onEdit,
}: {
  profile: ProfileData;
  name: string;
  avatarSrc?: string;
  onEdit: () => void;
}) {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const { uploadAvatar, deleteAvatar } = useProfileMutations();
  const [localError, setLocalError] = React.useState<string | null>(null);

  const busy = uploadAvatar.isPending || deleteAvatar.isPending;
  const error = localError ?? uploadAvatar.error?.message ?? deleteAvatar.error?.message ?? null;

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;
    setLocalError(null);
    if (!ACCEPT.split(",").includes(file.type)) {
      setLocalError("فقط تصویر PNG، JPEG یا WebP مجاز است.");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setLocalError("حجم تصویر باید کمتر از ۵ مگابایت باشد.");
      return;
    }
    uploadAvatar.mutate(file);
  }

  return (
    <Card className="relative overflow-hidden p-5">
      <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent" />
      <div className="absolute -top-10 -start-10 size-36 rounded-full bg-primary/5 blur-2xl" />
      <div className="absolute -bottom-8 -end-8 size-28 rounded-full bg-primary/5 blur-2xl" />

      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <Avatar className="size-20 border-2 border-background shadow-lg ring-1 ring-border">
              <AvatarImage src={avatarSrc} alt={name} />
              <AvatarFallback className="bg-primary/12 text-2xl font-black text-primary">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>

            {/* Upload / replace */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              aria-label={avatarSrc ? "تغییر تصویر" : "افزودن تصویر"}
              className="absolute -bottom-1 -end-1 flex size-7 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow-md transition-transform active:scale-90 disabled:opacity-70"
            >
              <HugeiconsIcon
                icon={busy ? Loading03Icon : Camera01Icon}
                size={14}
                className={cn(busy && "animate-spin")}
              />
            </button>

            {/* Remove (only when an avatar exists) */}
            {avatarSrc && !busy && (
              <button
                type="button"
                onClick={() => deleteAvatar.mutate()}
                aria-label="حذف تصویر"
                className="absolute -top-1 -end-1 flex size-6 items-center justify-center rounded-full border-2 border-card bg-destructive text-white shadow-md transition-transform active:scale-90"
              >
                <HugeiconsIcon icon={Delete02Icon} size={12} />
              </button>
            )}

            <input
              ref={fileRef}
              type="file"
              accept={ACCEPT}
              onChange={handleFile}
              className="hidden"
            />
          </div>

          <div className="min-w-0 flex-1 pt-1">
            <h1 className="truncate text-xl font-bold tracking-tight text-foreground">{name}</h1>
            <p dir="ltr" className="mt-0.5 truncate text-right text-sm text-muted-foreground">
              {profile.email}
            </p>
            {profile.phone && (
              <p dir="ltr" className="mt-0.5 flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                {toPersianDigits(profile.phone)}
                <HugeiconsIcon icon={SmartPhone01Icon} size={13} />
              </p>
            )}
            <div className="mt-2.5">
              <Badge variant="success" className="gap-1">
                <HugeiconsIcon icon={CheckmarkBadge01Icon} size={14} />
                {profile.completion.level.label}
              </Badge>
            </div>
          </div>
        </div>

        {error && <p className="mt-3 text-xs text-destructive">{error}</p>}

        <Button variant="outline" size="lg" onClick={onEdit} className="mt-4 h-11 w-full rounded-2xl font-semibold">
          <HugeiconsIcon icon={PencilEdit02Icon} size={18} />
          ویرایش پروفایل
        </Button>
      </div>
    </Card>
  );
}
