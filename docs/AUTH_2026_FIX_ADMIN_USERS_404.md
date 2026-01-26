# Исправление: GET /api/admin/users/[id] 404 Error

**Дата:** 2026-01-26  
**Проблема:** `GET http://localhost:3000/api/admin/users/407582be-59d5-4d21-873b-1a72d31b0d42 404 (Not Found)`  
**Статус:** ✅ Исправлено

---

## Проблема

### Симптомы

```
useAdminUsers.ts:215  GET http://localhost:3000/api/admin/users/407582be-59d5-4d21-873b-1a72d31b0d42 404 (Not Found)
Error fetching user details: Error: Failed to fetch user details
```

### Причина

API route `/app/api/admin/users/[id]/route.ts` использовал mock данные с ID вида `usr_1`, `usr_2`, но фронтенд запрашивал реальные UUID пользователей из базы данных.

```typescript
// ❌ БЫЛО: Mock данные
const mockUserDetails: Record<string, any> = {
  usr_1: { id: "usr_1", name: "Олександр", ... },
  usr_2: { id: "usr_2", name: "Марія", ... },
};

export async function GET(request, { params }) {
  const { id } = await params;
  const userDetails = mockUserDetails[id]; // ❌ Реальный UUID не найден
  
  if (!userDetails) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }
}
```

### Дополнительная проблема

Фронтенд (`hooks/useAdminUsers.ts`) использовал прямой `fetch` с токеном из `localStorage` вместо `authFetch`.

```typescript
// ❌ БЫЛО
const token = localStorage.getItem('token');
const response = await fetch(`/api/admin/users/${userId}`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
```

---

## Решение

### 1. API Route: Проксирование на Backend

Заменил mock данные на проксирование запросов к backend:

```typescript
// ✅ СТАЛО: Проксирование на backend
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  console.log("\n📋 ===== GET /api/admin/users/[id] =====");
  
  const { user, error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  console.log(`✅ [GET User Details] Admin: ${user!.email}, Target user: ${id}`);

  try {
    // ✅ Проксируем на backend
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const backendUrl = `${BACKEND_URL}/api/admin/users/${id}`;
    
    const backendResponse = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!backendResponse.ok) {
      if (backendResponse.status === 404) {
        return NextResponse.json(
          { success: false, error: { code: "NOT_FOUND", message: "User not found" } },
          { status: 404 }
        );
      }
      // ... обработка других ошибок
    }

    const data = await backendResponse.json();
    
    // ✅ Возвращаем данные в правильном формате
    return NextResponse.json({
      success: true,
      data: data.data || data,
    });
  } catch (error) {
    console.error("[GET User Details] Error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to fetch user details" } },
      { status: 500 }
    );
  }
}
```

### 2. Frontend: Использование authFetch

Заменил все прямые вызовы `fetch` в `hooks/useAdminUsers.ts` на `authFetch`:

#### useAdminUserDetails

```typescript
// ✅ СТАЛО
const fetchUserDetails = async () => {
  setIsLoading(true);
  try {
    // ✅ 2026: Використовуємо authFetch
    const { authFetch } = await import("@/lib/api/authFetch");
    
    const response = await authFetch(`/api/admin/users/${userId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch user details");
    }

    const responseData = await response.json();
    const userData = responseData.data || responseData;
    setUser(userData);
  } catch (error) {
    console.error("Error fetching user details:", error);
    toast.error("Помилка завантаження деталей користувача");
  } finally {
    setIsLoading(false);
  }
};
```

#### useAdminUsers (список пользователей)

```typescript
// ✅ СТАЛО
const url = `/api/admin/users?${queryString}`;
console.log("🔍 [useAdminUsers] Fetching:", url);

const { authFetch } = await import("@/lib/api/authFetch");
const response = await authFetch(url);
```

#### useAdminUserActions (изменение роли)

```typescript
// ✅ СТАЛО
const changeRole = async (userId: string, newRole: AdminUser["role"]): Promise<boolean> => {
  try {
    const { authFetch } = await import("@/lib/api/authFetch");
    
    const response = await authFetch(`/api/admin/users/${userId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role: newRole }),
    });
    
    // ...
  }
};
```

#### useAdminUserActions (изменение статуса)

```typescript
// ✅ СТАЛО
const changeStatus = async (
  userId: string,
  newStatus: AdminUser["status"],
  reason?: string
): Promise<boolean> => {
  try {
    const { authFetch } = await import("@/lib/api/authFetch");
    
    const response = await authFetch(`/api/admin/users/${userId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus, reason }),
    });
    
    // ...
  }
};
```

#### useAdminDeleteUser (удаление пользователя)

```typescript
// ✅ СТАЛО
export function useAdminDeleteUser() {
  const deleteUser = async (userId: string): Promise<boolean> => {
    try {
      console.log(`🗑️ [Delete User] Attempting to delete user: ${userId}`);

      const { authFetch } = await import("@/lib/api/authFetch");
      
      const response = await authFetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      
      // ...
    }
  };
}
```

#### useAdminUsersStats (статистика)

```typescript
// ✅ СТАЛО
try {
  console.log("🔍 [useAdminUsersStats] Fetching stats...");
  
  const { authFetch } = await import("@/lib/api/authFetch");
  const response = await authFetch("/api/admin/users/stats");
  
  // ...
}
```

---

## Преимущества authFetch

### 1. Централизованное управление токенами

```typescript
// ✅ authFetch автоматически:
// - Получает токен из token-utils (с валидацией)
// - Добавляет Authorization header
// - Обрабатывает 401 ошибки
// - Перенаправляет на /login при необходимости
```

### 2. Валидация токена

```typescript
// ✅ authFetch проверяет:
// - Токен существует
// - Токен не равен "undefined" или "null" (string)
// - Токен имеет правильный JWT формат
// - Токен имеет достаточную длину
```

### 3. Обработка ошибок

```typescript
// ✅ authFetch автоматически:
// - Логирует 401 ошибки
// - Очищает токены при 401
// - Не перенаправляет на публичных страницах
// - Перенаправляет на /login только с приватных страниц
```

---

## Проверка

### До исправления

```
❌ GET http://localhost:3000/api/admin/users/407582be-59d5-4d21-873b-1a72d31b0d42 404 (Not Found)
❌ Error fetching user details: Error: Failed to fetch user details
```

### После исправления

```
✅ [GET User Details] Admin: fodi85@gmail.ru, Target user: 407582be-59d5-4d21-873b-1a72d31b0d42
✅ [authFetch] Valid JWT token found (length: 248)
✅ [GET User Details] Backend status: 200
✅ [GET User Details] Success: { userId: "407582be...", email: "user@example.com" }
```

---

## Файлы изменены

- ✅ `app/api/admin/users/[id]/route.ts` - заменил mock на проксирование
- ✅ `hooks/useAdminUsers.ts` - заменил все `fetch` на `authFetch`

---

## Чеклист миграции на authFetch

- [x] `useAdminUserDetails` - GET `/api/admin/users/[id]`
- [x] `useAdminUsers` - GET `/api/admin/users?...`
- [x] `changeRole` - PATCH `/api/admin/users/[id]/role`
- [x] `changeStatus` - PATCH `/api/admin/users/[id]/status`
- [x] `deleteUser` - DELETE `/api/admin/users/[id]`
- [x] `useAdminUsersStats` - GET `/api/admin/users/stats`

---

## Правило 2026

```
❌ НЕ использовать:
const token = localStorage.getItem('token');
const response = await fetch(url, {
  headers: { 'Authorization': `Bearer ${token}` }
});

✅ ИСПОЛЬЗОВАТЬ:
const { authFetch } = await import("@/lib/api/authFetch");
const response = await authFetch(url);
```

**Причины:**
1. Централизованное управление токенами
2. Автоматическая валидация
3. Обработка 401 ошибок
4. Единообразие кода
5. Соответствие Auth 2026 архитектуре

---

**Статус:** ✅ Исправлено и задеплоено  
**Дата:** 2026-01-26
