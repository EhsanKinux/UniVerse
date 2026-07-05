"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { PencilEdit02Icon } from "@hugeicons/core-free-icons";

import { Card } from "@/components/ui/card";
import { toPersianDigits } from "@/lib/utils";
import type { ProfileData } from "@/lib/api/types";
import { profileSections } from "@/lib/profile-fields";

/**
 * The read-only view of every profile field, grouped into the same sections the
 * edit form uses. Empty fields show a muted "ثبت نشده" with their point value, so
 * the student can see at a glance what's still worth filling in.
 */
export function ProfileInfoSections({
  profile,
  onEdit,
}: {
  profile: ProfileData;
  onEdit: () => void;
}) {
  return (
    <div className="space-y-5">
      {profileSections.map((section) => (
        <section key={section.id} className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">{section.title}</h2>
              {section.subtitle && (
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{section.subtitle}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onEdit}
              aria-label={`ویرایش ${section.title}`}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:scale-95"
            >
              <HugeiconsIcon icon={PencilEdit02Icon} size={16} />
            </button>
          </div>

          <Card className="divide-y divide-border overflow-hidden p-0">
            {section.fields.map((field) => (
              <InfoRow
                key={field.id}
                icon={field.icon}
                label={field.label}
                value={field.format(profile)}
                points={field.points}
                onAdd={onEdit}
              />
            ))}
          </Card>
        </section>
      ))}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  points,
  onAdd,
}: {
  icon: IconSvgElement;
  label: string;
  value: string | null;
  points: number;
  onAdd: () => void;
}) {
  return (
    <div className="flex items-center gap-3 p-3.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background">
        <HugeiconsIcon icon={icon} size={18} className="text-muted-foreground" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] text-muted-foreground">{label}</span>
        {value ? (
          <span className="block truncate text-sm font-semibold text-foreground">{value}</span>
        ) : (
          <span className="block text-sm text-muted-foreground/70">ثبت نشده</span>
        )}
      </span>
      {!value && (
        <button
          type="button"
          onClick={onAdd}
          className="shrink-0 rounded-lg bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/15 active:scale-95"
        >
          افزودن +{toPersianDigits(points)}
        </button>
      )}
    </div>
  );
}
