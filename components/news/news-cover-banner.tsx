"use client";

import { useState } from "react";

import { newsApi } from "@/lib/api/news.api";
import { cn } from "@/lib/utils";

export function NewsCoverBanner({ id, alt, className }: { id: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <div className={cn("-mx-4 -mt-4 mb-3 bg-muted", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- backend-served image; next/image would need remotePatterns for the dynamic API host */}
      <img
        src={newsApi.coverUrl(id)}
        alt={alt}
        loading="lazy"
        className="aspect-video w-full object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
