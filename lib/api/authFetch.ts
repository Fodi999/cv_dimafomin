/**
 * Auth Fetch Wrapper - ЕДИНСТВЕННЫЙ источник Authorization header
 * 
 * ✅ Правило 2026:
 * ТОЛЬКО authFetch имеет право добавлять Authorization
 * 
 * Guard: добавляет Authorization только если токен валидный JWT
 */

import { getAccessToken } from "@/lib/auth/token-utils";

/**
 * Auth Fetch - ЕДИНСТВЕННЫЙ способ делать авторизованные запросы
 * 
 * Правила:
 * - Если токен null/пустой/не JWT → НЕ добавляем Authorization
 * - Если токен валидный JWT → добавляем Authorization: Bearer {token}
 * 
 * При 401 ошибке → logout (refresh временно отключен)
 */
export async function authFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  // ✅ Безопасно извлекаем токен (с автоматической валидацией и очисткой)
  const token = getAccessToken();

  const headers = new Headers(init.headers || {});

  // ✅ Guard: добавляем Authorization ТОЛЬКО если токен валидный JWT
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
    console.log(`[authFetch] ✅ Valid JWT token found (length: ${token.length}), adding Authorization header`);
    console.log(`[authFetch] 🔍 Auth header preview: "Bearer ${token.substring(0, 20)}..."`);
  }
  // Если токена нет - это нормально для неавторизованных пользователей
  // Не логируем это как проблему
  
  // Устанавливаем Content-Type если не указан
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(input, {
    ...init,
    headers,
  });

  // ✅ 2026: Обработка ошибок авторизации
  if (response.status === 401) {
    console.warn("[authFetch] ⚠️ Got 401 - token expired or invalid");
    
    // Предотвращаем множественные редиректы
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const isPublicRoute = ['/login', '/register', '/', '/account/status'].includes(currentPath);
      
      // Очищаем токены
      const { clearTokens } = await import("@/lib/auth/token-utils");
      clearTokens();
      
      // Редиректим только если не на публичной странице
      if (!isPublicRoute && currentPath !== '/login') {
        window.location.href = "/login";
      }
    }
  }

  // ✅ 2026: Обработка 403 "User is not active"
  if (response.status === 403) {
    console.warn("[authFetch] ⚠️ Got 403 - checking if user status changed");
    
    try {
      // Проверяем тело ответа на наличие сообщения о статусе
      const errorData = await response.clone().json().catch(() => ({}));
      const errorMessage = errorData.error?.message || errorData.message || "";
      
      if (errorMessage.toLowerCase().includes("not active") || 
          errorMessage.toLowerCase().includes("inactive") ||
          errorMessage.toLowerCase().includes("suspended") ||
          errorMessage.toLowerCase().includes("blocked")) {
        
        console.warn("[authFetch] 🔄 User status changed, reloading from /api/auth/me");
        
        // Динамически импортируем AuthContext чтобы избежать циклических зависимостей
        // Вместо этого перенаправляем на /account/status
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          if (currentPath !== '/account/status') {
            window.location.href = "/account/status";
          }
        }
      }
    } catch (e) {
      console.error("[authFetch] Failed to parse 403 error:", e);
    }
  }

  return response;
}
