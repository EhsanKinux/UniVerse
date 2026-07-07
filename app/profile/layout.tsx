import { MobileShell } from "@/components/layout/mobile-shell";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileShell subtitle="حساب کاربری">
      {children}
    </MobileShell>
  );
}
