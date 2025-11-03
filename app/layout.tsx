import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getMetadata } from "@/lib/seo";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { UserProvider } from "@/contexts/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Default metadata (будет использоваться как fallback)
export const metadata: Metadata = getMetadata("pl");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <head>
        {/* Viewport - Fixed scale, no zoom */}
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        
        {/* iOS PWA Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Dima Fomin" />
        
        {/* Disable tap highlight on mobile */}
        <meta name="format-detection" content="telephone=no" />
        
        {/* Theme Color for iOS and Android */}
        <meta name="theme-color" content="#1E1A41" />
        <meta name="msapplication-TileColor" content="#1E1A41" />
        
        {/* iOS Splash Screens */}
        <link rel="apple-touch-icon" href="/icon-192x192.svg" />
        <link rel="apple-touch-startup-image" href="/icon-512x512.svg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
