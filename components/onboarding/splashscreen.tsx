"use client";

import Image from "next/image";
import { motion } from "motion/react";

export function SplashScreen() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background text-foreground">
      {/* Aurora — same palette language as the onboarding slides */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/25 blur-[100px] motion-safe:animate-aurora motion-reduce:animate-none" />
        <div className="absolute top-[10%] -right-20 h-60 w-60 rounded-full bg-computer/15 blur-[90px] motion-safe:animate-aurora motion-reduce:animate-none [animation-delay:-9s] [animation-duration:26s]" />
        <div className="absolute -bottom-16 -left-16 h-60 w-60 rounded-full bg-mining/15 blur-[90px] motion-safe:animate-aurora motion-reduce:animate-none [animation-delay:-16s] [animation-duration:30s]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <Image
            src="/icons/univers_logo.png"
            alt="Universe Logo"
            width={1200}
            height={675}
            priority
            className="h-auto w-full max-w-85 object-contain sm:max-w-105 md:max-w-125"
          />
        </motion.div>

        {/* Text */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
          className="mt-8 text-center text-xl leading-6 text-muted-foreground"
        >
          سامانه یکپارچه مدیریت دانشگاه
        </motion.p>

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
