import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md items-center px-4">
      <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-5">
        <h1 className="text-2xl font-bold">ورود به Universe</h1>
        <p className="mt-2 text-sm text-slate-300">ورود آزمایشی برای تمرکز روی رابط کاربری</p>

        <div className="mt-5 space-y-3">
          <Input placeholder="شماره دانشجویی یا ایمیل" dir="rtl" />
          <Input placeholder="رمز عبور" type="password" dir="rtl" />
          <Button className="w-full">ورود</Button>
          <Button variant="secondary" className="w-full">
            ثبت‌نام
          </Button>
        </div>
      </div>
    </div>
  );
}
