import Image from "next/image";

import { Spinner } from "@/components/ui/spinner";

/**
 * Root Suspense fallback — shown briefly while a route resolves. Deliberately
 * minimal and theme-aware (inherits the body's `bg-background`, so it's correct
 * in light and dark): a small brand mark and a spinner that gets out of the way
 * fast. The heavier branded moment lives in the splash/onboarding, not here.
 */
export default function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <Image
          src="/icons/u-192x192.png"
          alt=""
          width={56}
          height={56}
          priority
          className="size-14 opacity-90"
        />
        <Spinner className="size-6 text-primary" />
      </div>
    </div>
  );
}
