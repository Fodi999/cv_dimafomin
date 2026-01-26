# Публичные vs Авторизованные Endpoint'ы - Правила 2026

**Дата:** 2026-01-26  
**Проблема:** Смешивание публичных и авторизованных endpoint'ов приводит к ненужным ошибкам 401 и очистке токенов

---

## Проблема

При загрузке страницы без токена (неавторизованный пользователь):
1. `CategoryContext` пытается загрузить категории
2. Используется `authFetch` для публичного endpoint'а
3. Backend возвращает 401
4. `authFetch` воспринимает это как ошибку авторизации
5. Очищает несуществующие токены
6. Показывает ошибки в логах

```
[authFetch] ℹ️ No valid token found, request will be unauthenticated
GET http://localhost:3000/api/catalog/ingredient-categories 401 (Unauthorized)
[authFetch] ⚠️ Got 401 - token expired or invalid
[token-utils] ✅ All tokens cleared
```

---

## Решение 2026

### Правило: Два типа fetch

1. **`authFetch`** — для авторизованных запросов
   - Добавляет `Authorization: Bearer {token}`
   - Очищает токены при 401
   - Редиректит на /login при 401
   - Используется для: профиль, холодильник, рецепты пользователя

2. **`publicFetch`** — для публичных запросов
   - НЕ добавляет Authorization header
   - НЕ очищает токены при 401
   - НЕ редиректит на /login
   - Используется для: категории, поиск, публичные рецепты

---

## Реализация

### 1. `publicFetch` (новый)

```typescript
// lib/api/publicFetch.ts
/**
 * Public Fetch - для публичных endpoint'ов без обязательной авторизации
 */
export async function publicFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(init.headers || {});
  
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  console.log(`[publicFetch] 🌐 Public request: ${input}`);

  const response = await fetch(input, {
    ...init,
    headers,
  });

  // Не обрабатываем 401 - это публичный endpoint
  return response;
}
```

### 2. `authFetch` (обновлен)

```typescript
// lib/api/authFetch.ts
export async function authFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const token = getAccessToken();

  const headers = new Headers(init.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
    console.log(`[authFetch] ✅ Valid JWT token found`);
  }
  // Если токена нет - это нормально для неавторизованных пользователей
  // Не логируем это как проблему

  const response = await fetch(input, {
    ...init,
    headers,
  });

  // При 401 - очистка токенов и редирект
  if (response.status === 401) {
    clearTokens();
    if (!isPublicRoute()) {
      window.location.href = "/login";
    }
  }

  return response;
}
```

---

## Когда использовать что

### ✅ Используй `publicFetch`:

- **Категории ингредиентов** (`/api/catalog/ingredient-categories`)
- **Поиск продуктов** (`/api/catalog/search`)
- **Публичные рецепты** (`/api/recipes/public`)
- **Статистика** (`/api/stats/public`)
- **Health check** (`/api/health`)

### ✅ Используй `authFetch`:

- **Профиль пользователя** (`/api/user/profile`)
- **Холодильник** (`/api/fridge`)
- **Мои рецепты** (`/api/user/recipes`)
- **Уведомления** (`/api/notifications`)
- **Настройки** (`/api/user/settings`)

---

## Пример: Категории

### ❌ Было (неправильно):

```typescript
// lib/api/categoryApi.ts
import { authFetch } from "./authFetch";

export async function fetchCategories(language: string) {
  const response = await authFetch('/api/catalog/ingredient-categories', {
    headers: { 'Accept-Language': language }
  });
  // ...
}
```

**Проблема:**
- При загрузке страницы без токена → 401
- `authFetch` очищает несуществующие токены
- Редиректит на /login (для публичной страницы!)

### ✅ Стало (правильно):

```typescript
// lib/api/categoryApi.ts
import { publicFetch } from "./publicFetch";

export async function fetchCategories(language: string) {
  const response = await publicFetch('/api/catalog/ingredient-categories', {
    headers: { 'Accept-Language': language }
  });
  
  if (!response.ok) {
    console.warn(`Failed with ${response.status} - using fallback`);
    return getFallbackCategories(language);
  }
  // ...
}
```

**Решение:**
- При загрузке без токена → fallback categories
- Нет ненужных ошибок 401
- Нет очистки токенов
- Нет редиректов

---

## Next.js API Routes

### Публичный endpoint (skipAuth: true):

```typescript
// app/api/catalog/ingredient-categories/route.ts
export async function GET(req: NextRequest) {
  return proxyToBackend(req, {
    endpoint: '/api/catalog/ingredient-categories',
    method: 'GET',
    skipAuth: true // ✅ Публичный endpoint
  });
}
```

**Клиент:**
```typescript
const response = await publicFetch('/api/catalog/ingredient-categories');
```

### Авторизованный endpoint (skipAuth: false):

```typescript
// app/api/fridge/route.ts
export async function GET(req: NextRequest) {
  return proxyToBackend(req, {
    endpoint: '/api/fridge',
    method: 'GET',
    skipAuth: false // ✅ Требует авторизацию
  });
}
```

**Клиент:**
```typescript
const response = await authFetch('/api/fridge');
```

---

## Чеклист миграции

Для каждого API клиента:

- [ ] Определить, публичный endpoint или авторизованный
- [ ] Использовать правильную fetch функцию
- [ ] Обработать ошибки правильно (fallback для публичных)
- [ ] Убрать лишние проверки токенов для публичных endpoint'ов
- [ ] Обновить Next.js API route (skipAuth: true/false)

---

## Результат после исправления

### До:

```
[authFetch] ℹ️ No valid token found, request will be unauthenticated
GET http://localhost:3000/api/catalog/ingredient-categories 401
[authFetch] ⚠️ Got 401 - token expired or invalid
[token-utils] ✅ All tokens cleared
[categoryApi] 401 - using fallback categories
```

### После:

```
[publicFetch] 🌐 Public request: /api/catalog/ingredient-categories
[CategoryContext] ✅ Loaded 10 categories for language: pl
```

---

## Важные замечания

1. **Fallback стратегия**: Публичные endpoint'ы должны иметь fallback данные
2. **Не смешивай**: Один endpoint = один тип fetch
3. **Backend настройка**: Убедись, что backend правильно настроен (публичный/приватный)
4. **Логирование**: Используй разные логи для публичных и приватных запросов

---

**Статус:** ✅ Исправлено  
**Файлы:**
- `lib/api/publicFetch.ts` (создан)
- `lib/api/categoryApi.ts` (обновлен)
- `lib/api/authFetch.ts` (обновлен)
- `contexts/CategoryContext.tsx` (обновлен)
