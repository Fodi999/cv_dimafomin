import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { getMetadata } from "@/lib/seo";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { UserProvider } from "@/contexts/UserContext";
import { RecipeProvider } from "@/contexts/RecipeContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { NotificationRefetchProvider } from "@/contexts/NotificationRefetchContext";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import PWARegister from "@/components/PWARegister";
import AuthGate from "@/components/auth/AuthGate";
import GlobalAuthModal from "@/components/auth/GlobalAuthModal"; // 🆕 Global auth modal
import TokenValidator from "@/components/auth/TokenValidator";
import ReloginNotification from "@/components/auth/ReloginNotification"; // 🆕 Relogin notification
import { Toaster } from "@/components/ui/sonner";
import { I18nDevWarning } from "@/components/dev/I18nDevWarning";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { DEFAULT_LANGUAGE, LANGUAGE_COOKIE_KEY, isSupportedLanguage } from "@/lib/i18n/constants";
import type { Language } from "@/lib/i18n/types";

const inter = Inter({ 
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Default metadata (будет использоваться как fallback)
export const metadata: Metadata = getMetadata("pl");

/**
 * Root Layout (SSR with cookie-based i18n)
 * 
 * Flow:
 * 1. Read language from cookie (set by middleware.ts)
 * 2. Load dictionary server-side
 * 3. Pass both to LanguageProvider
 * 4. SSR renders with correct language (no hydration mismatch)
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Read language from cookie (SSR-safe)
  const cookieStore = await cookies();
  const langCookie = cookieStore.get(LANGUAGE_COOKIE_KEY)?.value;
  const language: Language = langCookie && isSupportedLanguage(langCookie) 
    ? langCookie 
    : DEFAULT_LANGUAGE;

  // 2. Load dictionary server-side
  const dictionary = await getDictionary(language);

  return (
    <html lang={language} data-scroll-behavior="smooth" className={inter.className}>
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
            <UserProvider>
              <SettingsProvider>
                <LanguageProvider initialLanguage={language} dictionary={dictionary}>
                  <RecipeProvider>
                    <NotificationProvider>
                      <NotificationRefetchProvider>
                        <TokenValidator />
                        <ReloginNotification /> {/* 🆕 Notification for users with old tokens */}
                        <GlobalAuthModal /> {/* 🆕 Global auth modal for all pages */}
                        <AuthGate>
                          {/* ❌ NavigationBurger видалено з root layout */}
                          {/* ✅ Кожен контекст має свою навігацію:
                              - Public: мінімальний хедер на app/page.tsx
                              - User: UserNavigation в app/(user)/layout.tsx
                              - Admin: AdminNavigation в app/admin/layout.tsx
                          */}
                          <div className="min-h-screen">
                            {children}
                          </div>
                        </AuthGate>
                        {/* Global Toaster for toast notifications */}
                        <Toaster 
                          richColors 
                          position="top-right"
                          expand={false}
                          duration={3000}
                          toastOptions={{
                            style: {
                              opacity: 0.85,
                              backdropFilter: 'blur(8px)',
                              fontSize: '14px',
                              padding: '12px 16px',
                              minHeight: '48px',
                              maxWidth: '320px',
                            },
                          }}
                        />
                        {/* i18n Dev Warnings (only in development) */}
                        <I18nDevWarning />
                      </NotificationRefetchProvider>
                    </NotificationProvider>
                  </RecipeProvider>
                </LanguageProvider>
              </SettingsProvider>
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
