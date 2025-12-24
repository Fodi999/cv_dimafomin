# Fridge MVP - Правильная обработка данных

## 🐛 Типичная ошибка (исправлена)

### ❌ БЫЛО (неправильно):
```typescript
const response = await fetch('/api/catalog/ingredients/search?query=mleko');
const products = response.data; // ❌ data - это объект, не массив!
products.map(...) // ❌ ОШИБКА: products.map is not a function
```

### ✅ СТАЛО (правильно):
```typescript
const response = await fetch('/api/catalog/ingredients/search?query=mleko');
const json = await response.json();

// ✅ ВАЖНО: правильная обработка вложенной структуры
const items = json?.data?.items ?? [];

// Теперь items - это массив
setSuggestions(items);
```

---

## 📊 Структура API ответа

### Backend возвращает:
```json
{
  "data": {
    "count": 5,
    "items": [
      {
        "id": "uuid-123",
        "name": "Mleko",
        "unit": "ml",
        "category": "dairy",
        "defaultShelfLifeDays": 7
      },
      ...
    ]
  }
}
```

### Frontend должен извлечь:
```typescript
const items = response?.data?.items ?? [];
//                 ^      ^      ^
//                 |      |      └─ Массив продуктов
//                 |      └─ Объект data
//                 └─ Корневой объект response
```

---

## 🔍 Почему "found items: 5", но UI пустой?

### Proxy логирует:
```typescript
console.log('[API Proxy] ✅ Success, found items:', data.data?.count || 0);
// Вывод: "found items: 5" ✅
```

### Frontend (БЫЛО неправильно):
```typescript
const items = response.data; // ❌ Это объект, не массив!
items.map(...) // ❌ Ошибка!
```

### Frontend (СТАЛО правильно):
```typescript
const items = response?.data?.items ?? []; // ✅ Массив
items.map(...) // ✅ Работает!
```

---

## 🎯 Правильный flow добавления продукта

### 1️⃣ Пользователь вводит "mleko"

**Frontend:**
```typescript
GET /api/catalog/ingredients/search?query=mleko
Authorization: Bearer {token}
```

**Backend отвечает:**
```json
{
  "data": {
    "count": 3,
    "items": [
      { "id": "uuid-1", "name": "Mleko", "unit": "ml", ... },
      { "id": "uuid-2", "name": "Mleko kokosowe", "unit": "ml", ... },
      { "id": "uuid-3", "name": "Mleko migdałowe", "unit": "ml", ... }
    ]
  }
}
```

**Frontend обрабатывает:**
```typescript
const json = await response.json();
const items = json?.data?.items ?? [];
setSuggestions(items); // ✅ Dropdown показывает 3 результата
```

---

### 2️⃣ Пользователь выбирает "Mleko" из списка

**Frontend сохраняет:**
```typescript
const selectedIngredient = {
  id: "uuid-1",
  name: "Mleko",
  unit: "ml",
  category: "dairy",
  defaultShelfLifeDays: 7
};
```

---

### 3️⃣ Пользователь вводит количество: 1000 ml

**Frontend отправляет:**
```typescript
POST /api/fridge/items
Authorization: Bearer {token}
Content-Type: application/json

{
  "ingredientId": "uuid-1",
  "quantity": 1000,
  "unit": "ml"
}
```

**Backend:**
1. Берёт `defaultShelfLifeDays` из catalog (7 дней)
2. Вычисляет `expires_at = now + 7 days`
3. Вычисляет `daysLeft = (expires_at - now).days`
4. Определяет `status`:
   - `ok` если daysLeft >= 3
   - `warning` если daysLeft = 1-2
   - `critical` если daysLeft = 0
   - `expired` если daysLeft < 0

**Backend отвечает:**
```json
{
  "id": "fridge-item-uuid",
  "ingredient": {
    "name": "Mleko",
    "category": "dairy"
  },
  "quantity": 1000,
  "unit": "ml",
  "expiresAt": "2025-12-22T10:00:00Z",
  "daysLeft": 7,
  "status": "ok"
}
```

---

### 4️⃣ Frontend обновляет список

**Вариант A: Оптимистичный update (быстро, но может рассинхронизироваться)**
```typescript
const newItem = await fridgeApi.addItem(data, token);
setItems([...items, newItem]); // Добавить новый item
```

**Вариант B: Полный refetch (медленно, но надежно)** ⭐ **MVP использует этот**
```typescript
await fridgeApi.addItem(data, token);
await loadFridgeItems(); // Перезагрузить весь список
```

---

### 5️⃣ GET /api/fridge/items возвращает обновленный список

**Frontend:**
```typescript
GET /api/fridge/items
Authorization: Bearer {token}
```

**Backend отвечает:**
```json
{
  "items": [
    {
      "id": "fridge-item-uuid",
      "ingredient": { "name": "Mleko", "category": "dairy" },
      "quantity": 1000,
      "unit": "ml",
      "expiresAt": "2025-12-22T10:00:00Z",
      "daysLeft": 7,
      "status": "ok"
    }
  ]
}
```

**Frontend обрабатывает:**
```typescript
const response = await fridgeApi.getItems(token);
const items = response?.items ?? []; // ✅ Массив
setItems(items);
```

---

## 🔧 Исправления в коде

### `/components/fridge/IngredientAutocomplete.tsx`
```typescript
// ✅ ИСПРАВЛЕНО
const response = await fridgeApi.searchIngredients(value, token);
const items = response?.data?.items ?? []; // Правильная деструктуризация
console.log('[IngredientAutocomplete] Items extracted:', items);
setSuggestions(items);
```

### `/app/api/catalog/ingredients/search/route.ts`
```typescript
// ✅ ДОБАВЛЕНО: детальное логирование
console.log('[API Proxy] Response structure:', {
  hasData: !!data.data,
  hasItems: !!data.data?.items,
  itemsIsArray: Array.isArray(data.data?.items),
  count: data.data?.count || 0,
  itemsLength: data.data?.items?.length || 0
});
```

---

## 📋 Чеклист отладки

Если autocomplete не работает:

1. **Проверить терминал (server logs):**
   ```
   [API Proxy] GET /api/catalog/ingredients/search?query=mleko
   [API Proxy] Response structure: { itemsIsArray: true, itemsLength: 5 }
   ```

2. **Проверить browser console:**
   ```
   [IngredientAutocomplete] Response: { data: { count: 5, items: [...] } }
   [IngredientAutocomplete] Items extracted: [...]
   [IngredientAutocomplete] Items count: 5
   ```

3. **Проверить Network tab:**
   - Status: 200 OK
   - Response Preview: `{ data: { count: 5, items: [...] } }`

4. **Проверить React DevTools:**
   - `suggestions` state: массив из 5 элементов
   - `isOpen` state: true

Если всё это true, но UI пустой → проблема в рендеринге, проверить:
```typescript
{suggestions.map(item => ...)} // Убедиться что suggestions - массив
```

---

## ✅ Статус: Исправлено

- ✅ Правильная деструктуризация `response?.data?.items ?? []`
- ✅ Детальное логирование в proxy
- ✅ Детальное логирование в компоненте
- ✅ Правильный рендеринг пустого состояния
- ✅ Улучшенные сообщения об ошибках

**Готово к тестированию!** 🚀
