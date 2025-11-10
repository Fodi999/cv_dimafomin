# 🔧 API Endpoints Fix - 2025-11-10 (FINAL)

## ✅ Проблема решена!

Backend имеет правильные endpoint'ы, frontend был неправильно их вызывал.

## 🔴 Было неправильно:
```
GET /api/profile → 404 (не существует)
GET /api/wallet → 404 (не существует)
```

## 🟢 Исправлено на правильные:

### Profile API
```
GET /api/user/profile (protected, needs auth)
PUT /api/user/profile (protected, needs auth)
```

### Wallet API
```
GET /api/wallet/balance (protected, needs auth)
GET /api/wallet/transactions (protected, needs auth)
POST /api/wallet/purchase
POST /api/wallet/spend
```

## 📝 Изменённые endpoints в lib/api.ts

### Profile Endpoints

```typescript
// Было:
getProfile: async (userId: string, token?: string) => {
  return apiFetch<ProfileData>(`/profile`, { token });
}

updateProfile: async (userId: string, data: any, token: string) => {
  return apiFetch<ProfileData>(`/profile`, {
    method: "PUT",
    token,
    body: JSON.stringify(data),
  });
}

// Стало:
getProfile: async (userId: string, token?: string) => {
  return apiFetch<ProfileData>(`/user/profile`, { token });
}

updateProfile: async (userId: string, data: any, token: string) => {
  return apiFetch<ProfileData>(`/user/profile`, {
    method: "PUT",
    token,
    body: JSON.stringify(data),
  });
}
```

✅ `/profile` → `/user/profile`

### Wallet Balance Endpoint

```typescript
// Было:
getBalance: async (userId: string, token: string) => {
  return apiFetch(`/wallet`, { token });
}

// Стало:
getBalance: async (userId: string, token: string) => {
  return apiFetch(`/wallet/balance`, { token });
}
```

✅ `/wallet` → `/wallet/balance`

### Wallet Transactions Endpoint

```typescript
// Уже правильный:
getTransactions: async (userId: string, token: string, filters?: {...}) => {
  return apiFetch(`/wallet/transactions?${params}`, { token });
}
```

✅ Это уже `/wallet/transactions` - OK!

### Wallet Purchase & Spend

```typescript
// Уже правильные:
purchaseTokens: async (...) => {
  return apiFetch("/wallet/purchase", { ... });
}

spendTokens: async (...) => {
  return apiFetch("/wallet/spend", { ... });
}
```

✅ Оба используют правильные endpoints - OK!

## 📋 Итоговая таблица всех endpoints

| Функция | Endpoint | Метод | Auth |
|---------|----------|-------|------|
| getProfile | `/user/profile` | GET | ✅ |
| updateProfile | `/user/profile` | PUT | ✅ |
| getBalance | `/wallet/balance` | GET | ✅ |
| getTransactions | `/wallet/transactions` | GET | ✅ |
| purchaseTokens | `/wallet/purchase` | POST | ✅ |
| spendTokens | `/wallet/spend` | POST | ✅ |
| getUserPosts | `/posts` | GET | ✅ |
| getDashboard | `/user/{userId}/dashboard` | GET | ✅ |
| getAllPosts | `/posts` | GET | ❌ |

## ✅ Проверка логов

После исправления в консоли должно быть:

```
📡 API Call: GET /user/profile
📡 API Call: GET /wallet/balance
📡 API Call: GET /wallet/transactions
📡 API Call: GET /posts
```

## 🔗 Файлы изменены

- ✅ `lib/api.ts` - обновлены endpoints:
  - `getProfile()` - `/profile` → `/user/profile`
  - `updateProfile()` - `/profile` → `/user/profile`
  - `getBalance()` - `/wallet` → `/wallet/balance`

## 🎯 Статус

🟢 **ГОТОВО** - Все endpoints теперь совпадают с backend

Спасибо за помощь в диагностике! 🙏

