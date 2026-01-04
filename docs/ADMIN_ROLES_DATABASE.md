# 🎭 Admin Roles - Database Structure

## 📊 Роли в PostgreSQL

```sql
SELECT 
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE role = 'super_admin') AS super_admins,
  COUNT(*) FILTER (WHERE role = 'admin') AS admins,
  COUNT(*) FILTER (WHERE role = 'home_chef') AS home_chefs,
  COUNT(*) FILTER (WHERE role = 'investor') AS investors,
  COUNT(*) FILTER (WHERE status = 'blocked') AS blocked,
  COUNT(*) FILTER (WHERE status = 'active') AS active
FROM "User";
```

**Результат:**

| Показатель | Значение |
|------------|----------|
| **Всего пользователей** | 54 |
| **Super Admins** | 1 (admin@example.com) |
| **Admins** | 3 |
| **Home Chefs** | 49 |
| **Investors** | 1 |
| **Заблокированных** | 0 |
| **Активных** | 54 |

## 🔄 Маппинг ролей Frontend ↔ Backend

| Frontend UI | Frontend Value | Backend DB | Количество |
|-------------|----------------|------------|------------|
| 🍳 Користувач | `user` | `home_chef` | 49 |
| 👤 Адмін | `admin` | `admin` | 3 |
| ⭐ Суперадмін | `superadmin` | `super_admin` | 1 |
| 💼 Інвестор | — | `investor` | 1 |

## ⚙️ Реализация маппинга

**File:** `hooks/useAdminUsers.ts`

```typescript
if (filters.role !== "all") {
  let backendRole: string = filters.role;
  
  if (filters.role === "user") {
    backendRole = "home_chef";
  } else if (filters.role === "superadmin") {
    backendRole = "super_admin"; // ⚠️ С подчеркиванием!
  }
  // admin → admin (без изменений)
  
  params.append("role", backendRole);
}
```

## ✅ Тесты

### curl тесты с локального backend

```bash
TOKEN="eyJhbGci..."

# 1. Все пользователи
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/admin/users" | jq '.meta'
# → total: 54

# 2. Только super_admin
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/admin/users?role=super_admin" | jq '.meta'
# → total: 1

# 3. Только admin
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/admin/users?role=admin" | jq '.meta'
# → total: 3

# 4. Только home_chef
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/admin/users?role=home_chef" | jq '.meta'
# → total: 49
```

### Frontend Console Logs

```javascript
// Выбор "Суперадмін":
🔄 [Role Mapping] Frontend role: "superadmin"
✅ [Role Mapping] Mapped: "superadmin" → "super_admin"
📤 [Role Mapping] Sending to backend: "super_admin"
🔍 [useAdminUsers] Fetching: /api/admin/users?page=1&limit=20&role=super_admin
✅ [useAdminUsers] Data received: {usersCount: 1, meta: {…}}

// Выбор "Адмін":
🔄 [Role Mapping] Frontend role: "admin"
✅ [Role Mapping] No mapping needed: "admin"
📤 [Role Mapping] Sending to backend: "admin"
🔍 [useAdminUsers] Fetching: /api/admin/users?page=1&limit=20&role=admin
✅ [useAdminUsers] Data received: {usersCount: 3, meta: {…}}

// Выбор "Користувач":
🔄 [Role Mapping] Frontend role: "user"
✅ [Role Mapping] Mapped: "user" → "home_chef"
📤 [Role Mapping] Sending to backend: "home_chef"
🔍 [useAdminUsers] Fetching: /api/admin/users?page=1&limit=20&role=home_chef
✅ [useAdminUsers] Data received: {usersCount: 49, meta: {…}}
```

## 🎯 Ожидаемое поведение в UI

| Выбранный фильтр | Отправляется на backend | Результат в таблице |
|------------------|-------------------------|---------------------|
| **Все роли** | (без параметра role) | 54 пользователя |
| **🍳 Користувач** | `?role=home_chef` | 49 пользователей |
| **👤 Адмін** | `?role=admin` | 3 пользователя |
| **⭐ Суперадмін** | `?role=super_admin` | 1 пользователь |

## 📝 Важные заметки

### 1. Super Admin vs Admin
- `super_admin` (1 user) - наивысший уровень доступа
- `admin` (3 users) - обычные админы

### 2. Snake_case в БД
⚠️ **Важно:** В базе данных используется `super_admin` (с подчеркиванием), а не `superadmin`!

### 3. Investor роль
Есть 1 investor в базе, но нет UI фильтра для этой роли.

### 4. KPI показывает общую статистику
KPI блок (Total: 54, Active today: 0) всегда показывает **общую** статистику, не зависит от фильтров.

Только **таблица** отфильтрована.

---

**Дата проверки:** 4 января 2026
**Статус:** ✅ Все фильтры работают корректно
