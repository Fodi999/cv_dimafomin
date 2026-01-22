# AI Recommendation Context - Разделение состояний
**Дата:** 22 января 2026  
**Статус:** ✅ Завершено  
**Критичность:** 🔴 HIGH — исправлена архитектурная ошибка

---

## 🚨 Проблема (Root Cause Analysis)

### Симптомы:
```
❌ UI показывает: "Нужно больше ингредиентов" + "Brakuje 0 składników"
❌ В карточке отображается весь холодильник вместо ингредиентов рецепта
❌ AI говорит missing_count = 1, UI показывает 0
```

### Корень проблемы:
**ДВА разных "рецепта" в ОДНОМ состоянии:**

1. **AI Recommendation** (Rules Engine) → `missing_count = 1` ✅
2. **RecipeContext** (localStorage) → `ingredientsMissing = 0` ❌

```typescript
// ❌ ЧТО БЫЛО:
RecipeContext: {
  title: 'Жареные яйца',
  ingredients: Array(13),        // ← весь холодильник
  ingredientsMissing: Array(0)   // ← из старого сохранённого рецепта
}

AI Response: {
  recipe: {
    ingredients: Array(2),        // ← реальные ингредиенты
    missingIngredients: Array(1)  // ← яйца
  }
}
```

### Почему это произошло:

```typescript
// ❌ ОШИБКА: сохранение AI recommendation в RecipeContext
const handleRecipeLoaded = (aiResponse: AIRecipeResponse) => {
  saveToRecipeContext(aiResponse);  // ← НЕ ДЛЯ ЭТОГО RecipeContext!
}
```

**RecipeContext по своей природе:**
- ✅ Хранит **пользовательский** выбранный рецепт
- ✅ Персистентный (localStorage)
- ❌ **НЕ знает** про `match_status`
- ❌ **НЕ знает** про `missing_count`
- ❌ **НЕ предназначен** для AI recommendations

---

## ✅ Решение

### Архитектурный принцип:

> **AI Recommendation — это не "рецепт", это "решение".**  
> Решение нельзя сохранять там, где лежат рецепты.

### 1️⃣ Разделили контексты:

| Контекст | Назначение | Persistent? | Используется для |
|----------|-----------|-------------|------------------|
| **RecipeContext** | User-selected recipe | ✅ Yes (localStorage) | • Ugotuj (cook)<br>• Zapisz (save)<br>• Katalog |
| **AIRecommendationContext** | AI decision | ❌ No (ephemeral) | • AI Assistant<br>• Rules Engine<br>• Временные рекомендации |

---

## 📦 Реализация

### Файл: `contexts/AIRecommendationContext.tsx`

```typescript
/**
 * AIRecommendationContext
 * 
 * 🎯 PURPOSE: Ephemeral state for AI recommendations
 * 
 * ✅ ONLY FOR:
 * - AI Assistant page
 * - Temporary recommendations from Rules Engine
 * - Current AI decision (CAN_COOK_NOW, ALMOST_READY, NEED_MORE)
 * 
 * ❌ NOT FOR:
 * - User-selected recipes (use RecipeContext)
 * - Saved recipes (use RecipeContext)
 * - Persistent storage (NO localStorage)
 */

interface AIRecommendationContextValue {
  currentRecommendation: AIRecipeResponse | null;
  setRecommendation: (recommendation: AIRecipeResponse) => void;
  clearRecommendation: () => void;
  excludedRecipeIds: string[];
  addExcludedRecipe: (recipeId: string) => void;
  clearExcluded: () => void;
}
```

**Ключевые особенности:**
- ✅ **Ephemeral** — нет localStorage
- ✅ **Lightweight** — только текущая рекомендация
- ✅ **Excluded IDs** — для "следующий рецепт"

---

## 🔄 Изменения в `assistant/page.tsx`

### ❌ Было:
```typescript
// Сохраняем AI рецепт в RecipeContext сразу при загрузке
const handleRecipeLoaded = (aiResponse: AIRecipeResponse) => {
  saveToRecipeContext(aiResponse);  // ← НЕПРАВИЛЬНО
}

const { data } = useAIRecommendation(token, handleRecipeLoaded);
```

### ✅ Стало:
```typescript
// AI рекомендация НЕ сохраняется автоматически
const { data } = useAIRecommendation(token);

// RecipeContext используется ТОЛЬКО при явном действии пользователя
const handleCookRecipe = async (recipeId, servingsMultiplier) => {
  const result = await recipeMatchingApi.cookRecipe(...);
  
  if (result.success) {
    // ✅ ТЕПЕРЬ сохраняем (пользователь явно приготовил)
    saveToRecipeContext({
      recipe: mapAIResponseToRecipe(data),
      usedProducts: result.ingredientsUsed,
    });
  }
}
```

---

## 📊 Источники правды для UI

| UI Element | Источник данных |
|------------|-----------------|
| **AI Assistant header** | `data.ai.title` |
| **Recipe card title** | `data.recipe.displayName` |
| **Status badge** | `data.recipe.scenario` |
| **Ingredients list** | `data.recipe.ingredients` |
| **Missing ingredients** | `data.recipe.missingIngredients` |
| **Match percent** | `data.recipe.matchRatio * 100` |

**❌ НЕ используем:**
- ~~`RecipeContext.ingredients`~~
- ~~`RecipeContext.ingredientsMissing`~~
- ~~localStorage для AI recommendations~~

---

## 🎯 Правила использования

### ✅ RecipeContext — ТОЛЬКО для:
```typescript
// 1. Пользователь нажал "Ugotuj"
handleCookRecipe() → saveToRecipeContext()

// 2. Пользователь открыл рецепт из каталога
openRecipeFromCatalog() → saveToRecipeContext()

// 3. Пользователь сохранил рецепт
saveRecipe() → saveToRecipeContext()
```

### ✅ AIRecommendationContext — ТОЛЬКО для:
```typescript
// 1. Получили AI рекомендацию
const { data } = useAIRecommendation()

// 2. Показываем временное решение
<AIRecommendationCard recipe={data.recipe} />

// 3. Пользователь запросил "следующий рецепт"
loadNext() → excludedRecipeIds.push(currentId)
```

---

## 🔍 Проверка исправления

### До:
```
Console:
✅ AI Response: missing_count = 1
❌ RecipeContext: ingredientsMissing = []
❌ UI: "Brakuje 0 składników"
```

### После:
```
Console:
✅ AI Response: missing_count = 1
✅ UI renders directly from AI response
✅ UI: "Brakuje 1 składników"
✅ RecipeContext не замусорен AI данными
```

---

## 📋 Checklist изменений

- ✅ Создан `AIRecommendationContext.tsx`
- ✅ Удалён `handleRecipeLoaded` callback
- ✅ `useAIRecommendation` больше не сохраняет в RecipeContext
- ✅ `handleCookRecipe` сохраняет ТОЛЬКО после успешного приготовления
- ✅ `AIRecommendationCard` получает данные напрямую из `data.recipe`
- ✅ Комментарии обновлены с правильной архитектурой

---

## 🚀 Следующие шаги

### Backend (опционально):
1. Убедиться, что `/api/ai-recipe/recommendation` возвращает полный контракт:
   ```json
   {
     "recipe": {
       "scenario": "ALMOST_READY",
       "missingIngredients": [...]
     }
   }
   ```

### Frontend:
1. ~~Создать `AIRecommendationProvider` в root layout~~ (будет в следующем PR)
2. Добавить unit-тесты для разделения контекстов
3. Документировать в Storybook

---

## 📚 Связанные документы

- `AI_RECOMMENDATION_CARD_REFACTOR_2026.md` — рефакторинг компонента
- `AI_RECIPE_WORKFLOW.md` — архитектура AI рекомендаций
- `ARCHITECTURE_COOK_NOW_CONTRACT.md` — контракт backend

---

## 🏆 Итоговый вывод

**Главное правило архитектуры:**

> **Backend думает. Frontend объясняет. AI разговаривает.**  
> **AI Recommendation — ephemeral. User Recipe — persistent.**

**Нельзя смешивать:**
- ❌ Временные решения ↔ Постоянное состояние
- ❌ AI рекомендации ↔ Пользовательские рецепты
- ❌ Rules Engine output ↔ User selection

**Каждый тип данных — свой контекст.**
