# Auth 2026 - Жёсткая фиксация источника токена

**Дата**: 2026-01-26  
**Статус**: ✅ Исправлено

## Проблема

Множественные источники Authorization header:
- Прямые `fetch()` с `Authorization: Bearer {token}`
- Разные способы получения токена (`token`, `access_token`)
- Конфликты между старым и новым API

## Решение

### ✅ Правило 2026

**ТОЛЬКО `authFetch` имеет право добавлять Authorization**

### ШАГ 1: Исправлен authFetch

**Файл**: `lib/api/authFetch.ts`

**Изменения**:
- ✅ Добавлен guard для токена (проверка на JWT формат)
- ✅ Добавляет Authorization ТОЛЬКО если токен валидный JWT (3 части разделенные точками)
- ✅ Если токен null/пустой/не JWT → НЕ добавляет Authorization
- ⚠️ Refresh token flow временно отключен (при 401 → logout)

**Код**:
```typescript
function isValidJWT(token: string | null): boolean {
  if (!token || typeof token !== "string") {
    return false;
  }
  const parts = token.split(".");
  return parts.length === 3;
}

export async function authFetch(input, init = {}) {
  const token = localStorage.getItem("access_token");
  const headers = new Headers(init.headers || {});

  // ✅ Guard: добавляем Authorization ТОЛЬКО если токен валидный JWT
  if (token && isValidJWT(token)) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  // ...
}
```

### ШАГ 2: Исправлен categoryApi.ts

**Файл**: `lib/api/categoryApi.ts`

**Изменения**:
- ❌ Убран параметр `token` из `fetchCategories()`
- ✅ Использует `authFetch` вместо прямого `fetch()`
- ✅ Автоматически добавляет Authorization если токен есть

**Было**:
```typescript
export async function fetchCategories(language: string, token?: string | null) {
  const headers = {
    'Authorization': `Bearer ${token}` // ❌ Прямой fetch
  };
  const response = await fetch(url, { headers });
}
```

**Стало**:
```typescript
export async function fetchCategories(language: string) {
  // ✅ Используем authFetch - он автоматически добавит Authorization
  const response = await authFetch(url, {
    method: 'GET',
    headers: { 'Accept-Language': language },
  });
}
```

### ШАГ 3: Обновлен CategoryContext

**Файл**: `contexts/CategoryContext.tsx`

**Изменения**:
- ❌ Убрана проверка токена вручную
- ✅ Вызов `fetchCategories()` без параметра токена

**Было**:
```typescript
const token = localStorage.getItem('token');
const data = await fetchCategories(language, token || null);
```

**Стало**:
```typescript
// ✅ fetchCategories теперь использует authFetch автоматически
const data = await fetchCategories(language);
```

### ШАГ 4: Проверен AuthAPI.me()

**Файл**: `lib/api/auth.ts`

**Статус**: ✅ Уже использует `authFetch`

```typescript
export async function me(): Promise<MeResponse> {
  const response = await authFetch("/api/auth/me");
  // ...
}
```

### ШАГ 5: Refresh Token Flow временно отключен

**Файл**: `lib/api/authFetch.ts`

**Изменения**:
- ❌ Убрана логика автоматического refresh при 401
- ✅ При 401 → очистка токенов и редирект на `/login`

**Причина**: Backend еще не готов (`POST /api/auth/refresh → 404`)

---

## Осталось исправить

Следующие файлы все еще используют прямой `fetch()` с Authorization:

### lib/api/
- [ ] `settings.ts` - использует прямой fetch с Authorization
- [ ] `ai-recipe.ts` - использует прямой fetch с Authorization
- [ ] `catalog.ts` - использует прямой fetch с Authorization
- [ ] `recipes-ai.api.ts` - использует прямой fetch с Authorization
- [ ] `upload.ts` - использует прямой fetch с Authorization
- [ ] `recipe.ts` - использует прямой fetch с Authorization
- [ ] `user.ts` - использует прямой fetch с Authorization

### contexts/
- [ ] `UserContext.tsx` - использует прямой fetch с Authorization
- [ ] `SessionContext.tsx` - использует прямой fetch с Authorization
- [ ] `RecipeContext.tsx` - использует прямой fetch с Authorization

### components/
- [ ] `AdminNavigation.tsx` - использует прямой fetch с Authorization
- [ ] `RecipesTab.tsx` - использует прямой fetch с Authorization
- [ ] И другие компоненты...

**TODO**: Заменить все на `authFetch()`

---

## Как проверить что всё исправлено

### ✅ Правильные логи

В Network tab должно быть:
- ✅ Authorization header только от `authFetch`
- ✅ Token length: ~260 символов (валидный JWT)
- ✅ `/api/auth/me` → 200
- ✅ `/api/catalog/ingredient-categories` → 200
- ✅ CategoryContext Loaded

### ❌ Неправильные логи (старые)

- ❌ Token length: 9 (невалидный)
- ❌ "token is malformed"
- ❌ Множественные Authorization headers

---

## Ключевой принцип

```
AuthContext = источник истины (user, token)
    ↓
authFetch = единственный транспорт (добавляет Authorization)
    ↓
Все API вызовы = через authFetch
```

**Любой другой fetch с Authorization = баг**
