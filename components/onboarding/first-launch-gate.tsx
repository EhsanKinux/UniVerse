"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

const KEY = "universe_onboarding_seen_v1";

export function FirstLaunchGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(KEY);

    if (!seen) {
      setShowOnboarding(true);
    }

    setReady(true);
  }, []);

  if (!ready) return null;

  if (showOnboarding) {
    return (
      <OnboardingFlow
        onFinish={() => {
          localStorage.setItem(KEY, "1");
          setShowOnboarding(false);
          router.replace("/");
        }}
      />
    );
  }

  return <>{children}</>;
}
