/**
 * JWT Utilities
 * 
 * Единые утилиты для работы с JWT токенами
 * Используются во всех местах где нужна проверка токена
 */

/**
 * Проверка что токен является валидным JWT
 * 
 * JWT формат: header.payload.signature (3 части разделенные точками)
 * 
 * @param token - Токен для проверки
 * @returns true если токен валидный JWT, false иначе
 * 
 * @example
 * isValidJWT("eyJhbGci...") // true
 * isValidJWT("undefined") // false
 * isValidJWT(null) // false
 */
export function isValidJWT(token: string | null | undefined): boolean {
  if (!token || typeof token !== "string") {
    return false;
  }
  
  // JWT должен иметь 3 части разделенные точками
  const parts = token.split(".");
  return parts.length === 3;
}

/**
 * Проверка минимальной длины токена
 * 
 * Валидные JWT токены обычно имеют длину > 100 символов
 * Короткие токены (например "undefined" length: 9) явно невалидны
 * 
 * @param token - Токен для проверки
 * @returns true если токен имеет разумную длину
 */
export function hasValidLength(token: string | null | undefined): boolean {
  if (!token || typeof token !== "string") {
    return false;
  }
  
  // Минимальная длина для валидного JWT (обычно > 100 символов)
  return token.length > 50;
}

/**
 * Полная проверка валидности JWT токена
 * 
 * Проверяет:
 * - Токен является строкой
 * - Токен имеет правильный формат (3 части)
 * - Токен имеет разумную длину
 * 
 * @param token - Токен для проверки
 * @returns true если токен валидный JWT
 */
export function validateJWT(token: string | null | undefined): boolean {
  if (!isValidJWT(token)) {
    return false;
  }
  
  // Дополнительная проверка длины для большей надежности
  return hasValidLength(token);
}
