"use client";

import * as React from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SplashScreen } from "./splashscreen";
import { MobileAppsIllustration } from "./illustrations/mobile-apps-illustration";
import { ScheduleIllustration } from "./illustrations/schedule-illustration";
import { PushNotificationsIllustration } from "./illustrations/push-notifications-illustration";
import { EducationIllustration } from "./illustrations/education-illustration";

type Chip = { label: string; className: string };

const slides: {
  Illustration: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  chips: Chip[];
}[] = [
  {
    Illustration: MobileAppsIllustration,
    title: "همه‌چیزِ دانشگاه، یک‌جا",
    description: "برنامه هفتگی، غذا، اطلاعیه‌ها و خدمات خوابگاه — بدون سرگردانی بین چند سامانه، همه در یک اپ.",
    chips: [
      { label: "برنامه هفتگی", className: "top-5 -left-2 -rotate-2" },
      { label: "رزرو غذا", className: "top-1/2 -right-2 rotate-2" },
      { label: "خدمات خوابگاه", className: "bottom-5 left-6 rotate-1" },
    ],
  },
  {
    Illustration: ScheduleIllustration,
    title: "برنامه‌تان، همیشه جلوی چشم",
    description: "کلاس‌ها، تقویم آموزشی و رویدادهای ترم را مرتب و یک‌جا ببینید تا هیچ جلسه یا امتحانی غافلگیرتان نکند.",
    chips: [
      { label: "تقویم آموزشی", className: "top-5 -right-2 rotate-2" },
      { label: "کلاس‌های امروز", className: "top-1/2 -left-2 -rotate-2" },
      { label: "رویدادهای ترم", className: "bottom-5 right-8 -rotate-1" },
    ],
  },
  {
    Illustration: PushNotificationsIllustration,
    title: "هیچ خبری از قلم نمی‌افتد",
    description: "اطلاعیه‌های دانشگاه و خوابگاه همان لحظه به گوشی‌تان می‌رسد — حتی وقتی اپ بسته است.",
    chips: [
      { label: "اعلان لحظه‌ای", className: "top-5 -left-2 rotate-2" },
      { label: "اطلاعیه خوابگاه", className: "top-[55%] -right-2 -rotate-2" },
      { label: "اخبار دانشگاه", className: "bottom-5 left-8 rotate-1" },
    ],
  },
  {
    Illustration: EducationIllustration,
    title: "زندگی دانشجویی، هوشمندتر",
    description: "با حساب دانشجویی خود وارد شوید؛ همه‌چیز برای شروع آماده است.",
    chips: [
      { label: "ورود امن", className: "top-6 -right-2 -rotate-2" },
      { label: "نصب روی گوشی", className: "top-[52%] -left-2 rotate-2" },
      { label: "سریع و سبک", className: "bottom-5 right-8 rotate-1" },
    ],
  },
];

const faDigit = (n: number) => n.toLocaleString("fa-IR");

/** Dot accents cycle through the app's own spectrum: primary + department hues. */
const chipDots = ["bg-primary", "bg-computer", "bg-mining"];

export function OnboardingFlow({ onFinish }: { onFinish: () => void }) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [showSplash, setShowSplash] = React.useState(true);

  React.useEffect(() => {
    // Brief brand moment, then straight into onboarding. Native apps dismiss
    // their splash as soon as they're ready rather than holding an arbitrary delay.
    const t = window.setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => setCurrent(api.selectedScrollSnap());

    onSelect();
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const isLast = current === slides.length - 1;

  if (showSplash) return <SplashScreen />;

  return (
    <div className="relative flex min-h-dvh overflow-hidden bg-background text-foreground">
      {/* Aurora — drawn from the app's own palette: primary blue flanked by the
          department accents (computer violet, mining teal). */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-[110px] motion-safe:animate-aurora motion-reduce:animate-none dark:bg-primary/30" />
        <div className="absolute top-[16%] -right-28 h-80 w-80 rounded-full bg-computer/15 blur-[100px] motion-safe:animate-aurora motion-reduce:animate-none [animation-delay:-9s] [animation-duration:26s] dark:bg-computer/25" />
        <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-mining/15 blur-[100px] motion-safe:animate-aurora motion-reduce:animate-none [animation-delay:-16s] [animation-duration:30s] dark:bg-mining/25" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-5 safe-top safe-bottom">
        {/* Top bar */}
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-full border border-border/60 bg-card/60 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm backdrop-blur-md tabular-nums">
            {faDigit(current + 1)} از {faDigit(slides.length)}
          </span>

          <Button variant="ghost" size="sm" onClick={onFinish} className="text-muted-foreground hover:text-foreground">
            رد شدن
          </Button>
        </div>

        {/* Carousel */}
        <Carousel
          setApi={setApi}
          dir="rtl"
          opts={{
            direction: "rtl",
            align: "start",
            loop: false,
          }}
          className="min-h-0 flex-1 [&_[data-slot=carousel-content]]:h-full"
        >
          <CarouselContent className="h-full">
            {slides.map((slide, i) => {
              const { Illustration } = slide;
              const isActive = i === current;

              return (
                <CarouselItem key={slide.title} className="h-full">
                  <div className="flex h-full flex-col">
                    {/* Glass stage: a consistent home for the illustration in
                        both themes, with the slide's real features floating
                        around it as glass chips. */}
                    <div
                      className={cn(
                        "relative mt-2 flex min-h-0 flex-1 items-center justify-center",
                        isActive && "motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-500",
                      )}
                    >
                      <div
                        className={cn(
                          "relative flex h-full max-h-110 w-full items-center justify-center",
                          "rounded-4xl border border-white/50 bg-white/40 shadow-xl shadow-primary/5 backdrop-blur-xl",
                          "dark:border-white/10 dark:bg-white/[0.04]",
                          // Illustration palette — light
                          "[--ill-accent:var(--color-primary)] [--ill-ink:#2f2e41] [--ill-ink-2:#3f3d56] [--ill-skin:#ffb8b8]",
                          "[--ill-neutral:#e8eaf0] [--ill-neutral-2:#c9cdd8] [--ill-paper:#ffffff]",
                          // Illustration palette — dark (ink flips light, paper flips deep)
                          "dark:[--ill-ink:#e2e6ee] dark:[--ill-ink-2:#9aa4b6] dark:[--ill-neutral:#39424f]",
                          "dark:[--ill-neutral-2:#4d5766] dark:[--ill-paper:#232c37]",
                        )}
                      >
                        <div className="absolute h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

                        <Illustration className="relative z-10 h-auto w-full max-w-60 p-7 md:max-w-68" />

                        {/* Floating feature chips */}
                        {slide.chips.map((chip, c) => (
                          <span
                            key={chip.label}
                            className={cn(
                              "absolute z-20 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold",
                              "border border-white/60 bg-white/75 text-foreground/80 shadow-md backdrop-blur-md",
                              "dark:border-white/10 dark:bg-white/10 dark:text-foreground/90",
                              chip.className,
                              isActive &&
                                "motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 motion-safe:fill-mode-both motion-safe:duration-500",
                              isActive && ["motion-safe:delay-200", "motion-safe:delay-300", "motion-safe:delay-500"][c],
                            )}
                          >
                            <span className={cn("h-1.5 w-1.5 rounded-full", chipDots[c % chipDots.length])} />
                            {chip.label}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-none flex-col space-y-3.5 px-1 pb-2 pt-7 text-center">
                      <h2
                        className={cn(
                          "text-[1.65rem] font-black leading-[1.35] tracking-tight md:text-3xl",
                          isActive &&
                            "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:fill-mode-both motion-safe:duration-500 motion-safe:delay-100",
                        )}
                      >
                        {slide.title}
                      </h2>

                      <p
                        className={cn(
                          "mx-auto max-w-xs text-sm leading-7 text-muted-foreground md:text-[15px]",
                          isActive &&
                            "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:fill-mode-both motion-safe:duration-500 motion-safe:delay-200",
                        )}
                      >
                        {slide.description}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>

        {/* Dots */}
        <div className="mt-3 flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              aria-label={`رفتن به اسلاید ${faDigit(i + 1)}`}
              aria-current={i === current}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === current ? "w-7 bg-primary" : "w-2 bg-muted-foreground/25 hover:bg-muted-foreground/40",
              )}
            />
          ))}
        </div>

        {/* Action */}
        <div className="mt-5">
          <Button
            size="lg"
            onClick={() => (isLast ? onFinish() : api?.scrollNext())}
            className={cn(
              "h-13 w-full rounded-full text-base font-bold",
              "bg-primary text-primary-foreground",
              "shadow-lg shadow-primary/25",
              "transition hover:opacity-90 active:scale-[0.98]",
            )}
          >
            {isLast ? "ورود به حساب" : "بعدی"}
          </Button>
        </div>
      </div>
    </div>
  );
}
