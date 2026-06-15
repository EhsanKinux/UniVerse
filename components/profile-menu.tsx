"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Logout02Icon,
  Moon02Icon,
  Sun02Icon,
  ComputerIcon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getMockUser, signOutMock, type MockUser } from "@/lib/auth";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "؟";
  if (parts.length === 1) return parts[0].slice(0, 2);
  return parts[0][0] + parts[1][0];
}

export function ProfileMenu() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [user, setUser] = React.useState<MockUser | null>(null);

  React.useEffect(() => {
    setMounted(true);
    setUser(getMockUser());
  }, []);

  const name = user?.name ?? "کاربر";
  const email = user?.email ?? "—";

  function handleSignOut() {
    signOutMock();
    router.replace("/sign-in");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="group relative shrink-0 rounded-full outline-none transition-transform active:scale-95 focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-label="منوی کاربر"
      >
        <Avatar className="size-10 border border-border shadow-sm">
          <AvatarImage src={undefined} alt={name} />
          <AvatarFallback className="bg-primary/12 text-sm font-bold text-primary">
            {mounted ? initials(name) : ""}
          </AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 end-0 size-3 rounded-full border-2 border-background bg-emerald-500" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-64">
        {/* Identity */}
        <div className="flex items-center gap-3 p-2">
          <Avatar className="size-10">
            <AvatarFallback className="bg-primary/12 text-sm font-bold text-primary">
              {mounted ? initials(name) : ""}
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

        <DropdownMenuItem>
          <HugeiconsIcon icon={UserCircleIcon} />
          حساب کاربری
        </DropdownMenuItem>

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
  );
}
