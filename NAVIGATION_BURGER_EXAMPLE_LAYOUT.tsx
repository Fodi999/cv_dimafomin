/**
 * Пример использования NavigationBurger в app/layout.tsx
 * 
 * Это ПРИМЕРНЫЙ код для интеграции.
 * Адаптируйте под вашу текущую структуру.
 */

// app/layout.tsx

import type { Metadata } from "next";
import { Providers } from "./providers";
import NavigationBurger from "@/components/NavigationBurger";
import Footer from "@/components/sections/Footer";
import { DynamicMetaTags } from "@/components/DynamicMetaTags";
import "./globals.css";

export const metadata: Metadata = {
  title: "Seafood Academy by Dima Fomin",
  description: "Learn, cook, and earn ChefTokens",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <DynamicMetaTags />
      </head>
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors">
        <Providers>
          {/* ===== NAVBAR ===== */}
          <NavigationBurger />

          {/* ===== MAIN CONTENT ===== */}
          <main className="min-h-screen">
            {children}
          </main>

          {/* ===== FOOTER ===== */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
