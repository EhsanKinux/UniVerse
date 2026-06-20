"use client";

import * as React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRouter } from "next/navigation";

import { getQueryClient } from "@/lib/api/query-client";
import { registerUnauthorizedHandler } from "@/lib/api/client";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const router = useRouter();

  React.useEffect(() => {
    // The axios client calls this when a silent token refresh ultimately fails.
    // It has already cleared the tokens; here we wipe the cache and bounce the
    // user to sign-in.
    registerUnauthorizedHandler(() => {
      queryClient.clear();
      router.replace("/sign-in");
    });
  }, [queryClient, router]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
}
