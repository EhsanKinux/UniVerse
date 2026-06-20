import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkBadge01Icon, PencilEdit02Icon, SmartPhone01Icon } from "@hugeicons/core-free-icons";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getInitials } from "@/lib/utils";
import { academicProfile } from "@/lib/profile-data";

export function ProfileIdentityCard({
  mounted,
  name,
  email,
  phone,
  onEdit,
}: {
  mounted: boolean;
  name: string;
  email: string;
  phone?: string;
  onEdit: () => void;
}) {
  return (
    <Card className="relative overflow-hidden p-5">
      <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent" />
      <div className="absolute -top-10 -start-10 size-36 rounded-full bg-primary/5 blur-2xl" />
      <div className="absolute -bottom-8 -end-8 size-28 rounded-full bg-primary/5 blur-2xl" />

      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <Avatar className="size-20 border-2 border-background shadow-lg ring-1 ring-border">
              <AvatarFallback className="bg-primary/12 text-2xl font-black text-primary">
                {mounted ? getInitials(name) : ""}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-1 end-1 size-4 rounded-full border-2 border-card bg-emerald-500" />
          </div>

          <div className="min-w-0 flex-1 pt-1">
            <h1 className="truncate text-xl font-bold tracking-tight text-foreground">
              {mounted ? name : "‌"}
            </h1>
            <p dir="ltr" className="mt-0.5 truncate text-right text-sm text-muted-foreground">
              {mounted ? email : "‌"}
            </p>
            {mounted && phone && (
              <p dir="ltr" className="mt-0.5 flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                {phone}
                <HugeiconsIcon icon={SmartPhone01Icon} size={13} />
              </p>
            )}
            <div className="mt-2.5">
              <Badge variant="success" className="gap-1">
                <HugeiconsIcon icon={CheckmarkBadge01Icon} size={14} />
                {academicProfile.status}
              </Badge>
            </div>
          </div>
        </div>

        <Button variant="outline" size="lg" onClick={onEdit} className="mt-4 h-11 w-full rounded-2xl font-semibold">
          <HugeiconsIcon icon={PencilEdit02Icon} size={18} />
          ویرایش پروفایل
        </Button>
      </div>
    </Card>
  );
}
