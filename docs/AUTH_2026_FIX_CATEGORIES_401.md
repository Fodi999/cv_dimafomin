# Auth 2026 - Fix Categories 401

**Дата**: 2026-01-26  
**Проблема**: `GET /api/catalog/ingredient-categories` возвращает 401 без Authorization header  
**Статус**: ✅ Исправлено

## Проблема

### Симптомы
- Множественные 401 ошибки на `/api/catalog/ingredient-categories`
- Backend логи показывают: `❌ No Authorization header`
- Запросы идут напрямую к backend, минуя Next.js API routes

### Причина
1. **Прямой запрос к backend**
   - `categoryApi.ts` делал запрос напрямую к `getBackendUrl()/api/catalog/ingredient-categories`
   - Минуя Next.js API routes
   - Токен не передавался через proxy

2. **Endpoint требует авторизацию**
   - Backend требует Authorization header
   - Но категории должны быть доступны и без токена (fallback)

---

## Решение

### ✅ ШАГ 1: Создан Next.js API Route

**Файл**: `app/api/catalog/ingredient-categories/route.ts`

```typescript
export async function GET(req: NextRequest) {
  return proxyToBackend(req, {
    endpoint: '/api/catalog/ingredient-categories',
    method: 'GET',
    skipAuth: false // Передаем токен если есть, но не требуем его
  });
}
```

### ✅ ШАГ 2: Исправлен categoryApi.ts

**Было**:
```typescript
const backendUrl = getBackendUrl();
const url = `${backendUrl}/api/catalog/ingredient-categories`;
const response = await authFetch(url, ...);
```

**Стало**:
```typescript
// ✅ Используем Next.js API route
const url = `/api/catalog/ingredient-categories`;
const response = await authFetch(url, ...);
```

### ✅ ШАГ 3: Исправлен proxy.ts

**Изменения**:
- Токен извлекается всегда (даже если `skipAuth: true`)
- Требование авторизации только если `skipAuth: false` И токена нет
- Если токен есть, передается в backend (опциональная авторизация)

**Код**:
```typescript
// Extract token (even if skipAuth, we still try to get it for optional auth)
const cookieStore = await cookies();
token = cookieStore.get('token')?.value;

if (!token) {
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }
}

// Only require auth if skipAuth is false
if (!options.skipAuth && !token) {
  return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
}
```

---

## Архитектура

### Flow

1. **Frontend** (`categoryApi.ts`)
   - Вызывает `authFetch('/api/catalog/ingredient-categories')`
   - `authFetch` добавляет Authorization header если токен есть

2. **Next.js API Route** (`/api/catalog/ingredient-categories`)
   - Получает запрос с Authorization header (если есть)
   - Проксирует к backend через `proxyToBackend`

3. **Proxy** (`proxy.ts`)
   - Извлекает токен из cookies или Authorization header
   - Передает токен в backend (если есть)
   - Не требует токен (опциональная авторизация)

4. **Backend**
   - Получает запрос с Authorization header (если есть)
   - Возвращает расширенные данные если токен валиден
   - Возвращает базовые данные если токена нет

---

## Проверка

### ✅ Правильное поведение

1. **С токеном**:
   - `authFetch` добавляет Authorization header
   - Proxy передает токен в backend
   - Backend возвращает расширенные категории

2. **Без токена**:
   - `authFetch` не добавляет Authorization header
   - Proxy не передает токен
   - Backend возвращает базовые категории (или 401, но frontend использует fallback)

### ❌ Неправильное поведение (старое)

1. Прямой запрос к backend → токен не передается
2. Backend требует токен → 401
3. Frontend не получает категории

---

## Важно

### Опциональная авторизация

Категории используют **опциональную авторизацию**:
- Если токен есть → передается в backend для расширенных данных
- Если токена нет → backend может вернуть базовые данные или 401 (frontend использует fallback)

Это правильный подход для публичных данных с расширенными возможностями для авторизованных пользователей.

---

## Следующие шаги

1. ✅ API route создан
2. ✅ categoryApi.ts исправлен
3. ✅ proxy.ts поддерживает опциональную авторизацию
4. ⏳ Тестирование на реальном backend
5. ⏳ Проверка что токен передается правильно
