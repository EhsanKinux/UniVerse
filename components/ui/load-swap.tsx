"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

/**
 * Crossfades a skeleton into real content. While `loading`, the skeleton shows;
 * when it flips false, the skeleton fades out and the content rises in — one
 * continuous handoff instead of an abrupt swap. Respects reduced motion via the
 * app-level `MotionConfig` (content just appears, no transform).
 *
 * Keep the skeleton visually close to the real layout so the transition reads as
 * the same page resolving, not two different screens.
 */
export function LoadSwap({
  loading,
  skeleton,
  children,
  className,
}: {
  loading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {loading ? (
        <motion.div
          key="skeleton"
          className={className}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          {skeleton}
        </motion.div>
      ) : (
        <motion.div
          key="content"
          className={className}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
