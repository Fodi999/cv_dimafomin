# 🐛 Backend: Fridge Price - FRONTEND FIX + Backend TODO

**Дата создания**: 2026-01-16  
**Обновлено**: 2026-01-20 (**ИСПРАВЛЕНА ОШИБКА ФРОНТЕНДА**)  
**Проблема**: Цена отправлялась с неправильной единицей измерения  
**Влияние**: Невозможно рассчитать стоимость продуктов в холодильнике

---

## 🔴 Найденная проблема

### ❌ Что отправлял фронтенд (НЕПРАВИЛЬНО)

```json
{
  "ingredientId": "abc123",
  "quantity": 600,
  "unit": "g",
  "priceInput": {
    "value": 44.5,
    "per": "g"  // ❌ ОШИБКА! 44.5 PLN за ГРАММ = 44,500 PLN/кг!
  }
}
```

**Проблема**: Если продукт в граммах (g), то цена должна быть за килограмм (kg), а не за грамм!

**Пример**:
- Купил 600 г сыра за 44.5 злотых
- Это значит: **~74 PLN/кг** (44.5 ÷ 0.6)
- **НЕ** 44.5 PLN/грамм (это 44,500 PLN/кг - безумие!)

---

## ✅ Исправление фронтенда (ЗАВЕРШЕНО)

### Добавлена функция конвертации единиц

**Файл**: `/components/fridge/FridgeForm.tsx`

```typescript
/**
 * Конвертирует единицу продукта в единицу для цены
 * Примеры: g → kg, ml → l, pcs → pcs
 */
const getPriceUnit = (unit: string): string => {
  switch (unit.toLowerCase()) {
    case 'g':   return 'kg';   // Цена за килограмм
    case 'ml':  return 'l';    // Цена за литр
    case 'pcs':
    case 'szt': return 'pcs';  // Цена за штуку
    default:    return unit;   // Остальное без изменений (kg, l, tbsp, etc.)
  }
};

// Использование при отправке:
addData.priceInput = {
  value: parseFloat(priceValue),
  per: getPriceUnit(selectedIngredient.unit), // ✅ g → kg
};
```

### ✅ Теперь отправляет ПРАВИЛЬНО

```json
{
  "ingredientId": "abc123",
  "quantity": 600,
  "unit": "g",           // Продукт в граммах
  "priceInput": {
    "value": 44.5,
    "per": "kg"          // ✅ ПРАВИЛЬНО! Цена за килограмм
  }
}
```

---

## 💡 Логика конвертации

| Единица продукта | Единица для цены | Пример |
|------------------|------------------|--------|
| `g` | `kg` | 600g за 44.5 PLN → 44.5 PLN/kg |
| `ml` | `l` | 500ml за 15 PLN → 15 PLN/l |
| `pcs` / `szt` | `pcs` | 10 штук за 20 PLN → 20 PLN/pcs |
| `kg` | `kg` | Без изменений |
| `l` | `l` | Без изменений |

**Почему так?**
Пользователь думает крупными единицами:
- Цена за **килограмм** (не за грамм)
- Цена за **литр** (не за миллилитр)
- Цена за **штуку**

---

## 🔧 Backend TODO (всё ещё нужно!)

### 1. Добавить поля в таблицу `fridge_items`

```sql
ALTER TABLE fridge_items ADD COLUMN IF NOT EXISTS total_price DECIMAL(10, 2);
ALTER TABLE fridge_items ADD COLUMN IF NOT EXISTS price_per_unit DECIMAL(10, 2);
ALTER TABLE fridge_items ADD COLUMN IF NOT EXISTS price_unit VARCHAR(10);
ALTER TABLE fridge_items ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'PLN';
```

### 2. Принимать `priceInput` в запросе

```go
type AddFridgeItemRequest struct {
    IngredientID string     `json:"ingredientId"`
    Quantity     float64    `json:"quantity"`
    Unit         string     `json:"unit"`
    ExpiresAt    time.Time  `json:"expiresAt"`
    PriceInput   *PriceInput `json:"priceInput,omitempty"`  // 👈 Добавить
}

type PriceInput struct {
    Value float64 `json:"value"`  // 44.5
    Per   string  `json:"per"`    // "kg"
}
```

### 3. Рассчитать и сохранить цены

```go
func (s *FridgeService) AddItem(req AddFridgeItemRequest) (*FridgeItem, error) {
    item := &FridgeItem{
        IngredientID: req.IngredientID,
        Quantity:     req.Quantity,
        Unit:         req.Unit,
        ExpiresAt:    req.ExpiresAt,
    }

    // 💰 Если цена указана - рассчитать
    if req.PriceInput != nil {
        // Конвертировать количество продукта в единицы цены
        quantityInPriceUnits := convertUnits(req.Quantity, req.Unit, req.PriceInput.Per)
        
        // Цена за единицу (например, PLN/kg)
        item.PricePerUnit = req.PriceInput.Value
        
        // Общая цена = (количество в единицах цены) × (цена за единицу)
        item.TotalPrice = quantityInPriceUnits * req.PriceInput.Value
        
        item.PriceUnit = req.PriceInput.Per
        item.Currency = "PLN"
    }

    // Сохранить в БД
    return s.repository.Create(item)
}

// Пример конвертации
func convertUnits(quantity float64, fromUnit string, toUnit string) float64 {
    if fromUnit == "g" && toUnit == "kg" {
        return quantity / 1000.0  // 600g → 0.6kg
    }
    if fromUnit == "ml" && toUnit == "l" {
        return quantity / 1000.0  // 500ml → 0.5l
    }
    return quantity  // Одинаковые единицы
}
```

### 4. Вернуть цены в ответе

```go
type FridgeItemResponse struct {
    ID           string    `json:"id"`
    IngredientID string    `json:"ingredientId"`
    Quantity     float64   `json:"quantity"`
    Unit         string    `json:"unit"`
    ExpiresAt    time.Time `json:"expiresAt"`
    
    // 💰 Добавить цены
    TotalPrice   *float64 `json:"totalPrice,omitempty"`    // 44.5
    PricePerUnit *float64 `json:"pricePerUnit,omitempty"`  // 74.17 (PLN/kg)
    PriceUnit    *string  `json:"priceUnit,omitempty"`     // "kg"
    Currency     *string  `json:"currency,omitempty"`      // "PLN"
}
```

---

## 📊 Примеры расчётов

### Пример 1: Сыр (граммы)
```
Запрос:
- quantity: 600
- unit: "g"
- priceInput: { value: 44.5, per: "kg" }

Расчёт:
- quantityInPriceUnits = 600g ÷ 1000 = 0.6 kg
- pricePerUnit = 44.5 PLN/kg
- totalPrice = 0.6 × 44.5 = 26.7 PLN

Ответ:
{
  "totalPrice": 26.7,
  "pricePerUnit": 44.5,
  "priceUnit": "kg",
  "currency": "PLN"
}
```

### Пример 2: Молоко (миллилитры)
```
Запрос:
- quantity: 1000
- unit: "ml"
- priceInput: { value: 4.5, per: "l" }

Расчёт:
- quantityInPriceUnits = 1000ml ÷ 1000 = 1 l
- pricePerUnit = 4.5 PLN/l
- totalPrice = 1 × 4.5 = 4.5 PLN

Ответ:
{
  "totalPrice": 4.5,
  "pricePerUnit": 4.5,
  "priceUnit": "l",
  "currency": "PLN"
}
```

### Пример 3: Яйца (штуки)
```
Запрос:
- quantity: 10
- unit: "pcs"
- priceInput: { value: 12.0, per: "pcs" }

Расчёт:
- quantityInPriceUnits = 10 pcs (одинаковые единицы)
- pricePerUnit = 12.0 PLN/pcs (за упаковку 10 штук)
- totalPrice = 10 × 12.0 = 120 PLN (если цена за штуку)
  ИЛИ
- totalPrice = 12.0 PLN (если цена за всю упаковку)

Примечание: Для штучных товаров нужно уточнить логику!
```

---

## 🧪 Тестирование

### Сценарий 1: Добавить продукт с ценой
```bash
POST /api/fridge/items
Authorization: Bearer <JWT>

{
  "ingredientId": "abc123",
  "quantity": 600,
  "unit": "g",
  "expiresAt": "2026-01-27T10:00:00Z",
  "priceInput": {
    "value": 44.5,
    "per": "kg"
  }
}

# Ожидаемый ответ:
{
  "id": "xyz789",
  "ingredientId": "abc123",
  "quantity": 600,
  "unit": "g",
  "expiresAt": "2026-01-27T10:00:00Z",
  "totalPrice": 26.7,      // ✅
  "pricePerUnit": 44.5,    // ✅
  "priceUnit": "kg",       // ✅
  "currency": "PLN"        // ✅
}
```

### Сценарий 2: Добавить продукт БЕЗ цены
```bash
POST /api/fridge/items
{
  "ingredientId": "abc123",
  "quantity": 600,
  "unit": "g",
  "expiresAt": "2026-01-27T10:00:00Z"
  // priceInput отсутствует
}

# Ожидаемый ответ (без цен):
{
  "id": "xyz789",
  "ingredientId": "abc123",
  "quantity": 600,
  "unit": "g",
  "expiresAt": "2026-01-27T10:00:00Z"
  // Цены null или отсутствуют
}
```

---

## ✅ Статус

### Фронтенд
- ✅ **ИСПРАВЛЕНО** - Добавлена функция `getPriceUnit()`
- ✅ Правильная конвертация: g → kg, ml → l
- ✅ Цена отправляется в правильном формате
- ✅ Файл: `/components/fridge/FridgeForm.tsx`

### Бэкенд
- ⏳ **TODO** - Добавить поля в БД (`total_price`, `price_per_unit`, `price_unit`, `currency`)
- ⏳ **TODO** - Принимать `priceInput` в запросе
- ⏳ **TODO** - Рассчитывать цены (totalPrice, pricePerUnit)
- ⏳ **TODO** - Возвращать цены в ответе

---

## 🔗 Связанные файлы

- ✅ `/components/fridge/FridgeForm.tsx` - исправлена отправка
- ⏳ Backend: таблица `fridge_items` - нужны поля для цен
- ⏳ Backend: API endpoint `/api/fridge/items` - нужна обработка

---

## 📝 Примечания

1. **Почему g → kg?**
   - Пользователь думает крупными единицами
   - 44.5 PLN/kg понятнее, чем 0.0445 PLN/g

2. **Валюта**
   - Сейчас хардкод "PLN"
   - В будущем: поддержка EUR, USD и т.д.

3. **Штучные товары**
   - Для `pcs`/`szt` нужна дополнительная логика
   - Цена может быть за 1 штуку или за упаковку
   - Требуется уточнение бизнес-логики
