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
      
      // 🔍 DEBUG: Decode JWT and check sub
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log("🔍 [TokenValidator] JWT Payload:", {
          sub: payload.sub,
          email: payload.email,
          role: payload.role,
          hasRole: !!payload.role,
          exp: new Date(payload.exp * 1000).toISOString(),
        });
        
        // 🔥 КРИТИЧНО: Проверить наличие sub
        if (!payload.sub) {
          console.error("❌ [TokenValidator] Token missing 'sub' claim - INVALID TOKEN");
          console.warn("⚠️ [TokenValidator] Backend must include 'sub' (user.id) in JWT");
          // Не логаутим, но предупреждаем (для обратной совместимости)
        } else {
          // ✅ Сохранить userId из sub (для RecipeContext и других контекстов)
          localStorage.setItem('userId', payload.sub);
          console.log(`✅ [TokenValidator] User ID saved: ${payload.sub}`);
        }
      } catch (e) {
        console.error("⚠️ [TokenValidator] Failed to decode JWT:", e);
      }
    }
  }, [logout]);

  return null; // Этот компонент ничего не рендерит
}
