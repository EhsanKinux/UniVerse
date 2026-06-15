import Link from "next/link";

import { cn } from "@/lib/utils";

export function ModeSwitch({ mode }: { mode: "sign-in" | "sign-up" }) {
  return (
    <div className="mb-5 grid grid-cols-2 gap-1 rounded-2xl border border-border bg-muted/50 p-1">
      <Tab href="/sign-in" active={mode === "sign-in"}>
        ورود
      </Tab>
      <Tab href="/sign-up" active={mode === "sign-up"}>
        ثبت‌نام
      </Tab>
    </div>
  );
}

function Tab({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-center rounded-xl py-2 text-sm font-medium transition-all",
        active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}
