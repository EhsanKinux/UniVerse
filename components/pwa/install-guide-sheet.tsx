"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  Alert02Icon,
  ChromeIcon,
  DockIcon,
  Download01Icon,
  InformationCircleIcon,
  Menu01Icon,
  MoreVerticalIcon,
  PlusSignSquareIcon,
  SafariIcon,
  Share01Icon,
  SmartPhone01Icon,
  SquareUnlock01Icon,
} from "@hugeicons/core-free-icons";

import { Sheet } from "@/components/ui/sheet";
import type { InstallPlatform } from "@/lib/pwa/platform";

/**
 * An inline chip standing in for a real control the user has to find in their
 * browser chrome — the Share button, the ⋮ menu, a specific menu entry. Naming
 * the item in Latin *and* Persian is deliberate: browser UI on these devices is
 * usually still in English, so the English label is what they'll actually see.
 */
function Control({ icon, children }: { icon?: IconSvgElement; children: React.ReactNode }) {
  return (
    <span className="mx-1 inline-flex items-center gap-1 rounded-md border border-border bg-muted px-1.5 py-0.5 align-middle text-[0.72rem] font-medium text-foreground">
      {icon && <HugeiconsIcon icon={icon} size={13} strokeWidth={2} />}
      {children}
    </span>
  );
}

interface Guide {
  icon: IconSvgElement;
  /** Sets expectations before the steps — where this browser hides installing. */
  headline: string;
  steps: React.ReactNode[];
  note?: React.ReactNode;
  /** No install path exists at all; `steps` is then an alternative route. */
  unsupported?: boolean;
}

const GUIDES: Record<InstallPlatform, Guide> = {
  "ios-safari": {
    icon: SafariIcon,
    headline: "در سافاری، نصب از منوی اشتراک‌گذاری انجام می‌شود.",
    steps: [
      <>
        دکمهٔ
        <Control icon={Share01Icon}>اشتراک‌گذاری</Control>
        را در نوار پایین سافاری بزنید.
      </>,
      <>
        فهرست را کمی بالا بکشید و گزینهٔ
        <Control icon={PlusSignSquareIcon}>Add to Home Screen</Control>
        را انتخاب کنید.
      </>,
      <>
        در گوشهٔ بالا روی <Control>Add</Control> بزنید — آیکن یونیورس کنار بقیهٔ اپ‌ها می‌نشیند.
      </>,
    ],
    note: "اگر این گزینه را نمی‌بینید، مطمئن شوید صفحه در حالت مرور خصوصی (Private) باز نشده باشد.",
  },

  "ios-third-party": {
    icon: SmartPhone01Icon,
    headline: "روی iOS همهٔ مرورگرها از منوی اشتراک‌گذاری نصب می‌کنند.",
    steps: [
      <>
        منوی
        <Control icon={Share01Icon}>اشتراک‌گذاری</Control>
        همین مرورگر را باز کنید.
      </>,
      <>
        گزینهٔ
        <Control icon={PlusSignSquareIcon}>Add to Home Screen</Control>
        را بزنید و تأیید کنید.
      </>,
    ],
    note: "اگر این گزینه را پیدا نکردید، همین نشانی را در Safari باز کنید؛ آنجا همیشه در دسترس است.",
  },

  "safari-desktop": {
    icon: SafariIcon,
    headline: "روی macOS، سافاری اپ را به Dock اضافه می‌کند.",
    steps: [
      <>
        از نوار منوی بالای صفحه، <Control>File</Control> را باز کنید.
      </>,
      <>
        گزینهٔ
        <Control icon={DockIcon}>Add to Dock…</Control>
        را بزنید و سپس <Control>Add</Control> را انتخاب کنید.
      </>,
    ],
    note: "این قابلیت از macOS Sonoma و Safari ۱۷ به بعد وجود دارد. در نسخه‌های قدیمی‌تر، همین نشانی را در Chrome یا Edge باز کنید.",
  },

  "firefox-android": {
    icon: SmartPhone01Icon,
    headline: "فایرفاکس اندروید نصب را از منوی خودش انجام می‌دهد.",
    steps: [
      <>
        منوی
        <Control icon={MoreVerticalIcon}>سه‌نقطه</Control>
        را در نوار مرورگر باز کنید.
      </>,
      <>
        گزینهٔ <Control>Install</Control> یا <Control>Add to Home screen</Control> را بزنید.
      </>,
      <>روی تأیید بزنید تا آیکن اپ ساخته شود.</>,
    ],
  },

  "firefox-desktop": {
    icon: Alert02Icon,
    unsupported: true,
    headline: "فایرفاکس نسخهٔ دسکتاپ از نصب اپ‌های وب پشتیبانی نمی‌کند.",
    steps: [
      <>
        برای داشتن آیکن و پنجرهٔ مستقل، همین نشانی را در <Control icon={ChromeIcon}>Chrome</Control>،{" "}
        <Control>Edge</Control> یا <Control>Brave</Control> باز کنید.
      </>,
      <>روی موبایل محدودیتی نیست — فایرفاکس اندروید و سافاری هر دو نصب را پشتیبانی می‌کنند.</>,
    ],
    note: "این محدودیت خود فایرفاکس است، نه اپ؛ با هر تنظیمی در این مرورگر گزینهٔ نصب ظاهر نمی‌شود.",
  },

  "chromium-android": {
    icon: MoreVerticalIcon,
    headline: "نصب از منوی کروم انجام می‌شود.",
    steps: [
      <>
        منوی
        <Control icon={MoreVerticalIcon}>سه‌نقطه</Control>
        بالای مرورگر را باز کنید.
      </>,
      <>
        گزینهٔ <Control>Install app</Control> یا <Control>Add to Home screen</Control> را بزنید.
      </>,
    ],
    note: "اگر گزینه را نمی‌بینید، چند لحظه صبر کنید و صفحه را دوباره بارگذاری کنید؛ مرورگر پس از بررسی شرایط، نصب را فعال می‌کند.",
  },

  "chromium-desktop": {
    icon: ChromeIcon,
    headline: "نصب از نوار نشانی کروم یا اج انجام می‌شود.",
    steps: [
      <>
        آیکن
        <Control icon={Download01Icon}>نصب</Control>
        را در انتهای نوار نشانی بزنید.
      </>,
      <>
        یا از منوی
        <Control icon={MoreVerticalIcon}>سه‌نقطه</Control>
        گزینهٔ <Control>Install Universe…</Control> را انتخاب کنید.
      </>,
    ],
    note: "اگر گزینه را نمی‌بینید، چند لحظه صبر کنید و صفحه را دوباره بارگذاری کنید؛ مرورگر پس از بررسی شرایط، نصب را فعال می‌کند.",
  },

  samsung: {
    icon: Menu01Icon,
    headline: "در Samsung Internet نصب زیر منوی پایین صفحه است.",
    steps: [
      <>
        منوی
        <Control icon={Menu01Icon}>سه‌خط</Control>
        پایین مرورگر را باز کنید.
      </>,
      <>
        مسیر <Control>Add page to</Control> ← <Control>Home screen</Control> را دنبال کنید.
      </>,
    ],
  },

  unknown: {
    icon: InformationCircleIcon,
    headline: "بیشتر مرورگرها گزینهٔ نصب را داخل منوی اصلی دارند.",
    steps: [
      <>منوی اصلی مرورگر را باز کنید.</>,
      <>
        دنبال <Control>Install</Control> / «نصب» یا <Control>Add to Home screen</Control> / «افزودن به
        صفحهٔ اصلی» بگردید.
      </>,
    ],
  },
};

/**
 * Platform-specific "how do I install this?" instructions.
 *
 * Shown whenever a one-tap install isn't available — which is every browser
 * except Chromium, plus Chromium itself before the install criteria are met.
 */
export function InstallGuideSheet({
  open,
  onOpenChange,
  platform,
  secure,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform: InstallPlatform;
  secure: boolean;
}) {
  const guide = GUIDES[platform];
  // iOS "Add to Home Screen" is a Safari bookmark feature, not a web-platform
  // install, so it keeps working over plain http. Everywhere else an insecure
  // origin is the real blocker and deserves top billing over the steps.
  const insecureBlocks = !secure && !platform.startsWith("ios-");

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title="نصب اپلیکیشن یونیورس"
      description={guide.headline}
    >
      <div className="flex flex-col gap-4 pb-4">
        {insecureBlocks && (
          <div className="flex items-start gap-2.5 rounded-2xl border border-destructive/25 bg-destructive/5 p-3">
            <HugeiconsIcon
              icon={SquareUnlock01Icon}
              size={18}
              className="mt-0.5 shrink-0 text-destructive"
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              این صفحه با نشانی ناامن باز شده است. تا وقتی سایت را با
              <span dir="ltr" className="mx-1 font-medium text-foreground">
                https://
              </span>
              باز نکنید، مرورگر اجازهٔ نصب و کارکرد آفلاین را نمی‌دهد.
            </p>
          </div>
        )}

        <ol className="flex flex-col gap-3">
          {guide.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className={
                  guide.unsupported
                    ? "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
                    : "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/12 text-[0.72rem] font-bold text-primary"
                }
              >
                {guide.unsupported ? (
                  <HugeiconsIcon icon={guide.icon} size={13} strokeWidth={2} />
                ) : (
                  new Intl.NumberFormat("fa-IR").format(i + 1)
                )}
              </span>
              <p className="pt-0.5 text-[0.8rem] leading-6 text-muted-foreground">{step}</p>
            </li>
          ))}
        </ol>

        {guide.note && (
          <p className="rounded-2xl bg-muted/60 p-3 text-[0.72rem] leading-5 text-muted-foreground">
            {guide.note}
          </p>
        )}
      </div>
    </Sheet>
  );
}
