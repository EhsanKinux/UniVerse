"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Download01Icon,
  Logout02Icon,
  Moon02Icon,
  Sun02Icon,
  ComputerIcon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InstallGuideSheet } from "@/components/pwa/install-guide-sheet";
import { useInstall } from "@/hooks/pwa/use-install";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProfile, useLogout } from "@/hooks/auth";

export function ProfileMenu() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { name, email, initials, avatarSrc, mounted } = useProfile();
  const logout = useLogout();

  // The home-page install banner is dismissible; this is the permanent way back
  // to installing, so it stays until the app actually is installed.
  const install = useInstall();
  const [guideOpen, setGuideOpen] = React.useState(false);

  function handleSignOut() {
    // useLogout revokes the refresh token server-side then redirects to sign-in.
    logout.mutate();
  }

  async function handleInstall() {
    if (install.canPromptDirectly && (await install.install()) !== "unavailable") return;
    setGuideOpen(true);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="group relative shrink-0 rounded-full outline-none transition-transform active:scale-95 focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label="منوی کاربر"
        >
          <Avatar className="size-10 border border-border shadow-sm">
            <AvatarImage src={mounted ? avatarSrc : undefined} alt={name} />
            <AvatarFallback className="bg-primary/12 text-sm font-bold text-primary">
              {mounted ? initials : ""}
            </AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 end-0 size-3 rounded-full border-2 border-background bg-emerald-500" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" sideOffset={8} className="w-64">
          {/* Identity */}
          <div className="flex items-center gap-3 p-2">
            <Avatar className="size-10">
              <AvatarImage src={mounted ? avatarSrc : undefined} alt={name} />
              <AvatarFallback className="bg-primary/12 text-sm font-bold text-primary">
                {mounted ? initials : ""}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{mounted ? name : ""}</p>
              <p dir="ltr" className="truncate text-right text-xs text-muted-foreground">
                {mounted ? email : ""}
              </p>
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <HugeiconsIcon icon={UserCircleIcon} />
            حساب کاربری
          </DropdownMenuItem>

          {install.ready && !install.installed && (
            <DropdownMenuItem onClick={handleInstall}>
              <HugeiconsIcon icon={Download01Icon} />
              نصب اپلیکیشن
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <p className="px-1.5 py-1 text-xs font-medium text-muted-foreground">پوسته</p>
          <DropdownMenuRadioGroup value={mounted ? theme : undefined} onValueChange={setTheme}>
            <DropdownMenuRadioItem value="light">
              <HugeiconsIcon icon={Sun02Icon} />
              روشن
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">
              <HugeiconsIcon icon={Moon02Icon} />
              تیره
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">
              <HugeiconsIcon icon={ComputerIcon} />
              سیستم
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
            <HugeiconsIcon icon={Logout02Icon} />
            خروج از حساب
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <InstallGuideSheet
        open={guideOpen}
        onOpenChange={setGuideOpen}
        platform={install.platform}
        secure={install.secure}
      />
    </>
  );
}
