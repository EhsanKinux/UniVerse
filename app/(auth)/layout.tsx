export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background text-foreground">
      {/* Ambient mesh background — kept consistent with the onboarding flow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 -top-32 h-105 w-105 -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute -right-28 top-[18%] h-80 w-80 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -bottom-32 left-[8%] h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,80,255,0.08),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(120,80,255,0.16),transparent_55%)]" />
        <div
          className="
            absolute inset-0 opacity-[0.03] dark:opacity-[0.06]
            bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)]
            bg-size-[32px_32px]
          "
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/20 to-background" />
      </div>

      <main className="safe-top safe-bottom relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-8">
        {children}
      </main>
    </div>
  );
}
