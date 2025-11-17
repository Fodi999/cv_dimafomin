import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getMetadata } from "@/lib/seo";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { UserProvider } from "@/contexts/UserContext";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import PWARegister from "@/components/PWARegister";
import NavigationBurger from "@/components/NavigationBurger";

const inter = Inter({ 
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Default metadata (будет использоваться как fallback)
export const metadata: Metadata = getMetadata("pl");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" data-scroll-behavior="smooth" className={inter.className}>
      <head>
        {/* Viewport - Fixed scale, no zoom, safe-area support */}
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        
        {/* PWA Meta Tags - Updated for modern standards */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Dima Fomin" />
        
        {/* Disable tap highlight on mobile */}
        <meta name="format-detection" content="telephone=no" />
        
        {/* Theme Color for iOS and Android */}
        <meta name="theme-color" content="#1E1A41" />
        <meta name="msapplication-TileColor" content="#1E1A41" />
        
        {/* iOS Touch Icons - PNG for iOS Safari */}
        <link rel="apple-touch-icon" href="/icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512x512.png" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512x512.png" />
        
        {/* iOS Splash Screens */}
        <link rel="apple-touch-startup-image" href="/icon-1024x1024.png" />
        
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="antialiased relative">
        <PWARegister />
        <ThemeProvider defaultTheme="system">
          <AuthProvider>
            <LanguageProvider>
              <UserProvider>
                <NavigationBurger />
                <div className="min-h-screen">
                  {children}
                </div>
              </UserProvider>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
