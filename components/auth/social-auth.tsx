"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { GoogleIcon, ShieldUserIcon } from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";

export type SsoProvider = "Google" | "University";

export function SocialAuth({ disabled, onSelect }: { disabled?: boolean; onSelect: (provider: SsoProvider) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => onSelect("Google")}
        className="h-11 rounded-xl"
      >
        <HugeiconsIcon icon={GoogleIcon} className="h-5 w-5" strokeWidth={1.8} />
        گوگل
      </Button>
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => onSelect("University")}
        className="h-11 rounded-xl"
      >
        <HugeiconsIcon icon={ShieldUserIcon} className="h-5 w-5" strokeWidth={1.8} />
        حساب دانشگاهی
      </Button>
    </div>
  );
}
