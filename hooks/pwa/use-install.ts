"use client";

import * as React from "react";

import { useMounted } from "@/hooks/use-mounted";
import {
  hasDeferredPrompt,
  promptInstall,
  subscribeInstallability,
  subscribeStandalone,
  type InstallOutcome,
} from "@/lib/pwa/install-store";
import {
  detectInstallPlatform,
  isSecureContext,
  isStandalone,
  platformSupportsInstall,
  type InstallPlatform,
} from "@/lib/pwa/platform";

export interface InstallState {
  /** False during SSR and the hydration render; everything below is only meaningful once true. */
  ready: boolean;
  platform: InstallPlatform;
  /** Already launched from the home screen / dock. */
  installed: boolean;
  /** HTTPS or localhost. Off ⇒ Chromium install and the service worker are blocked. */
  secure: boolean;
  /** Chromium handed us a deferred prompt — one tap installs, no instructions needed. */
  canPromptDirectly: boolean;
  /** Installing is possible here at all (false only on desktop Firefox). */
  supported: boolean;
  install: () => Promise<InstallOutcome>;
}

/**
 * Everything the install UI needs, in one hydration-safe hook.
 *
 * The two live values come from `useSyncExternalStore` rather than
 * `useState` + `useEffect`: they can change *after* mount (the deferred prompt
 * arrives late, the user installs mid-session) and the project's
 * `react-hooks/set-state-in-effect` rule rules out mirroring them into state.
 * Platform and secure-context never change for the life of the document, so
 * those are plain memos gated on `useMounted`.
 */
export function useInstall(): InstallState {
  const ready = useMounted();

  const canPromptDirectly = React.useSyncExternalStore(
    subscribeInstallability,
    hasDeferredPrompt,
    () => false,
  );

  const installed = React.useSyncExternalStore(subscribeStandalone, isStandalone, () => false);

  const { platform, secure } = React.useMemo(
    () =>
      ready
        ? { platform: detectInstallPlatform(), secure: isSecureContext() }
        : { platform: "unknown" as InstallPlatform, secure: true },
    [ready],
  );

  return {
    ready,
    platform,
    installed,
    secure,
    canPromptDirectly,
    supported: platformSupportsInstall(platform),
    install: promptInstall,
  };
}
