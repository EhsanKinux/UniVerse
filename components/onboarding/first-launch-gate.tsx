"use client";

import { useRouter } from "next/navigation";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { useMounted } from "@/hooks/use-mounted";
import { markOnboardingSeen, useHasSeenOnboarding } from "@/lib/storage/onboarding";

/**
 * Shows the one-time intro before letting the app shell through. `seen` is a
 * reactive read of the device-level onboarding flag, so a session teardown that
 * calls `resetOnboarding` (logout / delete account) re-shows the intro even
 * though this gate lives in the persistent root layout and never re-mounts.
 */
export function FirstLaunchGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const mounted = useMounted();
  const seen = useHasSeenOnboarding();

  // Pre-hydration we can't read localStorage; render nothing rather than flash
  // the wrong screen.
  if (!mounted) return null;

  if (!seen) {
    return (
      <OnboardingFlow
        onFinish={() => {
          markOnboardingSeen();
          router.replace("/sign-in");
        }}
      />
    );
  }

  return <>{children}</>;
}
