import { MobileShell } from "@/components/mobile-shell";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileShell title="Universe" subtitle="حساب کاربری">
      {children}
    </MobileShell>
  );
}
