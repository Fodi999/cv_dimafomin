# AI Recipe Creation System

## Обзор

Система создания рецептов с помощью AI заменяет старую ручную форму. Теперь пользователю достаточно ввести минимум данных, а AI сгенерирует полный рецепт со всеми деталями.

## Философия

**Человек вводит:**
- Название рецепта (title)
- Список продуктов с весом (ingredients: [{ ingredientId, amount, unit }])
- Процесс приготовления одним текстом (instructions)

**AI генерирует:**
- Пошаговые инструкции (steps[])
- Количество порций (servings)
- Время приготовления (time)
- Сложность (difficulty)
- Калории и БЖУ (nutrition: { calories, protein, carbs, fat })
- Canonical name и SEO description

## Архитектура

### Frontend

**Основные компоненты:**

1. `/components/admin/recipes/CreateRecipeWithAI.tsx` - Главная форма
   - Поля: title, ingredients[], instructions
   - Кнопки: "Превью с AI", "Создать рецепт"
   - Отображение preview с AI-данными

2. `/components/admin/recipes/IngredientAutocomplete.tsx` - Автокомплит
   - Debounced search (300ms)
   - Dropdown с suggestions
   - "Добавить через AI" при отсутствии продукта

3. `/hooks/useAIRecipe.ts` - State management
   - `previewRecipe()` - генерация preview
   - `createRecipe()` - создание рецепта
   - `clearPreview()` - сброс состояния

4. `/lib/api/recipes-ai.api.ts` - API functions
   - Types: AIRecipeInput, AIRecipePreview, AIRecipeCreated
   - Functions: previewRecipeWithAI(), createRecipeWithAI()

### API Routes

**Frontend → Backend Proxy:**

1. `POST /api/admin/recipes/preview-ai`
   - Body: { title, ingredients[], instructions }
   - Response: AIRecipePreview (steps, servings, time, difficulty, nutrition)

2. `POST /api/admin/recipes/create-ai`
   - Body: { title, ingredients[], instructions }
   - Response: AIRecipeCreated (полный рецепт с ID)

**Backend Endpoints (требуют реализации):**

- `POST /admin/recipes/preview-ai` - AI preview generation
- `POST /admin/recipes/create-ai` - AI recipe creation + save to DB

## Workflow

### 1. Ввод данных пользователем

```typescript
{
  title: "Grilled Salmon with Rice",
  ingredients: [
    { ingredientId: "uuid-123", amount: 200, unit: "g" },
    { ingredientId: "uuid-456", amount: 150, unit: "g" }
  ],
  rawCookingText: "Marinate salmon in teriyaki sauce, grill it, boil rice, serve together"
}
```

### 2. Preview Generation (опционально)

- User clicks "Превью с AI"
- Frontend → `POST /api/admin/recipes/preview-ai`
- AI генерирует полный рецепт
- Frontend отображает preview в Card с голубой рамкой

### 3. Recipe Creation

- User clicks "Создать рецепт"
- Frontend → `POST /api/admin/recipes/create-ai`
- Backend:
  - AI генерирует полный рецепт
  - Сохраняет в БД
  - Возвращает created recipe с ID
- Frontend redirect → `/admin/catalog/recipes/{id}`

## UI/UX Features

### Autocomplete с suggestions

- Debounced search (300ms)
- Dropdown с прокруткой (max-h-60)
- Category icons в suggestions
- "Добавить через AI" при пустом результате

### Ingredient Row States

1. **Search state** - IngredientAutocomplete
2. **Selected state** - Зеленая плашка с галочкой
3. **Amount input** - Number input (width: 24 = 96px)
4. **Unit input** - Disabled (берется из ingredient.unit)

### Preview Card

- Border: `border-2 border-blue-500`
- Sections:
  - Title + canonical name
  - Stats grid (servings, time, difficulty, calories)
  - Summary text
  - Steps (numbered list)
  - Close button

### Error Handling

- Toast notifications для всех операций
- Form validation перед отправкой
- Backend error messages проброшены в UI

## Pages & Routes

**Удалено (старая форма):**
- ❌ `/app/admin/recipes/create/page.tsx` (RecipeForm) - заменена на AI

**Активные:**
- ✅ `/app/admin/recipes/create/page.tsx` - AI form (основная)
- ✅ `/app/admin/catalog/page.tsx` → RecipesTab → кнопка "Створити рецепт"

**API Routes:**
- `/app/api/admin/recipes/preview-ai/route.ts`
- `/app/api/admin/recipes/create-ai/route.ts`

## Integration Points

### 1. Ingredients System

- Используется `/api/admin/ingredients/suggest` для autocomplete
- `getIngredientName(ingredient, language)` для мультиязычности
- Category icons через `getCategoryIcon(category)`

### 2. Recipe Catalog

- После создания redirect → `/admin/catalog/recipes/{id}`
- RecipesTab рефетчит данные
- Новый рецепт появляется в таблице

### 3. Language Context

- Accept-Language header из `useLanguage()`
- Мультиязычные названия продуктов

## Backend Requirements

### 1. AI Integration

Backend должен реализовать AI-генерацию через:
- OpenAI GPT-4
- Claude API
- Gemini API
- Или собственная модель

### 2. Endpoints

**POST /admin/recipes/preview-ai:**
```typescript
Request: AIRecipeInput
Response: AIRecipePreview {
  title: string;
  canonicalName: string;
  summary: string;
  steps: string[];
  servings: number;
  time: number;
  difficulty: string;
  nutrition: { calories, protein, carbs, fat };
  ingredients: AIRecipeIngredient[];
}
```

**POST /admin/recipes/create-ai:**
```typescript
Request: AIRecipeInput
Response: AIRecipeCreated (full recipe DTO with ID)
```

### 3. AI Prompt Example

```
You are a professional chef assistant. 
Given a recipe title, ingredients list, and cooking instructions,
generate a complete recipe with:
- Step-by-step instructions (5-10 steps)
- Number of servings
- Cooking time in minutes
- Difficulty level (easy/medium/hard)
- Nutritional information (calories, protein, carbs, fat)
- SEO-friendly canonical name
- Short summary (2-3 sentences)

Input:
Title: "Grilled Salmon with Rice"
Ingredients: Salmon 200g, Rice 150g
Instructions: "Marinate salmon in teriyaki sauce, grill it, boil rice, serve together"

Output: { ... }
```

## Testing Checklist

- [ ] Autocomplete работает с debounce
- [ ] Выбор продукта заполняет weight и unit
- [ ] Кнопка "Add ingredient" добавляет строку
- [ ] Кнопка "Remove" удаляет строку
- [ ] Validation показывает toast errors
- [ ] Preview button генерирует preview
- [ ] Preview card отображает все данные
- [ ] Create button создает рецепт
- [ ] Redirect на /admin/catalog/recipes/{id} работает
- [ ] Error handling показывает user-friendly messages

## Future Improvements

1. **Image Generation** - AI генерирует изображение блюда
2. **Multi-step Preview** - Preview для каждого шага отдельно
3. **Ingredient Substitutions** - AI предлагает замены продуктов
4. **Batch Creation** - Создание нескольких рецептов за раз
5. **Voice Input** - Голосовой ввод инструкций
6. **Recipe Translation** - Автоматический перевод на другие языки

## Logs & Debugging

**Frontend Console:**
```javascript
console.log('[AI Recipe] Preview:', preview);
console.log('[AI Recipe] Creating...', input);
```

**Backend Logs:**
```
[Preview AI] Request: { title, ingredients, instructions }
[Preview AI] AI Response: { steps, servings, ... }
[Create AI] Saving recipe...
[Create AI] Created recipe ID: uuid-123
```

## Status

- ✅ Frontend компоненты созданы
- ✅ API routes настроены
- ✅ UI/UX реализован
- ⏳ Backend endpoints требуют реализации
- ⏳ AI integration не реализована

---

**Последнее обновление:** 7 января 2026
**Автор:** GitHub Copilot
