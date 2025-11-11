# 📡 Admin API Documentation

## 🔑 API Base Endpoints

**Base URL:** `https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app`

**Authentication:** All endpoints require `Authorization: Bearer <token>` header

---

## 📋 API Endpoints Summary

| # | Endpoint | Method | Описание | Фильтры |
|----|----------|--------|---------|---------|
| 1 | `/api/admin/profile` | GET | Получить профиль админа | По JWT |
| 2 | `/api/admin/stats` | GET | Получить статистику системы | - |
| 3 | `/api/admin/users` | GET | Все пользователи | - |
| 4 | `/api/admin/users/{id}` | PUT | Обновить пользователя | По ID |
| 5 | `/api/admin/users/{id}` | DELETE | Удалить пользователя | По ID |
| 6 | `/api/admin/users/update-role` | PATCH | Обновить роль | По user_id |
| 7 | `/api/admin/orders` | GET | Все заказы | DESC по дате |
| 8 | `/api/admin/orders/recent` | GET | 10 последних заказов | DESC по дате |
| 9 | `/api/admin/orders/{id}/status` | PUT | Обновить статус заказа | По ID |

---

## 🔐 Authentication

Все запросы должны включать JWT токен в заголовок:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://api.example.com/api/admin/stats
```

**Token Storage:**
- Сохраняется в `localStorage.token`
- Автоматически добавляется в заголовки `adminApi` функциями

---

## 📊 Endpoint Details

### 1. GET `/api/admin/profile`
**Получить профиль администратора**

**Request:**
```bash
GET /api/admin/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": {
    "id": "7ec8aba4-8195-4be1-a9a8-067c30aae306",
    "name": "System Administrator",
    "email": "admin@example.com",
    "role": "admin",
    "createdAt": "2024-11-15T10:30:00Z"
  },
  "success": true
}
```

---

### 2. GET `/api/admin/stats`
**Получить статистику системы**

**Request:**
```bash
GET /api/admin/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": {
    "totalUsers": 1234,
    "totalOrders": 567,
    "totalRevenue": 45000,
    "activeUsers": 234,
    "newUsersThisMonth": 145,
    "ordersThisMonth": 89
  },
  "success": true
}
```

---

### 3. GET `/api/admin/users`
**Получить всех пользователей**

**Request:**
```bash
GET /api/admin/users
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "user-id-1",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "level": 5,
      "xp": 2450,
      "chefTokens": 1250,
      "createdAt": "2024-11-15T10:30:00Z"
    },
    // ... more users
  ],
  "success": true
}
```

---

### 4. PUT `/api/admin/users/{id}`
**Обновить пользователя**

**Request:**
```bash
PUT /api/admin/users/user-id-1
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe Updated",
  "level": 6,
  "xp": 2500
}
```

**Response:**
```json
{
  "data": {
    "id": "user-id-1",
    "name": "John Doe Updated",
    "email": "john@example.com",
    "role": "student",
    "level": 6,
    "xp": 2500,
    "chefTokens": 1250
  },
  "success": true
}
```

---

### 5. DELETE `/api/admin/users/{id}`
**Удалить пользователя**

**Request:**
```bash
DELETE /api/admin/users/user-id-1
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "User deleted successfully",
  "success": true
}
```

---

### 6. PATCH `/api/admin/users/update-role`
**Обновить роль пользователя**

**Request:**
```bash
PATCH /api/admin/users/update-role
Authorization: Bearer <token>
Content-Type: application/json

{
  "user_id": "user-id-1",
  "role": "instructor"
}
```

**Response:**
```json
{
  "message": "User role updated successfully",
  "success": true
}
```

**Available Roles:**
- `student` - Ученик
- `instructor` - Инструктор
- `admin` - Администратор

---

### 7. GET `/api/admin/orders`
**Получить все заказы (DESC по дате)**

**Request:**
```bash
GET /api/admin/orders
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "order-1001",
      "userId": "user-id-1",
      "userName": "John Doe",
      "amount": 199.99,
      "status": "completed",
      "createdAt": "2024-11-11T10:30:00Z",
      "items": [
        {
          "id": "item-1",
          "name": "Premium Course",
          "price": 199.99
        }
      ]
    },
    // ... more orders
  ],
  "success": true
}
```

---

### 8. GET `/api/admin/orders/recent`
**Получить 10 последних заказов (DESC по дате)**

**Request:**
```bash
GET /api/admin/orders/recent
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "order-1001",
      "userId": "user-id-1",
      "userName": "John Doe",
      "amount": 199.99,
      "status": "completed",
      "createdAt": "2024-11-11T10:30:00Z"
    },
    // ... up to 10 orders
  ],
  "success": true
}
```

---

### 9. PUT `/api/admin/orders/{id}/status`
**Обновить статус заказа**

**Request:**
```bash
PUT /api/admin/orders/order-1001/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed"
}
```

**Response:**
```json
{
  "message": "Order status updated successfully",
  "success": true
}
```

**Available Statuses:**
- `pending` - В ожидании
- `completed` - Завершён
- `cancelled` - Отменён

---

## 🛠️ Using the Admin API Client

**File:** `src/lib/admin-api.ts`

```typescript
import { adminApi } from '@/src/lib/admin-api';

// Get admin profile
const profile = await adminApi.getProfile();

// Get system statistics
const stats = await adminApi.getStats();

// Get all users
const users = await adminApi.getUsers();

// Update user
const updated = await adminApi.updateUser(userId, { name: "New Name" });

// Update user role
await adminApi.updateUserRole(userId, 'instructor');

// Delete user
await adminApi.deleteUser(userId);

// Get orders
const orders = await adminApi.getOrders();

// Get recent orders (10 last)
const recent = await adminApi.getRecentOrders();

// Update order status
await adminApi.updateOrderStatus(orderId, 'completed');
```

---

## 🔄 Dashboard Data Flow

```
┌─────────────────────────┐
│  Admin Dashboard        │
│  (app/admin/page.tsx)   │
└────────────┬────────────┘
             │
             ├─── useEffect() ───┐
             │                    │
             ▼                    ▼
      adminApi.getStats()  adminApi.getRecentOrders()
             │                    │
             └─────┬──────────────┘
                   │
                   ▼
          ┌────────────────┐
          │  API Endpoints │
          │ /api/admin/... │
          └─────────┬──────┘
                    │
                    ▼
          ┌────────────────┐
          │   Backend DB   │
          └────────────────┘
```

---

## ⚠️ Error Handling

### Common HTTP Status Codes:

| Status | Meaning |
|--------|---------|
| 200 | OK - Успешный запрос |
| 400 | Bad Request - Неверные данные |
| 401 | Unauthorized - Требуется токен |
| 403 | Forbidden - Доступ запрещён |
| 404 | Not Found - Ресурс не найден |
| 500 | Server Error - Ошибка сервера |

### Error Response Example:
```json
{
  "error": "User not found",
  "success": false,
  "statusCode": 404
}
```

---

## 📝 Admin API Client Source

File: `src/lib/admin-api.ts`

Основные функции:
- `getProfile()` - Профиль админа
- `getStats()` - Статистика системы
- `getUsers()` - Все пользователи
- `updateUser()` - Обновить пользователя
- `updateUserRole()` - Обновить роль
- `deleteUser()` - Удалить пользователя
- `getOrders()` - Все заказы
- `getRecentOrders()` - 10 последних заказов
- `updateOrderStatus()` - Обновить статус заказа

Все функции:
- ✅ Автоматически добавляют JWT токен
- ✅ Нормализуют URL через `getApiUrl()`
- ✅ Логируют запросы и ответы
- ✅ Обрабатывают ошибки
- ✅ Редиректят на /login при 401/403

---

**Version:** 1.0  
**Last Updated:** 11 ноября 2025 г.  
**Status:** ✅ Fully Integrated
