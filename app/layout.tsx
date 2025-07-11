import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PeerLink",
  description: "A peer learning platform for college students",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          min-h-screen
          bg-[#f1f3f4]  /* ✅ Google background gray */
          text-[#202124] /* ✅ Google's primary text */
          font-sans
        `}
      >
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
