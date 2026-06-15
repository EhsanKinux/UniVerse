import { moduleGroups } from "@/lib/university-data";
import { SectionPage } from "@/components/section-page";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const announcements = [
  {
    title: "زمان انتخاب واحد نیمسال جدید",
    category: "آموزشی",
    date: "شنبه ۱۶ خرداد",
    description: "انتخاب واحد دانشجویان کارشناسی از ساعت ۸ صبح از طریق سامانه آموزشی فعال می‌شود.",
  },
  {
    title: "اطلاعیه سرویس رفت‌وآمد",
    category: "خدمات",
    date: "یکشنبه ۱۷ خرداد",
    description: "مسیرهای جدید سرویس دانشگاه برای خوابگاه‌ها و ایستگاه مترو به‌روزرسانی شد.",
  },
  {
    title: "تمدید رزرو غذای هفته",
    category: "دانشجویی",
    date: "تا دوشنبه",
    description: "مهلت رزرو و ویرایش غذای هفته آینده تا پایان روز دوشنبه تمدید شد.",
  },
] as const;

const quickAccessModules = [
  moduleGroups.educational[0],
  moduleGroups.educational[1],
  moduleGroups.educational[3],
  moduleGroups.services[0],
  moduleGroups.services[1],
  moduleGroups.student[0],
  moduleGroups.student[1],
  moduleGroups.student[2],
] as const;

export default function HomeTab() {
  return (
    <div className="space-y-7">
      <section className="relative isolate overflow-hidden rounded-3xl border border-border bg-muted shadow-sm">
        <div className="aspect-video w-full bg-[url('/imgs/HUT.webp')] bg-cover bg-center sm:aspect-21/9" />
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-black/5" />

        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <div className="mb-3 inline-flex rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-md">
            خوش آمدید
          </div>

          <h2 className="max-w-xs text-2xl font-bold leading-9 tracking-tight">همه چیز دانشگاه در یک اپ</h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-white/80">
            امور آموزشی، خدمات، غذا، برنامه هفتگی و اطلاعات دانشجویی را سریع و یکجا مدیریت کنید.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3 px-1">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">اخبار و اطلاعیه‌ها</h2>
            <p className="mt-1 text-sm text-muted-foreground">آخرین پیام‌های مهم دانشگاه</p>
          </div>

          <span className="shrink-0 text-xs font-medium text-primary">مشاهده همه</span>
        </div>

        <Carousel
          opts={{
            align: "start",
            direction: "rtl",
          }}
          className="w-full"
        >
          <CarouselContent className="-ms-3">
            {announcements.map((item) => (
              <CarouselItem key={item.title} className="basis-[86%] ps-3">
                <Card className="h-full p-4">
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant="soft">{item.category}</Badge>
                    <time className="shrink-0 text-xs text-muted-foreground">{item.date}</time>
                  </div>

                  <h3 className="mt-4 line-clamp-1 text-base font-bold text-foreground">{item.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      <SectionPage title="دسترسی سریع" modules={quickAccessModules} variant="apps" />
    </div>
  );
}
