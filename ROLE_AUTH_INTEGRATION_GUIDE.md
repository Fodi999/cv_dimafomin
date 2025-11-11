# 🚀 Полное руководство по интеграции - Role-Based Auth с Go-бэкендом

## ✅ Что было сделано

Я создал полную систему авторизации для Next.js приложения с поддержкой двух ролей: **user** и **admin**.

### 📦 Созданные файлы

```
src/
├── types/index.ts                      # TypeScript типы
├── utils/api.ts                         # API клиент с JWT
├── contexts/AuthContext.tsx             # Context провайдер
├── components/withAuth.tsx              # HOC для защиты
├── components/AuthExamples.tsx          # Примеры компонентов
└── hooks/useAuth.ts                     # Хук для использования

app/
├── user/dashboard/page.tsx              # Дашборд пользователя
└── admin/dashboard/page.tsx             # Дашборд администратора
```

## 🔧 Быстрый старт

### 1. Обнови `app/layout.tsx` (главный layout)

Добавь `AuthProvider` вокруг всего приложения:

```tsx
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 2. Добавь переменную окружения

Создай/обнови `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Замени `localhost:8080` на адрес твоего Go бэкенда.

### 3. Готово! 🎉

Теперь можешь использовать:
- `/login` — страница входа
- `/user/dashboard` — дашборд пользователя (только для role=user)
- `/admin/dashboard` — дашборд администратора (только для role=admin)

## 📚 Как использовать в компонентах

### Получить данные пользователя

```tsx
import { useAuth } from '@/hooks/useAuth';

export function MyComponent() {
  const { user, role, isAuthenticated } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>User: {user?.name}</p>
          <p>Role: {role}</p>
        </>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  );
}
```

### Защитить страницу по ролям

```tsx
import { withAuth } from '@/components/withAuth';

function SecretPage() {
  return <h1>Secret admin content</h1>;
}

// Доступно только для админов
export default withAuth(SecretPage, { requiredRole: 'admin' });
```

### Отправить API запрос с автоматическим JWT

```tsx
import { api } from '@/utils/api';

async function fetchUsers() {
  // Токен подставляется автоматически в Authorization заголовок
  const users = await api.get('/api/users');
  console.log(users);
}
```

### Логин и логаут

```tsx
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

function LoginForm() {
  const { login, logout } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password123');
      router.push('/user/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <>
      <button onClick={handleLogin}>Login</button>
      <button onClick={() => {
        logout();
        router.push('/login');
      }}>Logout</button>
    </>
  );
}
```

## 🔄 Как это работает

### 1️⃣ Пользователь логинится

```
User вводит email/пароль на /login
     ↓
POST /api/login { email, password }
     ↓
Go бэкенд возвращает: { token: "jwt...", role: "admin" | "user" }
```

### 2️⃣ Фронтенд сохраняет токен

```typescript
// api.ts
const response = await api.post('/api/login', { email, password });
localStorage.setItem('token', response.token);
localStorage.setItem('role', response.role);
```

### 3️⃣ Context обновляется

```typescript
// AuthContext.tsx
const [role, setRole] = useState<UserRole | null>(null);
const [token, setToken] = useState<string | null>(null);
// Значения обновляются в Context → все компоненты получают обновление
```

### 4️⃣ Автоматический редирект

```typescript
// Используется useEffect в компонентах с withAuth
if (role === 'admin') router.push('/admin/dashboard');
if (role === 'user') router.push('/user/dashboard');
```

### 5️⃣ API запросы с JWT

```typescript
// api.ts автоматически добавляет заголовок
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
};
```

## 🛡️ Примеры защиты маршрутов

### Только авторизованные пользователи

```tsx
export default withAuth(MyPage);
// Если нет токена → редирект на /login
```

### Только админы

```tsx
export default withAuth(MyPage, { requiredRole: 'admin' });
// Если роль не admin → редирект на /login
```

### Только обычные пользователи

```tsx
export default withAuth(MyPage, { requiredRole: 'user' });
// Если роль не user → редирект на /login
```

### Несколько ролей

```tsx
export default withAuth(MyPage, { requiredRole: ['admin', 'moderator'] });
// Доступно только админам и модераторам
```

### Пользовательский редирект

```tsx
export default withAuth(MyPage, {
  requiredRole: 'admin',
  redirectTo: '/error/unauthorized',
});
// При недостатке прав → /error/unauthorized вместо /login
```

## 📡 Примеры API запросов

### GET запрос

```typescript
const users = await api.get<User[]>('/api/users');
```

### POST запрос

```typescript
const newUser = await api.post<User>('/api/users', {
  name: 'John',
  email: 'john@example.com',
});
```

### PUT запрос

```typescript
const updated = await api.put<User>('/api/users/123', {
  name: 'Jane',
});
```

### DELETE запрос

```typescript
await api.delete<void>('/api/users/123');
```

### PATCH запрос

```typescript
const updated = await api.patch<User>('/api/users/123', {
  email: 'newemail@example.com',
});
```

## 🧪 Тестирование

### 1. Проверить LocalStorage

Открой DevTools → Application → LocalStorage:

```
token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
role: admin
```

### 2. Проверить заголовки запроса

В DevTools → Network → выбери любой запрос → Headers:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Проверить Context

В компоненте:

```tsx
const { user, role, isAuthenticated } = useAuth();
console.log('User:', user);
console.log('Role:', role);
console.log('Authenticated:', isAuthenticated);
```

## ⚠️ Важные моменты

### 1. Токен в localStorage

⚠️ **Для продакшена** рекомендуется использовать **HttpOnly cookies** вместо localStorage.

Текущая реализация использует localStorage для простоты, но это менее безопасно для чувствительных данных.

### 2. Восстановление сессии

При перезагрузке страницы:

```typescript
// useEffect в AuthProvider
checkAuth() {
  // Получает токен и роль из localStorage
  // Context восстанавливает состояние автоматически
}
```

### 3. Ошибка 401

При получении 401:

```typescript
// api.ts автоматически:
if (response.status === 401) {
  localStorage.removeItem('token');
  // Пользователь будет редирект на /login при следующем запросе
}
```

### 4. CORS

Убедись, что твой Go бэкенд разрешает CORS для `http://localhost:3000`:

```go
// Go пример
router.Use(cors.Default())
```

## 📋 Типы данных

### User

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}
```

### LoginResponse

```typescript
interface LoginResponse {
  token: string;           // JWT токен
  role: 'user' | 'admin';  // Роль пользователя
  user?: User;             // Опциональные данные пользователя
}
```

### AuthContextType

```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  role: 'user' | 'admin' | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}
```

## 🚀 Развертывание

### Next.js

```bash
npm run build
npm start
```

### Docker (пример)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "start"]
```

## 💡 Расширение функциональности

### Добавить поле в User

1. Обнови тип в `src/types/index.ts`:

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar?: string;  // Новое поле
}
```

2. Используй в компоненте:

```typescript
const { user } = useAuth();
<img src={user?.avatar} />
```

### Добавить новую роль

1. Обнови тип:

```typescript
export type UserRole = 'user' | 'admin' | 'moderator';
```

2. Используй в защите:

```typescript
export default withAuth(MyPage, { requiredRole: 'moderator' });
```

### Добавить Refresh Token

Обнови `api.ts`:

```typescript
async request<T>(...): Promise<T> {
  // При получении 401
  if (response.status === 401) {
    // Попытка обновить токен через refresh_token
    const newToken = await refreshToken();
    if (newToken) {
      // Повторить запрос с новым токеном
    }
  }
}
```

## 🎯 Итог

У тебя есть полностью работающая система авторизации:

✅ **Типизированная** — все типы в TypeScript  
✅ **Безопасная** — JWT в заголовках Authorization  
✅ **Гибкая** — поддержка разных ролей  
✅ **Удобная** — автоматическая подстановка токена  
✅ **Масштабируемая** — легко добавить новые роли/функции  

Можешь теперь создавать защищённые страницы и использовать API с автоматическим JWT! 🚀
