# 📊 Recipe Stats Frontend Integration

## Цель
Показывать пользователю количество рецептов в каталоге в AI-подсказках для лучшего UX.

## Архитектура

```
Backend (уже готов)
  └─ GET /api/recipes/stats
     └─ { totalRecipes: 428, byCategory: {...} }

Frontend
  ├─ useRecipeStats() - глобальный хук
  ├─ AssistantPage - обогащает context
  ├─ AIMessageCard - рендерит текст
  └─ i18n/pl/ai.ts - Polish UX messages
```

## ✅ Что сделано

### 1. Хук `useRecipeStats`
**Файл**: `/hooks/useRecipeStats.ts`

```tsx
const { stats, loading } = useRecipeStats();
// stats.totalRecipes → 428
// stats.byCategory → { breakfast: 120, lunch: 180, ... }
```

- ✅ Единственный источник данных о количестве рецептов
- ✅ Загружается один раз при монтировании
- ✅ Возвращает fallback (0) при ошибках

### 2. Интеграция в `AssistantPage`
**Файл**: `/app/assistant/page.tsx`

```tsx
// Импорт хука
import { useRecipeStats } from "@/hooks/useRecipeStats";

// Использование в компоненте
const { stats, loading: statsLoading } = useRecipeStats();

// Обогащение context перед передачей в AIMessageCard
setAiResponse({
  code: 'NO_RECIPES_FOR_FRIDGE',
  context: { 
    fridgeItems: fridgeItems.length,
    totalRecipes: stats?.totalRecipes ?? 0, // 🔢 Frontend enrichment
  },
  success: false,
});
```

**Важно**: Backend ничего не знает о `totalRecipes` - это обогащение происходит только на фронте.

### 3. Польские переводы
**Файл**: `/i18n/pl/ai.ts`

#### `NO_RECIPES_FOR_FRIDGE`
```typescript
NO_RECIPES_FOR_FRIDGE: (ctx = {}) => ({
  title: 'Nie znaleźliśmy pasujących przepisów',
  description: ctx.fridgeItems && ctx.totalRecipes
    ? `Masz ${ctx.fridgeItems} produktów w lodówce.
       W katalogu dostępnych jest ${ctx.totalRecipes} przepisów,
       ale żaden nie pasuje do aktualnych składników.`
    : '...',
  actions: [
    { id: 'ADD_PRODUCTS', label: 'Dodaj produkty do lodówki' },
    { id: 'VIEW_CATALOG', label: `Zobacz katalog (${ctx.totalRecipes})` }
  ]
})
```

#### `ALL_RECIPES_VIEWED`
```typescript
ALL_RECIPES_VIEWED: (ctx = {}) => ({
  title: 'Wszystkie przepisy już obejrzane',
  description: ctx.viewedCount && ctx.totalRecipes
    ? `Obejrzałeś już ${ctx.viewedCount} z ${ctx.totalRecipes} dostępnych przepisów...`
    : '...',
})
```

#### `EMPTY_FRIDGE`
```typescript
EMPTY_FRIDGE: (ctx = {}) => ({
  description: ctx.totalRecipes
    ? `W katalogu dostępnych jest ${ctx.totalRecipes} przepisów. 
       Dodaj produkty do lodówki...`
    : '...',
  actions: [
    { id: 'VIEW_CATALOG', label: `Zobacz katalog (${ctx.totalRecipes})` }
  ]
})
```

## 🎯 UX Примеры

### Сценарий 1: Пустая подборка
**Backend**: 
```json
{
  "status": "no-results",
  "requiresUserAction": true
}
```

**Frontend обогащает**:
```tsx
context: {
  fridgeItems: 10,
  totalRecipes: 428  // ← добавляем на фронте
}
```

**Пользователь видит**:
```
🧠 Nie znaleźliśmy pasujących przepisów

Masz 10 produktów w lodówce.
W katalogu dostępnych jest 428 przepisów,
ale żaden nie pasuje do aktualnych składników.

[Dodaj produkty do lodówki]  [Zobacz katalog (428)]
```

### Сценарий 2: Все рецепты просмотрены
```
✅ Wszystkie przepisy już obejrzane

Obejrzałeś już 12 z 428 dostępnych przepisów dla Twojej lodówki.
Chcesz zobaczyć je od nowa?

[Zobacz od nowa]  [Dodaj produkty]
```

### Сценарий 3: Пустая холодильник
```
ℹ️ Lodówka jest pusta

W katalogu dostępnych jest 428 przepisów.
Dodaj produkty do lodówki, aby AI mogło znaleźć idealne przepisy dla Ciebie.

[Dodaj produkty]  [Zobacz katalog (428)]
```

## 🚫 Чего НЕ делать

❌ **Не добавлять `totalRecipes` в backend AI**
```typescript
// ❌ НЕПРАВИЛЬНО (backend)
return {
  code: "NO_RECIPES_FOR_FRIDGE",
  context: { 
    fridgeItems: 10,
    totalRecipes: await getRecipeCount() // ← НЕТ!
  }
}
```

✅ **Правильно**: Backend возвращает только то, что он реально знает
```typescript
// ✅ ПРАВИЛЬНО (backend)
return {
  code: "NO_RECIPES_FOR_FRIDGE",
  context: { fridgeItems: 10 }
}
```

❌ **Не дублировать API вызов**
```typescript
// ❌ НЕПРАВИЛЬНО
const MyComponent = () => {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    fetch('/api/recipes/stats').then(...) // ← НЕТ!
  }, []);
}
```

✅ **Правильно**: Используй хук
```typescript
// ✅ ПРАВИЛЬНО
const MyComponent = () => {
  const { stats } = useRecipeStats(); // ← ДА!
}
```

❌ **Не показывать toast вместо AIMessageCard**
```typescript
// ❌ НЕПРАВИЛЬНО
if (noRecipes) {
  toast.error("Brak przepisów!"); // ← НЕТ!
}
```

✅ **Правильно**: Используй AIMessageCard
```typescript
// ✅ ПРАВИЛЬНО
setAiResponse({
  code: 'NO_RECIPES_FOR_FRIDGE',
  context: { totalRecipes: stats?.totalRecipes ?? 0 }
});
```

## 🔍 Тестирование

### 1. Проверить загрузку stats
```tsx
// В консоли браузера должно быть:
console.log('✅ Recipe stats loaded:', { totalRecipes: 428 })
```

### 2. Проверить обогащение context
```tsx
// При показе AIMessageCard:
console.log('Context:', aiResponse.context)
// Должно быть: { fridgeItems: 10, totalRecipes: 428 }
```

### 3. Проверить текст
- Открыть `/assistant`
- Кликнуть "Pokaż przepisy" при пустой холодильнике
- Должен показаться текст: "W katalogu dostępnych jest 428 przepisów..."

## 📦 Файлы изменены

1. `/hooks/useRecipeStats.ts` - уже существовал ✅
2. `/app/assistant/page.tsx` - добавлен хук и обогащение context
3. `/i18n/pl/ai.ts` - обновлены тексты с `totalRecipes`

## 🎉 Результат

Теперь AI объясняет пользователю контекст:
- "У тебя 10 продуктов, а в каталоге 428 рецептов"
- "Ты посмотрел 12 из 428 рецептов"
- "В каталоге 428 рецептов — добавь продукты!"

**UX стал понятнее и дружелюбнее** 🚀
