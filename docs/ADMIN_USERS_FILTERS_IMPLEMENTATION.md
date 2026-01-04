# 🔍 Admin Users API - Filters Implementation

## 📋 API Contract

### Endpoint
```
GET /api/admin/users
```

### Query Parameters

| Parameter | Type | Values | Required | Description |
|-----------|------|--------|----------|-------------|
| `page` | integer | >= 1 | ✅ Yes | Номер страницы |
| `limit` | integer | 1-100 | ✅ Yes | Кол-во на странице |
| `search` | string | any | ❌ No | Поиск по имени/email |
| `status` | string | `active`, `blocked`, `pending` | ❌ No | Фильтр по статусу |
| `role` | string | `user`, `admin`, `superadmin` | ❌ No | Фильтр по роли |

### Examples

#### 1. Все пользователи (первая страница)
```
GET /api/admin/users?page=1&limit=20
```

#### 2. Поиск по email
```
GET /api/admin/users?page=1&limit=20&search=admin@example.com
```

#### 3. Только заблокированные
```
GET /api/admin/users?page=1&limit=20&status=blocked
```

#### 4. Только админы
```
GET /api/admin/users?page=1&limit=20&role=admin
```

#### 5. Заблокированные админы с поиском
```
GET /api/admin/users?page=1&limit=20&status=blocked&role=admin&search=john
```

---

## 🏗️ Frontend Implementation

### 1. Hook: `useAdminUsers`

**File:** `hooks/useAdminUsers.ts`

```typescript
const buildQueryString = useCallback((filters: UsersFilters) => {
  const params = new URLSearchParams();

  // ✅ Обязательные параметры
  params.append("page", filters.page.toString());
  params.append("limit", filters.limit.toString());

  // ✅ Опциональные фильтры (только если не "all")
  if (filters.search) {
    params.append("search", filters.search);
  }
  if (filters.role !== "all") {
    params.append("role", filters.role);
  }
  if (filters.status !== "all") {
    params.append("status", filters.status);
  }

  return params.toString();
}, []);
```

### 2. Filters State

```typescript
const [filters, setFilters] = useState<UsersFilters>({
  search: "",
  role: "all",
  status: "all",
  page: 1,
  limit: 20,
});
```

### 3. Update Filters

```typescript
const updateFilters = useCallback((newFilters: Partial<UsersFilters>) => {
  setFilters((prev) => ({
    ...prev,
    ...newFilters,
    page: newFilters.search !== undefined ? 1 : prev.page, // ✅ Reset page on search
  }));
}, []);
```

---

## 🔄 Next.js API Route (Proxy)

**File:** `app/api/admin/users/route.ts`

```typescript
export async function GET(request: NextRequest) {
  // 🔐 Auth check
  const { user, error } = await requireAdmin(request);
  if (error) return error;

  try {
    // 📋 Get query parameters from frontend
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    // 🔍 Log filters
    console.log('[Admin Users API] 🔍 Filters:', {
      search: searchParams.get('search'),
      status: searchParams.get('status'),
      role: searchParams.get('role'),
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    });
    
    // 🔄 Proxy to Go backend (pass all query params)
    const backendResponse = await fetch(
      `${BACKEND_URL}/api/admin/users?${queryString}`,
      {
        method: 'GET',
        headers: {
          'Authorization': authHeader || '',
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await backendResponse.json();
    
    // 🔄 Map fields: lastLogin → lastActiveAt
    if (data.users && Array.isArray(data.users)) {
      data.users = data.users.map((user: any) => ({
        ...user,
        lastActiveAt: user.lastLogin || user.lastActiveAt,
        joinedAt: user.createdAt || user.joinedAt,
      }));
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Admin Users API] ❌ Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## 🎨 UI Components

### 1. Filters Component

**File:** `components/admin/users/UsersFilters.tsx`

```tsx
<UsersFilters
  searchQuery={filters.search}
  onSearchChange={(value) => updateFilters({ search: value })}
  
  statusFilter={filters.status === "all" ? "all" : filters.status}
  onStatusChange={(value) =>
    updateFilters({
      status: value as "all" | "active" | "blocked" | "pending",
    })
  }
  
  roleFilter={filters.role === "all" ? "all" : filters.role}
  onRoleChange={(value) =>
    updateFilters({
      role: value as "all" | "user" | "admin" | "superadmin",
    })
  }
  
  onExport={handleExport}
/>
```

### 2. Filter Inputs

```tsx
{/* Search */}
<Input
  type="text"
  value={searchQuery}
  onChange={(e) => onSearchChange(e.target.value)}
  placeholder="Пошук по імені чи email..."
/>

{/* Status */}
<Select value={statusFilter} onValueChange={onStatusChange}>
  <SelectItem value="all">Усі статуси</SelectItem>
  <SelectItem value="active">🟢 Активний</SelectItem>
  <SelectItem value="blocked">🔴 Заблокований</SelectItem>
  <SelectItem value="pending">🟡 Очікує</SelectItem>
</Select>

{/* Role */}
<Select value={roleFilter} onValueChange={onRoleChange}>
  <SelectItem value="all">Усі ролі</SelectItem>
  <SelectItem value="user">👤 Користувач</SelectItem>
  <SelectItem value="admin">🛡️ Адміністратор</SelectItem>
  <SelectItem value="superadmin">⭐ Суперадмін</SelectItem>
</Select>
```

---

## 🔧 Backend Requirements (Go)

### Expected Implementation

**File:** `internal/modules/admin/handler/handler.go`

```go
func (h *AdminHandler) GetUsers(c *gin.Context) {
    // 📋 Parse query parameters
    page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
    limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
    search := c.Query("search")
    status := c.Query("status")  // active, blocked, pending
    role := c.Query("role")      // user, admin, superadmin
    
    // 🔍 Build query
    query := h.db.Model(&models.User{})
    
    // Search filter
    if search != "" {
        query = query.Where(
            "name ILIKE ? OR email ILIKE ?",
            "%"+search+"%",
            "%"+search+"%",
        )
    }
    
    // Status filter
    if status != "" && status != "all" {
        query = query.Where("status = ?", status)
    }
    
    // Role filter
    if role != "" && role != "all" {
        query = query.Where("role = ?", role)
    }
    
    // Count total
    var total int64
    query.Count(&total)
    
    // Pagination
    offset := (page - 1) * limit
    var users []models.User
    query.Offset(offset).Limit(limit).Find(&users)
    
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

---

## 🧪 Testing

### 1. Test Filters Individually

```bash
# Base request
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3000/api/admin/users?page=1&limit=20"

# Search
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3000/api/admin/users?page=1&limit=20&search=admin"

# Status filter
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3000/api/admin/users?page=1&limit=20&status=active"

# Role filter
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3000/api/admin/users?page=1&limit=20&role=admin"

# Combined
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3000/api/admin/users?page=1&limit=20&status=active&role=admin&search=john"
```

### 2. Check Console Logs

**Frontend (Browser Console):**
```javascript
🔍 [useAdminUsers] Fetching: /api/admin/users?page=1&limit=20&status=active
🔑 [useAdminUsers] Token present: true
📥 [useAdminUsers] Response status: 200
✅ [useAdminUsers] Data received: {usersCount: 4, meta: {...}}
```

**Backend (Next.js Terminal):**
```
[Admin Users API] 🔍 Filters: {
  search: null,
  status: 'active',
  role: null,
  page: '1',
  limit: '20'
}
[Admin Users API] 📡 Proxying to backend: https://backend.koyeb.app/api/admin/users?page=1&limit=20&status=active
[Admin Users API] ✅ Backend response received: {usersCount: 4, ...}
```

---

## 📊 Expected Behavior

### Scenario 1: No Filters
```
Request: ?page=1&limit=20
Result: All 54 users (first 20)
```

### Scenario 2: Search "admin"
```
Request: ?page=1&limit=20&search=admin
Result: Users with "admin" in name or email (e.g., 4 users)
```

### Scenario 3: Status "blocked"
```
Request: ?page=1&limit=20&status=blocked
Result: Only blocked users (e.g., 0 users currently)
```

### Scenario 4: Role "admin"
```
Request: ?page=1&limit=20&role=admin
Result: Only admin users (e.g., 4 users)
```

### Scenario 5: Combined Filters
```
Request: ?page=1&limit=20&status=active&role=admin&search=john
Result: Active admins with "john" in name/email
```

---

## ✅ Checklist

- [x] Frontend строит query string с фильтрами
- [x] Next.js API проксирует все параметры на бэкенд
- [x] Добавлено логирование фильтров
- [x] UI обновляет фильтры через `updateFilters()`
- [x] Page сбрасывается на 1 при изменении поиска
- [ ] **Backend должен реализовать фильтры** (Go)

---

## 🚀 Next Steps

### Для бэкенда (Go):

1. **Добавить поддержку query параметров:**
   - `search` → `WHERE name ILIKE ? OR email ILIKE ?`
   - `status` → `WHERE status = ?`
   - `role` → `WHERE role = ?`

2. **Вернуть правильный `meta.total`:**
   ```go
   // Count AFTER applying filters
   query.Where(...filters...).Count(&total)
   ```

3. **Проверить регистр:**
   ```go
   // Case-insensitive search
   ILIKE '%' || ? || '%'
   ```

---

## 📚 Documentation

- [API_CONTRACT_GUIDE.md](./API_CONTRACT_GUIDE.md) - Полный API контракт
- [ADMIN_USERS_REAL_DATA_INTEGRATION.md](./ADMIN_USERS_REAL_DATA_INTEGRATION.md) - Интеграция данных
- [BACKEND_ADMIN_API_IMPLEMENTATION.md](./BACKEND_ADMIN_API_IMPLEMENTATION.md) - Go implementation

---

**Status:** ✅ Frontend готов, ждёт реализации фильтров на бэкенде
