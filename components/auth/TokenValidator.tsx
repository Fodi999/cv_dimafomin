'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { isTokenValid } from '@/lib/auth-interceptor';

/**
 * TokenValidator - проверяет токен при загрузке приложения
 * Автоматически очищает невалидные токены
 */
export default function TokenValidator() {
  const { logout } = useAuth();

  useEffect(() => {
    // Проверяем только в браузере
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    
    // Если токена нет - ничего не делаем
    if (!token) {
      console.log('ℹ️ [TokenValidator] No token found - user not logged in');
      return;
    }

    // Проверяем валидность токена
    console.log('🔐 [TokenValidator] Checking token validity...');
    
    if (!isTokenValid()) {
      console.warn('⚠️ [TokenValidator] Token is invalid or expired - clearing auth data');
      logout(); // Используем logout из AuthContext для чистки
    } else {
      console.log('✅ [TokenValidator] Token is valid');
    }
  }, [logout]);

  return null; // Этот компонент ничего не рендерит
}
