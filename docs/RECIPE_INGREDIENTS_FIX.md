# 🔧 Recipe Ingredients Transformation Fix

## Проблема

### Что пользователь видел:
```
Інгредієнтів: 0
```

### Что backend возвращал:
```json
{
  "ingredients": [
    {
      "id": "87967cfb-3362-47b9-8dff-6c6bf077d0a5",
      "quantity": 500,
      "unit": "g",
      "ingredient": {
        "name": "Ziemniak",
        "namePl": "Ziemniak",
        "nameEn": "potato"
      }
    }
  ]
}
```

### Root Cause:
API route просто копировал `item.ingredients` без трансформации:
```typescript
ingredients: item.ingredients || []  // ❌ Неправильно!
```

Frontend искал `ingredient.name`, а получал `ingredient.ingredient.name` (nested!)

---

## ✅ Решение

### 1. Трансформация в API route (`app/api/admin/recipes/route.ts`)

**До** (строка 99):
```typescript
ingredients: item.ingredients || []
```

**После**:
```typescript
ingredients: (item.ingredients || []).map((ing: any) => ({
  id: ing.id,
  ingredientId: ing.ingredientId,
  name: ing.ingredient?.name || ing.ingredient?.namePl || ing.ingredientName || 'Unknown',
  namePl: ing.ingredient?.namePl,
  nameEn: ing.ingredient?.nameEn,
  nameRu: ing.ingredient?.nameRu,
  quantity: ing.quantity,
  amount: ing.quantity, // alias
  unit: ing.unit,
  optional: ing.optional || false,
  sortOrder: ing.sortOrder,
  inFridge: ing.inFridge || false,
  fridgeQuantity: ing.fridgeQuantity
}))
```

### 2. TypeScript интерфейс (`hooks/useAdminRecipes.ts`)

Расширен интерфейс `ingredients`:
```typescript
ingredients: Array<{
  id?: string;
  ingredientId?: string;
  ingredientKey?: string;
  name?: string;              // ← основное поле
  ingredientName?: string;    // ← alias
  namePl?: string;            // ← мультиязычность
  nameEn?: string;
  nameRu?: string;
  quantity?: number;          // ← основное поле
  amount?: number;            // ← alias
  unit?: string;
  optional?: boolean;
  sortOrder?: number;
  inFridge?: boolean;
  fridgeQuantity?: number | null;
}>
```

---

## 📊 Трансформация данных

### Backend structure (PostgreSQL):
```
recipe.ingredients[]
  ├─ id: uuid
  ├─ quantity: number
  ├─ unit: string
  └─ ingredient: {         ← NESTED OBJECT
       name: string
       namePl: string
       nameEn: string
       nameRu: string
     }
```

### Frontend structure (после трансформации):
```
recipe.ingredients[]
  ├─ id: uuid
  ├─ name: string          ← FLATTENED
  ├─ namePl: string        ← FLATTENED
  ├─ nameEn: string        ← FLATTENED
  ├─ nameRu: string        ← FLATTENED
  ├─ quantity: number
  └─ unit: string
```

---

## 🎯 Результат

### До:
```typescript
recipe.ingredients = [
  {
    id: "...",
    quantity: 500,
    unit: "g",
    ingredient: {
      name: "Ziemniak"  // ← nested!
    }
  }
]

// Frontend ищет:
ingredient.name  // ❌ undefined!
```

### После:
```typescript
recipe.ingredients = [
  {
    id: "...",
    name: "Ziemniak",  // ← flattened! ✅
    quantity: 500,
    unit: "g"
  }
]

// Frontend находит:
ingredient.name  // ✅ "Ziemniak"
```

---

## 📝 Теперь отображается:

### KPI Metrics:
```
Інгредієнтів: 6  ← было 0!
```

### Overview Tab → Інгредієнти:
```
┌─────────────────────────────┐
│ 🧺 Інгредієнти              │
│ ┌─────────────────────────┐ │
│ │ Ziemniak      500 g     │ │
│ │ Twaróg        250 g     │ │
│ │ Cebula        200 g     │ │
│ │ Mąka pszenna  400 g     │ │
│ │ Jaja          1 pcs     │ │
│ │ Masło         50 g      │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

---

## 🔍 Backend данные (для справки)

### Рецепт "Pierogi Ruskie" содержит:
1. **Ziemniak** (Potato) - 500g
2. **Twaróg** (Cottage cheese) - 250g
3. **Cebula** (Onion) - 200g
4. **Mąka pszenna** (Wheat flour) - 400g
5. **Jaja** (Eggs) - 1 pcs
6. **Masło** (Butter) - 50g

### Backend endpoint:
```bash
GET /api/admin/recipes
Authorization: Bearer <token>

Response:
{
  "data": [
    {
      "canonicalName": "Pierogi Ruskie",
      "ingredients": [
        {
          "quantity": 500,
          "unit": "g",
          "ingredient": {
            "name": "Ziemniak",
            "namePl": "Ziemniak",
            "nameEn": "potato",
            "nameRu": "картофель"
          }
        }
      ]
    }
  ]
}
```

---

## 🚀 Тестирование

### Шаг 1: Обновить страницу
```
Cmd + R (или F5)
```

### Шаг 2: Открыть рецепт
```
Admin → Catalog → Recipes → Eye icon на "Pierogi ruskie"
```

### Шаг 3: Проверить KPI
```
Інгредієнтів: 6  ← должно быть 6, а не 0!
```

### Шаг 4: Проверить Overview Tab
```
Секція "Інгредієнти" должна показывать:
- Ziemniak 500 g
- Twaróg 250 g
- Cebula 200 g
- Mąka pszenna 400 g
- Jaja 1 pcs
- Masło 50 g
```

---

## 📚 Выводы

### Ключевой урок:
> Backend может возвращать nested структуры (ingredient.ingredient.name)
> Frontend ожидает flat структуры (ingredient.name)
> Трансформация должна происходить в API route!

### Архитектурный паттерн:
```
Backend (PostgreSQL)
    ↓
Backend API (Go) - возвращает как есть
    ↓
Frontend API Route (Next.js) - ТРАНСФОРМИРУЕТ
    ↓
Frontend Components - получают плоские данные
```

### Почему трансформировать в API route?
1. ✅ Single source of truth
2. ✅ TypeScript type safety
3. ✅ Легко тестировать
4. ✅ Не дублировать логику в компонентах
5. ✅ Backward compatibility (можем менять backend, frontend не ломается)

---

**Дата**: 4 січня 2026 р.  
**Статус**: ✅ Ингредиенты отображаются корректно  
**Версия**: 2.2 (Ingredients Transformation)
