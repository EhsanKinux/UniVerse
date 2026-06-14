"use client";

import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Call02Icon, CheckmarkCircle02Icon, Copy01Icon } from "@hugeicons/core-free-icons";

import { ModuleHero } from "@/components/module/module-hero";
import { EmptyState, SearchBox } from "@/components/module/module-ui";
import { contactGroups } from "@/lib/phone-data";
import { cn } from "@/lib/utils";

const HERO_TONE =
  "text-rose-600 border-rose-500/15 from-rose-500/18 via-rose-500/8 shadow-rose-500/25 dark:text-rose-300";

const formatPhone = (phone: string) =>
  phone.length > 7
    ? `${phone.slice(0, phone.length - 8)}-${phone.slice(-8, -4)} ${phone.slice(-4)}`.trim()
    : phone;

export default function PhoneListPage() {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const filteredGroups = useMemo(() => {
    const q = query.trim();
    if (!q) return contactGroups;
    return contactGroups
      .map((group) => ({
        ...group,
        contacts: group.contacts.filter(
          (c) => c.name.includes(q) || c.phone.includes(q) || group.title.includes(q),
        ),
      }))
      .filter((group) => group.contacts.length > 0);
  }, [query]);

  const totalContacts = contactGroups.reduce((s, g) => s + g.contacts.length, 0);

  async function copy(phone: string) {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(phone);
      setTimeout(() => setCopied((c) => (c === phone ? null : c)), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="space-y-6">
      <ModuleHero
        backHref="/services"
        backLabel="بخش خدمات"
        icon={Call02Icon}
        title="شماره‌های دانشگاه"
        description="دفترچه تلفن واحدهای مختلف دانشگاه. برای تماس روی شماره بزنید یا آن را کپی کنید."
        status="به‌روز"
        tone={HERO_TONE}
        stats={[{ icon: Call02Icon, value: String(totalContacts), label: "شماره تماس" }]}
      />

      <SearchBox value={query} onChange={setQuery} placeholder="جستجوی واحد یا شماره..." />

      <section id="content" className="space-y-5">
        {filteredGroups.length === 0 ? (
          <EmptyState title="شماره‌ای یافت نشد" subtitle="عبارت دیگری را جستجو کنید" />
        ) : (
          filteredGroups.map((group) => (
            <div key={group.id} className="space-y-2.5">
              <div className="flex items-center gap-2.5 px-1">
                <div className="flex size-9 items-center justify-center rounded-xl border border-border bg-card/80 text-primary">
                  <HugeiconsIcon icon={group.icon} size={18} />
                </div>
                <h2 className="text-sm font-bold text-foreground">{group.title}</h2>
              </div>

              <div className="overflow-hidden rounded-3xl border border-border bg-card/85 shadow-sm backdrop-blur-xl">
                {group.contacts.map((contact, idx) => (
                  <div
                    key={`${contact.phone}-${idx}`}
                    className={cn(
                      "flex items-center gap-3 p-3.5",
                      idx !== group.contacts.length - 1 && "border-b border-border",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">{contact.name}</p>
                      <p dir="ltr" className="mt-0.5 text-right font-mono text-xs text-muted-foreground">
                        {formatPhone(contact.phone)}
                        {contact.ext && <span className="text-primary"> · داخلی {contact.ext}</span>}
                      </p>
                    </div>

                    <button
                      onClick={() => copy(contact.phone)}
                      aria-label="کپی شماره"
                      className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:text-foreground active:scale-95"
                    >
                      <HugeiconsIcon
                        icon={copied === contact.phone ? CheckmarkCircle02Icon : Copy01Icon}
                        size={16}
                        className={cn(copied === contact.phone && "text-emerald-500")}
                      />
                    </button>

                    <a
                      href={`tel:${contact.phone}`}
                      aria-label="تماس"
                      className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95"
                    >
                      <HugeiconsIcon icon={Call02Icon} size={16} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
