import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

import { quickLinks } from "@/lib/profile-data";
import { SectionHeading } from "./profile-ui";

/** Shortcuts from the profile to the student's own pages. */
export function ProfileQuickLinks() {
  return (
    <section className="space-y-3">
      <SectionHeading title="میان‌برها" />
      <div className="grid grid-cols-2 gap-2.5">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex items-center gap-3 rounded-3xl border border-border bg-card/85 p-3.5 shadow-sm backdrop-blur-xl transition-all hover:border-primary/20 hover:shadow-md active:scale-[0.98]"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-background">
              <HugeiconsIcon icon={link.icon} size={20} className={link.tone} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-foreground">{link.label}</span>
              <span className="block truncate text-[11px] text-muted-foreground">{link.hint}</span>
            </span>
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              size={16}
              className="shrink-0 text-muted-foreground/60 transition-transform group-hover:-translate-x-0.5"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
