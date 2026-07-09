import { AppShell } from "@/components/layout/app-shell";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell subtitle="حساب کاربری">
      {children}
    </AppShell>
  );
}
