// Presentation metadata for the گروه‌ها page. The API sends a `kind` per join
// option ("link" | "handle" | "qr"); the icon + default button label live here so
// the front end owns its own look — the same split the phone-book page uses (see
// lib/phone-meta.ts). The keys MUST stay in step with GROUP_LINK_KINDS on the
// backend (univers-backend/src/groups/dto/group-kinds.ts).

import { AtIcon, LinkSquare01Icon, QrCode01Icon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

interface GroupLinkMeta {
  icon: IconSvgElement;
  /** Button label used when staff didn't set a custom one. */
  defaultLabel: string;
}

const LINK_META: Record<string, GroupLinkMeta> = {
  link: { icon: LinkSquare01Icon, defaultLabel: "عضویت" },
  handle: { icon: AtIcon, defaultLabel: "کپی شناسه" },
  qr: { icon: QrCode01Icon, defaultLabel: "نمایش کد QR" },
};

/** Look up a join option's meta, tolerating an unknown kind from the server. */
export function groupLinkMeta(kind: string): GroupLinkMeta {
  return LINK_META[kind] ?? LINK_META.link;
}
