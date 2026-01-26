"use client";

import { usePathname } from "next/navigation";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { RecipeProvider } from "@/contexts/RecipeContext";
import { CartProvider } from "@/contexts/CartContext";
import UserNavigation from "@/components/layout/UserNavigation";

/**
 * User App Layout
 * 
 * ✅ RecipeProvider wraps all /app routes EXCEPT /assistant
 * 
 * Защищённая зона для авторизованных пользователей (не админов).
 * Содержит:
 * - Холодильник (/app/fridge) ✅ RecipeProvider
 * - Рецепты (/app/recipes) ✅ RecipeProvider
 * - AI Ассистент (/app/assistant) ❌ NO RecipeProvider (has own layout)
 * - Академия (/app/academy) ✅ RecipeProvider
 * - Токены (/app/tokens) ✅ RecipeProvider
 * 
 * RequireAuth защищает от прямого доступа по URL.
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // ❌ Disable RecipeProvider for /assistant
  const isAssistantPage = pathname?.startsWith("/assistant");

  // Рендерим приложение пользователя
  const content = (
    <div className="min-h-screen bg-background">
      {/* User Navigation (отдельное меню для /app) */}
      <UserNavigation />
      
      {/* Main Content */}
      <main className="pt-16"> {/* Отступ под sticky header */}
        {children}
      </main>
    </div>
  );

  // ✅ Wrap with RequireAuth and RecipeProvider for all routes EXCEPT /assistant
  if (isAssistantPage) {
    console.log("🚫 RecipeProvider: DISABLED on /assistant (isolated)");
    return (
      <RequireAuth>
        {content}
      </RequireAuth>
    );
  }

  console.log("✅ RecipeProvider: ENABLED on", pathname);
  return (
    <RequireAuth>
      <CartProvider>
        <RecipeProvider>{content}</RecipeProvider>
      </CartProvider>
    </RequireAuth>
  );
}
