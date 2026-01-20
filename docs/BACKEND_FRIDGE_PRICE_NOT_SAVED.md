# 🐛 Backend не сохраняет и не возвращает цену продукта

## ❌ Проблема

При добавлении продукта в холодильник **цена не сохраняется** и не возвращается в ответе, хотя фронтенд корректно отправляет данные.

### Что отправляет фронтенд

```http
POST /api/fridge/items
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "ingredientId": "6c4de662-3bae-4543-a27c-9b436d9856f5",
  "quantity": 400,
  "unit": "g",
  "expiresAt": "2026-01-22T15:42:25.395Z",
  "priceInput": {          // 👈 Цена отправляется
    "value": 21.45,
    "per": "g"
  }
}
```

### Что возвращает бэкенд

```json
{
  "id": "temp-1768923746515-yd1qoieon",
  "ingredientId": "6c4de662-3bae-4543-a27c-9b436d9856f5",
  "quantity": 400,
  "unit": "g",
  "expiresAt": "2026-01-22T15:42:25.395Z"
  // ❌ НЕТ полей: totalPrice, pricePerUnit, currency
}
```

### Последствия

1. **Не работают расчёты экономии** - пользователь не видит, сколько сэкономил на рецепте
2. **Нет истории цен** - невозможно отследить динамику цен
3. **Плохой UX** - пользователь вводит цену, но она не сохраняется

---

## ✅ Ожидаемое поведение

### Запрос (уже работает правильно)

```typescript
interface AddFridgeItemRequest {
  ingredientId: string;
  quantity: number;
  unit: string;
  expiresAt: string;
  priceInput?: {
    value: number;  // Цена (например, 21.45 PLN)
    per: string;    // Единица измерения цены (g, kg, ml, l, pcs)
  };
}
```

### Ответ (должен включать цену)

```typescript
interface FridgeItemResponse {
  id: string;
  ingredientId: string;
  quantity: number;
  unit: string;
  expiresAt: string;
  totalPrice: number | null;     // ✅ Общая цена (например, 8.58 PLN за 400г)
  pricePerUnit: number | null;   // ✅ Цена за единицу (например, 21.45 PLN за 1кг)
  currency: string;               // ✅ Валюта (PLN, EUR, USD)
  createdAt: string;
  updatedAt: string;
  ingredient: {
    id: string;
    name: string;
    unit: string;
    category: string;
  };
}
```

---

## 🔧 Требования к бэкенду

### 1. Принимать `priceInput` в POST /api/fridge/items

```go
type AddFridgeItemRequest struct {
    IngredientID string     `json:"ingredientId" binding:"required"`
    Quantity     float64    `json:"quantity" binding:"required,gt=0"`
    Unit         string     `json:"unit" binding:"required"`
    ExpiresAt    time.Time  `json:"expiresAt" binding:"required"`
    PriceInput   *PriceInput `json:"priceInput,omitempty"`
}

type PriceInput struct {
    Value float64 `json:"value" binding:"required,gt=0"` // Цена
    Per   string  `json:"per" binding:"required"`        // Единица (g, kg, ml, l, pcs)
}
```

### 2. Рассчитать и сохранить цену

```go
func calculatePrice(priceInput *PriceInput, quantity float64, itemUnit string) (totalPrice, pricePerUnit float64) {
    if priceInput == nil {
        return 0, 0
    }
    
    // Конвертация единиц (если нужно)
    // Например: priceInput.Per = "kg", itemUnit = "g"
    // Нужно конвертировать цену: 21.45 PLN/kg = 0.02145 PLN/g
    
    // Упрощённый вариант (если единицы совпадают):
    pricePerUnit = priceInput.Value
    totalPrice = (priceInput.Value * quantity) // с учётом конвертации
    
    return totalPrice, pricePerUnit
}
```

### 3. Сохранить в БД

```sql
CREATE TABLE "FridgeItem" (
    id UUID PRIMARY KEY,
    ingredient_id UUID NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    total_price DECIMAL(10, 2),        -- Общая цена
    price_per_unit DECIMAL(10, 2),     -- Цена за единицу
    currency VARCHAR(3) DEFAULT 'PLN', -- Валюта
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Вернуть цену в ответе

```go
type FridgeItemResponse struct {
    ID           string    `json:"id"`
    IngredientID string    `json:"ingredientId"`
    Quantity     float64   `json:"quantity"`
    Unit         string    `json:"unit"`
    ExpiresAt    time.Time `json:"expiresAt"`
    TotalPrice   *float64  `json:"totalPrice"`     // 👈 Добавить
    PricePerUnit *float64  `json:"pricePerUnit"`   // 👈 Добавить
    Currency     string    `json:"currency"`        // 👈 Добавить
    CreatedAt    time.Time `json:"createdAt"`
    UpdatedAt    time.Time `json:"updatedAt"`
    Ingredient   IngredientInfo `json:"ingredient"`
}
```

---

## 🧪 Тестирование

### Тест 1: Добавление с ценой

```bash
curl -X POST http://localhost:8000/api/fridge/items \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "ingredientId": "abc-123",
    "quantity": 400,
    "unit": "g",
    "expiresAt": "2026-01-27T00:00:00Z",
    "priceInput": {
      "value": 21.45,
      "per": "kg"
    }
  }'
```

**Ожидаемый ответ:**
```json
{
  "id": "uuid",
  "ingredientId": "abc-123",
  "quantity": 400,
  "unit": "g",
  "expiresAt": "2026-01-27T00:00:00Z",
  "totalPrice": 8.58,      // ✅ 21.45 PLN/kg * 0.4 kg = 8.58 PLN
  "pricePerUnit": 21.45,   // ✅ Цена за кг
  "currency": "PLN",       // ✅ Валюта
  "createdAt": "2026-01-20T15:42:00Z",
  "updatedAt": "2026-01-20T15:42:00Z"
}
```

### Тест 2: Добавление без цены (опционально)

```bash
curl -X POST http://localhost:8000/api/fridge/items \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "ingredientId": "abc-123",
    "quantity": 500,
    "unit": "g",
    "expiresAt": "2026-01-27T00:00:00Z"
  }'
```

**Ожидаемый ответ:**
```json
{
  "id": "uuid",
  "ingredientId": "abc-123",
  "quantity": 500,
  "unit": "g",
  "expiresAt": "2026-01-27T00:00:00Z",
  "totalPrice": null,     // ✅ null если цена не указана
  "pricePerUnit": null,   // ✅ null если цена не указана
  "currency": "PLN",
  "createdAt": "2026-01-20T15:42:00Z",
  "updatedAt": "2026-01-20T15:42:00Z"
}
```

### Тест 3: GET /api/fridge/items должен возвращать цены

```bash
curl -X GET http://localhost:8000/api/fridge/items \
  -H "Authorization: Bearer <JWT>"
```

**Ожидаемый ответ:**
```json
{
  "data": {
    "items": [
      {
        "id": "uuid",
        "ingredientId": "abc-123",
        "quantity": 400,
        "unit": "g",
        "expiresAt": "2026-01-27T00:00:00Z",
        "totalPrice": 8.58,      // ✅ Цена присутствует
        "pricePerUnit": 21.45,   // ✅ Цена за единицу
        "currency": "PLN",
        "ingredient": {
          "id": "abc-123",
          "name": "Скумбрия",
          "unit": "g",
          "category": "fish"
        },
        "daysLeft": 6,
        "status": "fresh"
      }
    ]
  }
}
```

---

## 🎯 Приоритет

**HIGH** - Без этого функция расчёта экономии не работает, пользователи не видят выгоду от использования приложения.

---

## 📋 Связанные задачи

- [ ] Добавить поля `totalPrice`, `pricePerUnit`, `currency` в модель `FridgeItem`
- [ ] Обновить endpoint POST /api/fridge/items для обработки `priceInput`
- [ ] Добавить логику расчёта цены с конвертацией единиц
- [ ] Обновить endpoint GET /api/fridge/items для возврата цен
- [ ] Написать unit-тесты для расчёта цен
- [ ] Обновить Swagger документацию

---

## 🔗 Связанные файлы (фронтенд)

- `/app/api/fridge/items/route.ts` - Временный workaround с mock данными
- `/components/fridge/FridgeForm.tsx` - Форма отправляет `priceInput`
- `/lib/types.ts` - Определение типов `AddFridgeItemData`

---

**Создано:** 2026-01-20  
**Статус:** 🔴 Критический (блокирует функцию экономии)  
**Ответственный:** Backend team
