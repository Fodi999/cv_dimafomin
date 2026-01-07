# Admin Ingredients: Product Age Visualization

## 🎯 Цель

Визуально показывать админу, какие продукты были добавлены недавно, без необходимости запоминать или искать.

---

## ✅ Что реализовано

### 1️⃣ **Утилита определения возраста**

**Файл:** `/lib/utils/getProductAge.ts`

```typescript
getProductAge(createdAt: string): "today" | "new" | "old"
```

**Логика:**
- `today` — сегодня (0 дней)
- `new` — до 7 дней включительно
- `old` — более 7 дней

**Пример:**
```typescript
getProductAge("2026-01-07T10:00:00Z") → "today"
getProductAge("2026-01-03T10:00:00Z") → "new"   (4 дня назад)
getProductAge("2025-12-20T10:00:00Z") → "old"   (18 дней назад)
```

---

### 2️⃣ **Helper функции**

#### Локализация бейджей
```typescript
getProductAgeBadgeText(age, lang)

// Примеры:
getProductAgeBadgeText("today", "pl") → "Dziś"
getProductAgeBadgeText("new", "en") → "New"
getProductAgeBadgeText("today", "ru") → "Сегодня"
```

#### CSS классы для подсветки строк
```typescript
getProductAgeRowClass(age)

// Результат:
"today" → "bg-emerald-50 dark:bg-emerald-950/20"
"new"   → "bg-blue-50 dark:bg-blue-950/20"
"old"   → ""
```

#### Форматирование даты
```typescript
formatProductDate(createdAt, locale)

// Пример:
formatProductDate("2025-12-15", "pl-PL") → "15.12.2025"
formatProductDate("2025-12-15", "en-EN") → "12/15/2025"
```

---

### 3️⃣ **Колонка "Dodano" в таблице**

**Файл:** `/components/admin/catalog/ingredients/IngredientsTable.tsx`

**Новая колонка:**
```tsx
<th>Dodano</th>
```

**Отображение:**

| Возраст | Визуализация |
|---------|--------------|
| `today` | 🟢 Badge "Dziś" (зелёный) |
| `new` | 🔵 Badge "Nowy" (серый) |
| `old` | 📅 Дата "15.12.2025" |

---

### 4️⃣ **Подсветка строк**

```tsx
<tr className={getProductAgeRowClass(age)}>
```

**Результат:**
- 🟢 Сегодняшние — светло-зелёный фон
- 🔵 Новые (7 дней) — светло-синий фон
- ⚪ Старые — без подсветки

---

## 🎨 Примеры визуализации

### Вариант 1: Продукт добавлен сегодня
```
┌──────────────────────────────────────────────────────┐
│ 🟢 Mleko kokosowe │ Dairy │ ml │ 3 recipes │ [Dziś] │
└──────────────────────────────────────────────────────┘
       ↑ зелёный фон строки
```

### Вариант 2: Продукт добавлен 3 дня назад
```
┌──────────────────────────────────────────────────────┐
│ 🔵 Papaya │ Fruit │ g │ 1 recipe │ [Nowy] │
└──────────────────────────────────────────────────────┘
       ↑ синий фон строки
```

### Вариант 3: Старый продукт
```
┌─────────────────────────────────────────────────────────┐
│    Bazylia │ Herbs │ g │ 5 recipes │ 12.12.2025 │
└─────────────────────────────────────────────────────────┘
       ↑ обычный фон, серая дата
```

---

## 📊 Таблица с реальными данными

```
┏━━━━━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━━┓
┃ Nazwa            ┃ Kategoria ┃ Unit ┃ Used In   ┃ Dodano     ┃
┣━━━━━━━━━━━━━━━━━━╋━━━━━━━━━╋━━━━━╋━━━━━━━━━━╋━━━━━━━━━━━━┫
┃ 🟢 Kokos suszon  ┃ Fruit    ┃ g   ┃ 0        ┃ [Dziś]     ┃
┃ 🟢 Mango świeży  ┃ Fruit    ┃ g   ┃ 1        ┃ [Dziś]     ┃
┃ 🔵 Papryka czerw ┃ Vegetable┃ g   ┃ 3        ┃ [Nowy]     ┃
┃ 🔵 Avocado       ┃ Fruit    ┃ g   ┃ 8        ┃ [Nowy]     ┃
┃    Bazylia       ┃ Herb     ┃ g   ┃ 12       ┃ 15.12.2025 ┃
┃    Masło         ┃ Dairy    ┃ g   ┃ 20       ┃ 10.12.2025 ┃
┗━━━━━━━━━━━━━━━━━━┻━━━━━━━━━┻━━━━━┻━━━━━━━━━━┻━━━━━━━━━━━━┛
```

---

## 🔮 Будущие улучшения (опционально)

### Phase 2: Фильтры по возрасту

**В IngredientsFilters.tsx:**
```tsx
<Tabs value={filter} onValueChange={setFilter}>
  <TabsList>
    <TabsTrigger value="all">Wszystkie</TabsTrigger>
    <TabsTrigger value="today">Dziś</TabsTrigger>
    <TabsTrigger value="new">Nowe (7 dni)</TabsTrigger>
  </TabsList>
</Tabs>
```

**Фильтрация:**
```typescript
const filteredIngredients = ingredients.filter(ing => {
  const age = getProductAge(ing.createdAt);
  if (filter === "today") return age === "today";
  if (filter === "new") return age === "new" || age === "today";
  return true; // all
});
```

---

### Phase 3: Сортировка по дате

```typescript
ingredients.sort((a, b) => 
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
);
```

**Результат:** Новые всегда сверху.

---

### Phase 4: Счётчик новых в заголовке

```tsx
<h2>
  Products
  {newCount > 0 && (
    <Badge className="ml-2 bg-blue-600">{newCount} new</Badge>
  )}
</h2>
```

---

## 🧠 UX Преимущества

### До внедрения:
- ❌ Нужно помнить, что добавлялось
- ❌ Поиск новых продуктов вручную
- ❌ Не понятно, актуален ли каталог

### После внедрения:
- ✅ Мгновенно видно новые продукты
- ✅ Зелёные/синие строки привлекают внимание
- ✅ Бейджи интуитивно понятны
- ✅ Для старых продуктов — точная дата

---

## 📋 Связанные файлы

1. **Утилита:** `/lib/utils/getProductAge.ts`
2. **Таблица:** `/components/admin/catalog/ingredients/IngredientsTable.tsx`
3. **Тип Ingredient:** `/hooks/useIngredients.ts` (требует `createdAt?: string`)
4. **Badge компонент:** `/components/ui/badge.tsx` (shadcn/ui)

---

## ✅ Checklist

- ✅ Утилита `getProductAge` создана
- ✅ Helper функции (локализация, CSS, дата)
- ✅ Колонка "Dodano" добавлена
- ✅ Бейджи для today/new
- ✅ Дата для старых продуктов
- ✅ Подсветка строк (зелёный/синий фон)
- ✅ Поддержка dark mode
- ✅ Мультиязычность (PL/EN/RU)
- 🔜 Фильтры по возрасту (Phase 2)
- 🔜 Сортировка по дате (Phase 2)
- 🔜 Счётчик новых (Phase 3)

---

## 🎯 Итог

**Админ теперь видит:**

```
🟢 Сегодня добавлено 2 продукта
🔵 За неделю добавлено 5 продуктов
📅 Остальные с точной датой
```

👉 Не нужно запоминать или искать  
👉 Всё визуально понятно с первого взгляда  
👉 Профессиональный UX как в Shopify/Notion

🚀 **Готово к использованию!**
