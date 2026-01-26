# Auth 2026 Route Guard Implementation

**Дата**: 2026-01-26  
**Статус**: ✅ Реализовано

## Обзор

Реализована система защиты маршрутов (Route Guard) через компонент `RequireAuth`, который проверяет:
1. Авторизацию пользователя
2. Статус аккаунта (должен быть `active`)
3. Роль пользователя (если указаны разрешенные роли)

---

## Компонент RequireAuth

**Файл**: `components/auth/RequireAuth.tsx`

### Функциональность

- ✅ Проверяет наличие пользователя (через `AuthContext`)
- ✅ Проверяет статус аккаунта (`active`, `pending`, `suspended`, `blocked`)
- ✅ Проверяет роль пользователя (если указаны `allowRoles`)
- ✅ Автоматически редиректит на соответствующие страницы
- ✅ Показывает loader во время проверки

### Использование

```tsx
// Защита для админов
<RequireAuth allowRoles={["admin", "super_admin"]}>
  {children}
</RequireAuth>

// Защита для всех авторизованных
<RequireAuth>
  {children}
</RequireAuth>
```

### Логика редиректов

1. **Нет пользователя** → редирект на `/` (откроется auth modal)
2. **Статус не `active`** → редирект на `/account/status`
3. **Роль не разрешена** → редирект на маршрут по роли (`routeByRole`)

---

## Интеграция в Layouts

### Admin Layout

**Файл**: `app/admin/layout.tsx`

```tsx
<RequireAuth allowRoles={["admin", "super_admin"]}>
  <AdminNavigation />
  <main>{children}</main>
</RequireAuth>
```

**Защита**: Только `admin` и `super_admin` могут получить доступ.

### User Layout

**Файл**: `app/(user)/layout.tsx`

```tsx
<RequireAuth>
  <UserNavigation />
  <main>{children}</main>
</RequireAuth>
```

**Защита**: Все авторизованные пользователи (но RequireAuth в admin layout блокирует админов).

---

## Страница Account Status

**Файл**: `app/account/status/page.tsx`

### Функциональность

- ✅ Отображает статус аккаунта (`pending`, `suspended`, `blocked`)
- ✅ Показывает причину блокировки
- ✅ Предоставляет информацию о контакте с поддержкой
- ✅ Кнопка выхода из аккаунта

### UI

- Иконка статуса (Clock, Shield, Ban)
- Заголовок и описание
- Email пользователя
- Информация о том, что делать дальше
- Кнопка "Выйти из аккаунта"

---

## Refresh Token Flow

**Файл**: `lib/api/authFetch.ts`

### Функциональность

- ✅ Автоматически обновляет `access_token` при 401 ошибке
- ✅ Использует `refresh_token` для получения нового токена
- ✅ Повторяет оригинальный запрос с новым токеном
- ✅ Очищает токены и редиректит на `/login` при неудаче

### API Route

**Файл**: `app/api/auth/refresh/route.ts`

```tsx
POST /api/auth/refresh
Body: { refresh_token: string }
Response: { success, data: { access_token, refresh_token? } }
```

---

## Безопасность

### Защита от прямого доступа

- ✅ Любой пользователь не может открыть защищенный URL напрямую
- ✅ RequireAuth проверяет авторизацию перед рендерингом
- ✅ Автоматические редиректы на соответствующие страницы

### Проверки

1. **Авторизация**: Пользователь должен быть залогинен
2. **Статус**: Статус должен быть `active`
3. **Роль**: Роль должна быть в списке разрешенных (если указано)

---

## Тестирование

См. `docs/AUTH_2026_TESTING_CHECKLIST.md` для полного чеклиста тестирования.

### Быстрая проверка

1. Войти как `customer` → попробовать открыть `/admin/dashboard` → должен быть редирект на `/marketplace`
2. Войти как `admin` → попробовать открыть `/app/fridge` → должен быть редирект на `/admin/dashboard`
3. Войти как пользователь со статусом `suspended` → должен быть редирект на `/account/status`

---

## Известные ограничения

- ⏳ SessionContext все еще использует `/api/user/profile` (требует обновления)
- ⏳ `/chef/dashboard` пока редиректит на `/marketplace` (в будущем будет отдельный маршрут)

---

## Следующие шаги

1. ✅ Route Guard реализован
2. ✅ Refresh Token Flow реализован
3. ✅ Account Status Page создана
4. ⏳ Тестирование на реальном backend
5. ⏳ Обновление SessionContext (убрать `/api/user/profile`)
