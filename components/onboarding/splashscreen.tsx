import Image from "next/image";

export function SplashScreen() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background text-foreground">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
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
