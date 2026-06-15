"use client";

import * as React from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SplashScreen } from "./splashscreen";

import Onboarding1 from "@/public/icons/onboarding_1.svg";
import Onboarding2 from "@/public/icons/onboarding_2.svg";
import Onboarding3 from "@/public/icons/onboarding_3.svg";
import Onboarding4 from "@/public/icons/onboarding_4.svg";

import Image from "next/image";

const slides = [
  {
    illustration: Onboarding1,
    title: "همه چیز دانشگاه در یک جا",
    description:
      "به خدمات آموزشی، برنامه هفتگی، غذا، اطلاعیه‌ها و بخش‌های مهم دانشگاه با یک تجربه ساده و سریع دسترسی دارید.",
    points: ["ناوبری سریع و موبایل‌فرست", "طراحی شبیه اپ واقعی", "ورود بدون شلوغی و پیچیدگی"],
  },
  {
    illustration: Onboarding2,
    title: "برنامه‌ها و زمان‌بندی",
    description: "کلاس‌ها، زمان‌های مهم و رویدادها را در یک فضای مرتب ببینید تا کارهای روزانه‌تان سریع‌تر انجام شود.",
    points: ["مرور ساده اطلاعات", "تمرکز روی کارهای روزانه", "ظاهر شفاف و خوانا"],
  },
  {
    illustration: Onboarding3,
    title: "اعلان‌های مهم",
    description: "اطلاعیه‌ها و پیام‌های مهم را در یک رابط سبک و مدرن دنبال کنید تا چیزی از قلم نیفتد.",
    points: ["نمایش واضح هشدارها", "دسترسی فوری به اخبار", "آماده برای توسعه بعدی"],
  },
  {
    illustration: Onboarding4,
    title: "زندگی دانشجویی با دانشگاه هوشمند",
    description: "بعد از این معرفی کوتاه، کاربر مستقیم وارد صفحه ورود می‌شود و تجربه‌ای تمیز و حرفه‌ای خواهد داشت.",
    points: ["شروع سریع", "ورود امن", "حس اپلیکیشن بومی"],
  },
] as const;

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
      {/* Modern Mesh Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top Glow */}
        <div className="absolute left-1/2 -top-30 h-105 w-105 -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />

        {/* Right Glow */}
        <div className="absolute -right-30 top-[20%] h-80 w-[320px] rounded-full bg-primary/10 blur-[100px]" />

        {/* Bottom Glow */}
        <div className="absolute -bottom-30 left-[10%] h-70 w-70 rounded-full bg-primary/10 blur-[100px]" />

        {/* Center Spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,80,255,0.08),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(120,80,255,0.16),transparent_55%)]" />

        {/* Grid Pattern */}
        <div
          className="
        absolute inset-0
        opacity-[0.03]
        dark:opacity-[0.06]
        bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)]
        bg-size-[32px_32px]
      "
        />

        {/* Fade */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/20 to-background" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-6 pt-6">
        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between">
          <span className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground shadow-sm">
            {current + 1} / {slides.length}
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
          className="flex-1 bg-transparent"
        >
          <CarouselContent className="-ml-4">
            {slides.map((slide) => {
              const Illustration = slide.illustration;

              return (
                <CarouselItem key={slide.title} className="pl-4">
                  <div className="flex min-h-[70dvh] flex-col">
                    {/* Illustration (bigger + better spacing) */}
                    <div className="relative flex flex-[0.55] items-center justify-center">
                      <div className="absolute h-52 w-52 rounded-full bg-primary/10 blur-3xl" />

                      <Image
                        src={Illustration}
                        alt="onboarding_icon"
                        className="relative z-10 w-full max-w-60 object-contain md:max-w-70"
                        priority
                      />
                    </div>

                    {/* Content */}
                    <div className="flex flex-[0.45] flex-col justify-start space-y-4 pb-2">
                      <h2 className="text-center text-2xl md:text-3xl font-extrabold tracking-tight leading-snug">
                        {slide.title}
                      </h2>

                      <p className="text-center text-sm md:text-base leading-7 text-muted-foreground px-2">
                        {slide.description}
                      </p>

                      {/* Points */}
                      {/* <div className="mt-3 space-y-2">
                        {slide.points.map((point) => (
                          <div
                            key={point}
                            className={cn(
                              "flex items-center gap-3 rounded-2xl",
                              "bg-muted/40 px-4 py-3",
                              "transition-all duration-300",
                              "hover:bg-primary/5",
                            )}
                          >
                            <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                            <span className="text-sm text-foreground/90">{point}</span>
                          </div>
                        ))}
                      </div> */}
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>

        {/* Dots */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === current ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30",
              )}
            />
          ))}
        </div>

        {/* Action */}
        <div className="mt-6">
          <Button
            size="lg"
            onClick={() => (isLast ? onFinish() : api?.scrollNext())}
            className={cn(
              "h-13 w-full rounded-3xl text-base font-semibold",
              "bg-primary text-primary-foreground",
              "shadow-md shadow-primary/20",
              "hover:opacity-90 transition",
            )}
          >
            {isLast ? "ورود به حساب" : "بعدی"}
          </Button>
        </div>
      </div>
    </div>
  );
}
