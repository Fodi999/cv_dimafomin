# Smart Ingredient Search - Universal Resolve Pattern

## Концепция

**Один универсальный endpoint** для всех сценариев работы с ингредиентами:
- Поиск существующих
- Создание новых через AI
- Нормализация и классификация

## UX Scenarios

### 1️⃣ Есть точные совпадения

```
Пользователь вводит: "рис"

Dropdown показывает:
├─ Рис белый
├─ Рис басмати
└─ Рис жасмин

➕ Всё равно создать «рис»

👉 Клик на совпадение → выбор существующего
👉 Клик "Создать" → AI классификация + создание
```

### 2️⃣ Нет совпадений

```
Пользователь вводит: "киноа"

⚠️ Продукт не найден
AI создаст и классифицирует продукт

➕ Создать «киноа»

👉 Клик → POST /resolve → AI создает продукт
```

### 3️⃣ Частичное совпадение

```
Пользователь вводит: "лосось"

⚠️ Похожие продукты:
• Лосось свежий
• Лосось фермерский
• Лосось копчёный

➕ Всё равно создать «лосось»

👉 Клик на похожий → выбор существующего
👉 Клик "Создать" → AI классификация нового
```

## Technical Implementation

### Frontend Component

**`IngredientAutocomplete.tsx`** - Умный поисковый инпут

```tsx
<IngredientAutocomplete
  value={searchValue}
  onChange={(value) => setSearchValue(value)}
  onSelect={(ingredient) => handleSelect(ingredient)}
  onCreateNew={(input) => handleCreate(input)}
  language={language}
/>
```

**Состояния:**
- `value` - текущий поиск
- `suggestions` - результаты автокомплита (debounce 300ms)
- `showDropdown` - показ dropdown (min 2 символа)
- `loading` - состояние загрузки

**Dropdown структура:**
1. Список совпадений (если есть)
2. Разделитель
3. Кнопка "Создать" (всегда)

### API Layer

#### 1. Autocomplete Endpoint (существующий)

```
GET /api/admin/ingredients/suggest?q=лосось&limit=5

Response:
{
  "suggestions": [
    { id, name, nameRu, category, unit, ... }
  ]
}
```

**Использование:** Debounced поиск для dropdown

#### 2. Universal Resolve Endpoint (новый)

```
POST /api/admin/ingredients/resolve

Body:
{
  "input": "лосось"
}

Response:
{
  "status": "created" | "existing",
  "ingredient": {
    "id": "uuid-123",
    "name": "Лосось",
    "nameRu": "Лосось",
    "namePl": "Łosoś",
    "nameEn": "Salmon",
    "category": "fish",
    "nutritionGroup": "protein",
    "unit": "g"
  }
}
```

**Backend логика:**

```python
def resolve_ingredient(input: str):
    # 1. Normalize input
    normalized = normalize(input)
    
    # 2. Check if exists
    existing = db.find_by_normalized(normalized)
    if existing:
        return {"status": "existing", "ingredient": existing}
    
    # 3. AI Classification
    ai_result = classify_with_ai(input)
    # AI determines:
    # - category (fish, meat, vegetable, ...)
    # - nutritionGroup (protein, carbs, fat, ...)
    # - unit (g, ml, pcs, ...)
    # - translations (nameRu, namePl, nameEn)
    
    # 4. Create and save
    new_ingredient = db.create(
        name=ai_result.name,
        nameRu=ai_result.nameRu,
        namePl=ai_result.namePl,
        nameEn=ai_result.nameEn,
        category=ai_result.category,
        nutritionGroup=ai_result.nutritionGroup,
        unit=ai_result.unit,
        normalizedValue=normalized
    )
    
    return {"status": "created", "ingredient": new_ingredient}
```

### Frontend Integration

**В компоненте `CreateRecipeWithAI.tsx`:**

```tsx
const handleCreateNewIngredient = async (index: number, input: string) => {
  setCreatingIngredient(true);
  try {
    // Единственный вызов - всё остальное делает backend
    const result = await resolveIngredient(input);
    
    // Обновляем строку ингредиента
    setIngredients(prev => prev.map((ing, i) => 
      i === index ? {
        ...ing,
        ingredientId: result.ingredient.id,
        name: result.ingredient.nameRu || result.ingredient.name,
        unit: result.ingredient.unit,
        searchValue: ""
      } : ing
    ));

    // User feedback
    if (result.status === "created") {
      toast.success(`Продукт создан: ${result.ingredient.name}`);
    } else {
      toast.info(`Продукт найден: ${result.ingredient.name}`);
    }
  } catch (error) {
    toast.error("Не удалось создать продукт");
  } finally {
    setCreatingIngredient(false);
  }
};
```

**Никаких диалогов, никаких форм!** Просто один клик → результат.

## AI Classification Pipeline

Backend должен реализовать:

### 1. Prompt для классификации

```
You are an ingredient classification AI.
Given an ingredient name in any language, classify it:

Input: "лосось"

Output JSON:
{
  "name": "Лосось",
  "nameRu": "Лосось",
  "namePl": "Łosoś", 
  "nameEn": "Salmon",
  "category": "fish",
  "nutritionGroup": "protein",
  "unit": "g"
}

Categories: fish, meat, egg, vegetable, fruit, dairy, grain, pasta, bread, condiment, spice, herb, nut, seed, oil, sauce, beverage, sweet, legume, cheese, seafood, other

Nutrition Groups: protein, carbohydrate, fat, vegetable, fruit, dairy, other

Units: g, ml, pcs, tbsp, tsp, cup
```

### 2. Normalization

```python
def normalize(input: str) -> str:
    return (
        input
        .lower()
        .strip()
        .replace(' ', '')
        .replace('-', '')
        # Убрать диакритику
        # Убрать спецсимволы
    )
```

### 3. Deduplication Check

```sql
SELECT * FROM ingredients 
WHERE normalized_value = :normalized
LIMIT 1;
```

Если найдено → вернуть существующий
Если нет → AI классификация → создать новый

## Benefits

### ✅ Профессиональный UX
- Нет лишних модалок
- Мгновенный результат
- Прозрачная логика

### ✅ Простота Frontend
- Один компонент `IngredientAutocomplete`
- Один метод `resolveIngredient()`
- Никакой сложной логики

### ✅ Вся логика на Backend
- AI классификация
- Переводы
- Нормализация
- Дедупликация

### ✅ Переиспользование
- Работает в любой форме
- Recipe creation
- Fridge management
- Market lists

## Files Created/Modified

### ✅ Frontend

**Создано:**
- `/components/admin/recipes/IngredientAutocomplete.tsx` - Умный поисковый инпут
- `/lib/api/ingredients.api.ts` - Добавлена функция `resolveIngredient()`
- `/app/api/admin/ingredients/resolve/route.ts` - Proxy endpoint

**Изменено:**
- `/components/admin/recipes/CreateRecipeWithAI.tsx` - Использует новый паттерн

### ⏳ Backend (требуется)

**Требуется создать:**
- `POST /admin/ingredients/resolve` - Universal resolution endpoint
- AI classification service
- Normalization utils
- Deduplication check

## Testing

```bash
# 1. Запустить dev server
npm run dev

# 2. Открыть
http://localhost:3000/admin/recipes/create

# 3. Тест-кейсы:

## Scenario 1: Существующий продукт
Ввести: "рис"
✅ Должен показать список
✅ Клик на "Рис белый" → выбран
✅ Клик "Создать «рис»" → создан новый (если бэк готов)

## Scenario 2: Новый продукт
Ввести: "киноа"
✅ Должен показать "Продукт не найден"
✅ Клик "Создать «киноа»" → POST /resolve
✅ Backend создает через AI
✅ Продукт добавлен в форму

## Scenario 3: Частичное совпадение
Ввести: "лосось"
✅ Должен показать похожие
✅ Можно выбрать из списка
✅ Можно создать новый
```

## Next Steps

1. **Backend**: Реализовать `/admin/ingredients/resolve`
2. **AI**: Настроить prompt для классификации
3. **Testing**: Проверить все 3 сценария
4. **Optimization**: Кеширование AI результатов
5. **Analytics**: Логировать созданные через AI продукты

## Status

- ✅ Frontend component готов
- ✅ API route готов
- ✅ Integration в CreateRecipeWithAI готов
- ⏳ Backend endpoint требуется
- ⏳ AI classification требуется

---

**Последнее обновление:** 7 января 2026  
**Автор:** GitHub Copilot  
**Pattern:** Universal Resolve Pattern
