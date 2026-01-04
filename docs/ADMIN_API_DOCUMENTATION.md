# 🔐 Admin API Documentation

**Date:** 2026-01-04  
**Status:** ✅ Complete  
**Version:** 1.0.0

---

## 📋 Overview

Admin API предоставляет защищённые эндпоинты для управления пользователями, статистикой и системными настройками.

### 🔒 Authentication

Все эндпоинты требуют JWT токен с ролью `admin` или `superadmin`.

```http
Authorization: Bearer {admin_jwt_token}
```

### 🚫 Error Responses

```json
// 401 Unauthorized - нет токена или токен невалидный
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authorization token is required"
  }
}

// 403 Forbidden - недостаточно прав
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Admin access required"
  }
}

// 404 Not Found - ресурс не найден
{
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found"
  }
}

// 400 Bad Request - невалидные данные
{
  "error": {
    "code": "INVALID_ROLE",
    "message": "Invalid role. Allowed values: admin, home_chef, pro_chef"
  }
}

// 500 Internal Error - серверная ошибка
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Failed to update user"
  }
}
```

---

## 👥 User Management

### 1️⃣ Get All Users

**Endpoint:** `GET /api/admin/users`

**Description:** Получить список всех пользователей с фильтрацией и пагинацией.

**Headers:**
```http
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Номер страницы |
| `limit` | number | 20 | Количество записей на странице |
| `search` | string | "" | Поиск по имени или email |
| `role` | string | "all" | Фильтр по роли (all, admin, premium, user) |
| `status` | string | "all" | Фильтр по статусу (all, active, inactive, blocked) |

**Request Example:**
```http
GET /api/admin/users?page=1&limit=20&search=john&role=premium&status=active
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "users": [
    {
      "id": "usr_1",
      "email": "john.doe@example.com",
      "name": "John Doe",
      "role": "premium",
      "createdAt": "2024-01-15T10:00:00Z"
    },
    {
      "id": "usr_2",
      "email": "jane.smith@example.com",
      "name": "Jane Smith",
      "role": "user",
      "createdAt": "2024-02-20T12:00:00Z"
    }
  ],
  "meta": {
    "total": 1247,
    "activeToday": 5.1,
    "blocked": 12,
    "premium": 234,
    "page": 1,
    "limit": 20,
    "totalPages": 63
  }
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/admin/users?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

---

### 2️⃣ Get User Details

**Endpoint:** `GET /api/admin/users/{userId}`

**Description:** Получить подробную информацию о конкретном пользователе.

**Headers:**
```http
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Example:**
```http
GET /api/admin/users/usr_1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "id": "usr_1",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+380501234567",
  "role": "premium",
  "status": "active",
  "joinedAt": "2024-01-15T10:00:00Z",
  "lastActiveAt": "2025-01-04T14:30:00Z",
  "locale": "en",
  "timezone": "Europe/Kyiv",
  "stats": {
    "ordersCount": 45,
    "totalSpent": 1250,
    "recipesCreated": 12,
    "aiRequests": 230
  }
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/admin/users/usr_1" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

---

### 3️⃣ Update User Role

**Endpoint:** `PATCH /api/admin/users/update-role`

**Description:** Изменить роль пользователя.

**Headers:**
```http
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "usr_123",
  "role": "admin"
}
```

**Allowed Roles:**
- `admin` - Администратор
- `home_chef` - Домашний повар
- `pro_chef` - Профессиональный повар

**Request Example:**
```http
PATCH /api/admin/users/update-role
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "userId": "usr_123",
  "role": "pro_chef"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "userId": "usr_123",
    "role": "pro_chef",
    "updatedAt": "2026-01-04T15:30:00Z"
  }
}
```

**cURL Example:**
```bash
curl -X PATCH "http://localhost:3000/api/admin/users/update-role" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "usr_123",
    "role": "pro_chef"
  }'
```

---

### 4️⃣ Update User Data

**Endpoint:** `PUT /api/admin/users/{userId}`

**Description:** Обновить данные пользователя (имя, email).

**Headers:**
```http
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com"
}
```

**Request Example:**
```http
PUT /api/admin/users/usr_123
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "John Smith Updated",
  "email": "john.new@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "usr_123",
    "name": "John Smith Updated",
    "email": "john.new@example.com",
    "role": "premium",
    "status": "active",
    "updatedAt": "2026-01-04T15:35:00Z"
  }
}
```

**cURL Example:**
```bash
curl -X PUT "http://localhost:3000/api/admin/users/usr_123" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith Updated",
    "email": "john.new@example.com"
  }'
```

---

### 5️⃣ Delete User

**Endpoint:** `DELETE /api/admin/users/{userId}`

**Description:** Удалить пользователя из системы.

**Headers:**
```http
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Example:**
```http
DELETE /api/admin/users/usr_123
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "userId": "usr_123",
    "deletedAt": "2026-01-04T15:40:00Z"
  }
}
```

**Response (403 Forbidden) - попытка удалить себя:**
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Cannot delete your own account"
  }
}
```

**cURL Example:**
```bash
curl -X DELETE "http://localhost:3000/api/admin/users/usr_123" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

---

## 📊 Statistics

### 6️⃣ Get Admin Statistics

**Endpoint:** `GET /api/admin/stats`

**Description:** Получить общую статистику для админ-панели.

**Headers:**
```http
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Example:**
```http
GET /api/admin/stats
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 1247,
      "active": 892,
      "new_today": 23,
      "new_this_week": 156,
      "new_this_month": 487,
      "blocked": 12,
      "premium": 234,
      "admins": 5
    },
    "recipes": {
      "total": 3456,
      "published": 3102,
      "draft": 354,
      "pending_review": 45,
      "created_today": 12,
      "created_this_week": 78
    },
    "orders": {
      "total": 5678,
      "pending": 23,
      "processing": 45,
      "completed": 5567,
      "cancelled": 43,
      "total_revenue": 125430.50,
      "revenue_today": 1250.00,
      "revenue_this_week": 8750.50,
      "revenue_this_month": 34560.25
    },
    "treasury": {
      "total_tokens": 1250000,
      "tokens_distributed": 875430,
      "tokens_remaining": 374570,
      "transactions_today": 156,
      "transactions_this_week": 892,
      "avg_transaction_size": 50.5
    },
    "ai": {
      "requests_today": 456,
      "requests_this_week": 2890,
      "requests_this_month": 12340,
      "avg_response_time": 2.3,
      "success_rate": 98.5,
      "most_used_scenarios": [
        {
          "name": "Recipe Generation",
          "count": 5678
        },
        {
          "name": "Ingredient Substitution",
          "count": 3456
        },
        {
          "name": "Cooking Tips",
          "count": 2345
        }
      ]
    },
    "system": {
      "uptime": "15 days 4 hours 23 minutes",
      "server_health": "healthy",
      "database_size": "2.3 GB",
      "storage_used": "45.2 GB",
      "storage_limit": "100 GB",
      "api_version": "1.0.0",
      "last_backup": "2026-01-04T02:00:00Z"
    }
  },
  "timestamp": "2026-01-04T15:45:00Z"
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/admin/stats" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

---

## 🔧 Implementation Details

### Middleware Protection

Все эндпоинты защищены через `requireAdmin()` middleware:

```typescript
import { requireAdmin, logAdminAction } from "@/lib/api/middleware";

export async function GET(request: NextRequest) {
  // 🔐 Проверка админских прав
  const { user, error } = await requireAdmin(request);
  if (error) return error;

  // Логирование действия
  logAdminAction(user!.sub, 'GET_USERS', { timestamp: new Date().toISOString() });

  // Ваш код...
}
```

### JWT Token Structure

```json
{
  "sub": "user_id",
  "email": "admin@example.com",
  "role": "admin",
  "exp": 1735995600,
  "iat": 1735909200
}
```

### Admin Activity Logging

Все админские действия логируются через `logAdminAction()`:

```typescript
logAdminAction(adminId, action, details);

// Example:
logAdminAction("admin_1", "DELETE_USER", {
  userId: "usr_123",
  deletedUserEmail: "user@example.com",
  timestamp: "2026-01-04T15:40:00Z"
});
```

---

## 📦 Frontend Integration

### React Hook Example

```typescript
import { useAdminUsers } from "@/hooks/useAdminUsers";

function AdminUsersPage() {
  const { users, meta, isLoading, filters, updateFilters, refetch } = useAdminUsers();

  // Users will be fetched automatically with Authorization header
  // Token is retrieved from localStorage('token')
  
  return (
    <div>
      {isLoading ? <Loading /> : <UsersList users={users} />}
    </div>
  );
}
```

### Fetch Example with Token

```typescript
const token = localStorage.getItem('token');

const response = await fetch('/api/admin/users', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
```

---

## 🧪 Testing

### Get Admin Token

1. Login as admin через `/api/auth/login`
2. Сохранить токен из ответа
3. Использовать в `Authorization` header

### Example Test Flow

```bash
# 1. Login as admin
TOKEN=$(curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' \
  | jq -r '.data.token')

# 2. Use token to access admin API
curl -X GET "http://localhost:3000/api/admin/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# 3. Update user role
curl -X PATCH "http://localhost:3000/api/admin/users/update-role" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId":"usr_123","role":"pro_chef"}'
```

---

## ✅ Features

- ✅ JWT authentication with role validation
- ✅ Admin/Superadmin role check
- ✅ Comprehensive error handling
- ✅ Activity logging
- ✅ Pagination and filtering
- ✅ Input validation
- ✅ Self-deletion protection
- ✅ Detailed user statistics

---

## 📚 Related Documentation

- [Authentication Architecture](./AUTH_ARCHITECTURE_STATUS.md)
- [API Contract Guide](./API_CONTRACT_GUIDE.md)
- [Admin Architecture](./ADMIN_ARCHITECTURE.md)

---

**Last Updated:** 2026-01-04  
**Author:** System Admin API Team
