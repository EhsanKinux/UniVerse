"use client";

import { useState } from "react";

import { dormApi } from "@/lib/api/dorm.api";
import { cn } from "@/lib/utils";

/** An announcement's cover image, served inline by the backend; hides itself if it
 *  fails to load so the card still reads cleanly. Mirrors NewsCoverBanner. */
export function DormCoverBanner({ id, alt, className }: { id: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <div className={cn("-mx-4 -mt-4 mb-3 bg-muted", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- backend-served image; next/image would need remotePatterns for the dynamic API host */}
      <img
        src={dormApi.coverUrl(id)}
        alt={alt}
        loading="lazy"
        className="aspect-video w-full object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
