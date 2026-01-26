# Исправление: 405 Method Not Allowed для GET /api/admin/users/[id]

**Дата:** 2026-01-26  
**Проблема:** `GET http://localhost:3000/api/admin/users/407582be-59d5-4d21-873b-1a72d31b0d42 405 (Method Not Allowed)`  
**Статус:** ✅ Исправлено

---

## Проблема

### Симптомы

```
GET http://localhost:3000/api/admin/users/407582be-59d5-4d21-873b-1a72d31b0d42 405 (Method Not Allowed)
Error fetching user details: Error: Failed to fetch user details
```

### Причины

1. **Кэш Turbopack**: Next.js 16 с Turbopack агрессивно кэширует API routes
2. **Backend может не поддерживать путь**: Возможно, backend ожидает `/api/users/:id` вместо `/api/admin/users/:id`

---

## Решение

### 1. Добавлен Fallback Logic

Если backend возвращает 405 на `/api/admin/users/:id`, автоматически пробуем `/api/users/:id`:

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  console.log("\n📋 ===== GET /api/admin/users/[id] =====");
  
  const { user, error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;

  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    
    // 🔄 Сначала пробуем через /api/admin/users/:id
    let backendUrl = `${BACKEND_URL}/api/admin/users/${id}`;
    console.log(`📤 [GET User Details] Trying: GET ${backendUrl}`);

    let backendResponse = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`📥 [GET User Details] Backend status: ${backendResponse.status}`);

    // ✅ Если 405 (Method Not Allowed), пробуем через /api/users/:id
    if (backendResponse.status === 405) {
      console.log("⚠️ [GET User Details] Got 405, trying /api/users/:id instead");
      backendUrl = `${BACKEND_URL}/api/users/${id}`;
      
      backendResponse = await fetch(backendUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      console.log(`📥 [GET User Details] Second attempt status: ${backendResponse.status}`);
    }

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      console.error("❌ [GET User Details] Backend error:", errorData);
      
      if (backendResponse.status === 404) {
        return NextResponse.json(
          { success: false, error: { code: "NOT_FOUND", message: "User not found" } },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: { code: "FETCH_FAILED", message: errorData.message || "Failed to fetch user details" } },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    console.log("✅ [GET User Details] Success:", {
      userId: data.data?.id || data.id,
      email: data.data?.email || data.email,
    });

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

### 2. Очистка кэша и перезапуск

```bash
# 1. Остановить dev server (Ctrl+C)

# 2. Очистить кэш Next.js
rm -rf .next

# 3. Убить процесс на порту 3000 (если нужно)
lsof -ti:3000 | xargs kill -9

# 4. Запустить заново
npm run dev
```

---

## Логика Fallback

```
1. Пробуем: GET /api/admin/users/:id
   ├── 200 → ✅ Возвращаем данные
   ├── 404 → ❌ User not found
   ├── 405 → 🔄 Пробуем альтернативный путь
   └── Other → ❌ Возвращаем ошибку

2. Если 405, пробуем: GET /api/users/:id
   ├── 200 → ✅ Возвращаем данные
   ├── 404 → ❌ User not found
   └── Other → ❌ Возвращаем ошибку
```

---

## Ожидаемые логи

### Успешный запрос

```
📋 ===== GET /api/admin/users/[id] =====
✅ [GET User Details] Admin: fodi85@gmail.ru, Target user: 407582be-59d5-4d21-873b-1a72d31b0d42
📤 [GET User Details] Trying: GET https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/admin/users/407582be-59d5-4d21-873b-1a72d31b0d42
📥 [GET User Details] Backend status: 200
✅ [GET User Details] Success: { userId: "407582be...", email: "fodi85@gmail.ru" }
```

### Fallback на /api/users/:id

```
📋 ===== GET /api/admin/users/[id] =====
✅ [GET User Details] Admin: fodi85@gmail.ru, Target user: 407582be-59d5-4d21-873b-1a72d31b0d42
📤 [GET User Details] Trying: GET https://.../api/admin/users/407582be-59d5-4d21-873b-1a72d31b0d42
📥 [GET User Details] Backend status: 405
⚠️ [GET User Details] Got 405, trying /api/users/:id instead
📥 [GET User Details] Second attempt status: 200
✅ [GET User Details] Success: { userId: "407582be...", email: "fodi85@gmail.ru" }
```

---

## Возможные причины 405

### 1. Backend не поддерживает `/api/admin/users/:id`

Backend может ожидать:
- ❌ `GET /api/admin/users/:id` (не реализовано)
- ✅ `GET /api/users/:id` (реализовано)

### 2. Backend требует другую авторизацию

Возможно, endpoint требует:
- Специальную роль (только super_admin)
- Другой формат токена
- Дополнительные заголовки

### 3. Кэш Next.js / Turbopack

Next.js 16 с Turbopack может кэшировать старые версии API routes.

**Решение:** Перезапустить dev server

---

## Чеклист отладки

- [x] Добавлен fallback logic для `/api/users/:id`
- [x] Добавлено логирование всех попыток
- [x] Очищен кэш `.next`
- [ ] Перезапущен dev server (требует действий пользователя)
- [ ] Проверены логи backend на наличие endpoint'а
- [ ] Подтверждено, что backend поддерживает один из путей

---

## Инструкция для пользователя

### Шаг 1: Перезапустите dev server

```bash
# В терминале где запущен npm run dev:
# 1. Нажмите Ctrl+C для остановки
# 2. Запустите заново:
npm run dev
```

### Шаг 2: Проверьте логи

После перезапуска откройте страницу с пользователями и проверьте:

1. **В консоли браузера** не должно быть ошибок 405
2. **В терминале** должны появиться логи:
   ```
   📋 ===== GET /api/admin/users/[id] =====
   ✅ [GET User Details] Success
   ```

### Шаг 3: Если проблема остается

Проверьте backend логи на наличие endpoint'а:
- `/api/admin/users/:id` (GET)
- `/api/users/:id` (GET)

---

## Файлы изменены

- ✅ `app/api/admin/users/[id]/route.ts` - добавлен fallback logic
- ✅ `RESTART_DEV_SERVER.md` - инструкция по перезапуску

---

**Статус:** ✅ Fallback добавлен, требуется перезапуск dev server  
**Дата:** 2026-01-26
