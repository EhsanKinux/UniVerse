"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Logout02Icon } from "@hugeicons/core-free-icons";

import { useMounted } from "@/hooks/use-mounted";
import { Button } from "@/components/ui/button";
import { getMockUser, signOutMock, type MockUser } from "@/lib/auth";
import { APP_VERSION } from "@/lib/profile-data";
import { ProfileIdentityCard } from "./profile-identity-card";
import { ProfileEditCard } from "./profile-edit-card";
import { ProfileAcademicSnapshot } from "./profile-academic-snapshot";
import { ProfileAcademicInfo } from "./profile-academic-info";
import { ProfilePreferences } from "./profile-preferences";
import { ProfileSupportCard } from "./profile-support";

export function ProfileView() {
  const router = useRouter();
  const mounted = useMounted();
  const [editing, setEditing] = React.useState(false);
  // Local override takes precedence once the user edits in this session; until
  // then we derive from localStorage (gated by `mounted` for hydration safety).
  const [userOverride, setUserOverride] = React.useState<MockUser | null>(null);

  const storedUser = React.useMemo(() => (mounted ? getMockUser() : null), [mounted]);
  const user = userOverride ?? storedUser;

  const name = user?.name ?? "کاربر";
  const email = user?.email ?? "—";

  function handleSignOut() {
    signOutMock();
    router.replace("/sign-in");
  }

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
          user={user}
          onCancel={() => setEditing(false)}
          onSaved={(updated) => {
            setUserOverride(updated);
            setEditing(false);
          }}
        />
      ) : (
        <ProfileIdentityCard
          mounted={mounted}
          name={name}
          email={email}
          phone={user?.phone}
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
        onClick={handleSignOut}
        className="h-12 w-full rounded-2xl text-base font-semibold"
      >
        <HugeiconsIcon icon={Logout02Icon} size={20} />
        خروج از حساب
      </Button>

      <p className="pt-1 text-center text-[11px] text-muted-foreground">Universe • نسخه {APP_VERSION}</p>
    </div>
  );
}
