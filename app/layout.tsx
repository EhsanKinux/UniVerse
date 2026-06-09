import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { FirstLaunchGate } from "@/components/onboarding/first-launch-gate";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: {
    default: "Universe",
    template: "%s | Universe",
  },
  description: "سامانه یکپارچه مدیریت دانشگاه",
  applicationName: "Universe",
  appleWebApp: {
    capable: true,
    title: "Universe",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#081120",
};

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

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
      className={cn("h-full antialiased", geistSans.variable, geistMono.variable, inter.variable)}
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
        </Providers>
      </body>
    </html>
  );
}
