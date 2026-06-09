import { MobileShell } from "@/components/mobile-shell";

export default function ModulesLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileShell title="Universe" subtitle="جزئیات سرویس دانشگاهی">
      {children}
    </MobileShell>
  );
}
