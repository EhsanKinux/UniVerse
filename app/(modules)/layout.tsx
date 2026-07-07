import { MobileShell } from "@/components/layout/mobile-shell";

export default function ModulesLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileShell subtitle="جزئیات سرویس دانشگاهی">
      {children}
    </MobileShell>
  );
}
