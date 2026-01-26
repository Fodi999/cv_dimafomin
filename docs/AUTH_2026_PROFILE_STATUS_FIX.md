# Auth 2026: Исправление отображения статуса в профиле

**Дата:** 2026-01-26  
**Проблема:** Статус не отображается и не обновляется в профиле  
**Статус:** ✅ Исправлено

---

## Проблема

### Симптомы
- Пользователь меняет статус через админку
- Статус обновляется в базе данных
- Но в профиле статус не меняется

### Причины

1. **Статус вообще не отображался на странице профиля**
   - `app/admin/profile/page.tsx` не показывал ни роль, ни статус
   - Пользователь не видел актуальные данные

2. **SessionContext не обновлялся при изменении auth.user**
   - Проверка `if (profileLoaded) { return; }` блокировала обновление
   - При вызове `reloadMe()` в AuthContext, SessionContext не реагировал

3. **UserContext не обновлялся при изменении auth.user**
   - Аналогичная проблема с зависимостями

---

## Решение

### 1. Добавлен `reloadMe()` в AuthContext

**Файл:** `contexts/AuthContext.tsx`

```typescript
/**
 * ✅ 2026: Reload user from /api/auth/me
 * 
 * КРИТИЧНО: Вызывается после любых изменений:
 * - После изменения роли админом
 * - После изменения статуса
 * - После обновления профиля
 */
const reloadMe = async () => {
  console.log("[AuthContext] 🔄 Reloading user from /api/auth/me");
  try {
    await loadMe();
    console.log("[AuthContext] ✅ User reloaded successfully");
  } catch (error) {
    console.error("[AuthContext] ❌ Failed to reload user:", error);
  }
};

// Экспортируется в AuthState
type AuthState = {
  user: User | null;
  loading: boolean;
  reloadMe: () => Promise<void>; // ✅
  // ...
};
```

---

### 2. Исправлен SessionContext для реактивности

**Файл:** `contexts/SessionContext.tsx`

**Было:**
```typescript
useEffect(() => {
  if (!auth.isAuthenticated || !auth.user) {
    // ...
    return;
  }

  if (profileLoaded) {
    console.log("Session already created, skipping");
    return; // ❌ Блокировало обновление!
  }

  createSessionFromAuth();
}, [auth.isAuthenticated, auth.user]);
```

**Стало:**
```typescript
useEffect(() => {
  if (!auth.isAuthenticated || !auth.user) {
    setSession(null);
    setProfileLoaded(false);
    return;
  }

  // ✅ ВСЕГДА обновляем session при изменении auth.user
  // Убрали проверку profileLoaded - это важно для reloadMe()
  console.log("[SessionContext] 🔄 AuthContext.user changed, updating session");
  createSessionFromAuth();
}, [auth.user]); // ✅ Зависимость ТОЛЬКО от auth.user
```

---

### 3. Исправлен UserContext для реактивности

**Файл:** `contexts/UserContext.tsx`

```typescript
useEffect(() => {
  if (!auth.isAuthenticated || !auth.user) {
    setUser(null);
    setProfileLoaded(false);
    return;
  }

  console.log("[UserContext] 🔄 AuthContext.user changed, syncing data");

  // Создаём user из authUser
  const authUser = auth.user;
  setUser({
    id: authUser.id,
    email: authUser.email,
    role: authUser.role, // ✅ 2026: Напрямую из AuthContext
    // ... extended data from cache
  });

  setProfileLoaded(true);
  setIsLoading(false);
  
  console.log("[UserContext] ✅ User data synced from AuthContext:", {
    id: authUser.id,
    role: authUser.role,
    status: authUser.status,
  });
}, [auth.user]); // ✅ Зависимость ТОЛЬКО от auth.user
```

---

### 4. Добавлено отображение роли и статуса в профиле

**Файл:** `app/admin/profile/page.tsx`

**Добавлено:**
- ✅ Импорт `useAuth` для получения `authUser` и `reloadMe`
- ✅ Helper функции `getRoleConfig()` и `getStatusConfig()`
- ✅ Badge компоненты для роли и статуса в header
- ✅ Кнопка 🔄 для ручного вызова `reloadMe()`

```typescript
export default function AdminProfile() {
  const { user } = useUser();
  const { user: authUser, reloadMe } = useAuth(); // ✅ Для роли и статуса
  
  // Helper functions
  const getRoleConfig = (role: string) => {
    const configs = {
      customer: { label: "👤 Customer", variant: "secondary", icon: User },
      home_chef: { label: "👨‍🍳 Home Chef", variant: "default", icon: User },
      chef_staff: { label: "👔 Chef Staff", variant: "default", icon: User },
      admin: { label: "🛡️ Admin", variant: "default", icon: Shield },
      super_admin: { label: "👑 Super Admin", variant: "destructive", icon: Crown },
    };
    return configs[role] || configs.customer;
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      active: { 
        label: "Active", 
        icon: CheckCircle, 
        className: "bg-green-50 text-green-700" 
      },
      pending: { 
        label: "Pending", 
        icon: AlertTriangle, 
        className: "bg-yellow-50 text-yellow-700" 
      },
      suspended: { 
        label: "Suspended", 
        icon: XCircle, 
        className: "bg-orange-50 text-orange-700" 
      },
      blocked: { 
        label: "Blocked", 
        icon: Ban, 
        className: "bg-red-50 text-red-700" 
      },
    };
    return configs[status] || configs.active;
  };

  const roleConfig = getRoleConfig(authUser?.role || "customer");
  const statusConfig = getStatusConfig(authUser?.status || "active");

  return (
    <div className="min-h-screen">
      {/* Header with Role and Status */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()}>
              <ArrowLeft />
            </button>
            <div>
              <h1>Мій профіль</h1>
              <p>{user.email}</p>
            </div>
          </div>
          
          {/* ✅ Роль и статус */}
          <div className="flex items-center gap-2">
            <Badge variant={roleConfig.variant}>
              <roleConfig.icon className="w-3 h-3 mr-1" />
              {roleConfig.label}
            </Badge>
            <Badge className={statusConfig.className}>
              <statusConfig.icon className="w-3 h-3 mr-1" />
              {statusConfig.label}
            </Badge>
            <button onClick={reloadMe} title="Оновити дані">
              🔄
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Как работает обновление

### Процесс 1: Админ меняет статус другого пользователя

```
1. Admin Users Page → Изменить статус пользователя
   ↓
2. changeStatus(userId, newStatus)
   ↓
3. PATCH /api/admin/users/{id}/status
   ↓
4. Backend обновляет status в БД
   ↓
5. Frontend refetch() списка пользователей
   ↓
6. UI обновляется
```

### Процесс 2: Админ меняет СВОЙ статус

```
1. Admin Users Page → Изменить свой статус
   ↓
2. changeStatus(myId, newStatus)
   ↓
3. PATCH /api/admin/users/{id}/status
   ↓
4. Backend обновляет status в БД
   ↓
5. Frontend вызывает reloadMe()
   ↓
6. AuthContext → GET /api/auth/me
   ↓
7. AuthContext → setUser(newUserData)
   ↓
8. SessionContext useEffect срабатывает (auth.user changed)
   ↓
9. UserContext useEffect срабатывает (auth.user changed)
   ↓
10. Все компоненты обновляются автоматически
    ├── ProfilePage → новый статус в badge
    ├── Navigation → обновленная роль
    └── Guards → новые права доступа
```

### Процесс 3: Пользователь вручную обновляет профиль

```
1. ProfilePage → Нажать кнопку 🔄
   ↓
2. reloadMe() вызывается
   ↓
3. AuthContext → GET /api/auth/me
   ↓
4. AuthContext → setUser(newUserData)
   ↓
5. Все зависимые контексты обновляются
   ↓
6. UI показывает актуальные данные
```

---

## Цепочка реактивности

```
AuthContext.user изменился
         ↓
    (зависимость)
         ↓
┌────────┴────────┐
│                 │
SessionContext   UserContext
   ↓                 ↓
(обновляет       (обновляет
 session)          user)
   ↓                 ↓
   └────────┬────────┘
            ↓
      UI Components
      (автоматически
       обновляются)
```

---

## Ключевые изменения

### 1. Убрана проверка `profileLoaded`

**Было:**
```typescript
if (profileLoaded) {
  return; // ❌ Блокировало обновление
}
```

**Стало:**
```typescript
// ✅ Всегда обновляем при изменении auth.user
createSessionFromAuth();
```

### 2. Изменена зависимость useEffect

**Было:**
```typescript
}, [auth.isAuthenticated, auth.user]); // ❌ Две зависимости
```

**Стало:**
```typescript
}, [auth.user]); // ✅ Одна зависимость
```

**Почему:**
- `auth.isAuthenticated` вычисляется из `auth.user`
- Двойная зависимость вызывала лишние ререндеры
- Достаточно следить только за `auth.user`

### 3. Добавлено отображение статуса

**Было:**
```tsx
<div>
  <h1>Мій профіль</h1>
  <p>{user.email}</p>
</div>
// ❌ Статус не отображался
```

**Стало:**
```tsx
<div className="flex justify-between">
  <div>
    <h1>Мій профіль</h1>
    <p>{user.email}</p>
  </div>
  
  {/* ✅ Роль и статус */}
  <div className="flex gap-2">
    <Badge>{roleConfig.label}</Badge>
    <Badge className={statusConfig.className}>
      {statusConfig.label}
    </Badge>
    <button onClick={reloadMe}>🔄</button>
  </div>
</div>
```

---

## Тестирование

### Тест 1: Изменение статуса через админку

1. Залогиньтесь как super_admin
2. Откройте Admin Users
3. Измените свой статус на "suspended"
4. Проверьте профиль

**Ожидается:**
```
✅ [AdminUsersPage] Admin changed own status, reloading
✅ [AuthContext] Reloading user from /api/auth/me
✅ [SessionContext] AuthContext.user changed, updating session
✅ [UserContext] User data synced from AuthContext: {status: 'suspended'}
✅ ProfilePage показывает Badge "Suspended" оранжевого цвета
```

### Тест 2: Ручное обновление в профиле

1. Откройте профиль
2. Нажмите кнопку 🔄
3. Данные обновляются

**Ожидается:**
```
✅ [AuthContext] Reloading user from /api/auth/me
✅ [SessionContext] AuthContext.user changed, updating session
✅ UI обновляется с актуальными данными
```

### Тест 3: Автоматическое обновление при 403

1. Backend блокирует пользователя (status = "blocked")
2. Пользователь делает любой запрос
3. Backend возвращает 403 "User is not active"

**Ожидается:**
```
✅ [authFetch] Got 403 - user status changed
✅ Redirect на /account/status
✅ Показывается страница "Account Blocked"
```

---

## Файлы изменены

### Contexts
- ✅ `contexts/AuthContext.tsx`
  - Добавлен метод `reloadMe()`
  - Экспортируется в AuthState
  - Убрано сохранение роли в localStorage

- ✅ `contexts/SessionContext.tsx`
  - Убрана проверка `profileLoaded`
  - Зависимость только от `auth.user`
  - Всегда обновляется при изменении

- ✅ `contexts/UserContext.tsx`
  - Зависимость только от `auth.user`
  - Улучшено логирование
  - Fallback для name из email

### Pages
- ✅ `app/admin/profile/page.tsx`
  - Импорт `useAuth` для роли и статуса
  - Helper функции для роли и статуса
  - Badge компоненты в header
  - Кнопка 🔄 для reloadMe()

- ✅ `app/admin/users/page.tsx`
  - Вызов `reloadMe()` при изменении своей роли
  - Вызов `reloadMe()` при изменении своего статуса
  - Redirect через `resolveUserRoute()` после изменения

### Utils
- ✅ `lib/auth/resolveUserRoute.ts`
  - Функция `resolveUserRoute(user)` - определение маршрута
  - Функция `canAccessRoute(user, route)` - проверка доступа
  - Функция `getStatusRoute(status)` - маршрут по статусу

### API
- ✅ `lib/api/authFetch.ts`
  - Обработка 403 "User is not active"
  - Redirect на /account/status при блокировке

### Account Status
- ✅ `app/account/status/page.tsx`
  - Страница для неактивных пользователей
  - Показывает причину блокировки
  - Кнопка "Refresh Status" (вызывает reloadMe())
  - Контакты поддержки

---

## Архитектура реактивности

```
┌─────────────────────────────────────────┐
│       Backend изменяет status           │
│     (через PATCH /api/admin/users)      │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Frontend обнаруживает изменение:       │
│  1. Автоматически (403 от backend)      │
│  2. Вручную (reloadMe() вызван)         │
│  3. Через админку (после PATCH)         │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  AuthContext.reloadMe()                 │
│  ├── GET /api/auth/me                   │
│  └── setUser(newUserData)               │
└─────────────────────────────────────────┘
                  ↓
┌──────────────┬──────────────┐
│              │              │
│ SessionCtx   │  UserContext │
│ (useEffect)  │  (useEffect) │
│              │              │
│ auth.user    │  auth.user   │
│ изменился    │  изменился   │
│     ↓        │      ↓       │
│ update       │  update      │
│ session      │  user        │
└──────────────┴──────────────┘
                  ↓
┌─────────────────────────────────────────┐
│          UI Components                  │
│  ├── ProfilePage (Badge updated)        │
│  ├── Navigation (Role updated)          │
│  ├── Guards (Access updated)            │
│  └── AdminDashboard (UI updated)        │
└─────────────────────────────────────────┘
```

---

## Правило 2026: Источник правды

```
❌ НЕ читаем статус из:
- localStorage
- JWT токена
- Cookies
- Кэша

✅ Читаем статус ТОЛЬКО из:
- AuthContext.user.status
- Который получен из GET /api/auth/me
- Который загружен из Database
```

---

## UI отображение

### Header профиля

```tsx
<div className="flex items-center justify-between">
  {/* Left: Title */}
  <div>
    <h1>Мій профіль</h1>
    <p>{user.email}</p>
  </div>
  
  {/* Right: Role + Status + Refresh */}
  <div className="flex gap-2">
    <Badge variant={roleConfig.variant}>
      <roleConfig.icon />
      {roleConfig.label}
    </Badge>
    <Badge className={statusConfig.className}>
      <statusConfig.icon />
      {statusConfig.label}
    </Badge>
    <button onClick={reloadMe}>🔄</button>
  </div>
</div>
```

### Визуальные индикаторы

**Роли:**
- 👤 Customer - серый (secondary)
- 👨‍🍳 Home Chef - синий (default)
- 👔 Chef Staff - синий (default)
- 🛡️ Admin - синий (default)
- 👑 Super Admin - красный (destructive)

**Статусы:**
- ✅ Active - зеленый
- ⏳ Pending - желтый
- ⚠️ Suspended - оранжевый
- 🚫 Blocked - красный

---

## Чеклист

### AuthContext
- [x] Метод `reloadMe()` реализован
- [x] Экспортируется в AuthState
- [x] Вызывает `loadMe()` для перезагрузки
- [x] Логирует результат

### SessionContext / UserContext
- [x] Убрана проверка `profileLoaded`
- [x] Зависимость только от `auth.user`
- [x] Всегда обновляется при изменении
- [x] Улучшено логирование

### ProfilePage
- [x] Импортирует `useAuth`
- [x] Отображает роль через Badge
- [x] Отображает статус через Badge
- [x] Кнопка обновления (reloadMe)
- [x] Helper функции для конфигурации

### Admin Actions
- [x] Вызывает `reloadMe()` при изменении своей роли
- [x] Вызывает `reloadMe()` при изменении своего статуса
- [x] Redirect через `resolveUserRoute()` после изменения

---

**Статус:** ✅ Исправлено и протестировано  
**Дата:** 2026-01-26  
**Версия:** Auth 2026 Final
