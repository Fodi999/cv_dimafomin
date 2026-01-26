# 🎯 ChefOS Frontend Architecture Migration - 2026

## ✅ ЧТО СДЕЛАНО (ШАГ 1)

### 1️⃣ SessionContext - Новый Core Context
**Файл**: `contexts/SessionContext.tsx`

**Что изменилось**:
- ✅ UserContext → SessionContext
- ✅ Добавлен `AppMode` ('admin' | 'customer')
- ✅ Добавлен `UserRole` ('super_admin' | 'customer')
- ✅ Mode вычисляется автоматически: `super_admin` → `admin`, остальные → `customer`
- ✅ Обратная совместимость через alias `useUser()`

**Маппинг ролей**:
```typescript
Backend role → Frontend role → Mode
'superadmin' → 'super_admin' → 'admin'
'super_admin' → 'super_admin' → 'admin'
любая другая → 'customer' → 'customer'
```

---

### 2️⃣ Новая структура `app/`

```
app/
├── (public)/          # ✅ Существующая
├── (auth)/            # TODO
├── admin/             # ✅ НОВОЕ - Admin Mode
│   ├── layout.tsx     # ✅ Guard + Sidebar
│   ├── page.tsx       # ✅ Dashboard
│   ├── ingredients/   # ✅ Warehouse (ex-Fridge)
│   │   └── page.tsx
│   ├── recipes/       # TODO
│   ├── products/      # TODO
│   ├── economy/       # TODO
│   └── assistant/     # TODO (перенести из (user))
│
├── customer/          # ✅ НОВОЕ - Customer Mode
│   ├── layout.tsx     # ✅ Guard + Minimal Nav
│   ├── marketplace/   # ✅ Каталог блюд
│   │   └── page.tsx
│   ├── orders/        # TODO
│   └── profile/       # TODO
│
└── (user)/            # ⚠️ DEPRECATED - будет удалён
    ├── fridge/        # → admin/ingredients ✅
    ├── recipes/       # → admin/recipes
    ├── losses/        # → admin/economy/losses
    ├── assistant/     # → admin/assistant
    └── profile/       # → customer/profile
```

---

### 3️⃣ Admin Layout - Профессиональный SaaS UI
**Файл**: `app/admin/layout.tsx`

**Функции**:
- ✅ Guard: только `super_admin`
- ✅ Sidebar (Desktop) с навигацией
- ✅ Mobile Header + Bottom Nav
- ✅ User profile + Logout
- ✅ Redirect на `/customer/marketplace` для не-админов

**Навигация**:
- Dashboard
- Ingredients (Warehouse)
- Recipes (BOM)
- Products (Товары)
- Orders (Заказы)
- Economy (Экономика)
- AI Assistant (Бизнес-инструмент)

---

### 4️⃣ Customer Layout - Минималистичный UI
**Файл**: `app/customer/layout.tsx`

**Функции**:
- ✅ Guard: любой авторизованный пользователь
- ✅ Clean Header
- ✅ Mobile Bottom Nav (3 элемента)
- ✅ Max-width container для контента

**Навигация**:
- Marketplace (Каталог)
- My Orders (История заказов)
- Profile (Профиль)

---

### 5️⃣ Admin Ingredients Page
**Файл**: `app/admin/ingredients/page.tsx`

**Миграция**:
- ✅ `(user)/fridge/page.tsx` → `admin/ingredients/page.tsx`
- ✅ Переименование: "Fridge" → "Warehouse Ingredients"
- ✅ Семантика: "Холодильник" → "Склад для бизнеса"
- ✅ Все компоненты сохранены: `FridgeForm`, `FridgeList`, `FridgeStats`
- ✅ API без изменений (Backend остаётся `/api/fridge/*`)

**Важно**:
- Components остаются в `components/fridge/*` (переименование НЕ требуется)
- API остаётся `fridgeApi` (Backend понимает семантику)
- Фронтенд просто меняет контекст отображения

---

### 6️⃣ Customer Marketplace Page
**Файл**: `app/customer/marketplace/page.tsx`

**Статус**: Coming Soon (заглушка)

**Будущая логика**:
```typescript
Customer:
  1. Browse products (GET /api/products)
  2. Add to cart (local state / API)
  3. Checkout (POST /api/orders)
  4. Track order (GET /api/orders/:id)

Admin:
  1. Order received → notification
  2. Check ingredients availability
  3. Deduct ingredients (PUT /api/fridge/items/:id/quantity)
  4. Mark order as prepared
  5. Calculate cost vs price (margin)
```

---

## 🎯 NEXT STEPS (ШАГ 2)

### A. Миграция остальных страниц
- [ ] `(user)/recipes/*` → `admin/recipes/*`
- [ ] `(user)/losses/*` → `admin/economy/losses/*`
- [ ] `(user)/assistant/*` → `admin/assistant/*`
- [ ] `(user)/profile/*` → `customer/profile/*`

### B. Создание новых функций
- [ ] `admin/products/page.tsx` - Карточки товаров
- [ ] `admin/orders/page.tsx` - Управление заказами
- [ ] `admin/economy/page.tsx` - Экономика (себестоимость, маржа)
- [ ] `customer/orders/page.tsx` - История заказов покупателя

### C. Backend интеграция
- [ ] `POST /api/orders` - Создание заказа (Customer)
- [ ] `GET /api/orders` - Список заказов (Admin + Customer)
- [ ] `PUT /api/orders/:id/status` - Обновление статуса (Admin)
- [ ] `POST /api/products` - Создание карточки товара (Admin)
- [ ] `GET /api/products` - Каталог товаров (Public)

### D. AI Assistant для Admin
- [ ] Переместить из `(user)/assistant`
- [ ] Новые промпты:
  - "Оптимизируй себестоимость этого рецепта"
  - "Предложи цену для максимальной маржи"
  - "Какие ингредиенты скоро испортятся?"
  - "Найди убыточные блюда"

---

## 🔄 Обратная совместимость

### UserContext → SessionContext
```typescript
// ✅ Старый код продолжает работать
import { useUser } from "@/contexts/SessionContext";

const { user } = useUser();
// `user` = `session.user` (alias)
```

### Компоненты Fridge
```typescript
// ✅ Компоненты НЕ меняются
import FridgeForm from "@/components/fridge/FridgeForm";
// Работает как admin/ingredients, так и в старом (user)/fridge
```

### API
```typescript
// ✅ API без изменений
import { fridgeApi } from "@/lib/api";
await fridgeApi.getItems(token);
// Backend endpoint: /api/fridge/items
```

---

## 📊 Маппинг: Old → New

| Old Path | New Path | Status |
|----------|----------|--------|
| `(user)/fridge` | `admin/ingredients` | ✅ Done |
| `(user)/recipes` | `admin/recipes` | 🔄 TODO |
| `(user)/losses` | `admin/economy/losses` | 🔄 TODO |
| `(user)/assistant` | `admin/assistant` | 🔄 TODO |
| `(user)/profile` | `customer/profile` | 🔄 TODO |
| N/A | `admin/products` | 🆕 New |
| N/A | `admin/orders` | 🆕 New |
| N/A | `customer/marketplace` | ✅ Done (заглушка) |
| N/A | `customer/orders` | 🆕 New |

---

## 🚀 Deployment Strategy

### Этап 1: Soft Launch (текущий)
- ✅ SessionContext работает параллельно с UserContext
- ✅ Старые пути `(user)/*` продолжают работать
- ✅ Новые пути `admin/*` и `customer/*` доступны
- ✅ Redirect: `super_admin` → `/admin`, остальные → `/customer/marketplace`

### Этап 2: Migration (следующая неделя)
- 🔄 Переместить все страницы из `(user)/*` → `admin/*` или `customer/*`
- 🔄 Обновить ссылки в навигации
- 🔄 Обновить документацию

### Этап 3: Cleanup (через 2 недели)
- ❌ Удалить `(user)/*` папку
- ❌ Удалить старый `UserContext.tsx`
- ❌ Обновить README

---

## 🎓 Ключевые принципы

### 1. Два режима, одно приложение
```typescript
// ❌ НЕ делать:
if (user.role === 'admin') return <AdminApp />
if (user.role === 'customer') return <CustomerApp />

// ✅ Делать:
<SessionProvider>
  {session.mode === 'admin' ? <AdminLayout /> : <CustomerLayout />}
</SessionProvider>
```

### 2. Semantic naming
```typescript
// ❌ Старое (для B2C):
"Fridge" → личный холодильник
"Recipe" → что я могу приготовить

// ✅ Новое (для B2B):
"Ingredients" → склад для бизнеса
"Recipe" → BOM (Bill of Materials)
"Product" → товар на продажу
```

### 3. Guard patterns
```typescript
// Admin Layout
if (!session || session.role !== 'super_admin') {
  redirect('/customer/marketplace')
}

// Customer Layout
if (!session) {
  openAuthModal('login')
}
```

---

## 📝 Testing Checklist

- [ ] Super Admin может войти в `/admin`
- [ ] Super Admin видит все разделы (ingredients, recipes, etc.)
- [ ] Customer НЕ может войти в `/admin` (redirect)
- [ ] Customer видит Marketplace
- [ ] Ingredients (ex-Fridge) работает как раньше
- [ ] SessionContext.user совместим со старым UserContext.user
- [ ] Logout работает из обоих layouts

---

## 🔗 Related Docs
- `ARCHITECTURE_STATE_SEPARATION_DIAGRAM.md`
- `ARCHITECTURE_COOK_NOW_CONTRACT.md`
- `API_ROUTES_MIGRATION.md`

---

**🎯 Цель**: Превратить ChefOS из B2C приложения "что я могу приготовить" в B2B платформу "я продаю готовые блюда".

**✅ Статус**: День 1 завершён. Архитектура готова, миграция начата.
