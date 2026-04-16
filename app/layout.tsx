import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ClayBackground } from "@/components/ClayBackground";
import { LanguageProvider } from "@/components/LanguageProvider";

import "./globals.css";

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body-ui",
});

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  applicationName: "AI Recipe Studio",
  title: {
    default: "AI Recipe Studio | Bilingual AI Recipe Generator",
    template: "%s | AI Recipe Studio",
  },
  description:
    "Professional bilingual recipe generator with AI-powered dish recommendations and image generation based on cooking time, cuisine, dietary restrictions, and religious diet preferences.",
  keywords: [
    "AI recipe generator",
    "recipe suggestions",
    "dish image generation",
    "bilingual cooking app",
    "OpenRouter recipes",
    "meal planning",
    "cooking assistant",
  ],
  authors: [{ name: "Camilo Oviedo", url: "https://www.camilooviedo.com/" }],
  creator: "Camilo Oviedo",
  publisher: "AI Recipe Studio",
  category: "food",
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      es: "/",
    },
  },
  openGraph: {
    type: "website",
    url: appUrl,
    siteName: "AI Recipe Studio",
    title: "AI Recipe Studio | Bilingual AI Recipe Generator",
    description:
      "Generate structured recipes and dish visuals with AI using cuisine, time, and dietary preferences.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Recipe Studio | Bilingual AI Recipe Generator",
    description:
      "Generate structured recipes and dish visuals with AI using cuisine, time, and dietary preferences.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} font-sans`}>
        <ClayBackground />
        <LanguageProvider>{children}</LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
