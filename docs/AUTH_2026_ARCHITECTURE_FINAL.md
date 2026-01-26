# Auth 2026 - Правильная архитектура ролей

**Дата:** 2026-01-26  
**Статус:** ✅ Финальная версия

---

## ПРАВИЛО №1: Единственный источник правды

```
Backend JWT → /api/auth/me → AuthContext → UI
```

### ❌ ЗАПРЕЩЕНО:

- Вычислять роли на фронте
- Использовать `hasRole` флаги
- Мапить/преобразовывать роли
- Хардкодить логику ролей
- Использовать условные роли

### ✅ РАЗРЕШЕНО:

- Читать `role` из `AuthContext.user`
- Проецировать состояние в UI
- Редиректить по роли (только чтение)

---

## Архитектура

### Backend (источник правды)

```
Database → User Table
  ↓
{
  id: uuid,
  email: string,
  role: "customer" | "home_chef" | "chef_staff" | "admin" | "super_admin",
  status: "pending" | "active" | "suspended" | "blocked"
}
  ↓
JWT Token
  ↓
GET /api/auth/me
{
  "success": true,
  "data": {
    "id": "...",
    "email": "user@example.com",
    "role": "home_chef",          // ✅ НЕ ВЫЧИСЛЯЕТСЯ
    "status": "active"
  }
}
```

### Frontend (проекция состояния)

```typescript
// contexts/AuthContext.tsx
export type User = {
  id: string;
  email: string;
  role: "customer" | "home_chef" | "chef_staff" | "admin" | "super_admin";
  status: "pending" | "active" | "suspended" | "blocked";
};

// ✅ Единственный источник данных
const loadMe = async () => {
  const res = await AuthAPI.me(); // GET /api/auth/me
  
  const userData: User = {
    id: res.data.id,
    email: res.data.email,
    role: res.data.role,      // ✅ Напрямую из backend
    status: res.data.status,  // ✅ Напрямую из backend
  };
  
  setUser(userData); // ✅ Никаких вычислений
};
```

---

## Использование в UI

### 1. Проверка роли

```typescript
// ✅ ПРАВИЛЬНО
const { user } = useAuth();

if (user?.role === "admin" || user?.role === "super_admin") {
  // Показать админ панель
}

// ❌ НЕПРАВИЛЬНО
const role = calculateRole(user); // ❌ Вычисление
const hasAdminRole = user?.hasRole; // ❌ Флаг
```

### 2. Роутинг

```typescript
// lib/auth/routeByRole.ts

// ✅ ПРАВИЛЬНО: Только ЧТЕНИЕ роли
export function routeByRole(role: UserRole): string {
  if (role === "super_admin" || role === "admin") {
    return "/admin/dashboard";
  }
  
  if (role === "home_chef" || role === "chef_staff") {
    return "/marketplace"; // TODO: /chef/dashboard
  }
  
  return "/marketplace"; // customer
}

// ❌ НЕПРАВИЛЬНО: Вычисление роли
export function routeByRole(user: User): string {
  let role = "customer";
  if (user.isAdmin) role = "admin"; // ❌ Вычисление
  // ...
}
```

### 3. Защита маршрутов

```typescript
// components/auth/RequireAuth.tsx

// ✅ ПРАВИЛЬНО
const { user } = useAuth();

if (!user) {
  router.replace("/login");
  return null;
}

if (allowRoles && !allowRoles.includes(user.role)) {
  router.replace(routeByRole(user.role));
  return null;
}

// ❌ НЕПРАВИЛЬНО
if (!user.hasRole) { // ❌ Флаг
  // ...
}
```

### 4. UI компоненты

```typescript
// ✅ ПРАВИЛЬНО: Projection, не вычисление
function NavigationMenu() {
  const { user } = useAuth();
  
  return (
    <>
      {/* Доступно всем */}
      <MenuItem href="/marketplace">Marketplace</MenuItem>
      
      {/* Только для chef */}
      {(user?.role === "home_chef" || user?.role === "chef_staff") && (
        <MenuItem href="/kitchen">Kitchen</MenuItem>
      )}
      
      {/* Только для admin */}
      {(user?.role === "admin" || user?.role === "super_admin") && (
        <MenuItem href="/admin">Admin</MenuItem>
      )}
    </>
  );
}

// ❌ НЕПРАВИЛЬНО
function NavigationMenu() {
  const { user } = useAuth();
  const role = getUserRole(user); // ❌ Вычисление
  
  if (role === "admin") { // ❌ Использование вычисленной роли
    // ...
  }
}
```

---

## Context'ы (иерархия)

### 1. AuthContext (первичный)

```typescript
// ✅ Единственный источник user данных
// ✅ Загружает из GET /api/auth/me
// ❌ НЕ вычисляет роли
// ❌ НЕ мапит роли

const { user, loading, signIn, signOut } = useAuth();

user: {
  id: string;
  email: string;
  role: "customer" | "home_chef" | "chef_staff" | "admin" | "super_admin";
  status: "pending" | "active" | "suspended" | "blocked";
}
```

### 2. SessionContext (вторичный)

```typescript
// ✅ Использует AuthContext.user
// ✅ Добавляет расширенные данные (name, avatar, tokens)
// ❌ НЕ вызывает /api/user/profile
// ❌ НЕ мапит роли

const { session, user } = useSession();

session: {
  userId: string;
  role: UserRole;        // ✅ Из AuthContext
  mode: AppMode;         // ✅ Вычисляется из role (только для UI)
  user: SessionUser;
}
```

### 3. UserContext (вторичный)

```typescript
// ✅ Использует AuthContext.user
// ✅ Добавляет расширенные данные из localStorage cache
// ❌ НЕ вызывает /api/user/profile
// ❌ НЕ мапит роли

const { user } = useUser();

user: {
  id: string;
  email: string;
  role: UserRole;  // ✅ Из AuthContext
  name?: string;
  avatar?: string;
  level?: number;
  chefTokens?: number;
}
```

---

## Админка: Управление пользователями

### UI (таблица пользователей)

```typescript
function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    // ✅ Отправляем на backend
    await fetch(`/api/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role: newRole }),
    });
    
    // ✅ Обновляем список
    await refetchUsers();
  };
  
  return (
    <table>
      {users.map(user => (
        <tr key={user.id}>
          <td>{user.email}</td>
          <td>
            <select 
              value={user.role}
              onChange={(e) => handleRoleChange(user.id, e.target.value)}
            >
              <option value="customer">Customer</option>
              <option value="home_chef">Home Chef</option>
              <option value="chef_staff">Chef Staff</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </td>
          <td>{user.status}</td>
        </tr>
      ))}
    </table>
  );
}
```

### Backend API

```
PATCH /api/admin/users/:id/role
Body: { "role": "home_chef" }

PATCH /api/admin/users/:id/status  
Body: { "status": "suspended" }
```

**Важно:**
- Изменения сохраняются в Database
- JWT обновится при следующем login/refresh
- Frontend получит новую роль через GET /api/auth/me

---

## Роли (Backend определения)

### Типы пользователей

```typescript
type UserRole = 
  | "customer"      // Покупатель (базовый доступ)
  | "home_chef"     // Домашний повар (кухня, AI, бюджет)
  | "chef_staff"    // Персонал повара (помощь home_chef)
  | "admin"         // Администратор (управление системой)
  | "super_admin";  // Суперадмин (полный доступ)

type UserStatus =
  | "pending"       // Ожидает активации
  | "active"        // Активный
  | "suspended"     // Приостановлен
  | "blocked";      // Заблокирован
```

### UI доступ по ролям

**CUSTOMER:**
- ✅ Marketplace
- ✅ My Orders
- ✅ Profile (базовый)

**HOME_CHEF / CHEF_STAFF:**
- ✅ Kitchen
- ✅ Fridge
- ✅ Recipes
- ✅ AI Recipe Generator
- ✅ Budget Tracker
- ✅ Marketplace (как customer)

**ADMIN / SUPER_ADMIN:**
- ✅ Admin Dashboard
- ✅ Users Management
- ✅ Roles & Permissions
- ✅ Statistics
- ✅ Marketplace Control
- ✅ Все доступы customer и chef

---

## Чеклист правильной архитектуры

### Backend
- [ ] `hasRole` удален из JWT
- [ ] `GET /api/auth/me` возвращает `{ id, email, role, status }`
- [ ] `PATCH /api/admin/users/:id/role` работает
- [ ] `PATCH /api/admin/users/:id/status` работает
- [ ] AuthMiddleware проверяет `status === "active"`

### Frontend
- [x] AuthContext — единственный источник `user` данных
- [x] SessionContext использует AuthContext (не вызывает API)
- [x] UserContext использует AuthContext (не вызывает API)
- [x] `routeByRole()` — только чтение, не вычисление
- [x] `routeByStatus()` — только чтение, не вычисление
- [x] UI компоненты проецируют состояние, не вычисляют роли
- [x] Нет упоминаний `hasRole`
- [x] Нет вычислений ролей (`calculateRole`, `mapRole`, etc)

### Документация
- [x] AUTH_2026_ARCHITECTURE_FINAL.md — правильная архитектура
- [x] AUTH_2026_DEPLOYMENT_COMPLETE.md — деплой гайд
- [x] AUTH_2026_PUBLIC_VS_AUTH_ENDPOINTS.md — публичные endpoint'ы

---

## Примеры ошибок (НЕ ДЕЛАТЬ)

### ❌ Вычисление роли

```typescript
// ❌ НЕПРАВИЛЬНО
function getUserRole(user: User): string {
  if (user.isAdmin) return "admin";
  if (user.isChef) return "chef";
  return "customer";
}
```

### ❌ Использование hasRole

```typescript
// ❌ НЕПРАВИЛЬНО
if (user.hasRole) {
  // ...
}
```

### ❌ Мапинг ролей

```typescript
// ❌ НЕПРАВИЛЬНО
let mappedRole: UserRole = 'customer';
if (userData.role === 'superadmin') {
  mappedRole = 'super_admin';
}
```

### ❌ Условные роли

```typescript
// ❌ НЕПРАВИЛЬНО
const role = user.type === "business" ? "admin" : "customer";
```

### ❌ Вызов /api/user/profile для получения роли

```typescript
// ❌ НЕПРАВИЛЬНО
const profile = await fetch('/api/user/profile');
const role = profile.role; // ✅ Только из /api/auth/me!
```

---

## Заключение

**ГЛАВНОЕ ПРАВИЛО:**

```
Backend определяет роль → Frontend только читает и проецирует
```

**НЕ ВЫЧИСЛЯЕМ. ЧИТАЕМ.**

---

**Статус:** ✅ Архитектура соответствует 2026 стандартам  
**Дата:** 2026-01-26
