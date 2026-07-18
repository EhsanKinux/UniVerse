"use client";

import { useState } from "react";

import { foodApi } from "@/lib/api/food.api";
import { cn } from "@/lib/utils";

/** An announcement's cover image, served inline by the backend; hides itself if it
 *  fails to load so the card still reads cleanly. Mirrors DormCoverBanner. */
export function FoodCoverBanner({ id, alt, className }: { id: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <div className={cn("-mx-4 -mt-4 mb-3 bg-muted", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- backend-served image; next/image would need remotePatterns for the dynamic API host */}
      <img
        src={foodApi.coverUrl(id)}
        alt={alt}
        loading="lazy"
        className="aspect-video w-full object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
