import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { FirstLaunchGate } from "@/components/onboarding/first-launch-gate";
import { Providers } from "@/components/providers";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { InsecureContextHint } from "@/components/pwa/insecure-context-hint";
import { appleStartupImages } from "./apple-splash-screens";

const APP_NAME = "Universe";
const APP_DESCRIPTION = "سامانه یکپارچه مدیریت دانشگاه";

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  // The app/manifest.ts file convention auto-injects the <link rel="manifest"> tag.
  // Hint to mobile browsers that this is a phone-number-free app shell.
  formatDetection: { telephone: false },
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    // Translucent bar lets our themed background extend under the status bar.
    statusBarStyle: "black-translucent",
    startupImage: appleStartupImages,
  },
  icons: {
    icon: [
      { url: "/icons/u-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/u512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/splash/apple-icon-180.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Let content paint into the notch / home-indicator areas; we pad it back
  // with env(safe-area-inset-*) in globals.css so nothing is obscured.
  viewportFit: "cover",
  // Match each theme's background so the system chrome blends in.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#081120" },
  ],
};

// IRANSansWeb — the app's Persian/Latin UI font. Self-hosted via next/font/local
// (no layout shift). Each static weight file is mapped to its real font-weight, so
// `font-light` / `font-medium` / `font-bold` resolve to the matching cut instead of
// faux-synthesizing every weight from a single face.
const iranSans = localFont({
  variable: "--font-sans",
  display: "swap",
  src: [
    { path: "./fonts/IRANSansWeb_UltraLight.ttf", weight: "200", style: "normal" },
    { path: "./fonts/IRANSansWeb_Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/IRANSansWeb.ttf", weight: "400", style: "normal" },
    { path: "./fonts/IRANSansWeb_Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/IRANSansWeb_Bold.ttf", weight: "700", style: "normal" },
  ],
});

// Geist Mono — used only by the `font-mono` utility (course codes, times, phone numbers).
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      suppressHydrationWarning
      className={cn("h-full antialiased", geistMono.variable, iranSans.variable)}
    >
      <body className="min-h-full bg-background text-foreground font-sans">
        {/* Global Background Layer */}
        <div className="fixed inset-0 -z-10 bg-background">
          {/* Soft gradient for light/dark depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />

          {/* Dark mode vignette */}
          <div className="absolute inset-0 dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_60%)]" />
        </div>

        <Providers>
          <FirstLaunchGate>{children}</FirstLaunchGate>
          <InstallPrompt />
          <InsecureContextHint />
        </Providers>
      </body>
    </html>
  );
}
