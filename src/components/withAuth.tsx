/**
 * HOC для защиты страниц по ролям
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface WithAuthOptions {
  requiredRole?: 'admin' | 'user' | ('admin' | 'user')[];
  redirectTo?: string;
}

/**
 * HOC для защиты компонентов по авторизации и ролям
 * 
 * @example
 * // Защитить страницу только для авторизованных пользователей
 * export default withAuth(MyPage);
 * 
 * // Защитить только для админов
 * export default withAuth(AdminPage, { requiredRole: 'admin' });
 * 
 * // Защитить для админов и модераторов
 * export default withAuth(MyPage, { requiredRole: ['admin', 'user'] });
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
      console.log('═══════════════════════════════════════════════════');
      console.log('[withAuth] 🔒 ПРОВЕРКА ДОСТУПА К СТРАНИЦЕ');
      console.log('═══════════════════════════════════════════════════');
      console.log('[withAuth] 📊 State:');
      console.log('[withAuth]   - isLoading:', isLoading);
      console.log('[withAuth]   - isAuthenticated:', isAuthenticated);
      console.log('[withAuth]   - role:', role);
      console.log('[withAuth]   - requiredRole:', requiredRole);

      if (isLoading) {
        console.log('[withAuth] ⏳ Идет загрузка... показываем лоадер');
        return;
      }

      console.log('[withAuth] ✅ Загрузка завершена');

      // Если не авторизован - редирект на логин
      if (!isAuthenticated) {
        console.log('═══════════════════════════════════════════════════');
        console.log('[withAuth] ❌ ДОСТУП ЗАПРЕЩЕН: не авторизован');
        console.log('═══════════════════════════════════════════════════');
        console.log('[withAuth] 🔄 Редирект на:', redirectTo);
        router.push(redirectTo);
        return;
      }

      console.log('[withAuth] ✅ Пользователь авторизован');

      // Если требуется определенная роль - проверяем
      if (requiredRole && role) {
        const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        console.log('[withAuth] 🎯 Проверка роли:');
        console.log('[withAuth]   - Требуемые роли:', allowedRoles);
        console.log('[withAuth]   - Текущая роль:', role);
        
        if (!allowedRoles.includes(role)) {
          console.log('═══════════════════════════════════════════════════');
          console.log('[withAuth] ❌ ДОСТУП ЗАПРЕЩЕН: неправильная роль');
          console.log('═══════════════════════════════════════════════════');
          console.log('[withAuth] 🔄 Редирект на:', redirectTo);
          router.push(redirectTo);
          return;
        }

        console.log('[withAuth] ✅ Роль разрешена!');
      }

      console.log('═══════════════════════════════════════════════════');
      console.log('[withAuth] ✅ ДОСТУП РАЗРЕШЕН!');
      console.log('═══════════════════════════════════════════════════');
      console.log('[withAuth] 👑 Роль:', role);
      console.log('[withAuth] 🚀 Показываем компонент');
    }, [isAuthenticated, role, isLoading, router, requiredRole, redirectTo]);

    // Показываем лоадер пока идет проверка
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin text-2xl">⏳</div>
            <p className="mt-4 text-gray-600">Проверка доступа...</p>
          </div>
        </div>
      );
    }

    // Если не авторизован или нет прав - ничего не показываем
    if (!isAuthenticated) {
      return null;
    }

    // Если требуется роль и она не совпадает - ничего не показываем
    if (requiredRole && role) {
      const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      if (!allowedRoles.includes(role)) {
        return null;
      }
    }

    // Все ОК - показываем компонент
    return <Component {...props} />;
  };
}
