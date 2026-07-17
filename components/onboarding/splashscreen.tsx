import Image from "next/image";

export function SplashScreen() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background text-foreground">
      {/* Aurora — same palette language as the onboarding slides */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-[100px] motion-safe:animate-aurora motion-reduce:animate-none" />
        <div className="absolute top-[10%] -right-20 h-60 w-60 rounded-full bg-computer/15 blur-[90px] motion-safe:animate-aurora motion-reduce:animate-none [animation-delay:-9s] [animation-duration:26s]" />
        <div className="absolute -bottom-16 -left-16 h-60 w-60 rounded-full bg-mining/15 blur-[90px] motion-safe:animate-aurora motion-reduce:animate-none [animation-delay:-16s] [animation-duration:30s]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="animate-in fade-in zoom-in duration-700">
          <Image
            src="/icons/univers_logo.png"
            alt="Universe Logo"
            width={1200}
            height={675}
            priority
            className="
              h-auto
              w-full
              max-w-85
              sm:max-w-105
              md:max-w-125
              object-contain
            "
          />
        </div>

        {/* Text */}
        <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-2 duration-700 delay-150">
          {/* <h1 className="text-3xl font-extrabold tracking-tight">Universe</h1> */}

          <p className="mt-2 text-xl leading-6 text-muted-foreground">سامانه یکپارچه مدیریت دانشگاه</p>
        </div>

        {/* Loading Indicator */}
        <div className="mt-10 flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
