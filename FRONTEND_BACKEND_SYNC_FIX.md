# ✅ Frontend ↔ Backend Sync Fix

## 🎯 Проблема

**Симптом:**
```
Recipe stats from backend:
{ totalIngredients: undefined, availableInFridge: undefined, missingCount: undefined }
```

**Корінь проблеми:**
- Frontend очікував поля `totalIngredients`, `availableInFridge`, `missingCount` з backend
- Backend **ніколи не відправляв** ці поля (і не повинен був!)
- Десинхронізація контракту API

---

## 🔧 Виправлення

### 1️⃣ Видалено невалідні поля з `RecipeDetails` interface

**До:**
```typescript
interface RecipeDetails {
  // ...
  totalIngredients?: number;      // ❌ Backend не відправляє!
  availableInFridge?: number;     // ❌ Backend не відправляє!
  missingCount?: number;          // ❌ Backend не відправляє!
}
```

**Після:**
```typescript
interface RecipeDetails {
  // ...
  // ✅ Тільки те, що backend реально відправляє!
  ingredients: {
    id: string;
    name: string;
    inFridge: boolean;           // ✅ З backend!
    fridgeQuantity: number;      // ✅ З backend!
  }[];
}
```

---

### 2️⃣ Frontend сам рахує stats (derived state)

**До:**
```typescript
// ❌ Очікування даних з backend
const { totalIngredients, availableInFridge, missingCount } = recipe.stats;
```

**Після:**
```typescript
// ✅ Обчислення stats на frontend з useMemo
const fridgeStats = useMemo(() => {
  const ingredients = recipe.ingredients ?? [];
  const total = ingredients.length;
  const available = ingredients.filter(i => i.inFridge).length;
  const missing = total - available;

  console.log('📊 Recipe stats (calculated on frontend):', {
    totalIngredients: total,
    availableInFridge: available,
    missingCount: missing,
  });

  return {
    totalIngredients: total,
    ingredientsInFridge: available,
    missingIngredients: missing,
  };
}, [recipe.ingredients]);

const { totalIngredients, ingredientsInFridge, missingIngredients } = fridgeStats;
```

---

### 3️⃣ Виправлено endpoint для додавання інгредієнтів

**Створено:** `/app/api/fridge/add-missing/route.ts`

**Request:**
```typescript
POST /api/fridge/add-missing
Body: { recipeId: "uuid" }
```

**Response:**
```json
{
  "success": true,
  "data": {
    "added": 2,
    "skipped": 1,
    "items": [
      { "name": "Pomidor", "addedQuantity": 300, "unit": "g" }
    ]
  }
}
```

**Функція на frontend:**
```typescript
async function addMissingToFridge() {
  const response = await fetch('/api/fridge/add-missing', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ recipeId }),
  });

  const result = await response.json();
  
  // 🔄 Refetch recipe to update inFridge status
  await loadRecipeDetails();
  
  // ✅ Show success message
  alert(`✅ Dodano ${result.data.added} składników!`);
}
```

---

### 4️⃣ UI з правильними stats

```tsx
{/* ✅ Stats з frontend обчислень */}
<div className="flex items-center gap-3 text-xs">
  <span className="flex items-center gap-1 text-green-600">
    <CheckCircle2 className="w-3 h-3" />
    {ingredientsInFridge} w lodówce
  </span>
  {missingIngredients > 0 && (
    <span className="flex items-center gap-1 text-orange-600">
      <XCircle className="w-3 h-3" />
      {missingIngredients} brakuje
    </span>
  )}
</div>

{/* ✅ Кнопка з динамічним count */}
{missingIngredients > 0 ? (
  <button onClick={addMissingToFridge} disabled={addingToCart}>
    <ShoppingCart className="w-4 h-4" />
    Dodaj brakujące do lodówki ({missingIngredients})
  </button>
) : (
  <button className="bg-gradient-to-r from-green-500 to-emerald-500">
    <CheckCircle2 className="w-4 h-4" />
    Ugotuj 🍳
  </button>
)}
```

---

## 📋 Архітектурні принципи

| Відповідальність | Backend | Frontend |
|------------------|---------|----------|
| **Факти (raw data)** | ✅ | ❌ |
| `inFridge: boolean` | ✅ Рахує | ❌ |
| `fridgeQuantity: number` | ✅ Відправляє | ❌ |
| **Derived state** | ❌ | ✅ |
| `totalIngredients` | ❌ | ✅ Обчислює |
| `availableInFridge` | ❌ | ✅ Обчислює |
| `missingCount` | ❌ | ✅ Обчислює |

---

## ✅ Результат після фіксу

### Логи:
```
📊 Recipe stats (calculated on frontend):
{ totalIngredients: 4, availableInFridge: 3, missingCount: 1 }
```

### UI:
- ✅ **"3 w lodówce"** — правильно показує
- ✅ **"1 brakuje"** — правильно рахує
- ✅ **Кнопка активна** при `missingCount > 0`
- ✅ **"Ugotuj 🍳"** показується при `missingCount === 0`
- ✅ **Refetch after POST** оновлює stats

---

## 🎓 Чому це правильна архітектура

1. **Backend відповідає за факти** — не дублює логіку рахування
2. **Frontend обчислює derived state** — гнучкість у зміні логіки
3. **Масштабованість** — легко додати нові stats (наприклад, `almostAvailable`)
4. **Performance** — `useMemo` кешує обчислення
5. **Single Source of Truth** — `ingredients` є єдиним джерелом істини

---

## 📁 Змінені файли

- ✅ `/app/recipes/[id]/page.tsx` — видалено очікування `stats` з backend, додано `useMemo`
- ✅ `/app/api/fridge/add-missing/route.ts` — створено endpoint для bulk add
- ✅ `RECIPE_FRIDGE_API_CONTRACT.md` — документація контракту API

---

## 🚀 Наступні кроки (UX polish)

1. **Toast notifications** замість `alert()`
2. **Optimistic UI** — показувати зміни без refetch
3. **Modal confirmation** — показувати список інгредієнтів перед додаванням
4. **Estimated cost** — показувати вартість недостатніх інгредієнтів
5. **Auto-refresh AI context** — оновлювати AI після додавання в холодильник

---

✅ **Архітектура виправлена і синхронізована!**
