"use client";

import * as React from "react";
import { motion, MotionConfig, useReducedMotion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";

import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { SplashScreen } from "./splashscreen";
import { MobileAppsIllustration } from "./illustrations/mobile-apps-illustration";
import { ScheduleIllustration } from "./illustrations/schedule-illustration";
import { PushNotificationsIllustration } from "./illustrations/push-notifications-illustration";
import { EducationIllustration } from "./illustrations/education-illustration";

type Chip = { label: string; className: string };

type Slide = {
  Illustration: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  /** The token that colours this slide's whole world (aurora, art accent, CTA). */
  accent: string;
  title: string;
  description: string;
  chips: Chip[];
};

const slides: Slide[] = [
  {
    Illustration: MobileAppsIllustration,
    accent: "var(--color-primary)",
    title: "همه‌چیزِ دانشگاه، یک‌جا",
    description: "برنامه هفتگی، غذا، اطلاعیه‌ها و خدمات خوابگاه — بدون سرگردانی بین چند سامانه، همه در یک اپ.",
    chips: [
      { label: "برنامه هفتگی", className: "top-6 -left-1 -rotate-3" },
      { label: "رزرو غذا", className: "top-1/2 -right-2 rotate-3" },
      { label: "خدمات خوابگاه", className: "bottom-6 left-4 rotate-2" },
    ],
  },
  {
    Illustration: ScheduleIllustration,
    accent: "var(--color-computer)",
    title: "برنامه‌تان، همیشه جلوی چشم",
    description: "کلاس‌ها، تقویم آموزشی و رویدادهای ترم را مرتب و یک‌جا ببینید تا هیچ جلسه یا امتحانی غافلگیرتان نکند.",
    chips: [
      { label: "تقویم آموزشی", className: "top-6 -right-1 rotate-3" },
      { label: "کلاس‌های امروز", className: "top-1/2 -left-2 -rotate-3" },
      { label: "رویدادهای ترم", className: "bottom-6 right-6 -rotate-2" },
    ],
  },
  {
    Illustration: PushNotificationsIllustration,
    accent: "var(--color-mining)",
    title: "هیچ خبری از قلم نمی‌افتد",
    description: "اطلاعیه‌های دانشگاه و خوابگاه همان لحظه به گوشی‌تان می‌رسد — حتی وقتی اپ بسته است.",
    chips: [
      { label: "اعلان لحظه‌ای", className: "top-6 -left-1 rotate-3" },
      { label: "اطلاعیه خوابگاه", className: "top-[55%] -right-2 -rotate-3" },
      { label: "اخبار دانشگاه", className: "bottom-6 left-6 rotate-2" },
    ],
  },
  {
    Illustration: EducationIllustration,
    accent: "var(--color-chemical)",
    title: "زندگی دانشجویی، هوشمندتر",
    description: "با حساب دانشجویی خود وارد شوید؛ همه‌چیز برای شروع آماده است.",
    chips: [
      { label: "ورود امن", className: "top-7 -right-1 -rotate-3" },
      { label: "نصب روی گوشی", className: "top-[52%] -left-2 rotate-3" },
      { label: "سریع و سبک", className: "bottom-6 right-6 rotate-2" },
    ],
  },
];

const faDigit = (n: number) => n.toLocaleString("fa-IR");

/** How far the illustration lags behind its slide while swiping — the parallax
    depth cue that makes the scene feel like a scene, not a flat card. */
const PARALLAX = 0.5;

export function OnboardingFlow({ onFinish }: { onFinish: () => void }) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [showSplash, setShowSplash] = React.useState(true);
  const parallaxNodes = React.useRef<(HTMLDivElement | null)[]>([]);
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    // Brief brand moment, then straight into onboarding. Native apps dismiss
    // their splash as soon as they're ready rather than holding an arbitrary delay.
    const t = window.setTimeout(() => setShowSplash(false), 1500);
    return () => clearTimeout(t);
  }, []);

  // Drift each illustration relative to its slide as the track scrolls. Applied
  // straight to the DOM node in the scroll handler so it stays at 60fps without
  // re-rendering React on every frame.
  const applyParallax = React.useCallback((emblaApi: NonNullable<CarouselApi>) => {
    const progress = emblaApi.scrollProgress();
    emblaApi.scrollSnapList().forEach((snap, index) => {
      const node = parallaxNodes.current[index];
      if (!node) return;
      const diff = snap - progress;
      const shift = reduceMotion ? 0 : diff * PARALLAX * 100;
      node.style.transform = `translate3d(${shift}%, 0, 0)`;
      node.style.opacity = `${1 - Math.min(Math.abs(diff) * 1.4, 0.85)}`;
    });
  }, [reduceMotion]);

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    applyParallax(api);

    api.on("select", onSelect);
    api.on("scroll", applyParallax);
    api.on("reInit", applyParallax);

    return () => {
      api.off("select", onSelect);
      api.off("scroll", applyParallax);
      api.off("reInit", applyParallax);
    };
  }, [api, applyParallax]);

  const isLast = current === slides.length - 1;
  const accent = slides[current].accent;

  if (showSplash) return <SplashScreen />;

  return (
    <MotionConfig reducedMotion="user">
    <div
      className={cn(
        "relative flex min-h-dvh flex-col overflow-hidden bg-background text-foreground",
        // Illustration palette — shared across all slides (theme-based).
        "[--ill-ink:#2f2e41] [--ill-ink-2:#3f3d56] [--ill-skin:#ffb8b8]",
        "[--ill-neutral:#e8eaf0] [--ill-neutral-2:#c9cdd8] [--ill-paper:#ffffff]",
        "dark:[--ill-ink:#e2e6ee] dark:[--ill-ink-2:#9aa4b6] dark:[--ill-neutral:#39424f]",
        "dark:[--ill-neutral-2:#4d5766] dark:[--ill-paper:#232c37]",
      )}
      style={{ ["--accent" as string]: accent }}
    >
      {/* Ambient aurora — retints to the active slide's world. No card, no
          frame: the light itself is the background. */}
      <Aurora />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 safe-top safe-bottom">
        {/* Progress + skip */}
        <div className="flex items-center gap-4 pt-1">
          <div className="flex flex-1 items-center gap-1.5">
            {slides.map((_, i) => (
              <span key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/10">
                <motion.span
                  className="block h-full rounded-full"
                  style={{ backgroundColor: "var(--accent)", transition: "background-color 700ms ease" }}
                  initial={false}
                  animate={{ width: i < current ? "100%" : i === current ? "100%" : "0%", opacity: i <= current ? 1 : 0 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                />
              </span>
            ))}
          </div>

          <button
            onClick={onFinish}
            className={cn(
              "shrink-0 text-xs font-medium text-muted-foreground transition-all hover:text-foreground",
              isLast && "pointer-events-none opacity-0",
            )}
          >
            رد شدن
          </button>
        </div>

        {/* Swipeable stage — illustration + copy move together (the whole screen
            travels), while the art parallaxes for depth. */}
        <Carousel
          setApi={setApi}
          dir="rtl"
          opts={{ direction: "rtl", align: "start", loop: false }}
          className="-mx-6 min-h-0 flex-1 [&_[data-slot=carousel-content]]:h-full"
        >
          <CarouselContent className="h-full">
            {slides.map((slide, i) => {
              const { Illustration } = slide;
              const isActive = i === current;

              return (
                <CarouselItem key={slide.title} className="h-full">
                  <div className="flex h-full flex-col px-6">
                    {/* Illustration zone (parallax layer) */}
                    <div className="relative flex min-h-0 flex-1 items-center justify-center">
                      <div
                        ref={(el) => {
                          parallaxNodes.current[i] = el;
                        }}
                        className="relative flex h-full max-h-[26rem] w-full items-center justify-center will-change-transform"
                        style={{ ["--ill-accent" as string]: slide.accent }}
                      >
                        {/* Spotlight behind the art */}
                        <div
                          className="pointer-events-none absolute h-64 w-64 rounded-full opacity-40 blur-[70px] dark:opacity-60"
                          style={{ backgroundColor: slide.accent, transition: "background-color 700ms ease" }}
                        />

                        <motion.div
                          className="relative z-10 w-full max-w-[16rem] sm:max-w-[17.5rem]"
                          initial={false}
                          animate={isActive ? { scale: 1, y: 0, opacity: 1 } : { scale: 0.9, y: 14, opacity: 0.5 }}
                          transition={{ type: "spring", stiffness: 220, damping: 26 }}
                        >
                          <Illustration className="h-auto w-full drop-shadow-xl" />
                        </motion.div>

                        {/* Floor reflection to ground the scene */}
                        <div
                          className="pointer-events-none absolute bottom-6 h-6 w-40 rounded-[100%] opacity-25 blur-md dark:opacity-40"
                          style={{ backgroundColor: slide.accent, transition: "background-color 700ms ease" }}
                        />

                        {/* Free-floating feature chips */}
                        {slide.chips.map((chip, c) => (
                          <motion.span
                            key={chip.label}
                            className={cn(
                              "absolute z-20 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold",
                              "border border-white/60 bg-white/70 text-foreground/80 shadow-lg shadow-black/5 backdrop-blur-md",
                              "dark:border-white/10 dark:bg-white/10 dark:text-foreground/90 dark:shadow-black/20",
                              chip.className,
                            )}
                            initial={false}
                            animate={
                              isActive
                                ? { opacity: 1, scale: 1, y: 0 }
                                : { opacity: 0, scale: 0.8, y: 6 }
                            }
                            transition={{ type: "spring", stiffness: 260, damping: 22, delay: isActive ? 0.15 + c * 0.09 : 0 }}
                          >
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ backgroundColor: slide.accent }}
                            />
                            {chip.label}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    {/* Copy */}
                    <div className="flex flex-none flex-col items-center gap-3 pb-2 pt-6 text-center">
                      <motion.h2
                        className="text-[1.7rem] font-black leading-[1.35] tracking-tight text-balance md:text-3xl"
                        initial={false}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                        transition={{ duration: 0.5, delay: isActive ? 0.1 : 0, ease: "easeOut" }}
                      >
                        {slide.title}
                      </motion.h2>

                      <motion.p
                        className="max-w-xs text-sm leading-7 text-muted-foreground text-balance md:text-[15px]"
                        initial={false}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                        transition={{ duration: 0.5, delay: isActive ? 0.18 : 0, ease: "easeOut" }}
                      >
                        {slide.description}
                      </motion.p>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>

        {/* Dots */}
        <div className="mt-2 flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              aria-label={`رفتن به اسلاید ${faDigit(i + 1)}`}
              aria-current={i === current}
              className="h-2 rounded-full transition-all duration-300"
              style={
                i === current
                  ? { width: "1.75rem", backgroundColor: "var(--accent)" }
                  : { width: "0.5rem", backgroundColor: "color-mix(in oklab, var(--foreground) 22%, transparent)" }
              }
            />
          ))}
        </div>

        {/* Action */}
        <div className="mt-5 pb-1">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => (isLast ? onFinish() : api?.scrollNext())}
            className="flex h-13 w-full items-center justify-center gap-2 rounded-full text-base font-bold text-white shadow-lg"
            style={{
              // The raw accent is tuned as a *foreground* colour (and is lightened
              // in dark mode), so as a button fill under white text it needs
              // deepening. The bright accent stays on as the glow.
              backgroundColor: "color-mix(in oklab, var(--accent) 72%, #000)",
              boxShadow: "0 14px 30px -12px var(--accent)",
              transition: "background-color 700ms ease, box-shadow 700ms ease",
            }}
          >
            {isLast ? "ورود به حساب" : "بعدی"}
            <HugeiconsIcon
              icon={ArrowLeft02Icon}
              className={cn("h-5 w-5 transition-transform", isLast && "-translate-x-0.5")}
              strokeWidth={2.2}
            />
          </motion.button>
        </div>
      </div>
    </div>
    </MotionConfig>
  );
}

/** The atmosphere. Three slow-drifting blobs whose colour follows `--accent`,
    so switching slides sweeps the whole screen into a new hue. */
function Aurora() {
  const blob = "absolute rounded-full motion-safe:animate-aurora motion-reduce:animate-none";
  const tint = (pct: number) => ({
    backgroundColor: `color-mix(in oklab, var(--accent) ${pct}%, transparent)`,
    transition: "background-color 900ms ease",
  });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className={cn(blob, "-top-24 left-1/2 h-96 w-96 -translate-x-1/2 blur-[120px] opacity-70 dark:opacity-90")} style={tint(45)} />
      <div className={cn(blob, "top-[18%] -right-28 h-80 w-80 blur-[110px] opacity-50 dark:opacity-70 [animation-delay:-9s] [animation-duration:26s]")} style={tint(35)} />
      <div className={cn(blob, "-bottom-24 -left-20 h-80 w-80 blur-[110px] opacity-50 dark:opacity-70 [animation-delay:-16s] [animation-duration:30s]")} style={tint(30)} />
      {/* Settle the light into the page bottom so nothing reads as a floating panel. */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background" />
    </div>
  );
}
