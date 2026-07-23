"use client";

import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Call02Icon, CheckmarkCircle02Icon, Copy01Icon, Mail01Icon } from "@hugeicons/core-free-icons";

import { ModuleHero } from "@/components/module/module-hero";
import { EmptyState, ErrorState, SearchBox } from "@/components/module/module-ui";
import { SkeletonSearchBox, SkeletonSections } from "@/components/module/module-skeletons";
import { Card } from "@/components/ui/card";
import { LoadSwap } from "@/components/ui/load-swap";
import { usePhoneBook } from "@/hooks/phone-book/use-phone-book";
import { contactGroupIcon } from "@/lib/meta/phone-meta";
import { cn, toPersianDigits } from "@/lib/utils";

const HERO_TONE =
  "text-rose-600 border-rose-500/15 from-rose-500/18 via-rose-500/8 shadow-rose-500/25 dark:text-rose-300";

const formatPhone = (phone: string) =>
  phone.length > 7
    ? `${phone.slice(0, phone.length - 8)}-${phone.slice(-8, -4)} ${phone.slice(-4)}`.trim()
    : phone;

export default function PhoneListPage() {
  const { data, isLoading, isError, refetch } = usePhoneBook();
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const groups = useMemo(() => data ?? [], [data]);
  const totalContacts = useMemo(
    () => groups.reduce((sum, group) => sum + group.contacts.length, 0),
    [groups],
  );

  const filteredGroups = useMemo(() => {
    const q = query.trim();
    if (!q) return groups;
    return groups
      .map((group) => ({
        ...group,
        contacts: group.contacts.filter(
          (c) =>
            c.name.includes(q) ||
            c.phone.includes(q) ||
            c.ext?.includes(q) ||
            c.note?.includes(q) ||
            c.email?.includes(q) ||
            group.title.includes(q),
        ),
      }))
      .filter((group) => group.contacts.length > 0);
  }, [groups, query]);

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
        stats={
          totalContacts
            ? [{ icon: Call02Icon, value: toPersianDigits(totalContacts), label: "شماره تماس" }]
            : []
        }
      />

      <LoadSwap loading={isLoading} skeleton={<PhoneListSkeleton />}>
        {isError ? (
          <ErrorState
            title="دریافت شماره‌ها ناموفق بود"
            subtitle="اتصال به سرور برقرار نشد. دوباره تلاش کنید."
            onRetry={() => {
              refetch();
            }}
          />
        ) : groups.length === 0 ? (
          <EmptyState
            icon={Call02Icon}
            title="هنوز شماره‌ای ثبت نشده است"
            subtitle="به‌محض ثبت شماره‌های تماس توسط دانشگاه، اینجا نمایش داده می‌شود."
          />
        ) : (
          <div className="space-y-6">
            <div className="md:max-w-md">
              <SearchBox value={query} onChange={setQuery} placeholder="جستجوی واحد یا شماره..." />
            </div>

            <section id="content" className="space-y-5 lg:grid lg:grid-cols-2 lg:items-start lg:gap-5 lg:space-y-0">
            {filteredGroups.length === 0 ? (
              <EmptyState title="شماره‌ای یافت نشد" subtitle="عبارت دیگری را جستجو کنید" />
            ) : (
              filteredGroups.map((group) => (
                <div key={group.id} className="space-y-2.5">
                  <div className="flex items-center gap-2.5 px-1">
                    <div className="flex size-9 items-center justify-center rounded-xl border border-border bg-card/80 text-primary">
                      <HugeiconsIcon icon={contactGroupIcon(group.icon)} size={18} />
                    </div>
                    <h2 className="text-sm font-bold text-foreground">{group.title}</h2>
                  </div>

                  <Card className="overflow-hidden">
                    {group.contacts.map((contact, idx) => (
                      <div
                        key={contact.id}
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
                          {contact.note && (
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">{contact.note}</p>
                          )}
                          {contact.email && (
                            <a
                              href={`mailto:${contact.email}`}
                              dir="ltr"
                              className="mt-0.5 block truncate text-right text-xs text-primary hover:underline"
                            >
                              {contact.email}
                            </a>
                          )}
                        </div>

                        {contact.email && (
                          <a
                            href={`mailto:${contact.email}`}
                            aria-label="ارسال ایمیل"
                            className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:text-foreground active:scale-95"
                          >
                            <HugeiconsIcon icon={Mail01Icon} size={16} />
                          </a>
                        )}

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
                  </Card>
                </div>
              ))
            )}
            </section>
          </div>
        )}
      </LoadSwap>
    </div>
  );
}

function PhoneListSkeleton() {
  return (
    <div className="space-y-6">
      <SkeletonSearchBox />
      <SkeletonSections
        sections={4}
        perSection={1}
        cardClassName="h-36"
        gridClassName="grid gap-3"
      />
    </div>
  );
}
