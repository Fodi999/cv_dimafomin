import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Dima Fomin - Professional Chef | Doświadczony Kucharz Gdańsk",
  description:
    "Profesjonalny kucharz z 20-letnim doświadczeniem międzynarodowym szuka pracy w Polsce. Specjalizacja w sushi, owocach morza, kuchni europejskiej. Doświadczenie w Polsce, Francji, Kanadzie, Niemczech.",
  keywords: [
    "Kucharz Gdańsk",
    "Chef Polska",
    "Praca Kucharz",
    "Professional Chef Poland",
    "Sushi Chef Gdańsk",
    "Doświadczony Kucharz",
    "Chef Warszawa",
    "Kucharz Kraków",
    "HACCP",
    "Dima Fomin",
  ],
  authors: [{ name: "Dima Fomin" }],
  creator: "Dima Fomin",
  publisher: "Dima Fomin",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "https://dimafomin.com",
    title: "Dima Fomin - Professional Chef | Doświadczony Kucharz",
    description:
      "Profesjonalny kucharz z 20-letnim doświadczeniem. Specjalizacja w sushi i kuchni międzynarodowej. Gdańsk, Polska.",
    siteName: "Dima Fomin - Chef",
    images: [
      {
        url: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Dima Fomin - Professional Chef",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dima Fomin - Professional Chef | Doświadczony Kucharz",
    description:
      "Profesjonalny kucharz z 20-letnim doświadczeniem międzynarodowym. Specjalizacja w sushi i kuchni europejskiej.",
    images: [
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icon-512x512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
