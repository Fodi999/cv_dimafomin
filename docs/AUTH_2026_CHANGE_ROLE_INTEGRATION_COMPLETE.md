# Auth 2026: Изменение ролей - Интеграция завершена

**Дата:** 2026-01-26  
**Статус:** ✅ Frontend полностью интегрирован с backend

---

## ✅ Что реализовано

### 1. API Route (Next.js Proxy)
**Файл:** `app/api/admin/users/[id]/role/route.ts`

```typescript
PATCH /api/admin/users/{id}/role
Body: { "role": "customer" | "home_chef" | "chef_staff" | "admin" | "super_admin" }
```

**Что делает:**
- ✅ Проксирует запросы на backend `${BACKEND_URL}/api/admin/users/${id}/role`
- ✅ Проверяет права админа через `requireAdmin` middleware
- ✅ Валидирует роли Auth 2026
- ✅ Логирует действия через `logAdminAction`
- ✅ Обрабатывает ошибки (403 Forbidden, 404 Not Found)

---

### 2. Frontend Hooks
**Файл:** `hooks/useAdminUsers.ts`

**Обновленные типы:**
```typescript
export type UserRole = "customer" | "home_chef" | "chef_staff" | "admin" | "super_admin";
export type UserStatus = "pending" | "active" | "suspended" | "blocked";

export interface AdminUser {
  role: UserRole; // ✅ Auth 2026 роли
  status: UserStatus; // ✅ Auth 2026 статусы
  // ...
}
```

**Функция `changeRole`:**
```typescript
const changeRole = async (userId: string, newRole: UserRole): Promise<boolean> => {
  const { authFetch } = await import("@/lib/api/authFetch");
  
  const response = await authFetch(`/api/admin/users/${userId}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role: newRole }),
  });
  
  // ... обработка ответа
};
```

---

### 3. UI Components

#### UsersTable.tsx
**Файл:** `components/admin/users/UsersTable.tsx`

**Обновленные типы:**
```typescript
export type UserRole = "customer" | "home_chef" | "chef_staff" | "admin" | "super_admin";
export type UserStatus = "pending" | "active" | "suspended" | "blocked";

export interface User {
  role: UserRole;
  status: UserStatus;
  // ...
}
```

**Функция `getRoleBadge`:**
```typescript
const getRoleBadge = (role: string) => {
  const variants = {
    customer: { label: "👤 Customer", tooltip: "Покупатель (базовый доступ)" },
    home_chef: { label: "👨‍🍳 Home Chef", tooltip: "Домашний повар (кухня, AI)" },
    chef_staff: { label: "👔 Chef Staff", tooltip: "Персонал повара" },
    admin: { label: "🛡️ Admin", tooltip: "Администратор" },
    super_admin: { label: "👑 Super Admin", tooltip: "Владелец платформы" },
  };
  return variants[role as keyof typeof variants] || variants.customer;
};
```

#### UserEditModal.tsx
**Файл:** `components/admin/users/UserEditModal.tsx`

**Обновленный dropdown:**
```tsx
<Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
  <SelectContent>
    <SelectItem value="customer">👤 Customer (Покупатель)</SelectItem>
    <SelectItem value="home_chef">👨‍🍳 Home Chef (Домашній кухар)</SelectItem>
    <SelectItem value="chef_staff">👔 Chef Staff (Персонал кухаря)</SelectItem>
    <SelectItem value="admin">🛡️ Admin (Адміністратор)</SelectItem>
    <SelectItem value="super_admin">👑 Super Admin (Власник системи)</SelectItem>
  </SelectContent>
</Select>
```

#### AdminUsersPage
**Файл:** `app/admin/users/page.tsx`

**Убран маппинг ролей:**
```typescript
// ❌ БЫЛО: mapRoleToFrontend(), mapRoleToBackend()
// ✅ СТАЛО: Прямое использование ролей из backend

const selectedUser = {
  role: selectedUserDetails.role as UserRole, // ✅ Напрямую
  // ...
};
```

---

## 📋 API Specification

### Endpoint

```
PATCH /api/admin/users/{id}/role
```

### Authorization

```
Authorization: Bearer <token>
```

**Требования:**
- Валидный JWT токен
- Роль: `admin` или `super_admin` (в некоторых случаях только `super_admin`)
- Статус: `active`

### Request

```json
{
  "role": "home_chef"
}
```

**Доступные роли:**
- `customer` — покупатель
- `home_chef` — домашний повар
- `chef_staff` — персонал ресторана
- `admin` — администратор
- `super_admin` — владелец системы

### Response (200 OK)

```json
{
  "success": true,
  "message": "Role updated successfully",
  "user_id": "407582be-59d5-4d21-873b-1a72d31b0d42",
  "new_role": "home_chef"
}
```

### Error Responses

**400 Bad Request** — неправильная роль:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_ROLE",
    "message": "Invalid role. Must be one of: customer, home_chef, chef_staff, admin, super_admin"
  }
}
```

**403 Forbidden** — недостаточно прав:
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Only super_admin can change roles"
  }
}
```

**404 Not Found** — пользователь не найден:
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found"
  }
}
```

---

## 🔄 Процесс изменения роли

### 1. Пользователь открывает модальное окно редактирования
```
Admin Users Page → Клик "Edit" → UserEditModal открывается
```

### 2. Выбирает новую роль из dropdown
```
<Select> → Показывает 5 ролей Auth 2026
```

### 3. Нажимает "Save"
```
UserEditModal → onSave() → changeRole(userId, newRole)
```

### 4. Frontend отправляет запрос
```
authFetch() → PATCH /api/admin/users/{id}/role
Body: { "role": "home_chef" }
Authorization: Bearer <token>
```

### 5. Next.js API Route проксирует на backend
```
Next.js API Route → Backend: PATCH /api/admin/users/{id}/role
```

### 6. Backend обрабатывает запрос
```
Backend:
1. Проверяет JWT
2. Проверяет роль admin/super_admin
3. Валидирует новую роль
4. Обновляет роль в БД
5. Логирует в history_events
6. Возвращает успех
```

### 7. Frontend обновляет UI
```
changeRole() → success
Admin Users Page → refetchUsers()
Таблица обновляется с новой ролью
```

---

## 🧪 Тестирование

### Тест 1: Успешное изменение роли

1. Залогиньтесь как `super_admin`
2. Откройте Admin Users (http://localhost:3000/admin/users)
3. Найдите пользователя
4. Нажмите "Edit"
5. Выберите новую роль (например, `home_chef`)
6. Нажмите "Save"

**Ожидается:**
```
✅ Роль успешно обновлена
✅ Таблица обновилась
✅ Toast notification: "Роль успішно змінено"
```

### Тест 2: Валидация

1. Попробуйте отправить запрос с несуществующей ролью
2. Backend вернет 400 Bad Request
3. Frontend покажет ошибку: "Invalid role"

### Тест 3: Проверка прав

1. Залогиньтесь как `admin` (не super_admin)
2. Попробуйте изменить роль
3. Если backend требует `super_admin`, вернется 403 Forbidden
4. Frontend покажет: "Only super_admin can change roles"

---

## 📁 Файлы изменены

### API Routes
- ✅ `app/api/admin/users/[id]/role/route.ts` - полностью переписан для Auth 2026

### Hooks
- ✅ `hooks/useAdminUsers.ts` - обновлены типы `UserRole` и `UserStatus`

### Components
- ✅ `components/admin/users/UsersTable.tsx` - обновлены типы и `getRoleBadge()`
- ✅ `components/admin/users/UserEditModal.tsx` - обновлен dropdown с ролями
- ✅ `app/admin/users/page.tsx` - убран маппинг ролей

---

## 🔐 Безопасность

### Frontend
- ✅ Использует `authFetch` для автоматического добавления токена
- ✅ Обрабатывает 401 (автоматический logout и redirect)
- ✅ Обрабатывает 403 (показывает ошибку прав доступа)

### Backend (через Next.js proxy)
- ✅ `requireAdmin` middleware проверяет JWT и роль
- ✅ Валидация ролей (только 5 валидных ролей)
- ✅ Логирование всех изменений (`logAdminAction`)
- ✅ Проксирование на backend с токеном

### Backend (Go)
- ✅ `authMiddleware` - проверка JWT
- ✅ `adminMiddleware` - проверка роли admin/super_admin
- ✅ `superAdminMiddleware` - проверка super_admin (если требуется)
- ✅ Валидация роли в сервисе
- ✅ История изменений в `history_events`

---

## 📊 Логирование

### Frontend
```
✅ [Change Role] Admin: admin@example.com, Target user: 407582be...
📤 [Change Role] Backend request: PATCH .../api/admin/users/407582be.../role
📋 [Change Role] New role: home_chef
📥 [Change Role] Backend status: 200
✅ [Change Role] Success
```

### Backend
```
INFO  User role changed
  user_id=407582be-59d5-4d21-873b-1a72d31b0d42
  old_role=customer
  new_role=home_chef
  changed_by=admin-user-id
```

---

## ✅ Чеклист интеграции

### Backend
- [x] RESTful endpoint: `PATCH /api/admin/users/{id}/role`
- [x] Middleware: `authMiddleware`, `adminMiddleware`, `superAdminMiddleware`
- [x] Валидация ролей (все 5 ролей)
- [x] Проверка существования пользователя
- [x] История изменений в `history_events`
- [x] Логирование (zap logger)

### Frontend
- [x] API Route: проксирование на backend
- [x] Hooks: обновлены типы `UserRole` и `UserStatus`
- [x] UI Components: обновлены для Auth 2026 ролей
- [x] UserEditModal: dropdown с 5 ролями
- [x] UsersTable: отображение всех ролей
- [x] Использует `authFetch` для всех запросов
- [x] Обработка ошибок (403, 404, 400)

---

## 🚀 Результат

### До миграции
- ❌ Старые роли: `user`, `admin`, `premium`
- ❌ Mock данные в API route
- ❌ Маппинг ролей между frontend и backend
- ❌ Несоответствие типов

### После миграции
- ✅ Auth 2026 роли: `customer`, `home_chef`, `chef_staff`, `admin`, `super_admin`
- ✅ Проксирование на backend (реальные данные)
- ✅ Прямое использование ролей (без маппинга)
- ✅ Единообразие типов во всем приложении

---

## 📝 Следующие шаги

### Optional (рекомендуется)

1. **Добавить подтверждение для super_admin роли:**
   ```tsx
   {formData.role === "super_admin" && (
     <Alert variant="destructive">
       <AlertTitle>⚠️ Критическое действие</AlertTitle>
       <AlertDescription>
         Вы назначаете роль Super Admin. У пользователя будет полный доступ к системе.
       </AlertDescription>
     </Alert>
   )}
   ```

2. **Показывать историю изменений ролей:**
   ```
   GET /api/admin/users/{id}/history?type=role_changed
   → Показать список всех изменений
   ```

3. **Добавить фильтр по ролям в списке пользователей:**
   ```tsx
   <Select value={filters.role} onValueChange={(role) => setFilters({ ...filters, role })}>
     <SelectItem value="all">Все роли</SelectItem>
     <SelectItem value="customer">Customer</SelectItem>
     <SelectItem value="home_chef">Home Chef</SelectItem>
     {/* ... */}
   </Select>
   ```

---

**Статус:** ✅ Интеграция завершена  
**Версия:** Auth 2026 Final  
**Дата:** 2026-01-26
