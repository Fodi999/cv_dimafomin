# API Endpoints Documentation - Token Economy System

## 📋 Overview

Этот документ описывает все API endpoints для системы токен-экономики. 

**Архитектура:**
- Frontend (Next.js): `localhost:3000`
- Backend (Go): `yeasty-madelaine-fodi999-671ccdf5.koyeb.app`
- Proxy: Next.js API Routes проксируют запросы к Go бэкенду

## 🔐 Authentication

**Два способа авторизации:**

### 1. Cookie-Based (Рекомендуется ✅)
```
Cookie: session=<jwt_token>
```
- Автоматически отправляется браузером
- Защищено от XSS атак (HttpOnly)
- Работает с SSR

### 2. Header-Based (Legacy)
```
Authorization: Bearer <jwt_token>
```
- Для API клиентов и мобильных приложений
- Требует ручной передачи токена

**Все Next.js proxy routes автоматически проксируют оба варианта к Go бэкенду.**

## 📊 User Endpoints

### GET /api/token-bank/me
Получить баланс текущего пользователя

**Response:**
```json
{
  "success": true,
  "data": {
    "balance": 1000,
    "userId": "uuid"
  }
}
```

---

### GET /api/token-bank/me/transactions
Получить историю транзакций текущего пользователя

**Query Parameters:**
- `type` (optional): `earned` | `spent` | `bonus` | `purchase` | `all`
- `limit` (optional): Number, default 10
- `offset` (optional): Number, default 0

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "type": "earned",
        "amount": 50,
        "description": "Виконано завдання",
        "reason": "task_completion",
        "createdAt": "2025-12-11T10:00:00Z"
      }
    ],
    "total": 25
  }
}
```

---

### GET /api/tasks
Получить список заданий

**Query Parameters:**
- `category` (optional): `daily` | `weekly` | `special` | `learning` | `social` | `achievements`
- `status` (optional): `available` | `pending` | `completed`

**Response:**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "uuid",
        "title": "Завершити перший рецепт",
        "description": "Створіть та опублікуйте свій перший рецепт",
        "reward": 100,
        "category": "learning",
        "status": "available",
        "progress": 0,
        "maxProgress": 1,
        "deadline": "2025-12-31T23:59:59Z"
      }
    ]
  }
}
```

---

### POST /api/tasks/{taskID}/submit
Отправить задание на проверку

**URL Parameters:**
- `taskID`: UUID задания

**Body:**
```json
{
  "proof": "any proof data or link",
  "notes": "optional notes"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "pending",
    "submittedAt": "2025-12-11T10:00:00Z"
  }
}
```

---

### POST /api/ai/chat
Отправить сообщение AI чату (списывает токены)

**Body:**
```json
{
  "message": "Як приготувати борщ?",
  "context": {
    "requestType": "basic"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "AI response text",
    "cost": 10,
    "remainingBalance": 990
  }
}
```

---

## 👑 Admin Endpoints

### GET /api/admin/treasury/stats
Получить детальную статистику казначейства (только для админов)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalIssued": 1000000000,
    "circulating": 6000,
    "locked": 0,
    "available": 999994000,
    "balance": 999994000
  }
}
```

**Поля:**
- `totalIssued` - Всего выпущено токенов
- `circulating` - Токенов в обращении (у пользователей)
- `locked` - Заблокировано для наград/резервов
- `available` - Доступно для распределения
- `balance` - Текущий баланс казначейства

---

### GET /api/admin/token-bank/treasury
Получить баланс казначейства (только для админов) - **Deprecated, используйте /api/admin/treasury/stats**

**Response:**
```json
{
  "success": true,
  "data": {
    "balance": 50000,
    "totalIssued": 100000,
    "totalCirculating": 45000,
    "lockedForRewards": 5000,
    "available": 50000
  }
}
```

---

### GET /api/admin/treasury/stream
Server-Sent Events (SSE) поток для реального времени баланса казначейства

**Query Parameters:**
- `token`: JWT token (если не в заголовке)

**Response (SSE format):**
```
event: message
data: {"balance":50000,"totalIssued":100000,"totalCirculating":45000,"lockedForRewards":5000,"available":50000}

event: message
data: {"balance":50100,"totalIssued":100000,"totalCirculating":45100,"lockedForRewards":4900,"available":50000}
```

**Frontend Usage:**
```typescript
const events = new EventSource("/api/admin/treasury/stream?token=YOUR_JWT");
events.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("Treasury update:", data);
};
```

---

### POST /api/admin/tasks
Создать новое задание (только для админов)

**Body:**
```json
{
  "title": "Нове завдання",
  "description": "Опис завдання",
  "reward": 100,
  "category": "daily",
  "duration": "24h",
  "requirements": {
    "minLevel": 1,
    "maxCompletions": 100
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Нове завдання",
    "createdAt": "2025-12-11T10:00:00Z"
  }
}
```

---

### POST /api/admin/tasks/{taskID}/approve
Одобрить выполнение задания пользователем

**URL Parameters:**
- `taskID`: UUID задания

**Body:**
```json
{
  "userId": "uuid",
  "approved": true,
  "rewardAmount": 100,
  "notes": "Добра робота!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "taskId": "uuid",
    "userId": "uuid",
    "status": "completed",
    "rewardGiven": 100
  }
}
```

---

### GET /api/admin/tasks/pending
Получить список заданий, ожидающих проверки

**Response:**
```json
{
  "success": true,
  "data": {
    "pendingTasks": [
      {
        "taskId": "uuid",
        "userId": "uuid",
        "userName": "Іван Іванов",
        "taskTitle": "Створити рецепт",
        "submittedAt": "2025-12-11T10:00:00Z",
        "proof": "link or data",
        "notes": "user notes"
      }
    ],
    "total": 5
  }
}
```

---

## 🔧 Environment Variables

### Frontend (.env.local)
```bash
# Base URL бэкенда
NEXT_PUBLIC_API_BASE=https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app

# Для локальной разработки
# NEXT_PUBLIC_API_BASE=http://localhost:8080
```

### Backend (Go)
```bash
# Server settings
PORT=8080
FRONTEND_URL=https://dima-fomin.pl

# Database
DATABASE_URL=postgresql://...

# JWT Secret
JWT_SECRET=your_secret_key

# Treasury initial balance
TREASURY_INITIAL_BALANCE=100000
```

---

## 📝 Frontend Integration Examples

### Wallet Balance
```typescript
import { walletApi } from "@/lib/api";

// Cookie автоматически отправляется браузером
const balance = await fetch("/api/token-bank/me", {
  credentials: "include"
}).then(res => res.json());

console.log("Balance:", balance.data.balance);
```

### Transaction History
```typescript
// С query параметрами
const response = await fetch("/api/token-bank/me/transactions?type=earned&limit=20", {
  credentials: "include"
});
const transactions = await response.json();
```

### AI Chat with Token Deduction
```typescript
const response = await fetch("/api/ai/chat", {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    message: "Як приготувати борщ?",
    context: { requestType: "basic" }
  })
});

const data = await response.json();
console.log("AI Response:", data.response);
console.log("Cost:", data.cost);
console.log("Remaining:", data.remainingBalance);
```

### Real-Time Treasury (Admin)
```typescript
// SSE автоматически отправляет cookies с withCredentials
const events = new EventSource("/api/admin/treasury/stream", {
  withCredentials: true
});

events.onmessage = (event) => {
  const data = JSON.parse(event.data);
  setTreasuryData(data);
};

events.onerror = () => {
  // Fallback to polling
  setInterval(async () => {
    const response = await fetch("/api/admin/token-bank/treasury", {
      credentials: "include"
    });
    const data = await response.json();
    setTreasuryData(data);
  }, 30000);
};
```

---

## 🐛 Error Handling

Все endpoints возвращают ошибки в следующем формате:

```json
{
  "success": false,
  "error": "Описание ошибки"
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (неправильные данные)
- `401` - Unauthorized (нет токена или токен недействителен)
- `403` - Forbidden (нет прав доступа)
- `404` - Not Found (ресурс не найден)
- `500` - Internal Server Error

---

## 🚀 Testing

### Test Treasury Balance (Admin)
```bash
curl -H "Authorization: Bearer YOUR_JWT" \
  http://localhost:3000/api/admin/token-bank/treasury
```

### Test User Balance
```bash
curl -H "Authorization: Bearer YOUR_JWT" \
  http://localhost:3000/api/token-bank/me
```

### Test SSE Stream
```bash
curl -H "Accept: text/event-stream" \
  "http://localhost:3000/api/admin/treasury/stream?token=YOUR_JWT"
```

---

## 📌 Notes

1. **SSE Authentication**: EventSource не поддерживает кастомные заголовки, поэтому токен передается через query параметр
2. **Proxy Layer**: Next.js API routes проксируют все запросы к Go бэкенду для избежания CORS проблем
3. **Rate Limiting**: Бэкенд может применять rate limiting на некоторые endpoints
4. **Token Expiration**: JWT токены истекают через 24 часа

---

## 🔄 Changelog

### 2025-12-11
- ✅ Создана документация API endpoints
- ✅ Добавлены Next.js proxy routes
- ✅ Обновлен базовый URL в lib/api.ts
- ✅ Исправлены пути для SSE соединения
