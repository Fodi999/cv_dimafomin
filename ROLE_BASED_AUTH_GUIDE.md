# Фронтенд с поддержкой ролей для Go-бэкенда

Полная реализация авторизации с разделением по ролям (user/admin) для Next.js.

## 📋 Структура проекта

```
src/
├── types/
│   └── index.ts              # TypeScript типы
├── utils/
│   └── api.ts                # API клиент с JWT
├── contexts/
│   └── AuthContext.tsx        # Context для авторизации
├── components/
│   └── withAuth.tsx           # HOC для защиты страниц
└── hooks/
    └── useAuth.ts            # Хук для использования

app/
├── login/
│   └── page.tsx              # Страница входа
├── user/
│   └── dashboard/
│       └── page.tsx          # Дашборд пользователя (доступ: user)
└── admin/
    └── dashboard/
        └── page.tsx          # Дашборд администратора (доступ: admin)
```

## 🔐 Как работает авторизация

### 1. Типы (src/types/index.ts)

```typescript
export type UserRole = 'user' | 'admin';

export interface LoginResponse {
  token: string;
  role: UserRole;
  user?: User;
}
```

### 2. API Клиент (src/utils/api.ts)

```typescript
// Автоматически подставляет JWT токен в заголовок Authorization
const response = await api.post('/api/login', { email, password });

// Все запросы будут содержать:
// Authorization: Bearer <token>
```

### 3. Context (src/contexts/AuthContext.tsx)

```typescript
// Провайдер оборачивает приложение
<AuthProvider>
  <App />
</AuthProvider>

// Используется в компонентах
const { user, token, role, login, logout } = useAuth();
```

### 4. HOC withAuth (src/components/withAuth.tsx)

```typescript
// Защита страницы по ролям
export default withAuth(MyComponent, { requiredRole: 'admin' });

// Проверяет:
// 1. Наличие токена (если нет → /login)
// 2. Роль пользователя (если не подходит → /login)
```

## 🚀 Использование

### Страница с защитой

```typescript
'use client';

import { useAuth } from '@/hooks/useAuth';
import { withAuth } from '@/components/withAuth';

function MyPage() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <button onClick={logout}>Выход</button>
    </div>
  );
}

// Применяем HOC - доступно только администраторам
export default withAuth(MyPage, { requiredRole: 'admin' });
```

### Использование API

```typescript
import { api, login, logout } from '@/utils/api';

// Логин (возвращает токен и роль)
const response = await login('user@example.com', 'password');

// Обычный запрос (токен подставляется автоматически)
const users = await api.get('/api/users');

// POST запрос
const newUser = await api.post('/api/users', { name: 'John' });

// Логаут
logout();
```

### Использование Hook

```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, role, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) return <div>Not logged in</div>;

  return (
    <div>
      <p>User: {user?.name}</p>
      <p>Role: {role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## 🔄 Поток входа

1. Пользователь вводит email/пароль на `/login`
2. Запрос на `POST /api/login`
3. Бэкенд возвращает:
   ```json
   {
     "token": "eyJhbGc...",
     "role": "admin",
     "user": { "id": "123", "email": "admin@example.com" }
   }
   ```
4. Фронтенд сохраняет токен в `localStorage`
5. Context обновляется с новыми данными
6. Редирект:
   - Если `role === 'admin'` → `/admin/dashboard`
   - Если `role === 'user'` → `/user/dashboard`

## 🛡️ Защита маршрутов

### Только для авторизованных

```typescript
export default withAuth(MyComponent);
// Если токета нет → редирект на /login
```

### Только для админов

```typescript
export default withAuth(MyComponent, { requiredRole: 'admin' });
// Если роль не 'admin' → редирект на /login
```

### Несколько ролей

```typescript
export default withAuth(MyComponent, { requiredRole: ['admin', 'moderator'] });
// Доступно только админам и модераторам
```

### Пользовательский редирект

```typescript
export default withAuth(MyComponent, {
  requiredRole: 'admin',
  redirectTo: '/unauthorized',
});
// Если нет прав → редирект на /unauthorized вместо /login
```

## 📦 Переменные окружения

Добавьте в `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 🧪 Пример интеграции с Go-бэкендом

Твой Go бэкенд должен вернуть при логине:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "admin"
}
```

Фронтенд автоматически:
1. Сохранит токен
2. Подставит его в заголовок `Authorization: Bearer <token>`
3. Перенаправит пользователя на правильный дашборд

## ⚡ API методы

```typescript
// GET запрос
await api.get<User[]>('/api/users');

// POST запрос с телом
await api.post<User>('/api/users', { name: 'John' });

// PUT запрос
await api.put<User>('/api/users/123', { name: 'Jane' });

// DELETE запрос
await api.delete<void>('/api/users/123');

// PATCH запрос
await api.patch<User>('/api/users/123', { name: 'Updated' });
```

## 🔑 Утилиты

```typescript
// Получить сохраненный токен
const token = getStoredToken();

// Получить сохраненную роль
const role = getStoredRole();

// Логин (сохраняет токен автоматически)
await login('email@example.com', 'password');

// Логаут (удаляет токен)
logout();
```

## 📊 Примеры страниц

### /login
Форма входа, отправляет POST на `/api/login`

### /user/dashboard
Дашборд пользователя, доступен только при `role === 'user'`

### /admin/dashboard
Панель администратора, доступна только при `role === 'admin'`

## 🎯 Проверка при разработке

1. Откройте DevTools → Application → LocalStorage
2. После входа там должен быть ключ `token` с JWT
3. При запросе к API проверьте заголовки - там должен быть:
   ```
   Authorization: Bearer eyJhbGc...
   ```

## 📝 Важные моменты

- Токен хранится в `localStorage` (не очень безопасно для продакшена, используйте HttpOnly cookies)
- Context автоматически восстанавливает сессию при перезагрузке страницы
- HOC защищает от доступа неавторизованных пользователей
- Все ошибки 401 автоматически очищают токен
- API клиент типизирован через TypeScript generics

## 🚀 Готово к использованию!

Теперь ты можешь:
- ✅ Создавать защищённые страницы по ролям
- ✅ Сохранять и восстанавливать сессию
- ✅ Отправлять API запросы с автоматическим JWT
- ✅ Перенаправлять пользователей на нужные дашборды
