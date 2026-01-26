"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { RecipeProvider } from "@/contexts/RecipeContext";
import { CartProvider } from "@/contexts/CartContext";
import { Loader } from "lucide-react";
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
 * Middleware уже проверил наличие token и role !== admin.
 * Здесь делаем дополнительную проверку на клиенте.
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useUser();
  const { openAuthModal } = useAuth();

  // Проверка авторизации и роли
  useEffect(() => {
    console.log("[AppLayout] 🔐 Access check:", {
      isLoading,
      hasUser: !!user,
      userEmail: user?.email,
      userRole: user?.role,
      pathname,
    });

    if (!isLoading) {
      // Если нет пользователя → открываем модалку входа
      if (!user) {
        console.warn("[AppLayout] ❌ No user - opening auth modal");
        openAuthModal("login");
        return;
      }

      // Если пользователь — админ → редирект в /admin (на случай, если middleware не сработал)
      if (user.role === "admin" || user.role === "superadmin") {
        console.warn("[AppLayout] ❌ Admin detected in /app - redirecting to /admin");
        router.push("/admin");
        return;
      }

      console.log("[AppLayout] ✅ User access granted:", user.role);
    }
  }, [user, isLoading, router, openAuthModal, pathname]);

  // Показываем loader пока идёт загрузка
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-sky-600 dark:text-sky-400 mx-auto mb-4" />
          <p className="text-muted-foreground">Завантаження...</p>
        </div>
      </div>
    );
  }

  // Если нет пользователя или это админ → не рендерим контент
  if (!user || user.role === "admin" || user.role === "superadmin") {
    return null;
  }

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

  // ✅ Wrap with RecipeProvider for all routes EXCEPT /assistant
  if (isAssistantPage) {
    console.log("🚫 RecipeProvider: DISABLED on /assistant (isolated)");
    return content;
  }

  console.log("✅ RecipeProvider: ENABLED on", pathname);
  return (
    <CartProvider>
      <RecipeProvider>{content}</RecipeProvider>
    </CartProvider>
  );
}
