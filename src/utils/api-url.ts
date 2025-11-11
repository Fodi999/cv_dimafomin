/**
 * Утилиты для работы с API URL
 * Предотвращает двойные /api и другие проблемы с путями
 */

/**
 * Нормализовать базовый URL API
 * Убирает двойные слэши и trailing slashes
 * 
 * @example
 * normalizeBaseUrl('http://localhost:8080/') → 'http://localhost:8080'
 * normalizeBaseUrl('http://localhost:8080') → 'http://localhost:8080'
 * normalizeBaseUrl('http://localhost:8080//') → 'http://localhost:8080'
 */
export function normalizeBaseUrl(url: string): string {
  if (!url) return '';
  
  // Убрать trailing slashes
  url = url.replace(/\/$/, '');
  
  // Убрать двойные слэши (кроме https://)
  url = url.replace(/([^:]\/)\/+/g, '$1');
  
  return url;
}

/**
 * Построить полный URL для API эндпоинта
 * Гарантирует отсутствие двойных /api
 * 
 * @example
 * buildApiUrl('http://localhost:8080', '/api/login') → 'http://localhost:8080/api/login'
 * buildApiUrl('http://localhost:8080', 'api/login') → 'http://localhost:8080/api/login'
 * buildApiUrl('http://localhost:8080/', '/api/login') → 'http://localhost:8080/api/login'
 */
export function buildApiUrl(baseUrl: string, endpoint: string): string {
  // Нормализовать базовый URL
  const normalized = normalizeBaseUrl(baseUrl);
  
  // Убрать leading slash из эндпоинта если нужно
  let path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Если path уже начинается с /api, не добавляем ещё один
  // Это для обратной совместимости с полными путями
  if (path.startsWith('/api/')) {
    return `${normalized}${path}`;
  }
  
  // Если path не начинается с /api, добавляем
  if (!path.startsWith('/api')) {
    path = `/api${path}`;
  }
  
  return `${normalized}${path}`;
}

/**
 * Получить нормализованный базовый URL API
 * Использует NEXT_PUBLIC_API_BASE из .env
 */
export function getApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';
  return normalizeBaseUrl(baseUrl);
}

/**
 * Получить полный URL для эндпоинта
 * 
 * @example
 * getApiUrl('/login') → 'http://localhost:8080/api/login'
 * getApiUrl('users/123') → 'http://localhost:8080/api/users/123'
 */
export function getApiUrl(endpoint: string): string {
  const baseUrl = getApiBaseUrl();
  return buildApiUrl(baseUrl, endpoint);
}

// Unit tests (можно использовать для отладки)
export function runTests() {
  console.log('=== API URL Tests ===');
  
  const tests = [
    {
      input: { baseUrl: 'http://localhost:8080', endpoint: '/login' },
      expected: 'http://localhost:8080/api/login'
    },
    {
      input: { baseUrl: 'http://localhost:8080/', endpoint: 'login' },
      expected: 'http://localhost:8080/api/login'
    },
    {
      input: { baseUrl: 'http://localhost:8080', endpoint: '/api/login' },
      expected: 'http://localhost:8080/api/login'
    },
    {
      input: { baseUrl: 'https://api.example.com/', endpoint: '/auth/login' },
      expected: 'https://api.example.com/api/auth/login'
    },
  ];
  
  let passed = 0;
  let failed = 0;
  
  tests.forEach(test => {
    const result = buildApiUrl(test.input.baseUrl, test.input.endpoint);
    const success = result === test.expected;
    
    if (success) {
      passed++;
      console.log(`✅ ${result}`);
    } else {
      failed++;
      console.error(`❌ Expected: ${test.expected}`);
      console.error(`   Got:      ${result}`);
    }
  });
  
  console.log(`\nResults: ${passed} passed, ${failed} failed`);
}
