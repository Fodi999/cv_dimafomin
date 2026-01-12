# 🔧 Динамічна система фільтрів для каталогу рецептів

## 📋 Огляд

Реалізована повністю динамічна система фільтрації з завантаженням опцій з API. Всі значення фільтрів завантажуються з `/api/admin/recipes/filters/meta` замість хардкоду.

## 🎯 Архітектура

```
┌─────────────────┐
│  RecipesTab     │ ← UI компонент
└────────┬────────┘
         │
         ├── useAdminRecipes() ← Стан фільтрів + завантаження рецептів
         │
         └── useRecipesFilterMeta() ← Завантаження опцій фільтрів
                    │
                    ▼
         GET /api/admin/recipes/filters/meta
```

## 🚀 API Endpoint

### GET /api/admin/recipes/filters/meta

**Відповідь**:
```json
{
  "success": true,
  "data": {
    "cuisines": [
      { "value": "italian", "label": "Італійська", "icon": "🇮🇹" },
      { "value": "japanese", "label": "Японська", "icon": "🇯🇵" }
    ],
    "difficulties": [
      { "value": "easy", "label": "Легкий", "icon": "🟢" },
      { "value": "medium", "label": "Середній", "icon": "🟡" },
      { "value": "hard", "label": "Складний", "icon": "🔴" }
    ],
    "statuses": [
      { "value": "draft", "label": "Чернетка", "icon": "📝" },
      { "value": "published", "label": "Опубліковано", "icon": "✅" },
      { "value": "archived", "label": "Архів", "icon": "📦" }
    ],
    "sortOptions": [
      { "value": "created_at", "label": "За датою створення", "icon": "📅" },
      { "value": "title", "label": "За назвою", "icon": "🔤" },
      { "value": "cooking_time", "label": "За часом приготування", "icon": "⏱️" },
      { "value": "views", "label": "За переглядами", "icon": "👁️" }
    ],
    "sortOrders": [
      { "value": "desc", "label": "За спаданням", "icon": "⬇️" },
      { "value": "asc", "label": "За зростанням", "icon": "⬆️" }
    ],
    "timeRanges": [
      { "value": "15", "label": "≤ 15 хв", "icon": "⚡" },
      { "value": "30", "label": "≤ 30 хв", "icon": "⏱️" }
    ],
    "caloriesRanges": [
      { "value": "300", "label": "≤ 300 ккал", "icon": "🥗" },
      { "value": "500", "label": "≤ 500 ккал", "icon": "🍽️" }
    ],
    "sourceTypes": [
      { "value": "ai", "label": "AI-генерований", "icon": "🤖" },
      { "value": "manual", "label": "Ручний ввід", "icon": "✍️" }
    ]
  }
}
```

## 🎨 React Hook - useRecipesFilterMeta

### Використання
```typescript
import { useRecipesFilterMeta } from '@/hooks/useRecipesFilterMeta';

function RecipesTab() {
  const { filterMeta, isLoading, error } = useRecipesFilterMeta();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <Error message={error} />;
  
  return (
    <select>
      {filterMeta?.cuisines.map(cuisine => (
        <option key={cuisine.value} value={cuisine.value}>
          {cuisine.icon} {cuisine.label}
        </option>
      ))}
    </select>
  );
}
```

### TypeScript інтерфейси
```typescript
interface FilterOption {
  value: string;
  label: string;
  icon?: string;
}

interface RecipesFilterMeta {
  cuisines: FilterOption[];
  difficulties: FilterOption[];
  statuses: FilterOption[];
  sortOptions: FilterOption[];
  sortOrders: FilterOption[];
  timeRanges: FilterOption[];
  caloriesRanges: FilterOption[];
  sourceTypes: FilterOption[];
}
```

## 🔧 Утиліти для роботи з запитами

### buildRecipesQueryString()
Будує query-рядок з об'єкта фільтрів:

```typescript
import { buildRecipesQueryString } from '@/lib/utils/query-builder';

const filters = {
  search: 'лосось',
  cuisine: 'japanese',
  difficulty: 'easy',
  sortBy: 'created_at',
  sortOrder: 'desc',
  page: 1,
  limit: 50
};

const query = buildRecipesQueryString(filters);
// Result: "search=лосось&cuisine=japanese&difficulty=easy&sortBy=created_at&sortOrder=desc&page=1&limit=50"

fetch(`/api/admin/recipes?${query}`);
```

### parseRecipesQueryString()
Парсить query-рядок назад у фільтри:

```typescript
import { parseRecipesQueryString } from '@/lib/utils/query-builder';

const queryString = "search=лосось&cuisine=japanese&page=2";
const filters = parseRecipesQueryString(queryString);

console.log(filters);
// {
//   search: 'лосось',
//   cuisine: 'japanese',
//   page: 2
// }
```

### getFilterLabel()
Отримує читабельну назву для значення фільтра:

```typescript
import { getFilterLabel } from '@/lib/utils/query-builder';

getFilterLabel('cuisine', 'japanese');  // "Японська"
getFilterLabel('difficulty', 'easy');   // "Легкий"
getFilterLabel('status', 'published');  // "Опубліковано"
```

## 📊 Інтеграція в компонент

### RecipesTab з динамічними фільтрами

```tsx
import { useRecipesFilterMeta } from '@/hooks/useRecipesFilterMeta';
import { Select, SelectContent, SelectItem } from '@/components/ui/select';

export function RecipesTab() {
  const { filterMeta, isLoading: isLoadingMeta } = useRecipesFilterMeta();
  const { filters, updateFilters } = useAdminRecipes();

  return (
    <>
      {/* Cuisine Filter - Динамічний */}
      <Select
        value={filters.cuisine || "all"}
        onValueChange={(value) => updateFilters({ cuisine: value === "all" ? "" : value })}
        disabled={isLoadingMeta}
      >
        <SelectTrigger>
          <SelectValue placeholder="Всі категорії" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">🌍 Всі категорії</SelectItem>
          {filterMeta?.cuisines.map(cuisine => (
            <SelectItem key={cuisine.value} value={cuisine.value}>
              {cuisine.icon} {cuisine.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Difficulty Filter - Динамічний */}
      <Select
        value={filters.difficulty || "all"}
        onValueChange={(value) => updateFilters({ difficulty: value === "all" ? "" : value })}
        disabled={isLoadingMeta}
      >
        <SelectTrigger>
          <SelectValue placeholder="Всі складності" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">⭐ Всі складності</SelectItem>
          {filterMeta?.difficulties.map(diff => (
            <SelectItem key={diff.value} value={diff.value}>
              {diff.icon} {diff.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
```

## 🎯 Переваги динамічних фільтрів

### ✅ До (хардкод)
```tsx
<SelectContent>
  <SelectItem value="italian">🇮🇹 Італійська</SelectItem>
  <SelectItem value="japanese">🇯🇵 Японська</SelectItem>
  <SelectItem value="ukrainian">🇺🇦 Українська</SelectItem>
  {/* 10+ рядків хардкоду */}
</SelectContent>
```

### ✨ Після (динамічно)
```tsx
<SelectContent>
  <SelectItem value="all">🌍 Всі категорії</SelectItem>
  {filterMeta?.cuisines.map(cuisine => (
    <SelectItem key={cuisine.value} value={cuisine.value}>
      {cuisine.icon} {cuisine.label}
    </SelectItem>
  ))}
</SelectContent>
```

### Переваги:
1. ✅ **Легко оновлювати** - змінюємо API, не чіпаючи UI
2. ✅ **Масштабується** - додати нову кухню = 1 рядок в API
3. ✅ **Мультимовність** - labels приходять з бекенду на потрібній мові
4. ✅ **Централізоване управління** - одне місце для всіх опцій
5. ✅ **Type-safe** - TypeScript інтерфейси для всіх опцій

## 🔄 Fallback стратегія

Якщо API не відповідає, хук автоматично використовує fallback:

```typescript
// useRecipesFilterMeta.ts
catch (err) {
  // Встановлюємо мінімальний набір опцій
  setFilterMeta({
    cuisines: [
      { value: 'italian', label: 'Італійська', icon: '🇮🇹' },
      { value: 'japanese', label: 'Японська', icon: '🇯🇵' }
    ],
    difficulties: [
      { value: 'easy', label: 'Легкий', icon: '🟢' }
    ],
    // ... мінімальні опції
  });
}
```

## 🧪 Тестування

### Тест завантаження мета-даних
```typescript
import { renderHook } from '@testing-library/react-hooks';
import { useRecipesFilterMeta } from '@/hooks/useRecipesFilterMeta';

test('loads filter meta successfully', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useRecipesFilterMeta());
  
  expect(result.current.isLoading).toBe(true);
  
  await waitForNextUpdate();
  
  expect(result.current.isLoading).toBe(false);
  expect(result.current.filterMeta).toBeDefined();
  expect(result.current.filterMeta?.cuisines.length).toBeGreaterThan(0);
});
```

### Тест query builder
```typescript
import { buildRecipesQueryString } from '@/lib/utils/query-builder';

test('builds query string correctly', () => {
  const filters = {
    search: 'тест',
    cuisine: 'italian',
    page: 1,
    limit: 20
  };
  
  const query = buildRecipesQueryString(filters);
  
  expect(query).toContain('search=тест');
  expect(query).toContain('cuisine=italian');
  expect(query).toContain('page=1');
  expect(query).toContain('limit=20');
});
```

## 📝 TODO: Майбутні покращення

- [ ] Кешування filter meta в localStorage
- [ ] Підтримка мультивибору (multiple cuisines)
- [ ] Збереження фільтрів в URL (browser history)
- [ ] Експорт/імпорт preset фільтрів
- [ ] A/B тестування популярності фільтрів
- [ ] Автокомплит для пошуку

---

**✨ Готово!** Фільтри повністю динамічні, легко розширюються та не потребують змін коду UI при додаванні нових опцій.
