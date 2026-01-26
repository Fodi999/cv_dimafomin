# 🎯 ChefOS - Quick Cheat Sheet

## 📂 Где что находится

### 🔐 ADMIN MODE
```bash
app/admin/
  ├── page.tsx                    # Dashboard
  ├── ingredients/page.tsx        # Склад (ex-Fridge) ✅
  ├── recipes/                    # Рецепты (BOM) 🔄
  ├── products/                   # Товары 🆕
  ├── orders/                     # Заказы
  └── economy/losses/             # Списания 🔄
```

### 🟢 CUSTOMER MODE
```bash
app/customer/
  ├── marketplace/page.tsx        # Каталог блюд ✅
  ├── orders/page.tsx             # Мои заказы ✅
  └── profile/page.tsx            # Профиль ✅
```

---

## 🔑 Быстрые команды

### Создать super admin
```bash
# SQL напрямую
UPDATE users SET role = 'superadmin' WHERE email = 'your@email.com';

# Через скрипт
./scripts/create-super-admin.sh your@email.com
```

### Dev server
```bash
npm run dev
```

### Build
```bash
npm run build
```

---

## 💻 Код

### SessionContext
```typescript
import { useSession } from "@/contexts/SessionContext"

const { session, user, isAdmin } = useSession()

// session = { userId, role, mode, user }
// isAdmin = true/false (быстрая проверка)
```

### Проверка роли
```typescript
// В компоненте
if (session?.role === 'super_admin') {
  // Admin-only код
}

// Или быстро
if (isAdmin) {
  // Admin-only код
}
```

### Guard в layout
```typescript
// admin/layout.tsx
if (!session || session.role !== 'super_admin') {
  redirect('/customer/marketplace')
}

// customer/layout.tsx
if (!session) {
  openAuthModal('login')
}
```

---

## 🎨 UI Components

### Fridge components (работают везде)
```typescript
import FridgeForm from "@/components/fridge/FridgeForm"
import FridgeList from "@/components/fridge/FridgeList"
import FridgeStats from "@/components/fridge/FridgeStats"
import PriceSheet from "@/components/fridge/PriceSheet"
import QuantitySheet from "@/components/fridge/QuantitySheet"
```

### API
```typescript
import { fridgeApi } from "@/lib/api"

await fridgeApi.getItems(token)
await fridgeApi.addItem(data, token)
await fridgeApi.deleteItem(id, token)
await fridgeApi.updateItemQuantity(id, { quantity }, token)
await fridgeApi.addPrice(id, { pricePerUnit, currency }, token)
```

---

## 🔀 Маппинг путей

| Старый | Новый | Статус |
|--------|-------|--------|
| `/app/(user)/fridge` | `/admin/ingredients` | ✅ |
| `/app/(user)/recipes` | `/admin/recipes` | 🔄 |
| `/app/(user)/losses` | `/admin/economy/losses` | 🔄 |
| `/app/(user)/assistant` | `/admin/assistant` | 🔄 |
| `/app/(user)/profile` | `/customer/profile` | 🔄 |

---

## 📚 Документация

| Файл | Описание |
|------|----------|
| `MIGRATION_SUMMARY.md` | Краткий summary |
| `docs/QUICKSTART_2026.md` | Быстрый старт |
| `docs/ARCHITECTURE_MIGRATION_2026.md` | Полная миграция |
| `docs/MIGRATION_DAY1_COMPLETE.md` | Отчёт День 1 |
| `docs/ARCHITECTURE_VISUAL_DIAGRAM.md` | Визуальная диаграмма |

---

## 🐛 Troubleshooting

### ❌ "Access denied" в /admin
```bash
# Проверить роль в БД
SELECT email, role FROM users WHERE email = 'your@email.com';

# Должно быть: role = 'superadmin'
UPDATE users SET role = 'superadmin' WHERE email = 'your@email.com';
```

### ❌ Redirect loop
```bash
# Очистить кеш браузера
# Проверить localStorage
localStorage.clear()
```

### ❌ "useUser must be used within provider"
```bash
# Уже исправлено! Но если видишь:
# Проверь, что импорт из SessionContext:
import { useUser } from "@/contexts/SessionContext"
```

---

## 🎯 Быстрый тест

### 1. Super Admin → Admin Mode
```
1. Логин как super admin
2. Должен открыться /admin
3. Видишь sidebar с 7 разделами
4. Можешь открыть /admin/ingredients
5. Добавление ингредиента работает
```

### 2. Regular User → Customer Mode
```
1. Логин как обычный user
2. Должен открыться /customer/marketplace
3. Видишь header с 3 разделами
4. НЕ можешь открыть /admin (redirect)
```

---

## 🚀 Next Steps

### Day 2
- [ ] Перенести recipes
- [ ] Перенести losses
- [ ] Перенести assistant
- [ ] Перенести profile

### Day 3
- [ ] Создать products
- [ ] Реализовать marketplace
- [ ] Реализовать orders flow

---

**🎉 Готово! Архитектура работает.**
