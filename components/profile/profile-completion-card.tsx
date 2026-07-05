"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon, PlusSignIcon } from "@hugeicons/core-free-icons";

import { Card } from "@/components/ui/card";
import { toPersianDigits } from "@/lib/utils";
import type { ProfileData } from "@/lib/api/types";
import { AVATAR_ICON, AVATAR_POINTS, allScoredFields } from "@/lib/profile-fields";

/**
 * The gamified header of the profile: a completion ring, the point score + level
 * (both authoritative from the server), and tappable chips for the highest-value
 * fields still missing — each nudging the student to earn more points.
 */
export function ProfileCompletionCard({
  profile,
  onEdit,
}: {
  profile: ProfileData;
  onEdit: () => void;
}) {
  const { percent, score, maxScore, level } = profile.completion;

  // Build the "missing" list locally (same rules as the server) so we can show
  // each field's icon + point value. The avatar is a scored item too.
  const missing = [
    ...allScoredFields
      .filter((f) => !f.isFilled(profile))
      .map((f) => ({ id: f.id, label: f.label, points: f.points, icon: f.icon })),
    ...(profile.avatarUrl
      ? []
      : [{ id: "avatar", label: "تصویر پروفایل", points: AVATAR_POINTS, icon: AVATAR_ICON }]),
  ].sort((a, b) => b.points - a.points);

  return (
    <Card className="overflow-hidden p-5">
      <div className="flex items-center gap-5">
        <CompletionRing percent={percent} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <HugeiconsIcon icon={SparklesIcon} size={16} className="text-primary" />
            <span className="text-sm font-bold text-foreground">{level.label}</span>
          </div>
          <p className="mt-1 text-2xl font-black tracking-tight text-foreground">
            {toPersianDigits(score)}
            <span className="text-sm font-medium text-muted-foreground"> / {toPersianDigits(maxScore)} امتیاز</span>
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {percent === 100
              ? "پروفایل شما کامل است 🎉"
              : "با تکمیل اطلاعات، امتیاز بیشتری بگیرید."}
          </p>
        </div>
      </div>

      {missing.length > 0 && (
        <div className="mt-4 border-t border-border pt-3.5">
          <p className="mb-2 text-[11px] font-medium text-muted-foreground">موارد باقی‌مانده</p>
          <div className="flex flex-wrap gap-2">
            {missing.slice(0, 5).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={onEdit}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 active:scale-95"
              >
                <HugeiconsIcon icon={m.icon} size={14} className="text-muted-foreground" />
                {m.label}
                <span className="text-[10px] font-bold text-primary">+{toPersianDigits(m.points)}</span>
              </button>
            ))}
            {missing.length > 5 && (
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/15 active:scale-95"
              >
                <HugeiconsIcon icon={PlusSignIcon} size={13} />
                {toPersianDigits(missing.length - 5)} مورد دیگر
              </button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

/** An SVG donut ring showing the completion percentage. */
function CompletionRing({ percent }: { percent: number }) {
  const size = 88;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.min(100, Math.max(0, percent)) / 100);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="stroke-primary transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-black text-foreground">٪{toPersianDigits(percent)}</span>
        <span className="text-[9px] font-medium text-muted-foreground">تکمیل</span>
      </div>
    </div>
  );
}
