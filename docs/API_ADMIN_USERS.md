# Admin Users API Contract

> **Философия**: Фронтенд получает ТОЛЬКО то, что рисуется. Никаких паролей, токенов, лишних полей.

## 📋 1. Список пользователей

### Endpoint
```
GET /api/admin/users
```

### Query Parameters
```typescript
{
  page?: number          // default: 1
  limit?: number         // default: 20, max: 100
  search?: string        // поиск по name OR email
  role?: 'user' | 'admin' | 'premium'
  status?: 'active' | 'blocked' | 'inactive'
  sort?: 'created_at' | 'last_active'  // default: 'created_at'
  order?: 'asc' | 'desc'                // default: 'desc'
}
```

### Response
```typescript
{
  meta: {
    total: number           // 3847 (всего пользователей)
    activeToday: number     // 5.1 (процент активных сегодня)
    blocked: number         // 12 (заблокированных)
    premium: number         // 245 (премиум пользователей)
    page: number            // текущая страница
    limit: number           // лимит на страницу
    totalPages: number      // общее количество страниц
  }
  items: Array<{
    id: string
    name: string
    email: string
    avatarUrl?: string

    role: 'user' | 'admin' | 'premium'
    status: 'active' | 'blocked' | 'inactive'

    joinedAt: string        // ISO 8601: "2024-01-15T10:30:00Z"
    lastActiveAt: string    // ISO 8601: "2025-01-04T14:32:00Z"

    stats: {
      ordersCount?: number     // optional, если нет заказов = undefined
      totalSpent?: number      // optional, в долларах
    }
  }>
}
```

### Example Request
```bash
GET /api/admin/users?page=1&limit=20&status=active&search=олександр
```

### Example Response
```json
{
  "meta": {
    "total": 3847,
    "activeToday": 5.1,
    "blocked": 12,
    "premium": 245,
    "page": 1,
    "limit": 20,
    "totalPages": 193
  },
  "items": [
    {
      "id": "usr_1",
      "name": "Олександр Петренко",
      "email": "alex@example.com",
      "avatarUrl": "https://cdn.example.com/avatars/usr_1.jpg",
      "role": "premium",
      "status": "active",
      "joinedAt": "2024-01-15T10:30:00Z",
      "lastActiveAt": "2025-01-04T14:32:00Z",
      "stats": {
        "ordersCount": 23,
        "totalSpent": 1250.50
      }
    }
  ]
}
```

### ✅ Важно
- ❌ **НЕ возвращаем**: `password`, `passwordHash`, `tokens`, `sessions`, приватные поля
- ❌ **НЕ возвращаем**: всё подряд "на всякий случай"
- ✅ **ТОЛЬКО**: то, что реально рисуется в таблице
- ✅ `stats` могут быть пустыми (не все юзеры делают заказы)

---

## 👤 2. Детали пользователя (Modal / Drawer)

### Endpoint
```
GET /api/admin/users/:id
```

### Response
```typescript
{
  id: string
  name: string
  email: string
  phone?: string              // опционально
  avatarUrl?: string

  role: 'user' | 'admin' | 'premium'
  status: 'active' | 'blocked' | 'inactive'

  joinedAt: string            // ISO 8601
  lastActiveAt: string        // ISO 8601

  locale: 'uk' | 'pl' | 'ru' | 'en'
  timezone: string            // "Europe/Kyiv"

  stats: {
    ordersCount: number
    totalSpent: number        // в долларах
    recipesCreated: number
    aiRequests: number
  }
}
```

### Example Request
```bash
GET /api/admin/users/usr_1
```

### Example Response
```json
{
  "id": "usr_1",
  "name": "Олександр Петренко",
  "email": "alex@example.com",
  "phone": "+380991234567",
  "avatarUrl": "https://cdn.example.com/avatars/usr_1.jpg",
  "role": "premium",
  "status": "active",
  "joinedAt": "2024-01-15T10:30:00Z",
  "lastActiveAt": "2025-01-04T14:32:00Z",
  "locale": "uk",
  "timezone": "Europe/Kyiv",
  "stats": {
    "ordersCount": 23,
    "totalSpent": 1250.50,
    "recipesCreated": 5,
    "aiRequests": 120
  }
}
```

### 🔐 RBAC Rules
- `role` и `status` — может менять только `admin` / `superadmin`
- `email` — **read-only** (нельзя менять)
- `phone` — **read-only** (или editable, если бизнесу нужно)
- `locale`, `timezone` — меняет сам пользователь

---

## 🔄 3. Изменить роль

### Endpoint
```
PATCH /api/admin/users/:id/role
```

### Request Body
```typescript
{
  role: 'user' | 'admin' | 'premium'
}
```

### Response
```typescript
{
  success: true
  user: {
    id: string
    role: 'user' | 'admin' | 'premium'
  }
}
```

### Example Request
```bash
PATCH /api/admin/users/usr_1/role
Content-Type: application/json

{
  "role": "admin"
}
```

### Example Response
```json
{
  "success": true,
  "user": {
    "id": "usr_1",
    "role": "admin"
  }
}
```

### Security
- ✅ Логируется в `admin_activity_log`
- ✅ Проверка JWT + роли админа
- ⚠️ Нельзя изменить роль самому себе (защита от случайного downgrade)

---

## 🚫 4. Изменить статус (Блокировка / Разблокировка)

### Endpoint
```
PATCH /api/admin/users/:id/status
```

### Request Body
```typescript
{
  status: 'active' | 'blocked' | 'inactive'
  reason?: string  // опционально, причина блокировки
}
```

### Response
```typescript
{
  success: true
  user: {
    id: string
    status: 'active' | 'blocked' | 'inactive'
  }
}
```

### Example Request (Блокировка)
```bash
PATCH /api/admin/users/usr_1/status
Content-Type: application/json

{
  "status": "blocked",
  "reason": "Спам в комментариях"
}
```

### Example Response
```json
{
  "success": true,
  "user": {
    "id": "usr_1",
    "status": "blocked"
  }
}
```

### Security
- ✅ Логируется в `admin_activity_log` с причиной
- ✅ Блокированный пользователь → `logout` + редирект
- ⚠️ Нельзя заблокировать самого себя

---

## 📊 5. Dashboard KPI (Статистика)

### Endpoint
```
GET /api/admin/users/stats
```

### Response
```typescript
{
  total: number           // 3847 (всего пользователей)
  activeTodayPercent: number  // 5.1 (процент активных сегодня)
  blocked: number         // 12 (заблокированных)
  premium: number         // 245 (премиум пользователей)
  growth: {
    total: number         // +120 (новых за последние 30 дней)
    premium: number       // +15 (новых премиум за 30 дней)
  }
}
```

### Example Response
```json
{
  "total": 3847,
  "activeTodayPercent": 5.1,
  "blocked": 12,
  "premium": 245,
  "growth": {
    "total": 120,
    "premium": 15
  }
}
```

### ❗ Критично
- ❌ **НЕ вычислять** это на фронте
- ❌ **НЕ гонять** весь список пользователей ради счётчиков
- ✅ **Кешировать** на 5-10 минут (это не real-time метрика)

---

## 📜 6. Лог активности пользователя

### Endpoint
```
GET /api/admin/users/:id/activity
```

### Query Parameters
```typescript
{
  limit?: number       // default: 50, max: 100
  offset?: number      // для пагинации
}
```

### Response
```typescript
{
  items: Array<{
    id: string
    action: string          // "login", "role_changed", "status_changed", "profile_updated"
    details?: object        // дополнительные данные
    createdAt: string       // ISO 8601
    actor?: {               // кто совершил действие (если админ)
      id: string
      name: string
      email: string
    }
  }>
  meta: {
    total: number
    limit: number
    offset: number
  }
}
```

### Example Response
```json
{
  "items": [
    {
      "id": "act_123",
      "action": "role_changed",
      "details": {
        "from": "user",
        "to": "premium"
      },
      "createdAt": "2025-01-04T14:30:00Z",
      "actor": {
        "id": "adm_1",
        "name": "System Admin",
        "email": "admin@example.com"
      }
    },
    {
      "id": "act_122",
      "action": "login",
      "details": {
        "ip": "192.168.1.1",
        "userAgent": "Mozilla/5.0..."
      },
      "createdAt": "2025-01-04T14:32:00Z"
    }
  ],
  "meta": {
    "total": 245,
    "limit": 50,
    "offset": 0
  }
}
```

---

## 🔐 7. Безопасность (Critical)

### Middleware (уже реализовано)
```typescript
// middleware.ts
if (!token) redirect('/')
if (role !== 'admin' && role !== 'superadmin') redirect('/academy')
```

### Backend ОБЯЗАТЕЛЬНО
1. **Проверка JWT** в каждом `/api/admin/*`
2. **Проверка роли** (`admin` / `superadmin`)
3. **Логирование всех действий**:
   - Смена ролей
   - Блокировки
   - Удаления
   - Просмотр профилей (опционально)

### Rate Limiting
```typescript
// Рекомендуется
/api/admin/users         → 100 req/min per admin
/api/admin/users/:id/role    → 10 req/min (защита от спама)
/api/admin/users/:id/status  → 10 req/min
```

---

## ✅ 8. Frontend: Чеклист задач

### ✅ Уже реализовано
- [x] Таблица с пользователями (`UsersTable.tsx`)
- [x] Фильтры (поиск, роль, статус) (`UsersFilters.tsx`)
- [x] KPI карточки (`UsersKPI.tsx`)
- [x] Modal просмотра (`UserViewModal.tsx`)
- [x] Modal редактирования (`UserEditModal.tsx`)
- [x] shadcn/ui компоненты (Table, Badge, Sheet, Dialog)
- [x] Навигация в админке

### 🔜 Следующие задачи

#### 1. API Integration
```typescript
// hooks/useAdminUsers.ts
export function useAdminUsers() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    status: 'all',
  })

  useEffect(() => {
    fetchUsers()
  }, [filters])

  const fetchUsers = async () => {
    setIsLoading(true)
    const res = await fetch(`/api/admin/users?${buildQuery(filters)}`)
    const data = await res.json()
    setUsers(data.items)
    setIsLoading(false)
  }

  return { users, isLoading, filters, setFilters }
}
```

#### 2. Optimistic UI для блокировки
```typescript
const handleToggleBlock = async (userId: string) => {
  // Оптимистичное обновление UI
  setUsers(prev => prev.map(u => 
    u.id === userId 
      ? { ...u, status: u.status === 'blocked' ? 'active' : 'blocked' }
      : u
  ))

  try {
    await fetch(`/api/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus })
    })
    toast.success('Статус изменён')
  } catch (error) {
    // Откат изменений
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, status: oldStatus }
        : u
    ))
    toast.error('Ошибка изменения статуса')
  }
}
```

#### 3. Toast + SystemNotifications
```typescript
// Интеграция с SystemNotifications на dashboard
// После блокировки → добавить уведомление
addNotification({
  icon: <Shield />,
  message: `Пользователь ${userName} заблокирован`,
  time: 'Только что',
  type: 'warning'
})
```

#### 4. Пагинация
```typescript
// components/admin/users/UsersPagination.tsx
<Pagination>
  <PaginationPrevious onClick={() => setPage(p => p - 1)} />
  <PaginationNext onClick={() => setPage(p => p + 1)} />
</Pagination>
```

---

## 📋 9. Error Handling

### Response Errors
```typescript
// Все ошибки в едином формате
{
  error: {
    code: string           // "UNAUTHORIZED", "FORBIDDEN", "NOT_FOUND"
    message: string        // Человекочитаемое сообщение
    details?: object       // Дополнительные данные (для валидации)
  }
}
```

### HTTP Status Codes
```
200 OK              → Успех
400 Bad Request     → Невалидные данные (например, неверный role)
401 Unauthorized    → Нет токена / токен невалиден
403 Forbidden       → Нет прав (не admin)
404 Not Found       → Пользователь не найден
429 Too Many Requests → Rate limit exceeded
500 Internal Error  → Ошибка сервера
```

### Frontend Error Handling
```typescript
try {
  const res = await fetch('/api/admin/users/usr_1/role', {
    method: 'PATCH',
    body: JSON.stringify({ role: 'admin' })
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error.message)
  }

  const data = await res.json()
  toast.success('Роль изменена')
} catch (error) {
  toast.error(error.message || 'Ошибка изменения роли')
}
```

---

## 🎯 10. Summary: Что нужно от бэкенда

### Минимум для работы (MVP)
1. ✅ `GET /api/admin/users` — список с фильтрами
2. ✅ `GET /api/admin/users/:id` — детали пользователя
3. ✅ `GET /api/admin/users/stats` — KPI для дашборда
4. ✅ `PATCH /api/admin/users/:id/role` — смена роли
5. ✅ `PATCH /api/admin/users/:id/status` — блокировка

### Опционально (Nice to have)
6. `GET /api/admin/users/:id/activity` — лог активности
7. `GET /api/admin/users/export` — экспорт в CSV
8. WebSocket для real-time обновлений статусов

### Что делать дальше (фронтенд)
1. Создать `hooks/useAdminUsers.ts`
2. Подключить API к `app/admin/users/page.tsx`
3. Реализовать Optimistic UI
4. Добавить пагинацию
5. Интегрировать toast notifications
6. Добавить error boundaries
7. Тесты (опционально)

---

## 📝 Notes
- **Все даты** в ISO 8601 формате (`2025-01-04T14:32:00Z`)
- **Все суммы** в долларах (не центах), 2 знака после запятой
- **Pagination** рекомендуется, но не обязательна для MVP (limit: 100)
- **Search** работает по `name` ИЛИ `email` (OR, не AND)
- **Sorting** по умолчанию по `created_at desc` (новые первые)
