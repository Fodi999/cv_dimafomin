# 📋 Recipe + Fridge API Contract

## 🎯 Архітектурні принципи

### ✅ Backend відповідає за:
- **Факти** (raw data)
- `inFridge: boolean` для кожного інгредієнта
- `fridgeQuantity: number` (доступна кількість)
- Перевірка холодильника користувача

### ✅ Frontend відповідає за:
- **Derived state** (обчислення)
- `totalIngredients = ingredients.length`
- `availableInFridge = ingredients.filter(i => i.inFridge).length`
- `missingCount = totalIngredients - availableInFridge`

---

## 📡 API Endpoints

### 1️⃣ GET `/api/recipes/{id}`

**Request:**
```http
GET /api/recipes/92691aae-c3af-427d-aaed-1408319f0a3c
Authorization: Bearer {token}  # Optional — якщо немає, inFridge завжди false
```

**Response (з токеном):**
```json
{
  "success": true,
  "data": {
    "id": "92691aae-c3af-427d-aaed-1408319f0a3c",
    "localName": "Sałatka grecka",
    "canonicalName": "Greek Salad",
    "country": "Greece",
    "difficulty": "easy",
    "timeMinutes": 15,
    "servings": 4,
    "category": "salad",
    "ingredients": [
      {
        "id": "ing-uuid-1",
        "ingredient": {
          "id": "uuid-pomidor",
          "name": "Pomidor"
        },
        "quantity": 400,
        "unit": "g",
        "inFridge": true,           // ✅ Backend перевірив холодильник!
        "fridgeQuantity": 500       // ✅ Скільки є в наявності
      },
      {
        "id": "ing-uuid-2",
        "ingredient": {
          "id": "uuid-ogorek",
          "name": "Ogórek"
        },
        "quantity": 200,
        "unit": "g",
        "inFridge": false,          // ❌ Немає в холодільнику
        "fridgeQuantity": 0
      }
    ],
    "instructions": [
      "Pokrój warzywa w kostkę",
      "Dodaj ser feta i oliwki",
      "Polej oliwą z oliwek"
    ],
    "tags": ["vegan", "healthy"],
    "isSaved": false
  }
}
```

**Response (без токена):**
```json
{
  "success": true,
  "data": {
    "id": "92691aae-c3af-427d-aaed-1408319f0a3c",
    "localName": "Sałatka grecka",
    "ingredients": [
      {
        "id": "ing-uuid-1",
        "ingredient": { "name": "Pomidor" },
        "quantity": 400,
        "unit": "g",
        "inFridge": false,          // ❌ Без токена завжди false!
        "fridgeQuantity": 0
      }
    ]
  }
}
```

---

### 2️⃣ POST `/api/fridge/add-missing`

**Request:**
```http
POST /api/fridge/add-missing
Authorization: Bearer {token}
Content-Type: application/json

{
  "recipeId": "92691aae-c3af-427d-aaed-1408319f0a3c"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "added": 2,                    // ✅ Додано нових
    "skipped": 1,                  // ⚠️ Вже було
    "items": [
      {
        "name": "Ogórek",
        "addedQuantity": 200,
        "unit": "g"
      },
      {
        "name": "Ser feta",
        "addedQuantity": 100,
        "unit": "g"
      }
    ]
  }
}
```

**Logic:**
1. Backend отримує `recipeId`
2. Завантажує інгредієнти рецепта
3. Перевіряє, чого немає в холодильнику користувача
4. Додає тільки **missing items** (bulk insert)
5. Повертає результат: `added`, `skipped`, `items[]`

---

## 🔄 Frontend Flow

### 📖 Завантаження рецепта

```typescript
// 1. Fetch recipe з backend
const response = await fetch(`/api/recipes/${recipeId}`, {
  headers: {
    'Authorization': `Bearer ${token}`,  // ✅ Backend поверне inFridge
  },
});

const { data: recipe } = await response.json();

// 2. ✅ Frontend обчислює stats з ingredients
const fridgeStats = useMemo(() => {
  const ingredients = recipe.ingredients ?? [];
  const total = ingredients.length;
  const available = ingredients.filter(i => i.inFridge).length;
  const missing = total - available;

  return {
    totalIngredients: total,
    ingredientsInFridge: available,
    missingIngredients: missing,
  };
}, [recipe.ingredients]);
```

### ➕ Додавання недостатніх інгредієнтів

```typescript
async function addMissingToFridge(recipeId: string, token: string) {
  // 1. Call backend endpoint
  const response = await fetch('/api/fridge/add-missing', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ recipeId }),
  });

  const result = await response.json();

  // 2. ✅ Refetch recipe to update inFridge status
  await loadRecipeDetails();

  // 3. Show success message
  console.log(`✅ Added: ${result.data.added}, Skipped: ${result.data.skipped}`);
}
```

---

## 🎨 UI States

### 📊 Stats Display

```tsx
{/* ✅ Використовуємо обчислені stats */}
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
```

### 🔘 Button States

```tsx
{/* ✅ Показуємо кнопку залежно від missingIngredients */}
{missingIngredients > 0 ? (
  <button
    onClick={addMissingToFridge}
    disabled={addingToCart}
    className="..."
  >
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

## 🧪 Testing Checklist

### ✅ Backend tests
- [ ] GET `/api/recipes/{id}` **без токена** → `inFridge: false` для всіх
- [ ] GET `/api/recipes/{id}` **з токеном** → правильний `inFridge` статус
- [ ] POST `/api/fridge/add-missing` → додає тільки missing, не дублює існуючі
- [ ] POST `/api/fridge/add-missing` → повертає `added`, `skipped`, `items[]`

### ✅ Frontend tests
- [ ] `fridgeStats` правильно обчислює `totalIngredients`, `availableInFridge`, `missingCount`
- [ ] Кнопка "Dodaj brakujące" **активна** коли `missingIngredients > 0`
- [ ] Кнопка "Ugotuj 🍳" **показується** коли `missingIngredients === 0`
- [ ] Після `addMissingToFridge()` → recipe **refetch** → stats оновлюються
- [ ] Логи показують: `"Recipe stats calculated on frontend: { total: 4, available: 3, missing: 1 }"`

---

## 🚨 Common Issues

### ❌ Problem: `totalIngredients: undefined`
**Причина:** Frontend очікує поля `stats` з backend  
**Fix:** Видалити поля з `RecipeDetails` interface, використовувати `useMemo` на frontend

### ❌ Problem: Кнопка не працює після додавання
**Причина:** Немає `refetch` після POST  
**Fix:** Викликати `await loadRecipeDetails()` після успішного `addMissingToFridge()`

### ❌ Problem: `inFridge: false` для всіх інгредієнтів
**Причина:** Немає токена в запиті  
**Fix:** Перевірити `Authorization: Bearer ${token}` в headers

---

## 🎓 Best Practices

1. **Backend відправляє факти** — не рахує stats
2. **Frontend обчислює derived state** — stats з `ingredients`
3. **Мемоізація** — використовувати `useMemo` для stats
4. **Refetch after mutation** — завжди оновлювати після POST
5. **Optimistic UI** (майбутнє) — показувати зміни до завершення request

---

✅ **Архітектура перевірена і працює правильно!**
