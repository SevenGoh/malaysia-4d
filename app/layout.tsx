import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { AdBanner } from "@/components/AdBanner";
import { AdSenseHeadScript } from "@/components/AdSenseHeadScript";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Malaysia 4D Results",
  description:
    "Latest 4D results for Magnum, Da Ma Cai, Sports Toto & Grand Dragon Malaysia",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Malaysia 4D",
  },
  ...(process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID
    ? {
        other: {
          "google-adsense-account": process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID,
        },
      }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <AdSenseHeadScript />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
          <div className="mx-auto flex max-w-lg items-center gap-4 px-4 py-3 text-sm">
            <Link href="/" className="font-medium text-white hover:text-amber-400">
              Live
            </Link>
            <Link
              href="/history"
              className="text-zinc-400 hover:text-white"
            >
              History
            </Link>
            <Link
              href="/privacy"
              className="text-zinc-400 hover:text-white"
            >
              Privacy
            </Link>
          </div>
        </nav>
        <div className="flex-1">{children}</div>
        <footer className="mx-auto w-full max-w-lg px-4 pb-4 pt-2">
          <AdBanner slot="footer" />
        </footer>
      </body>
    </html>
  );
}
