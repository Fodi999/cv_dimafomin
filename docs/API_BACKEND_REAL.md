# Real Backend API для Admin Users

## 🔥 Текущие endpoints бэкенда (Go)

### 1️⃣ Получить всех пользователей
```http
GET /api/admin/users
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "User Name",
      "role": "home_chef | pro_chef | admin",
      "createdAt": "2026-01-04T10:00:00Z"
    }
  ]
}
```

### 2️⃣ Обновить роль пользователя
```http
PATCH /api/admin/users/update-role
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "userId": "user-uuid",
  "role": "admin | home_chef | pro_chef"
}
```

### 3️⃣ Обновить данные пользователя
```http
PUT /api/admin/users/{userId}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "New Name",
  "email": "newemail@example.com"
}
```

### 4️⃣ Удалить пользователя
```http
DELETE /api/admin/users/{userId}
Authorization: Bearer {admin_token}
```

---

## 🔄 Mapping Frontend ↔ Backend

### Current Frontend Expectations (Mock API)
```typescript
// GET /api/admin/users?page=1&limit=20&search=&role=all&status=all
{
  meta: {
    total: number
    activeToday: number
    blocked: number
    premium: number
    page: number
    limit: number
    totalPages: number
  }
  items: Array<{
    id: string
    name: string
    email: string
    role: "user" | "admin" | "premium"
    status: "active" | "blocked" | "inactive"
    joinedAt: string  // ISO 8601
    lastActiveAt: string
    stats?: { ordersCount?, totalSpent? }
  }>
}
```

### Backend Response (Actual)
```json
{
  "users": [
    {
      "id": "uuid",
      "email": "string",
      "name": "string",
      "role": "home_chef | pro_chef | admin",
      "createdAt": "ISO 8601"
    }
  ]
}
```

---

## ⚠️ Проблемы совместимости

### 1. **Response Structure**
- Backend: `{ users: [...] }`
- Frontend expects: `{ meta: {...}, items: [...] }`

### 2. **Role Names**
- Backend: `home_chef`, `pro_chef`, `admin`
- Frontend: `user`, `premium`, `admin`

**Mapping:**
```
home_chef → user
pro_chef → premium
admin → admin
```

### 3. **Missing Fields**
Backend **НЕ возвращает**:
- ❌ `status` (active/blocked/inactive)
- ❌ `lastActiveAt`
- ❌ `stats` (ordersCount, totalSpent)
- ❌ `phone`
- ❌ Pagination metadata

### 4. **Endpoints Mismatch**
- ❌ Backend: `PATCH /api/admin/users/update-role`
- ✅ Frontend expects: `PATCH /api/admin/users/:id/role`

- ❌ Backend: `PUT /api/admin/users/:id` (full update)
- ✅ Frontend expects: `PATCH /api/admin/users/:id/status`

---

## 🛠️ Solution Options

### Option 1: **Adapter Layer (Frontend)**
Создать адаптер для преобразования backend responses:

```typescript
// lib/adapters/adminUsersAdapter.ts
export function adaptBackendUsersToFrontend(backendResponse: any) {
  return {
    meta: {
      total: backendResponse.users.length,
      activeToday: 0, // TODO: add backend support
      blocked: 0,     // TODO: add backend support
      premium: backendResponse.users.filter(u => u.role === 'pro_chef').length,
      page: 1,
      limit: 20,
      totalPages: 1,
    },
    items: backendResponse.users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: adaptRole(user.role),
      status: 'active', // TODO: add backend support
      joinedAt: user.createdAt,
      lastActiveAt: user.createdAt, // fallback
      stats: {
        ordersCount: 0, // TODO: add backend support
        totalSpent: 0,  // TODO: add backend support
      }
    }))
  }
}

function adaptRole(backendRole: string): 'user' | 'premium' | 'admin' {
  switch(backendRole) {
    case 'home_chef': return 'user'
    case 'pro_chef': return 'premium'
    case 'admin': return 'admin'
    default: return 'user'
  }
}
```

### Option 2: **Backend Updates (Recommended)**
Обновить backend для соответствия фронтенд контракту:

```go
// internal/modules/admin/handlers.go

type GetUsersResponse struct {
    Meta struct {
        Total       int     `json:"total"`
        ActiveToday float64 `json:"activeToday"`
        Blocked     int     `json:"blocked"`
        Premium     int     `json:"premium"`
        Page        int     `json:"page"`
        Limit       int     `json:"limit"`
        TotalPages  int     `json:"totalPages"`
    } `json:"meta"`
    Items []UserDTO `json:"items"`
}

type UserDTO struct {
    ID           string  `json:"id"`
    Name         string  `json:"name"`
    Email        string  `json:"email"`
    Role         string  `json:"role"` // "user" | "premium" | "admin"
    Status       string  `json:"status"` // "active" | "blocked" | "inactive"
    JoinedAt     string  `json:"joinedAt"`
    LastActiveAt string  `json:"lastActiveAt"`
    Phone        *string `json:"phone,omitempty"`
    Stats        *struct {
        OrdersCount int     `json:"ordersCount"`
        TotalSpent  float64 `json:"totalSpent"`
    } `json:"stats,omitempty"`
}
```

**New Endpoints:**
```
GET    /api/admin/users                 - List with pagination/filters
GET    /api/admin/users/stats           - KPI stats
GET    /api/admin/users/:id             - User details
PATCH  /api/admin/users/:id/role        - Change role
PATCH  /api/admin/users/:id/status      - Change status (block/unblock)
DELETE /api/admin/users/:id             - Delete user
```

---

## 🚀 Quick Fix (Use Adapter Now)

Создам адаптер для немедленной интеграции с текущим backend:
