/**
 * Token Utilities - Безопасная работа с токенами
 * 
 * ✅ Правила 2026:
 * - Всегда проверяем на "undefined" строку
 * - Валидируем формат JWT
 * - Очищаем невалидные токены автоматически
 */

import { isValidJWT } from "./jwt-utils";

/**
 * Безопасно получает access_token из localStorage
 * Автоматически очищает невалидные значения
 * 
 * @returns Валидный токен или null
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null; // SSR
  }
  
  let token = localStorage.getItem("access_token");
  
  // ✅ Проверка: если токен "undefined" (строка), очищаем его
  if (token === "undefined" || token === "null") {
    console.warn("[token-utils] ⚠️ Found string 'undefined' or 'null' in localStorage, clearing");
    localStorage.removeItem("access_token");
    localStorage.removeItem("token"); // Legacy
    return null;
  }
  
  if (!token || typeof token !== "string" || token.length === 0) {
    return null;
  }
  
  // ✅ Проверка формата JWT
  if (!isValidJWT(token)) {
    console.warn(`[token-utils] ⚠️ Invalid token format (length: ${token.length}), clearing`);
    localStorage.removeItem("access_token");
    localStorage.removeItem("token"); // Legacy
    return null;
  }
  
  return token;
}

/**
 * Безопасно сохраняет access_token в localStorage
 * Валидирует токен перед сохранением
 * 
 * @param token - JWT токен для сохранения
 * @returns true если токен сохранен успешно
 */
export function saveAccessToken(token: string): boolean {
  if (typeof window === "undefined") {
    return false; // SSR
  }
  
  // ✅ Валидация токена перед сохранением
  if (!token || typeof token !== "string" || token.length < 50) {
    console.error(`[token-utils] ❌ Invalid token to save (length: ${token?.length || 0})`);
    return false;
  }
  
  if (!isValidJWT(token)) {
    console.error(`[token-utils] ❌ Token is not a valid JWT format`);
    return false;
  }
  
  // ✅ Сохраняем токен
  localStorage.setItem("access_token", token);
  
  // ✅ Проверяем, что токен сохранен
  const savedToken = localStorage.getItem("access_token");
  if (savedToken === token) {
    console.log(`[token-utils] ✅ Token saved successfully (length: ${token.length})`);
    
    // Legacy compatibility
    localStorage.setItem("token", token);
    
    return true;
  } else {
    console.error("[token-utils] ❌ Token save failed! Expected:", token.substring(0, 20), "Got:", savedToken?.substring(0, 20));
    return false;
  }
}

/**
 * Очищает все токены из localStorage
 */
export function clearTokens(): void {
  if (typeof window === "undefined") {
    return; // SSR
  }
  
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("token"); // Legacy
  localStorage.removeItem("role"); // Legacy
  
  console.log("[token-utils] ✅ All tokens cleared");
}
