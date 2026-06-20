import "./globals.css";
import type { Metadata } from "next";
import { Sora, Inter, IBM_Plex_Sans_Arabic, JetBrains_Mono } from "next/font/google";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ResumeX — AI Resume & CV Builder",
    template: "%s · ResumeX",
  },
  description:
    "Build a recruiter-ready, ATS-optimized resume in minutes with AI. 20+ premium templates, live preview, cover letters, and resume scoring. English, العربية, and Türkçe.",
  metadataBase: new URL("https://cv-saas-ochre.vercel.app"),
  openGraph: {
    title: "ResumeX — AI Resume & CV Builder",
    description:
      "Build a recruiter-ready, ATS-optimized resume in minutes with AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${inter.variable} ${plexArabic.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
