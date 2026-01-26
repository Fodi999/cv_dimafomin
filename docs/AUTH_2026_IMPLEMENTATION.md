# Auth 2026 Implementation

**Дата**: 2026-01-26  
**Статус**: ✅ Реализовано

## Обзор

Переработана система аутентификации согласно требованиям 2026:
- Единый API wrapper с токеном (`authFetch`)
- Новый Auth API client (`lib/api/auth.ts`)
- Упрощенный AuthContext с поддержкой нового API
- Логика редиректов по роли и статусу
- Убраны все обращения к `/customer/profile`

---

## Структура

### 1. Auth Fetch Wrapper
**Файл**: `lib/api/authFetch.ts`

Единый wrapper для API запросов с токеном:
```typescript
export async function authFetch(input: RequestInfo, init: RequestInit = {})
```

Использует `access_token` из localStorage и добавляет `Authorization: Bearer {token}` header.

---

### 2. Auth API Client
**Файл**: `lib/api/auth.ts`

Контракт API 2026:
- `POST /api/auth/login` → `{ success, data: { access_token, refresh_token, user? } }`
- `POST /api/auth/register` → `{ success, data?: { id, email }, message? }`
- `GET /api/auth/me` → `{ success, data: { id, email, role, status } }`
- `POST /api/auth/logout` → очистка токенов

Все функции используют Next.js API routes (`/api/auth/*`), которые проксируют к backend.

---

### 3. AuthContext
**Файл**: `contexts/AuthContext.tsx`

Новый упрощенный AuthContext:

**Состояние**:
- `user: User | null` - текущий пользователь
- `loading: boolean` - загрузка
- `signIn(email, password)` - вход, возвращает redirect URL
- `signUp(email, password, name?)` - регистрация, возвращает redirect URL или `null` (если нужна верификация email)
- `signOut()` - выход

**Legacy compatibility**:
- `login()` - алиас для `signIn`
- `register()` - алиас для `signUp`
- `logout()` - алиас для `signOut`
- `token`, `role`, `isAuthenticated` - для обратной совместимости

**Инициализация**:
- При монтировании загружает пользователя через `/api/auth/me`
- Сохраняет токены в localStorage (`access_token`, `refresh_token`)
- Также сохраняет в cookies для middleware

---

### 4. Route by Role
**Файл**: `lib/auth/routeByRole.ts`

Логика редиректов:

```typescript
routeByRole(role: UserRole): string
// super_admin | admin → /admin/dashboard
// home_chef | chef_staff → /chef/dashboard (пока /marketplace)
// customer → /marketplace

routeByStatus(status: UserStatus): string | null
// active → null (нет редиректа)
// pending | suspended | blocked → /account/status
```

---

### 5. Login Flow

**AuthModal** (`components/auth/AuthModal.tsx`):
1. Вызывает `signIn(email, password)`
2. Получает redirect URL
3. Редиректит на URL (или вызывает `onSuccess` callback)

**После логина**:
1. Сохраняются токены (`access_token`, `refresh_token`)
2. Загружается пользователь
3. Проверяется статус → если не `active`, редирект на `/account/status`
4. Проверяется роль → редирект на соответствующий маршрут

---

### 6. Registration Flow

**Сценарий A** (Email verification):
- `signUp()` возвращает `null`
- Показывается сообщение "Проверь email"
- Редирект на `/login`

**Сценарий B** (Auto-login):
- `signUp()` возвращает redirect URL
- Автоматический вход
- Редирект на соответствующий маршрут

---

## Миграция

### Что изменилось:

1. **API**:
   - ❌ Старый: `authApi.login()`, `authApi.register()`
   - ✅ Новый: `login()`, `register()`, `me()`, `logout()` из `lib/api/auth.ts`

2. **AuthContext**:
   - ❌ Старый: `login()`, `register()` с внутренней логикой
   - ✅ Новый: `signIn()`, `signUp()`, `signOut()` с упрощенной логикой

3. **Токены**:
   - ❌ Старый: `token` в localStorage
   - ✅ Новый: `access_token` и `refresh_token` в localStorage

4. **Редиректы**:
   - ❌ Старый: `/customer/profile` или `/profile`
   - ✅ Новый: `/admin/dashboard`, `/marketplace`, `/account/status` (по роли/статусу)

### Обратная совместимость:

Все старые методы доступны как алиасы:
- `login()` → `signIn()`
- `register()` → `signUp()`
- `logout()` → `signOut()`

---

## Проверка

✅ AuthProvider подключен в `app/layout.tsx`  
✅ AuthModal использует `signIn` и `signUp`  
✅ Все компоненты используют `logout` (алиас работает)  
✅ Нет обращений к `/customer/profile`  
✅ Редиректы работают по роли и статусу  

---

## Обновления UserContext

**UserContext** (`contexts/UserContext.tsx`):
- ✅ Убраны вызовы `/api/user/profile`
- ✅ Использует данные из `AuthContext.user` для базовых полей (id, email, role)
- ✅ Расширенные данные (name, avatar, level, xp, chefTokens) загружаются из localStorage cache
- ✅ Обратная совместимость сохранена - все компоненты продолжают работать

**SessionContext** (`contexts/SessionContext.tsx`):
- ⚠️ Все еще требует обновления (использует `/api/user/profile`)
- TODO: Переработать аналогично UserContext

## Route Guard (ШАГ 1)

**Реализовано**: ✅

### RequireAuth Component
- **Файл**: `components/auth/RequireAuth.tsx`
- Проверяет авторизацию, статус и роль
- Автоматически редиректит на соответствующие страницы

### Интеграция
- ✅ `app/admin/layout.tsx` - защита для `admin` и `super_admin`
- ✅ `app/(user)/layout.tsx` - защита для всех авторизованных

### Account Status Page
- **Файл**: `app/account/status/page.tsx`
- Отображает статус для `pending`, `suspended`, `blocked`
- Минимальный UI с информацией и кнопкой выхода

## Refresh Token Flow (ШАГ 2)

**Реализовано**: ✅

### authFetch Enhancement
- **Файл**: `lib/api/authFetch.ts`
- Автоматически обновляет `access_token` при 401 ошибке
- Использует `refresh_token` для получения нового токена
- Повторяет оригинальный запрос с новым токеном

### API Route
- **Файл**: `app/api/auth/refresh/route.ts`
- `POST /api/auth/refresh` - обновление токена

## Тестирование (ШАГ 4)

**Чеклист**: `docs/AUTH_2026_TESTING_CHECKLIST.md`

Полный чеклист для тестирования всех сценариев:
- Customer flow
- Home Chef flow
- Admin flow
- Status flow
- Refresh Token flow
- Edge cases

## Следующие шаги

1. ✅ Route Guard реализован
2. ✅ Refresh Token Flow реализован
3. ✅ Account Status Page создана
4. ✅ Чеклист тестирования готов
5. ⏳ Тестирование на реальном backend
6. ⏳ Обновление SessionContext (убрать `/api/user/profile`)
