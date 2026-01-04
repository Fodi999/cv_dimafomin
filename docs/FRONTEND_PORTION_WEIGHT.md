# 🍽️ Frontend Integration: Portion Weight

## Что добавлено

### Backend изменения (уже задеплоены)
- ✅ Migration 062: добавлено поле `portionWeightGrams` в таблицу `Recipe`
- ✅ Go модель `RecipeCatalog` обновлена
- ✅ Все 10 рецептов имеют установленный вес порции (150-450г)
- ✅ API возвращает `portionWeightGrams` в response

---

## ✅ Frontend изменения

### 1. TypeScript интерфейс (`hooks/useAdminRecipes.ts`)

Добавлено поле:
```typescript
export interface Recipe {
  // ...existing fields
  portionWeightGrams?: number; // вес одной порции в граммах
}
```

---

### 2. API Route трансформация (`app/api/admin/recipes/route.ts`)

```typescript
const transformedItems = backendItems.map((item: any) => ({
  // ...existing fields
  servings: item.servings || 1,  // теперь всегда 1 (базовая порция)
  portionWeightGrams: item.portionWeightGrams, // вес порции
  // ...
}));
```

**Важно**: `servings` теперь по умолчанию `1`, так как backend нормализовал все рецепты к базовой порции.

---

### 3. Recipe View Dialog - KPI Metrics

**До** (4 колонки):
```
┌──────┬──────┬──────────┬──────────┐
│ Час  │ Порції│ Інгред. │ Перегляди│
└──────┴──────┴──────────┴──────────┘
```

**После** (5 колонок):
```
┌──────┬──────┬──────┬──────────┬──────────┐
│ Час  │ Порції│ Вага │ Інгред.  │ Перегляди│
└──────┴──────┴──────┴──────────┴──────────┘
```

**Код**:
```tsx
<div className="grid grid-cols-2 md:grid-cols-5 gap-3 my-4">
  <StatCard icon={Clock} label="Час" value={`${recipe.timeMinutes} хв`} />
  <StatCard icon={Users} label="Порції" value={recipe.servings} />
  <StatCard 
    icon={Weight} 
    label="Вага" 
    value={recipe.portionWeightGrams ? `${recipe.portionWeightGrams} г` : '—'} 
  />
  <StatCard icon={ChefHat} label="Інгредієнтів" value={recipe.ingredients?.length || 0} />
  <StatCard icon={Eye} label="Перегляди" value={recipe.views || 0} />
</div>
```

**Импорт иконки**:
```tsx
import { Clock, Users, ChefHat, Eye, MapPin, Flame, Weight } from "lucide-react";
```

---

### 4. Recipes Table - новая колонка

**Структура таблицы**:
```
┌─────────┬──────┬──────────┬────────┬──────┬──────┬──────┬──────────┬──────────┬──────┐
│ Назва   │ Кухня│ Складність│ Статус │ Час  │ Порції│ Вага │ Інгред.  │ Перегляди│ Дії  │
└─────────┴──────┴──────────┴────────┴──────┴──────┴──────┴──────────┴──────────┴──────┘
```

**Header**:
```tsx
<th className="text-center p-3 text-sm font-medium text-gray-700 dark:text-gray-300">
  <Weight className="w-4 h-4 inline" />
</th>
```

**Cell**:
```tsx
<td className="p-3 text-center">
  <span className="text-sm text-gray-600 dark:text-gray-400">
    {recipe.portionWeightGrams ? `${recipe.portionWeightGrams}г` : '—'}
  </span>
</td>
```

---

## 📊 Примеры отображения

### Recipe View Dialog (модальное окно):

```
Pierogi ruskie
Pierogi z ziemniakami i serem.

[ Середній ] [ Опубліковано ] [ 🍽️ main ]

┌───────────────────────────────────────────────────┐
│  ⏱ Час    👥 Порції   ⚖️ Вага   🧺 Інгред.  👁 Перегляди │
│  90 хв       1         200 г        6          0      │
└───────────────────────────────────────────────────┘
```

### Recipes Table (список):

```
┌──────────────────┬──────┬──────┬──────┬──────┐
│ Pierogi ruskie   │ 90хв │  1   │ 200г │  6   │
│ Greek Salad      │ 15хв │  1   │ 250г │  8   │
│ Spaghetti Carbon.│ 25хв │  1   │ 300г │  7   │
└──────────────────┴──────┴──────┴──────┴──────┘
```

---

## 🎯 Веса порций по рецептам

| Рецепт | Вес | Категория |
|--------|-----|-----------|
| Scrambled Eggs | 150г | Легкий |
| Polish Meat Dumplings | 180г | Средний |
| Pierogi Ruskie | 200г | Средний |
| Polish Potato Pancakes | 200г | Средний |
| Polish Breaded Pork Chop | 220г | Средний |
| Greek Salad | 250г | Средний |
| Spaghetti Carbonara | 300г | Большой |
| Pizza Margherita | 350г | Большой |
| Polish Chicken Soup | 400г | Большой |
| Polish Hunters Stew (Bigos) | 450г | Очень большой |

---

## 🔧 Технические детали

### Fallback значения

Если `portionWeightGrams` отсутствует (`null` / `undefined`):
- **KPI Metrics**: показывается `—` (em dash)
- **Table**: показывается `—` (em dash)

```tsx
{recipe.portionWeightGrams ? `${recipe.portionWeightGrams} г` : '—'}
```

### Responsive дизайн

**KPI Metrics**:
- Mobile: `grid-cols-2` (2 колонки)
- Desktop: `grid-cols-5` (5 колонок)

```tsx
<div className="grid grid-cols-2 md:grid-cols-5 gap-3 my-4">
```

---

## 🚀 Использование данных

### Расчёт веса для нескольких порций

```typescript
const calculateTotalWeight = (recipe: Recipe, servingsCount: number) => {
  if (!recipe.portionWeightGrams) return null;
  return recipe.portionWeightGrams * servingsCount;
};

// Пример:
calculateTotalWeight(pierogiRuskie, 1)  // 200г
calculateTotalWeight(pierogiRuskie, 4)  // 800г (семейная порция)
```

### Калорийность на вес

```typescript
const calculateCaloriesPerGram = (recipe: Recipe) => {
  const calories = recipe.nutritionProfile?.calories;
  const weight = recipe.portionWeightGrams;
  
  if (!calories || !weight) return null;
  return (calories / weight).toFixed(2); // ккал/г
};

// Pierogi Ruskie: 420 ккал / 200г = 2.1 ккал/г
```

---

## ✅ Проверка работы

### 1. Обновите страницу
```bash
Cmd + R  # или F5
```

### 2. Откройте каталог
```
Admin → Catalog → Recipes Tab
```

### 3. Проверьте таблицу
```
Должна быть колонка с иконкой ⚖️ (Weight)
Pierogi ruskie → 200г
Greek Salad → 250г
```

### 4. Откройте рецепт (Eye icon)
```
KPI Metrics должны показывать:
┌────────────────────────────────┐
│ Час: 90 хв                     │
│ Порції: 1                      │
│ Вага: 200 г    ← НОВОЕ ПОЛЕ!  │
│ Інгредієнтів: 6                │
│ Перегляди: 0                   │
└────────────────────────────────┘
```

---

## 📋 Чеклист интеграции

- [x] TypeScript interface обновлён (`portionWeightGrams?: number`)
- [x] API route трансформирует данные
- [x] Recipe View Dialog показывает вес в KPI
- [x] Recipes Table имеет колонку "Вага"
- [x] Иконка `Weight` импортирована из lucide-react
- [x] Responsive grid (2/5 колонок)
- [x] Fallback для отсутствующих значений (`—`)
- [x] servings по умолчанию = 1 (базовая порция)

---

## 🎓 Архитектурные решения

### Почему вес порции, а не общий вес?

**Гибкость**:
```typescript
// Пользователь выбирает количество порций
const totalWeight = portionWeightGrams * selectedServings;

// Примеры:
// 1 порция = 200г
// 2 порции = 400г
// 4 порции = 800г (семья)
```

### Почему servings = 1 теперь?

Backend нормализовал все рецепты к **базовой порции**:
- Было: servings = 2, 4, 6 (разные значения)
- Стало: servings = 1 (единый стандарт)
- Преимущество: проще умножать на желаемое количество порций

### Почему gram, а не ml?

Грамы - универсальная единица:
- ✅ Работает для твёрдых и жидких продуктов
- ✅ Стандарт в кулинарии (весы)
- ✅ Легко конвертировать в другие единицы

---

**Дата**: 4 січня 2026 р.  
**Статус**: ✅ Frontend integration completed  
**Версия**: 2.3 (Portion Weight Display)
