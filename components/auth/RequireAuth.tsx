"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { routeByRole, routeByStatus } from "@/lib/auth/routeByRole";
import type { UserRole } from "@/lib/auth/routeByRole";

interface RequireAuthProps {
  children: React.ReactNode;
  allowRoles?: UserRole[];
}

// Глобальный флаг для предотвращения множественных редиректов
const redirectingTo = new Map<string, number>();

/**
 * Route Guard Component
 * 
 * Защищает маршруты на основе:
 * - Авторизации (user должен быть залогинен)
 * - Статуса (status должен быть "active")
 * - Роли (role должен быть в allowRoles, если указано)
 * 
 * ✅ Исправление бесконечного цикла:
 * - Пропускает публичные маршруты
 * - Использует глобальный Map для отслеживания редиректов
 * - Проверяет текущий pathname перед редиректом
 * - Очищает флаги редиректов через 2 секунды
 */
export function RequireAuth({ children, allowRoles }: RequireAuthProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  // Публичные маршруты, которые не требуют авторизации
  const publicRoutes = useMemo(() => ['/login', '/register', '/', '/account/status'], []);
  const isPublicRoute = useMemo(() => {
    return pathname && publicRoutes.includes(pathname);
  }, [pathname, publicRoutes]);

  useEffect(() => {
    // Очистка старых флагов редиректов (старше 2 секунд)
    const now = Date.now();
    for (const [route, timestamp] of redirectingTo.entries()) {
      if (now - timestamp > 2000) {
        redirectingTo.delete(route);
      }
    }

    // Если это публичный маршрут, не проверяем авторизацию
    if (isPublicRoute) {
      setIsChecking(false);
      return;
    }

    // Ждем завершения загрузки
    if (loading) {
      return;
    }

    setIsChecking(false);

    // 1. Проверка авторизации
    if (!user) {
      const targetRoute = '/login';
      const isRedirecting = redirectingTo.has(targetRoute);
      const redirectTimestamp = redirectingTo.get(targetRoute) || 0;
      const timeSinceRedirect = Date.now() - redirectTimestamp;
      
      if (pathname !== targetRoute && !isRedirecting && timeSinceRedirect > 500) {
        console.log("[RequireAuth] ❌ No user - redirecting to /login");
        redirectingTo.set(targetRoute, Date.now());
        router.replace(targetRoute);
      }
      return;
    }

    // 2. Проверка статуса
    if (user.status !== "active") {
      const statusRoute = routeByStatus(user.status);
      if (statusRoute) {
        const isRedirecting = redirectingTo.has(statusRoute);
        const redirectTimestamp = redirectingTo.get(statusRoute) || 0;
        const timeSinceRedirect = Date.now() - redirectTimestamp;
        
        if (pathname !== statusRoute && !isRedirecting && timeSinceRedirect > 500) {
          console.log(`[RequireAuth] ❌ User status is ${user.status} - redirecting to ${statusRoute}`);
          redirectingTo.set(statusRoute, Date.now());
          router.replace(statusRoute);
          return;
        }
      }
    }

    // 3. Проверка роли (если указаны разрешенные роли)
    if (allowRoles && allowRoles.length > 0) {
      if (!allowRoles.includes(user.role)) {
        const userRoute = routeByRole(user.role);
        const isRedirecting = redirectingTo.has(userRoute);
        const redirectTimestamp = redirectingTo.get(userRoute) || 0;
        const timeSinceRedirect = Date.now() - redirectTimestamp;
        
        if (pathname !== userRoute && !isRedirecting && timeSinceRedirect > 500) {
          console.log(
            `[RequireAuth] ❌ User role ${user.role} not allowed. Allowed: ${allowRoles.join(", ")} - redirecting to ${userRoute}`
          );
          redirectingTo.set(userRoute, Date.now());
          router.replace(userRoute);
          return;
        }
      }
    }

    console.log("[RequireAuth] ✅ Access granted");
  }, [user, loading, allowRoles, router, pathname, isPublicRoute]);

  // Если это публичный маршрут, рендерим без проверок
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Показываем loader во время проверки
  if (loading || isChecking) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Проверка доступа...
          </p>
        </div>
      </div>
    );
  }

  // Если нет пользователя, не рендерим контент (редирект уже произошел)
  if (!user) {
    return null;
  }

  // Если статус не active, не рендерим контент
  if (user.status !== "active") {
    return null;
  }

  // Если роль не разрешена, не рендерим контент
  if (allowRoles && allowRoles.length > 0 && !allowRoles.includes(user.role)) {
    return null;
  }

  // Все проверки пройдены - рендерим контент
  return <>{children}</>;
}
