"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Logout02Icon } from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile, useLogout } from "@/hooks/auth";
import { APP_VERSION } from "@/lib/profile-data";
import { ProfileIdentityCard } from "./profile-identity-card";
import { ProfileCompletionCard } from "./profile-completion-card";
import { ProfileInfoSections } from "./profile-info-sections";
import { ProfileEditForm } from "./profile-edit-form";
import { ProfileQuickLinks } from "./profile-quick-links";
import { ProfilePreferences } from "./profile-preferences";
import { ProfileSupportCard } from "./profile-support";
import { ProfileDangerZone } from "./profile-danger-zone";

export function ProfileView() {
  const logout = useLogout();
  const [editing, setEditing] = React.useState(false);
  // Identity + all fields come from the server (/profile); avatar/name/phone are
  // part of that payload now (no more localStorage extras).
  const { profile, name, avatarSrc, mounted, isLoading } = useProfile();

  const backLink = (
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-2 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-xl transition-colors hover:text-foreground"
    >
      <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
      بازگشت به خانه
    </Link>
  );

  // Loading (or pre-hydration): show placeholders so nothing pops in/out.
  if (!mounted || (isLoading && !profile)) {
    return (
      <div className="animate-fade-in-up space-y-6 pb-4">
        {backLink}
        <Skeleton className="h-44 w-full rounded-3xl" />
        <Skeleton className="h-32 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  // No profile despite a session — a transient fetch error. Offer a retry.
  if (!profile) {
    return (
      <div className="animate-fade-in-up space-y-6 pb-4">
        {backLink}
        <Card className="space-y-3 p-6 text-center">
          <p className="text-sm text-muted-foreground">دریافت اطلاعات حساب ناموفق بود.</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            تلاش دوباره
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up space-y-6 pb-4">
      {backLink}

      {editing ? (
        <ProfileEditForm profile={profile} onDone={() => setEditing(false)} />
      ) : (
        <>
          <ProfileIdentityCard
            profile={profile}
            name={name}
            avatarSrc={avatarSrc}
            onEdit={() => setEditing(true)}
          />
          <ProfileCompletionCard profile={profile} onEdit={() => setEditing(true)} />
          <ProfileInfoSections profile={profile} onEdit={() => setEditing(true)} />
          <ProfileQuickLinks />
          <ProfilePreferences />
          <ProfileSupportCard />

          <div className="space-y-3">
            <Button
              variant="destructive"
              size="lg"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="h-12 w-full rounded-2xl text-base font-semibold"
            >
              <HugeiconsIcon icon={Logout02Icon} size={20} />
              خروج از حساب
            </Button>
            <ProfileDangerZone />
          </div>

          <p className="pt-1 text-center text-[11px] text-muted-foreground">Universe • نسخه {APP_VERSION}</p>
        </>
      )}
    </div>
  );
}
