/**
 * HOC для защиты страниц по ролям
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../types';

interface WithAuthOptions {
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
}

/**
 * HOC для защиты компонентов по авторизации и ролям
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthOptions = {},
) {
  const { requiredRole, redirectTo = '/login' } = options;

  return function ProtectedComponent(props: P) {
    const { isAuthenticated, role, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (isLoading) return;

      // Если не авторизован - редирект на логин
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // Если требуется определенная роль - проверяем
      if (requiredRole && role) {
        const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        if (!allowedRoles.includes(role)) {
          router.push(redirectTo);
        }
      }
    }, [isAuthenticated, role, isLoading, router]);

    // Показываем лоадер пока идет проверка
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin">⏳</div>
            <p className="mt-4 text-gray-600">Загрузка...</p>
          </div>
        </div>
      );
    }

    // Если не авторизован или нет прав - ничего не показываем
    if (!isAuthenticated) {
      return null;
    }

    // Все ОК - показываем компонент
    return <Component {...props} />;
  };
}
