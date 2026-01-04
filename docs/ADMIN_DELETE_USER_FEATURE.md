# 🗑️ User Delete Feature - Complete Implementation

## ✅ Реализовано

### 1. Backend Endpoint
**File:** `app/api/admin/users/[id]/route.ts`

```typescript
DELETE /api/admin/users/{id}
```

**Защита:**
- ✅ JWT Authentication (`requireAdmin`)
- ✅ **Только super_admin** может удалять пользователей
- ✅ Обычные admin получат `403 Forbidden`
- ✅ Нельзя удалить самого себя

**Логика:**
```typescript
// 1. Проверка JWT
const { user, error } = await requireAdmin(request);

// 2. Проверка роли
if (user!.role !== "super_admin") {
  return 403 Forbidden: "Only super_admin can delete users"
}

// 3. Проверка "не себя"
if (user!.sub === id) {
  return 403 Forbidden: "Cannot delete your own account"
}

// 4. Удаление через Go backend
DELETE https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/admin/users/{id}
```

### 2. Frontend Hook
**File:** `hooks/useAdminUsers.ts`

```typescript
export function useAdminDeleteUser() {
  const deleteUser = async (userId: string): Promise<boolean>
}
```

**Особенности:**
- ✅ Автоматически берет токен из localStorage
- ✅ Показывает toast с результатом
- ✅ Специальное сообщение для 403: "⚠️ Тільки супер-адміністратор може видаляти користувачів"
- ✅ Подробное логирование в консоль

### 3. Delete Button in Table
**File:** `components/admin/users/UsersTable.tsx`

```tsx
<DropdownMenuItem
  onClick={() => onDelete(user)}
  className="text-red-600 dark:text-red-400"
>
  <Trash2 className="w-4 h-4 mr-2" />
  Видалити
</DropdownMenuItem>
```

**Расположение:**
- Dropdown меню (⋮) в каждой строке таблицы
- Последний пункт меню (после "Заблокувати")
- Красный цвет для предупреждения

### 4. Confirmation Dialog
**File:** `components/admin/users/UserDeleteDialog.tsx`

```tsx
<UserDeleteDialog
  open={isDeleteDialogOpen}
  onOpenChange={setIsDeleteDialogOpen}
  onConfirm={handleConfirmDelete}
  userName={user.name}
  userEmail={user.email}
/>
```

**Дизайн:**
- ⚠️ Красная иконка предупреждения
- 📝 Показывает имя и email пользователя
- 🔴 Красный блок с предупреждением:
  - "Це незворотна дія!"
  - "Усі дані користувача будуть видалені"
  - "Історія замовлень буде втрачена"
  - "Відновлення буде неможливим"
- ✅ Кнопки: "Скасувати" | "Так, видалити" (красная)

### 5. Page Integration
**File:** `app/admin/users/page.tsx`

```tsx
const handleDelete = (user: User) => {
  setUserToDelete(user);
  setIsDeleteDialogOpen(true);
};

const handleConfirmDelete = async () => {
  const success = await deleteUser(userToDelete.id);
  
  if (success) {
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
    refetch(); // Обновить список
  }
};
```

## 🔒 Security

### Уровни доступа:

| Роль | Может удалять? |
|------|----------------|
| **super_admin** | ✅ Да |
| **admin** | ❌ Нет (403) |
| **user** | ❌ Нет (401) |

### Защита от ошибок:

1. **Нельзя удалить себя:**
   ```
   if (user!.sub === userId) {
     return 403: "Cannot delete your own account"
   }
   ```

2. **Только super_admin:**
   ```
   if (user!.role !== "super_admin") {
     return 403: "Only super_admin can delete users"
   }
   ```

3. **JWT проверка:**
   ```
   const { user, error } = await requireAdmin(request);
   ```

## 🎯 User Flow

### 1. Открытие диалога
```
User → Table → ⋮ → "Видалити" → Dialog открыт
```

### 2. Подтверждение
```
Dialog → "Так, видалити" → API request → Success toast → Table обновлен
```

### 3. Отмена
```
Dialog → "Скасувати" → Dialog закрыт
```

### 4. Ошибка (не super_admin)
```
Dialog → "Так, видалити" → 403 Forbidden → Error toast:
"⚠️ Тільки супер-адміністратор може видаляти користувачів"
```

## 🧪 Testing

### Test 1: Super Admin удаляет пользователя

**Precondition:**
- Залогинен как super_admin (admin@example.com)
- Токен с `role: "super_admin"`

**Steps:**
1. Открыть `/admin/users`
2. Выбрать пользователя (НЕ себя)
3. Нажать ⋮ → "Видалити"
4. В диалоге нажать "Так, видалити"

**Expected:**
- ✅ Toast: "Користувача успішно видалено"
- ✅ Таблица обновилась (пользователя нет)
- ✅ Total в KPI уменьшился на 1

### Test 2: Обычный Admin пытается удалить

**Precondition:**
- Залогинен как admin (НЕ super_admin)
- Токен с `role: "admin"`

**Steps:**
1. Открыть `/admin/users`
2. Выбрать пользователя
3. Нажать ⋮ → "Видалити"
4. В диалоге нажать "Так, видалити"

**Expected:**
- ❌ Toast (error): "⚠️ Тільки супер-адміністратор може видаляти користувачів"
- ✅ Пользователь остался в таблице

### Test 3: Попытка удалить себя

**Precondition:**
- Залогинен как super_admin
- Пытается удалить свой аккаунт

**Steps:**
1. Найти себя в таблице
2. Нажать ⋮ → "Видалити"
3. В диалоге нажать "Так, видалити"

**Expected:**
- ❌ Toast (error): "Cannot delete your own account"
- ✅ Аккаунт остался

### Test 4: Отмена удаления

**Steps:**
1. Открыть диалог удаления
2. Нажать "Скасувати"

**Expected:**
- ✅ Диалог закрылся
- ✅ Пользователь остался в таблице
- ✅ Никакого запроса к API

## 📊 Console Logs

### Success (super_admin):
```javascript
🗑️ ===== DELETE /api/admin/users/[id] =====
✅ [DELETE User] Admin: admin@example.com (role: super_admin)
🎯 [DELETE User] Target user ID: 7ec8aba4-8195-4be1-a9a8-067c30aae306
📤 [DELETE User] Backend request: DELETE https://...
📥 [DELETE User] Backend status: 200
✅ [DELETE User] Success: {success: true, ...}
🗑️ [Delete User] Attempting to delete user: 7ec8aba4-8195-4be1-a9a8-067c30aae306
📥 [Delete User] Response status: 200
✅ [Delete User] Success: {success: true, message: "User deleted successfully"}
```

### Forbidden (admin):
```javascript
🗑️ ===== DELETE /api/admin/users/[id] =====
✅ [DELETE User] Admin: user@example.com (role: admin)
❌ [DELETE User] Forbidden: admin tried to delete user
🗑️ [Delete User] Attempting to delete user: 7ec8aba4-8195-4be1-a9a8-067c30aae306
📥 [Delete User] Response status: 403
❌ [Delete User] Error: Error: ⚠️ Тільки супер-адміністратор може видаляти користувачів
```

## 🚀 API Endpoints Summary

### Критичные операции (только super_admin):

```
DELETE /api/admin/users/:id          - Удаление пользователя ⚠️
PATCH  /api/admin/users/update-role  - Изменение ролей ⚠️
```

### Обычные операции (admin + super_admin):

```
GET    /api/admin/users              - Просмотр пользователей
GET    /api/admin/users/stats        - Статистика
GET    /api/admin/users/:id          - Детали пользователя
PUT    /api/admin/users/:id          - Редактирование профиля
PATCH  /api/admin/users/:id/status   - Блокировка/разблокировка
```

## 📝 Files Modified

1. ✅ `app/api/admin/users/[id]/route.ts` - DELETE endpoint
2. ✅ `hooks/useAdminUsers.ts` - useAdminDeleteUser hook
3. ✅ `components/admin/users/UsersTable.tsx` - Delete button
4. ✅ `components/admin/users/UserDeleteDialog.tsx` - Confirmation dialog
5. ✅ `app/admin/users/page.tsx` - Integration
6. ✅ `components/ui/alert-dialog.tsx` - shadcn component (added)

## ✅ Checklist

- [x] DELETE endpoint создан
- [x] Проверка super_admin роли
- [x] Защита от удаления себя
- [x] Frontend hook для удаления
- [x] Кнопка "Видалити" в таблице
- [x] Диалог подтверждения
- [x] Toast уведомления
- [x] Обновление таблицы после удаления
- [x] Красивый дизайн диалога
- [x] Подробное логирование
- [x] Обработка ошибок

---

**Status:** ✅ Полностью готово к использованию
**Date:** 4 января 2026
**Author:** Implemented with proper security and UX
