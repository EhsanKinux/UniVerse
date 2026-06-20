"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Logout02Icon } from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { useProfile, useLogout } from "@/hooks/auth";
import { APP_VERSION } from "@/lib/profile-data";
import { ProfileIdentityCard } from "./profile-identity-card";
import { ProfileEditCard } from "./profile-edit-card";
import { ProfileAcademicSnapshot } from "./profile-academic-snapshot";
import { ProfileAcademicInfo } from "./profile-academic-info";
import { ProfilePreferences } from "./profile-preferences";
import { ProfileSupportCard } from "./profile-support";

export function ProfileView() {
  const logout = useLogout();
  const [editing, setEditing] = React.useState(false);
  // Identity comes from the server (`/auth/me`); phone/name-override are local
  // extras. `useProfile` re-reads local storage each render, so leaving edit
  // mode reflects the saved changes immediately.
  const { user, name, email, phone, mounted } = useProfile();

  return (
    <div className="animate-fade-in-up space-y-6 pb-4">
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-2 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-xl transition-colors hover:text-foreground"
      >
        <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
        بازگشت به خانه
      </Link>

      {editing ? (
        <ProfileEditCard
          email={email}
          serverName={user?.name ?? null}
          onCancel={() => setEditing(false)}
          onSaved={() => setEditing(false)}
        />
      ) : (
        <ProfileIdentityCard
          mounted={mounted}
          name={name}
          email={email}
          phone={phone}
          onEdit={() => setEditing(true)}
        />
      )}

      <ProfileAcademicSnapshot />
      <ProfileAcademicInfo />
      <ProfilePreferences />
      <ProfileSupportCard />

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

      <p className="pt-1 text-center text-[11px] text-muted-foreground">Universe • نسخه {APP_VERSION}</p>
    </div>
  );
}
