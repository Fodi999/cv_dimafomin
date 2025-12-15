# 🏦 Treasury Balance Integration Guide

## Обзор

Система Treasury Balance позволяет отображать баланс токенов казначейства в реальном времени с использованием SSE (Server-Sent Events) для live обновлений.

## 📍 Где используется

### 1. Admin Dashboard
**Файл:** `components/admin/RealTimeTreasuryBalance.tsx`
**Путь:** `/app/admin/dashboard/page.tsx`
**Требует:** Авторизация (admin роль)

### 2. Главная страница (Hero Section)
**Файл:** `components/sections/HeroTreasuryWidget.tsx`
**Путь:** `/app/page.tsx`
**Требует:** Публичный доступ (без авторизации)

---

## 🔐 Авторизация и Token Flow

### UserContext Integration

Компоненты получают токен через `UserContext`:

```typescript
import { useUser } from "@/contexts/UserContext";

export default function RealTimeTreasuryBalance() {
  const { token } = useUser(); // 🔑 Получаем токен из контекста
  
  useEffect(() => {
    if (!token) {
      console.warn("⚠️ No token available");
      return;
    }
    // ... используем token
  }, [token]);
}
```

### Где хранится токен?

1. **localStorage**: `localStorage.getItem("token")`
2. **UserContext**: `const { token } = useUser()`
3. **Cookie**: Автоматически отправляется браузером с `credentials: "include"`

---

## 🌐 API Endpoints

### 1. Initial Data Fetch (Admin)

```
GET /api/admin/treasury/stats
Authorization: Bearer {token}
```

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

### 2. SSE Stream (Admin)

```
GET /api/admin/treasury/stream?token={token}
Content-Type: text/event-stream
```

**⚠️ ВАЖНО:** EventSource не поддерживает кастомные заголовки, поэтому токен передаётся через query параметр!

**SSE Event Format:**
```javascript
data: {"balance": 999994000, "totalIssued": 1000000000, "circulating": 6000, "locked": 0, "available": 999994000}
```

### 3. Public Treasury (No Auth)

```
GET /api/public/treasury
```

**Response:**
```json
{
  "balance": 999994000,
  "totalIssued": 1000000000,
  "totalCirculating": 6000
}
```

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Component                       │
│  (RealTimeTreasuryBalance.tsx / HeroTreasuryWidget.tsx)         │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ 1. Initial Fetch
                     │ GET /api/admin/treasury/stats
                     │ Authorization: Bearer {token}
                     │
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│                   Next.js API Proxy Routes                       │
│      /app/api/admin/treasury/stats/route.ts                     │
│      /app/api/admin/treasury/stream/route.ts                    │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ 2. Forward request to backend
                     │ Authorization: Bearer {token}
                     │
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Go Backend Server                           │
│   https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app          │
│        /api/admin/treasury/stats                                │
│        /api/admin/treasury/stream (SSE)                         │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ 3. Return data
                     │
                     ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend Component                            │
│  - Updates UI with new balance                                  │
│  - Listens to SSE stream for real-time updates                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💻 Frontend Implementation

### Admin Component (RealTimeTreasuryBalance.tsx)

**✅ Ключевые моменты:**

1. **Получение токена из UserContext**
```typescript
const { token } = useUser();
```

2. **Initial Fetch с Authorization header**
```typescript
const res = await fetch("/api/admin/treasury/stats", {
  credentials: "include",
  headers: {
    "Authorization": `Bearer ${token}`,
  },
});
```

3. **SSE подключение с токеном в URL**
```typescript
const sseUrl = `/api/admin/treasury/stream?token=${encodeURIComponent(token)}`;
const events = new EventSource(sseUrl);

events.onmessage = (event) => {
  const data = JSON.parse(event.data);
  setTreasuryData(data);
};
```

4. **Safe Number Conversion (защита от NaN)**
```typescript
const safeNumber = (value: any, defaultValue: number = 0) => {
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
};
```

5. **Fallback на polling (каждые 30 сек)**
```typescript
const interval = setInterval(() => {
  fetchInitial();
}, 30000);
```

---

## 🛠️ Backend Proxy Routes

### SSE Stream Route (`/app/api/admin/treasury/stream/route.ts`)

**✅ Обновленная версия с токеном из query параметра:**

```typescript
export async function GET(req: Request) {
  // 🔑 Получаем токен из query параметра (EventSource не поддерживает headers)
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return new Response(JSON.stringify({ error: "Authorization required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const backendUrl = `${BACKEND_URL}/api/admin/treasury/stream`;

  const res = await fetch(backendUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Accept": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: "Backend SSE error" }), {
      status: res.status,
    });
  }

  // Проксируем SSE поток напрямую
  return new Response(res.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
```

---

## 🐛 Common Issues & Solutions

### ❌ Problem: 401 Authorization Required

**Причина:** Токен не передаётся или недействителен

**Решение:**
1. Проверьте наличие токена: `localStorage.getItem("token")`
2. Убедитесь что пользователь залогинен
3. Проверьте что токен передаётся в headers (initial fetch) или query params (SSE)

### ❌ Problem: NaN Values in UI

**Причина:** Небезопасное преобразование чисел

**Решение:**
```typescript
const safeNumber = (value: any, defaultValue: number = 0) => {
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
};
```

### ❌ Problem: SSE Connection Fails

**Причина:** EventSource не поддерживает custom headers

**Решение:** Передавайте токен через URL query параметр:
```typescript
const sseUrl = `/api/admin/treasury/stream?token=${encodeURIComponent(token)}`;
const events = new EventSource(sseUrl);
```

### ❌ Problem: CORS Errors

**Причина:** Прямые запросы к Go backend с фронтенда

**Решение:** Используйте Next.js API proxy routes вместо прямых запросов

---

## 🔄 User Wallet Integration

### RefreshBalance Function (UserContext)

**Обновлённая версия с новым Token Bank API:**

```typescript
const refreshBalance = async () => {
  if (!user) return;

  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token");

    // 🆕 Используем новый endpoint
    const response = await fetch(`/api/token-bank/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("❌ Failed to refresh balance");
      return;
    }

    const result = await response.json();
    const data = result.data || result;
    const newBalance = data.balance || 0;

    // Update user balance
    setUser((prevUser) =>
      prevUser ? { ...prevUser, chefTokens: newBalance } : null
    );

    // Update localStorage
    const userJson = localStorage.getItem("user");
    if (userJson) {
      const userData = JSON.parse(userJson);
      userData.chefTokens = newBalance;
      localStorage.setItem("user", JSON.stringify(userData));
    }

    console.log(`✅ Balance refreshed: ${newBalance} CT`);
  } catch (error) {
    console.error("❌ Error refreshing balance:", error);
  }
};
```

---

## 📊 Wallet API Endpoints

### Get User Wallet

```
GET /api/token-bank/me
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "balance": 5000,
    "total_allocated": 6000,
    "total_spent": 1000,
    "transactions": [
      {
        "id": "tx-123",
        "type": "earned",
        "amount": 100,
        "description": "Completed task",
        "created_at": "2025-12-11T10:30:00Z"
      }
    ]
  }
}
```

### Get Transaction History

```
GET /api/token-bank/me/transactions
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [...],
    "total": 50,
    "page": 1,
    "limit": 20
  }
}
```

---

## ✅ Testing Checklist

### Admin Dashboard

- [ ] Компонент загружается без ошибок
- [ ] Отображается корректный баланс казначейства
- [ ] SSE подключение работает (live обновления)
- [ ] При отсутствии токена показывается сообщение об ошибке
- [ ] Fallback polling работает (если SSE недоступен)
- [ ] Компонент корректно размещён в dashboard

### User Wallet

- [ ] `refreshBalance()` обновляет баланс пользователя
- [ ] Баланс отображается в UI (WalletCard, header)
- [ ] После транзакций баланс обновляется автоматически
- [ ] localStorage синхронизируется с state

### Browser Console

- [ ] Нет ошибок 401/403 Authorization
- [ ] Нет ошибок 404 Not Found
- [ ] Логи показывают успешное подключение SSE
- [ ] Нет warnings о NaN values

---

## 🎯 Next Steps

### Этап 1: ✅ ЗАВЕРШЁН
- ✅ Обновлён `RealTimeTreasuryBalance.tsx` с правильной авторизацией
- ✅ Обновлён SSE endpoint для работы с токеном в query params
- ✅ Обновлён `UserContext.refreshBalance()` для нового API

### Этап 2: История транзакций пользователя
- [ ] Создать компонент `TransactionHistory.tsx`
- [ ] Добавить фильтры (earned/spent/bonus)
- [ ] Добавить пагинацию
- [ ] Интегрировать на страницу пользователя

### Этап 3: Admin Transaction Management
- [ ] Создать страницу `/app/admin/transactions/page.tsx`
- [ ] Показывать все транзакции в системе
- [ ] Фильтры по пользователю, типу, дате
- [ ] Экспорт в CSV

### Этап 4: Live Wallet Updates для пользователей
- [ ] SSE endpoint для обновлений баланса пользователя
- [ ] Real-time уведомления при изменении баланса
- [ ] Интеграция с `WalletCard` компонентом

---

## 📚 Полезные ссылки

- [API Endpoints Documentation](./API_ENDPOINTS.md)
- [Cookie Authentication Guide](./COOKIE_AUTH.md)
- [Server-Sent Events MDN](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)

---

**Обновлено:** 11 декабря 2025  
**Автор:** AI Assistant  
**Версия:** 2.0
