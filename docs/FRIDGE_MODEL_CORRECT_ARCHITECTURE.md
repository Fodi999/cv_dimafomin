# 🎯 Правильная архитектура холодильника

**Дата**: 2026-01-20  
**Статус**: 🔴 CRITICAL - Требуется рефакторинг модели данных  
**Цель**: Сделать холодильник работающим инструментом, а не игрушкой

---

## 🔴 Проблема сейчас

### ❌ Неправильная модель данных

```typescript
// Текущая модель (НЕПРАВИЛЬНО)
{
  quantity: 5600,           // ❌ Нет разделения купил/осталось
  unit: 'g',
  totalPrice: 439.04,       // ❌ Считается от купленного, не остатка
  pricePerUnit: 78.40,
  expiresAt: '2026-01-22'
}
```

**Проблемы:**
1. Не отслеживается, сколько продукта **использовано**
2. Стоимость холодильника **неправильная** (считается от купленного, а не от остатка)
3. Категории **захардкожены в коде** (condiment → Przyprawy) вместо i18n словаря

---

## ✅ Правильная модель (эталон)

### 1️⃣ Backend / Database

```sql
CREATE TABLE fridge_items (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  ingredient_id UUID NOT NULL,
  
  -- 📦 Количество (ОБЯЗАТЕЛЬНО разделить!)
  quantity_total DECIMAL(10,2) NOT NULL,      -- Сколько КУПИЛИ
  quantity_remaining DECIMAL(10,2) NOT NULL,   -- Сколько ОСТАЛОСЬ
  unit VARCHAR(10) NOT NULL,                   -- g, ml, pcs
  
  -- 💰 Цена
  price_total DECIMAL(10,2),                   -- Сколько ЗАПЛАТИЛИ
  price_per_unit DECIMAL(10,2),                -- Цена за единицу (PLN/kg, PLN/l, PLN/pcs)
  currency VARCHAR(3) DEFAULT 'PLN',
  
  -- 📅 Даты
  arrived_at TIMESTAMP DEFAULT NOW(),          -- Когда добавили
  expires_at TIMESTAMP NOT NULL,               -- Когда истекает
  
  -- 🏷️ Метаданные
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2️⃣ TypeScript Interface

```typescript
interface FridgeItem {
  id: string;
  userId: string;
  ingredientId: string;
  
  // 📦 Количество
  quantityTotal: number;      // Купили: 5600g
  quantityRemaining: number;  // Осталось: 3200g (использовали 2400g)
  unit: 'g' | 'ml' | 'pcs';
  
  // 💰 Цена
  priceTotal: number;         // Заплатили: 439.04 PLN
  pricePerUnit: number;       // Цена: 78.40 PLN/kg
  currency: string;           // PLN
  
  // 📅 Даты
  arrivedAt: string;          // 2026-01-20
  expiresAt: string;          // 2026-01-22
  
  // 🧮 Вычисляемые поля (backend считает)
  daysLeft: number;           // 2 дня
  status: 'ok' | 'warning' | 'danger'; // 🟢🟡🔴
  currentValue: number;       // 251.65 PLN (3.2kg × 78.40)
  usagePercent: number;       // 42.86% использовано
}
```

---

## 💡 Ключевая логика

### ✅ Правильный расчёт стоимости холодильника

```typescript
// ❌ НЕПРАВИЛЬНО (сейчас)
const fridgeValue = items.reduce((sum, item) => 
  sum + item.priceTotal, 0
);
// Результат: 518.52 PLN (сумма всех покупок)

// ✅ ПРАВИЛЬНО (должно быть)
const fridgeValue = items.reduce((sum, item) => 
  sum + (item.quantityRemaining / getUnitDivisor(item.unit)) * item.pricePerUnit, 0
);
// Результат: ~300 PLN (стоимость ОСТАТКА)

function getUnitDivisor(unit: string): number {
  switch (unit) {
    case 'g': return 1000;  // g → kg
    case 'ml': return 1000; // ml → l
    case 'pcs': return 1;   // pcs → pcs
    default: return 1;
  }
}
```

### 📊 Пример расчёта

| Продукт | Купили | Осталось | Цена | Заплатили | Стоимость остатка |
|---------|--------|----------|------|-----------|-------------------|
| Яйца | 20 pcs | 12 pcs | 1.50 PLN/pcs | 30.00 PLN | **18.00 PLN** ✅ |
| Лосось | 5600 g | 3200 g | 78.40 PLN/kg | 439.04 PLN | **251.65 PLN** ✅ |
| Рис | 2000 g | 1500 g | 18.34 PLN/kg | 36.68 PLN | **27.51 PLN** ✅ |

**Итого:**
- Заплатили: 505.72 PLN
- Стоимость в холодильнике: **297.16 PLN** ✅
- Использовано: 208.56 PLN (41%)

---

## 🏷️ Категории: Backend vs Frontend

### ❌ Сейчас (неправильно)

```typescript
// Backend возвращает: category: 'condiment'
// Frontend хардкодит маппинг:
const mapping = {
  'condiment': 'Przyprawy' // ❌ Бизнес-логика в маппинге!
};
```

**Проблемы:**
- Категории смешаны с локализацией
- Нельзя легко добавить новый язык
- AI должен выбирать из польских названий (путаница)

### ✅ Правильно

**Backend (стабильный enum):**
```go
// Backend всегда возвращает английские ID
type IngredientCategory string

const (
    CategoryEgg       IngredientCategory = "egg"
    CategoryFish      IngredientCategory = "fish"
    CategoryMeat      IngredientCategory = "meat"
    CategoryDairy     IngredientCategory = "dairy"
    CategoryVegetable IngredientCategory = "vegetable"
    CategoryFruit     IngredientCategory = "fruit"
    CategoryGrain     IngredientCategory = "grain"
    CategoryOil       IngredientCategory = "oil"
    CategoryCondiment IngredientCategory = "condiment"
    CategoryBeverage  IngredientCategory = "beverage"
    CategoryOther     IngredientCategory = "other"
)
```

**Frontend (i18n словарь):**
```typescript
// /i18n/ru/categories.ts
export const categories = {
  egg: 'Яйца',
  fish: 'Рыба',
  meat: 'Мясо',
  dairy: 'Молочные',
  vegetable: 'Овощи',
  fruit: 'Фрукты',
  grain: 'Крупы',
  oil: 'Масла',
  condiment: 'Специи',
  beverage: 'Напитки',
  other: 'Другое',
};

// /i18n/pl/categories.ts
export const categories = {
  egg: 'Jajka',
  fish: 'Ryby',
  meat: 'Mięso',
  dairy: 'Nabiał',
  vegetable: 'Warzywa',
  fruit: 'Owoce',
  grain: 'Zboża',
  oil: 'Oleje',
  condiment: 'Przyprawy',
  beverage: 'Napoje',
  other: 'Inne',
};

// Использование
const categoryName = t.categories[item.ingredient.category];
```

**Преимущества:**
- ✅ Backend не знает про польский/русский
- ✅ Легко добавить новый язык (просто новый файл)
- ✅ AI работает со стабильными ID
- ✅ Нет if/switch в бизнес-логике

---

## 🎨 UI: Как должно выглядеть

### 🔥 Верхняя панель

```
🧊 Холодильник
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 5 продуктов
💰 Текущая стоимость: 297.16 PLN
⚠️ Использовать сегодня: 1 продукт (Лосось)
```

### 🧾 Карточка продукта

```
┌─────────────────────────────────────────┐
│ Лосось                           🐟 Рыба │
│─────────────────────────────────────────│
│                                          │
│ 📦 Осталось: 3.2 kg из 5.6 kg (57%)     │
│ 💰 Цена: 78.40 PLN/kg                   │
│ 💵 Стоимость остатка: 251.65 PLN        │
│                                          │
│ ⏳ Истекает: 22 января 2026             │
│ 🔴 Осталось 1 день - Использовать сегодня│
│                                          │
│ [Использовать] [Удалить] [Подробнее]    │
└─────────────────────────────────────────┘
```

### 📊 Статусы срока годности

```typescript
function getExpiryStatus(daysLeft: number) {
  if (daysLeft <= 0) {
    return { 
      status: 'expired', 
      color: '🔴', 
      text: 'Просрочен',
      action: 'Выбросить или использовать'
    };
  }
  if (daysLeft === 1) {
    return { 
      status: 'danger', 
      color: '🔴', 
      text: 'Осталось 1 день',
      action: 'Использовать сегодня'
    };
  }
  if (daysLeft <= 3) {
    return { 
      status: 'warning', 
      color: '🟡', 
      text: `Осталось ${daysLeft} дня`,
      action: 'Использовать в ближайшие дни'
    };
  }
  return { 
    status: 'ok', 
    color: '🟢', 
    text: `Ещё ${daysLeft} дней`,
    action: null
  };
}
```

---

## 🔧 Что исправить СЕЙЧАС

### 🔴 CRITICAL (обязательно)

#### 1. Backend: Добавить поля в БД

```sql
ALTER TABLE fridge_items ADD COLUMN IF NOT EXISTS quantity_total DECIMAL(10,2);
ALTER TABLE fridge_items ADD COLUMN IF NOT EXISTS quantity_remaining DECIMAL(10,2);

-- Миграция существующих данных
UPDATE fridge_items 
SET quantity_total = quantity, 
    quantity_remaining = quantity 
WHERE quantity_total IS NULL;

-- Сделать поля обязательными
ALTER TABLE fridge_items ALTER COLUMN quantity_total SET NOT NULL;
ALTER TABLE fridge_items ALTER COLUMN quantity_remaining SET NOT NULL;
```

#### 2. Backend: Вернуть `currentValue` в API

```go
type FridgeItemResponse struct {
    ID               string    `json:"id"`
    Ingredient       Ingredient `json:"ingredient"`
    QuantityTotal    float64   `json:"quantityTotal"`
    QuantityRemaining float64  `json:"quantityRemaining"`
    Unit             string    `json:"unit"`
    PriceTotal       float64   `json:"priceTotal"`
    PricePerUnit     float64   `json:"pricePerUnit"`
    Currency         string    `json:"currency"`
    ExpiresAt        time.Time `json:"expiresAt"`
    DaysLeft         int       `json:"daysLeft"`
    Status           string    `json:"status"`
    
    // 🆕 Вычисляемые поля
    CurrentValue     float64   `json:"currentValue"`  // quantityRemaining * pricePerUnit
    UsagePercent     float64   `json:"usagePercent"`  // (total - remaining) / total * 100
}
```

#### 3. Frontend: Считать правильную стоимость

```typescript
// /components/fridge/FridgeStats.tsx
const calculateFridgeValue = (items: FridgeItem[]) => {
  return items.reduce((sum, item) => {
    if (!item.pricePerUnit || !item.quantityRemaining) return sum;
    
    // Конвертировать в единицы цены (g→kg, ml→l)
    const divisor = item.unit === 'g' || item.unit === 'ml' ? 1000 : 1;
    const quantityInPriceUnits = item.quantityRemaining / divisor;
    
    return sum + (quantityInPriceUnits * item.pricePerUnit);
  }, 0);
};
```

#### 4. Frontend: Убрать маппинг категорий из кода

```typescript
// ❌ УДАЛИТЬ функцию mapBackendCategoryToFrontend()
// ✅ Использовать только i18n словарь

const categoryName = t?.fridge?.categories?.[item.ingredient.category] || item.ingredient.category;
```

### 🟡 Желательно (можно позже)

#### 5. Backend: Стандартизировать категории в БД

```sql
-- Исправить категории продуктов
UPDATE "Ingredient" SET category = 'oil' WHERE category = 'condiment' AND name_en LIKE '%oil%';
UPDATE "Ingredient" SET category = 'condiment' WHERE category = 'condiment' AND name_en LIKE '%salt%';
```

#### 6. Frontend: Добавить UI для использования продукта

```typescript
// Кнопка "Использовать"
const handleUse = async (itemId: string, usedQuantity: number) => {
  await api.post(`/fridge/items/${itemId}/use`, { quantity: usedQuantity });
  // Backend: UPDATE fridge_items SET quantity_remaining = quantity_remaining - ?
};
```

---

## 📈 Метрики успеха

### До рефакторинга (сейчас)
- ❌ Стоимость холодильника: **518.52 PLN** (неправильно - считает всё купленное)
- ❌ Категории: 3 из 5 показывают "Другое"
- ❌ Нет отслеживания использования продуктов

### После рефакторинга (цель)
- ✅ Стоимость холодильника: **~300 PLN** (правильно - только остаток)
- ✅ Категории: все правильные (Яйца, Рыба, Крупы, Масла, Специи)
- ✅ Отслеживание: "Использовано 42% яиц (8 из 20)"

---

## 🚀 План внедрения

### Фаза 1: Backend (1-2 дня)
1. Добавить поля `quantity_total`, `quantity_remaining` в БД
2. Мигрировать существующие данные
3. Обновить API endpoints
4. Добавить endpoint `POST /fridge/items/:id/use`
5. Вернуть `currentValue` и `usagePercent` в ответе

### Фаза 2: Frontend (1 день)
1. Обновить TypeScript интерфейсы
2. Убрать `mapBackendCategoryToFrontend()`
3. Использовать только i18n словари для категорий
4. Пересчитать стоимость холодильника по остаткам
5. Обновить UI карточек продуктов

### Фаза 3: UX улучшения (1 день)
1. Добавить кнопку "Использовать продукт"
2. Показать процент использования (42%)
3. Улучшить статусы срока годности (🔴🟡🟢)
4. Добавить предупреждения "Использовать сегодня"

---

## 📝 Связанные файлы

### Backend
- Таблица: `fridge_items`
- Модель: `internal/models/fridge_item.go`
- Сервис: `internal/services/fridge_service.go`
- API: `internal/handlers/fridge_handler.go`

### Frontend
- Типы: `/lib/types.ts`
- API: `/lib/api/fridge.ts`
- Компоненты:
  - `/components/fridge/FridgeList.tsx`
  - `/components/fridge/FridgeItem.tsx` (создать)
  - `/components/fridge/FridgeStats.tsx` (создать)
- i18n:
  - `/i18n/ru/fridge.ts`
  - `/i18n/pl/fridge.ts`
  - `/i18n/en/fridge.ts`

---

## ✅ Чеклист готовности

- [ ] Backend: поля `quantity_total`, `quantity_remaining` добавлены
- [ ] Backend: API возвращает `currentValue` и `usagePercent`
- [ ] Backend: endpoint `POST /fridge/items/:id/use` работает
- [ ] Frontend: убран `mapBackendCategoryToFrontend()`
- [ ] Frontend: категории берутся из i18n словаря
- [ ] Frontend: стоимость считается по остаткам
- [ ] UI: показан процент использования
- [ ] UI: правильные статусы срока годности
- [ ] UI: кнопка "Использовать продукт"
- [ ] Тесты: покрытие расчёта стоимости
- [ ] Документация: обновлены API docs

---

## 💬 Комментарии

**Почему это CRITICAL?**
Без правильной модели данных холодильник — просто список продуктов. Он не помогает:
- Экономить деньги (неправильная стоимость)
- Планировать рецепты (не знаем, сколько осталось)
- Избегать waste (нет отслеживания использования)

**Что ломается при внедрении?**
- Существующие записи будут иметь `quantity_total = quantity_remaining` (всё свежее)
- Нужна миграция данных
- Старые клиенты могут не работать (нужна версионность API)

**Альтернативы?**
- Можно начать с `quantity_remaining` = `quantity_total` для всех продуктов
- Постепенно добавлять функционал "использовать"
- Пока считать стоимость по `priceTotal` (как сейчас), но показывать warning

