import type { Metadata } from "next";
import { Figtree, Fraunces } from "next/font/google";
import { AppProviders, SiteHeader } from "@/components/common/RoleGuard";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ReliefOps — Crisis Relief Coordination",
  description:
    "Coordinate disaster relief with prioritized requests, transparent resource allocation, and volunteer management. Built for moments that matter.",
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} antialiased`}
    >
      <body className="min-h-screen font-sans">
        <AppProviders>
          <SiteHeader />
          <div className="min-h-[calc(100vh-3.5rem)]">{children}</div>
        </AppProviders>
      </body>
    </html>
  );
}
