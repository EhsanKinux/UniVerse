import { AppShell } from "@/components/layout/app-shell";

export default function ModulesLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell subtitle="جزئیات سرویس دانشگاهی">
      {children}
    </AppShell>
  );
}
