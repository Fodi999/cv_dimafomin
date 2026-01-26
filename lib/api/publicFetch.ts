/**
 * Public Fetch - для публичных endpoint'ов без обязательной авторизации
 * 
 * ✅ Правило 2026:
 * - Используется для публичных endpoint'ов (категории, поиск, и т.д.)
 * - НЕ добавляет Authorization header
 * - НЕ очищает токены при 401
 * 
 * Для авторизованных запросов используй authFetch
 */

/**
 * Public Fetch - для публичных API запросов
 * 
 * Используется для endpoint'ов, которые не требуют авторизацию
 * Не добавляет Authorization header
 * Не обрабатывает 401 как ошибку авторизации
 */
export async function publicFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(init.headers || {});
  
  // Устанавливаем Content-Type если не указан
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  console.log(`[publicFetch] 🌐 Public request: ${input}`);

  const response = await fetch(input, {
    ...init,
    headers,
  });

  // Не обрабатываем 401 - это публичный endpoint
  // Просто возвращаем ответ как есть
  return response;
}
