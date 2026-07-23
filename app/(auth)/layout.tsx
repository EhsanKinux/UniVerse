export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background text-foreground">
      {/* Ambient aurora — the same atmosphere the onboarding ends on, so signing
          in feels like staying in the same world rather than landing on a form. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-28 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-primary/25 blur-[120px] motion-safe:animate-aurora motion-reduce:animate-none dark:bg-primary/35" />
        <div className="absolute top-[20%] -right-28 h-80 w-80 rounded-full bg-computer/15 blur-[110px] motion-safe:animate-aurora motion-reduce:animate-none [animation-delay:-9s] [animation-duration:26s] dark:bg-computer/25" />
        <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-primary/15 blur-[110px] motion-safe:animate-aurora motion-reduce:animate-none [animation-delay:-16s] [animation-duration:30s] dark:bg-primary/25" />
        {/* Faint grid — texture without weight. */}
        <div
          className="
            absolute inset-0 opacity-[0.03] dark:opacity-[0.05]
            bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)]
            bg-size-[32px_32px]
          "
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background" />
      </div>

      <main className="safe-top safe-bottom relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-8">
        {children}
      </main>
    </div>
  );
}
