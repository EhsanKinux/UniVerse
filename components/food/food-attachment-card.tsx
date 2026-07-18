"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  Doc01Icon,
  Download04Icon,
  File01Icon,
  Image01Icon,
  Pdf01Icon,
  Ppt01Icon,
  ViewIcon,
  Xls01Icon,
} from "@hugeicons/core-free-icons";

import { foodApi } from "@/lib/api/food.api";
import type { FoodAnnouncementAttachment } from "@/lib/api/types";

/** Pick a file-type icon from the attachment's MIME type. */
function iconForMime(mime: string): IconSvgElement {
  if (mime === "application/pdf") return Pdf01Icon;
  if (mime.startsWith("image/")) return Image01Icon;
  if (mime.includes("word")) return Doc01Icon;
  if (mime.includes("sheet") || mime.includes("excel")) return Xls01Icon;
  if (mime.includes("presentation") || mime.includes("powerpoint")) return Ppt01Icon;
  return File01Icon;
}

/** One downloadable attachment on the food announcement detail page. Mirrors
 *  DormAttachmentCard: tap مشاهده to open inline, دانلود to save. */
export function FoodAttachmentCard({ attachment }: { attachment: FoodAnnouncementAttachment }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/70 p-3.5">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/50 text-primary">
        <HugeiconsIcon icon={iconForMime(attachment.mimeType)} size={22} />
      </div>

      <div className="min-w-0 flex-1">
        <p dir="ltr" className="truncate text-right text-sm font-semibold text-foreground">
          {attachment.originalName}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{attachment.sizeLabel}</p>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <IconLink href={foodApi.attachmentUrl(attachment.id)} icon={ViewIcon} title="مشاهده" />
        <IconLink
          href={foodApi.attachmentUrl(attachment.id, { download: true })}
          icon={Download04Icon}
          title="دانلود"
        />
      </div>
    </div>
  );
}

function IconLink({ href, icon, title }: { href: string; icon: IconSvgElement; title: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      aria-label={title}
      className="flex size-9 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:text-primary active:scale-95"
    >
      <HugeiconsIcon icon={icon} size={16} />
    </a>
  );
}
