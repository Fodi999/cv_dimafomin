# ✅ LEGACY ROUTES — ИСПРАВЛЕНО

**Дата:** 25 января 2026  
**Проблема:** GET /profile 404  
**Статус:** 🟢 РЕШЕНО

---

## 🔍 ПРОБЛЕМА

После миграции на новую архитектуру (B2C → B2B) остались старые ссылки:
- `/profile` → 404  
- `/fridge` → не используется
- `/recipes` → не используется
- `/assistant` → не используется

**Лог:**
```
GET http://localhost:3000/profile 404 (Not Found)
```

---

## ✅ ИСПРАВЛЕНИЯ

### 1. UserNavigation.tsx
**Проблема:** Логотип вел на `/fridge`

**Было:**
```tsx
<Link href="/fridge" ...>
  ChefOS
</Link>
```

**Стало:**
```tsx
<Link href="/customer/marketplace" ...>
  ChefOS Marketplace
</Link>
```

---

### 2. customer/profile/page.tsx
**Проблема:** Кнопка Settings вела на `/profile/settings`

**Было:**
```tsx
router.push("/profile/settings");
```

**Стало:**
```tsx
router.push("/customer/profile/settings");
```

---

### 3. next.config.ts — Добавлены redirects
**Решение:** Permanent redirects для всех legacy путей

```typescript
async redirects() {
  return [
    // Legacy user routes (B2C → B2B)
    {
      source: '/profile',
      destination: '/customer/profile',
      permanent: true,
    },
    {
      source: '/profile/settings',
      destination: '/customer/profile/settings',
      permanent: true,
    },
    {
      source: '/fridge',
      destination: '/admin/ingredients',
      permanent: true,
    },
    {
      source: '/recipes',
      destination: '/admin/recipes',
      permanent: true,
    },
    {
      source: '/assistant',
      destination: '/admin/assistant',
      permanent: true,
    },
  ];
}
```

---

## 📊 ИТОГОВАЯ ТАБЛИЦА REDIRECTS

| Старый путь (B2C)         | Новый путь (B2B)                  | Тип      |
|---------------------------|-----------------------------------|----------|
| `/profile`                | `/customer/profile`               | 301 ✅   |
| `/profile/settings`       | `/customer/profile/settings`      | 301 ✅   |
| `/fridge`                 | `/admin/ingredients`              | 301 ✅   |
| `/recipes`                | `/admin/recipes`                  | 301 ✅   |
| `/assistant`              | `/admin/assistant`                | 301 ✅   |
| `/admin/catalog/products` | `/admin/ingredients`              | 301 ✅   |
| `/admin/catalog/recipes`  | `/admin/recipes`                  | 301 ✅   |
| `/catalog/products`       | `/customer/marketplace`           | 301 ✅   |
| `/catalog/recipes`        | `/customer/marketplace`           | 301 ✅   |

**Всего:** 9 redirects

---

## ⚠️ ВАЖНО

### Permanent Redirects (301)
- Браузеры кешируют
- Поисковики обновляют индексы
- Закладки автоматически перенаправляются

### После деплоя
1. Очистить кеш браузера (Ctrl+Shift+R)
2. Проверить все старые ссылки
3. Обновить внешние ссылки (если есть)

---

## ✅ РЕЗУЛЬТАТ

**До:**
- `/profile` → 404  
- `/fridge` → 404  
- Старые ссылки не работали

**После:**
- `/profile` → `/customer/profile` (301)
- `/fridge` → `/admin/ingredients` (301)
- Все старые ссылки автоматически редиректят

**Статус:** ✅ Проблема решена полностью
