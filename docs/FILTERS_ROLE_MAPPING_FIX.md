# 🔧 Filters Issue - Role Mapping Fix

## ❌ Проблема

**Симптом:** Фильтры не работают, бэкенд возвращает всегда 54 пользователя

```javascript
// Запрос с фильтром:
/api/admin/users?page=1&limit=20&role=user&status=active

// Ответ: 54 пользователя (все, без фильтрации) ❌
{users: Array(54), meta: {...}}
```

## 🔍 Причина

### 1. Бэкенд не поддерживает фильтры
Бэкенд (Go) игнорирует query параметры `status`, `role`, `search`

**Решение:** Нужно реализовать фильтры на бэкенде (см. ниже)

### 2. Несовпадение названий ролей

| Frontend | Backend | Количество |
|----------|---------|------------|
| `user` | `home_chef` | 49 |
| `admin` | `admin` | 3 |
| `superadmin` | `super_admin` | 1 |
| — | `investor` | 1 |
| **ИТОГО** | | **54** |

**Проблема:**
```javascript
// Frontend отправляет:
?role=user

// Backend ищет:
WHERE role = 'user'  // ❌ Нет такой роли!

// Должно быть:
WHERE role = 'home_chef'  // ✅

// Еще проблема:
?role=superadmin
WHERE role = 'superadmin'  // ❌ Нет! В БД "super_admin" с _

// Должно быть:
WHERE role = 'super_admin'  // ✅ С подчеркиванием!
```

## ✅ Решение

### 1. Маппинг ролей на фронтенде

**File:** `hooks/useAdminUsers.ts`

```typescript
const buildQueryString = useCallback((filters: UsersFilters) => {
  const params = new URLSearchParams();

  params.append("page", filters.page.toString());
  params.append("limit", filters.limit.toString());

  if (filters.search) {
    params.append("search", filters.search);
  }
  
  // 🔄 Маппинг ролей: Frontend → Backend
  if (filters.role !== "all") {
    let backendRole: string = filters.role;
    
    // Frontend → Backend mapping
    if (filters.role === "user") {
      backendRole = "home_chef"; // ✅ user → home_chef
    } else if (filters.role === "superadmin") {
      backendRole = "super_admin"; // ✅ superadmin → super_admin (с подчеркиванием!)
    }
    // admin → admin (без изменений)
    
    params.append("role", backendRole);
  }
  
  if (filters.status !== "all") {
    params.append("status", filters.status);
  }

  return params.toString();
}, []);
```

**Результат:**
```javascript
// Теперь отправляется:
?role=home_chef      // ✅ для "Користувач"
?role=super_admin    // ✅ для "Суперадмін" (с подчеркиванием!)
?role=admin          // ✅ для "Адмін"
```

### 2. Реализация фильтров на бэкенде

**File:** `internal/modules/admin/handler/handler.go`

```go
func (h *AdminHandler) GetUsers(c *gin.Context) {
    // Parse query parameters
    page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
    limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
    search := c.Query("search")
    status := c.Query("status")
    role := c.Query("role")
    
    log.Printf("📋 [GetUsers] Filters: page=%d, limit=%d, search=%s, status=%s, role=%s",
        page, limit, search, status, role)
    
    // Build query
    query := h.db.Model(&models.User{})
    
    // 🔍 Search filter (case-insensitive)
    if search != "" {
        query = query.Where(
            "name ILIKE ? OR email ILIKE ?",
            "%"+search+"%",
            "%"+search+"%",
        )
        log.Printf("✅ Applied search filter: %s", search)
    }
    
    // 🔍 Status filter
    if status != "" && status != "all" {
        query = query.Where("status = ?", status)
        log.Printf("✅ Applied status filter: %s", status)
    }
    
    // 🔍 Role filter
    if role != "" && role != "all" {
        query = query.Where("role = ?", role)
        log.Printf("✅ Applied role filter: %s", role)
    }
    
    // Count total (with filters applied!)
    var total int64
    query.Count(&total)
    
    // Pagination
    offset := (page - 1) * limit
    var users []models.User
    query.Offset(offset).Limit(limit).Order("created_at DESC").Find(&users)
    
    log.Printf("📊 [GetUsers] Results: %d users (total: %d)", len(users), total)
    
    // Response
    c.JSON(200, gin.H{
        "users": users,
        "meta": gin.H{
            "total":      total,
            "page":       page,
            "limit":      limit,
            "totalPages": (total + int64(limit) - 1) / int64(limit),
        },
    })
}
```

## 📊 Ожидаемое поведение

### Тест 1: Фильтр по роли "user" (home_chef)

**Request:**
```
GET /api/admin/users?page=1&limit=20&role=home_chef
```

**Response:**
```json
{
  "users": [...],  // Только home_chef (49 пользователей)
  "meta": {
    "total": 49,   // ✅ НЕ 54!
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

### Тест 2: Фильтр по роли "admin"

**Request:**
```
GET /api/admin/users?page=1&limit=20&role=admin
```

**Response:**
```json
{
  "users": [...],  // Только admin (3 пользователя)
  "meta": {
    "total": 3,    // ✅ НЕ 54!
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

### Тест 2.5: Фильтр по роли "superadmin"

**Request:**
```
GET /api/admin/users?page=1&limit=20&role=super_admin
```

**Response:**
```json
{
  "users": [{"email": "admin@example.com", ...}],  // Только super_admin (1 пользователь)
  "meta": {
    "total": 1,    // ✅ НЕ 54!
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

### Тест 3: Фильтр по статусу "blocked"

**Request:**
```
GET /api/admin/users?page=1&limit=20&status=blocked
```

**Response:**
```json
{
  "users": [],     // Нет заблокированных
  "meta": {
    "total": 0,    // ✅ НЕ 54!
    "page": 1,
    "limit": 20,
    "totalPages": 0
  }
}
```

### Тест 4: Поиск "admin"

**Request:**
```
GET /api/admin/users?page=1&limit=20&search=admin
```

**Response:**
```json
{
  "users": [
    {"email": "admin@example.com", ...},
    {"email": "admin2@example.com", ...},
    ...
  ],
  "meta": {
    "total": 4,    // Пользователи с "admin" в email/name
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

## 🔍 Debugging

### Frontend Console
```javascript
// До маппинга:
🔍 [useAdminUsers] Fetching: /api/admin/users?page=1&limit=20&role=user

// После маппинга:
🔍 [useAdminUsers] Fetching: /api/admin/users?page=1&limit=20&role=home_chef
```

### Next.js Terminal
```
[Admin Users API] 🔍 Filters from frontend: {
  search: null,
  status: null,
  role: 'home_chef',  // ✅ Правильное имя!
  page: '1',
  limit: '20'
}
```

### Go Backend Logs
```
📋 [GetUsers] Filters: page=1, limit=20, search=, status=, role=home_chef
✅ Applied role filter: home_chef
📊 [GetUsers] Results: 20 users (total: 49)  // ✅ Отфильтровано!
```

## 📋 Checklist

- [x] Frontend маппит роли (user → home_chef)
- [x] Frontend отправляет правильные названия
- [ ] **Backend реализует фильтры** (TODO)
- [ ] Backend логирует полученные фильтры
- [ ] Backend возвращает правильный `meta.total`
- [ ] UI показывает отфильтрованные данные

## 🚀 Next Steps

### 1. Проверить маппинг (сейчас)
```bash
# Обновить страницу /admin/users
# Выбрать фильтр "Користувач"
# Проверить консоль:
# Должно быть: ?role=home_chef (не role=user)
```

### 2. Реализовать на бэкенде (Go)
```bash
# Добавить фильтры в GetUsers handler
# Задеплоить на Koyeb
# Проверить, что теперь возвращается 49, а не 54
```

### 3. Протестировать все фильтры
- ✅ Роль: user (home_chef) → 49 пользователей
- ✅ Роль: admin → 3 пользователя
- ✅ Роль: superadmin (super_admin) → 1 пользователь (admin@example.com)
- ✅ Статус: active → все активные
- ✅ Статус: blocked → 0 (нет заблокированных)
- ✅ Поиск: "admin" → 4 результата

---

**Status:** 
- ✅ Frontend исправлен (маппинг добавлен)
- ⏳ Backend ждет реализации фильтров
