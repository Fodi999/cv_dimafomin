"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

/**
 * Login Page
 * 
 * Страница входа в систему
 * Показывает форму входа через AuthModal
 * 
 * ✅ Исправление бесконечного цикла:
 * - Использует useRef для предотвращения множественных редиректов
 */
// Глобальный флаг для предотвращения множественных редиректов из LoginPage
let loginPageRedirecting = false;

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Предотвращаем множественные редиректы
    if (loginPageRedirecting) {
      return;
    }

    // Если пользователь уже залогинен, редиректим на главную
    if (!loading && user) {
      const targetRoute = '/marketplace';
      if (window.location.pathname !== targetRoute) {
        console.log("[LoginPage] ✅ User logged in - redirecting to /marketplace");
        loginPageRedirecting = true;
        router.replace(targetRoute);
        
        // Сбрасываем флаг через 2 секунды
        setTimeout(() => {
          loginPageRedirecting = false;
        }, 2000);
      }
    }
  }, [user, loading, router]);

  // Показываем loader во время загрузки
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Загрузка...
          </p>
        </div>
      </div>
    );
  }

  // Если пользователь залогинен, не показываем форму (редирект уже произошел)
  if (user) {
    return null;
  }

  // Показываем форму входа
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <AuthModal
        isOpen={true}
        onClose={() => router.push("/")}
        initialTab="login"
      />
    </div>
  );
}
