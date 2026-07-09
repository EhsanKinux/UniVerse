"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Megaphone01Icon } from "@hugeicons/core-free-icons";

import { bottomTabs, moduleGroups } from "@/lib/data/university-data";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// Same shortcuts the home screen promotes, plus the news feed.
const quickLinks = [
  moduleGroups.educational[1], // تقویم آموزشی
  moduleGroups.student[1], // برنامه هفتگی
  moduleGroups.student[0], // غذای هفته
  moduleGroups.student[2], // گروه‌ها
  { title: "اخبار و اطلاعیه‌ها", href: "/news", icon: Megaphone01Icon },
] as const;

/**
 * Desktop (lg+) navigation rail. Mirrors the mobile bottom tab bar so the two
 * never disagree about destinations; below lg the Sidebar renders nothing and
 * the tab bar in AppShell takes over.
 */
export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar side="right" collapsible="icon">
      <SidebarHeader className="p-3">
        <Link href="/" className="flex items-center justify-center">
          <Image
            src="/icons/univers_logo.png"
            alt="UniVerse"
            width={156}
            height={88}
            className="h-10 w-auto object-contain group-data-[collapsible=icon]:hidden"
            priority
          />
          <Image
            src="/icons/u-192x192.png"
            alt="UniVerse"
            width={192}
            height={192}
            className="hidden size-8 rounded-lg group-data-[collapsible=icon]:block"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>ناوبری اصلی</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomTabs.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.title}
                    render={<Link href={item.href} />}
                  >
                    <HugeiconsIcon icon={item.icon} />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>دسترسی سریع</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickLinks.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(item.href)}
                    tooltip={item.title}
                    render={<Link href={item.href} />}
                  >
                    <HugeiconsIcon icon={item.icon} />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
