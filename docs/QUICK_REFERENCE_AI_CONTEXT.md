# 🚀 Quick Reference - AIRecommendationContext

## 📦 Импорт и использование

```typescript
import { useAIRecommendation } from '@/contexts/AIRecommendationContext';

function MyComponent() {
  const {
    currentRecommendation,
    setRecommendation,
    clearRecommendation,
    excludedRecipeIds,
    addExcludedRecipe,
    clearExcluded,
  } = useAIRecommendation();
  
  // Your code here
}
```

---

## ✅ Правильные паттерны

### 1. Показать AI рекомендацию
```typescript
const { currentRecommendation } = useAIRecommendation();

if (!currentRecommendation) return <Loading />;

return (
  <AIRecommendationCard
    recipe={currentRecommendation.recipe}
    matchStatus={currentRecommendation.recipe.scenario}
    matchPercent={currentRecommendation.recipe.matchRatio * 100}
    aiExplanation={{
      title: currentRecommendation.ai.title,
      reason: currentRecommendation.ai.reason,
    }}
  />
);
```

### 2. Следующий рецепт
```typescript
const { currentRecommendation, addExcludedRecipe } = useAIRecommendation();

const handleNextRecipe = async () => {
  if (currentRecommendation) {
    // ✅ Добавить в excluded (защита от дубликатов встроена)
    addExcludedRecipe(currentRecommendation.recipe.id);
  }
  
  // Загрузить следующую рекомендацию
  await loadNextRecommendation();
};
```

### 3. Приготовить рецепт (ВАЖНО!)
```typescript
const { currentRecommendation } = useAIRecommendation();
const { setRecipe } = useRecipe();  // RecipeContext

const handleCook = async () => {
  const result = await cookRecipe(currentRecommendation.recipe.id);
  
  if (result.success) {
    // ✅ ТОЛЬКО ЗДЕСЬ сохраняем в RecipeContext
    setRecipe({
      recipe: mapAIToRecipe(currentRecommendation),
      usedProducts: result.ingredientsUsed,
    });
  }
};
```

---

## ❌ Антипаттерны (НЕ делать)

### 1. ❌ НЕ сохранять автоматически
```typescript
// ❌ НЕПРАВИЛЬНО
const setRecommendation = (recommendation) => {
  setCurrentRecommendation(recommendation);
  saveToRecipeContext(recommendation);  // ← Нет!
};
```

### 2. ❌ НЕ использовать localStorage
```typescript
// ❌ НЕПРАВИЛЬНО
useEffect(() => {
  localStorage.setItem('aiRecommendation', JSON.stringify(currentRecommendation));
}, [currentRecommendation]);
```

### 3. ❌ НЕ рендерить из RecipeContext
```typescript
// ❌ НЕПРАВИЛЬНО
const { recipe } = useRecipe();
return <AIRecommendationCard recipe={recipe} />;

// ✅ ПРАВИЛЬНО
const { currentRecommendation } = useAIRecommendation();
return <AIRecommendationCard recipe={currentRecommendation.recipe} />;
```

---

## 🔄 Автоматическое поведение

### ✅ Что происходит автоматически:

1. **При новой рекомендации (`setRecommendation`)**
   - Excluded IDs очищаются
   - Свежий старт для новой сессии

2. **При добавлении в excluded (`addExcludedRecipe`)**
   - Дубликаты предотвращаются
   - Нет лишних перерендеров

3. **При перезагрузке страницы**
   - Состояние очищается (ephemeral)
   - AI рекомендация загружается заново

---

## 📋 Быстрая диагностика

### Проблема: "Brakuje 0 składników"
```typescript
// ❌ Вероятно используете RecipeContext
const { recipe } = useRecipe();

// ✅ Должно быть
const { currentRecommendation } = useAIRecommendation();
```

### Проблема: Показывается весь холодильник
```typescript
// ❌ Вероятно берёте из RecipeContext
<IngredientsList items={recipe.ingredients} />

// ✅ Должно быть
<IngredientsList items={currentRecommendation.recipe.ingredients} />
```

### Проблема: AI рекомендация после reload
```typescript
// ❌ НЕ сохранять в localStorage
localStorage.setItem('aiRecommendation', ...)

// ✅ Пусть загружается заново с API
// Ephemeral = нет persistence
```

---

## 🎯 Один источник правды

| UI Element | Источник |
|------------|----------|
| AI Title | `currentRecommendation.ai.title` |
| Recipe Name | `currentRecommendation.recipe.displayName` |
| Missing Count | `currentRecommendation.recipe.missingIngredients.length` |
| Ingredients | `currentRecommendation.recipe.ingredients` |
| Match % | `currentRecommendation.recipe.matchRatio * 100` |
| Scenario | `currentRecommendation.recipe.scenario` |

**НЕ используйте `RecipeContext` для рендера AI Assistant UI!**

---

## 🚀 TL;DR

```typescript
// ✅ DO
const { currentRecommendation } = useAIRecommendation();
<Card data={currentRecommendation} />

// ❌ DON'T
const { recipe } = useRecipe();
<Card data={recipe} />
```

**Правило:** AI Assistant использует `useAIRecommendation`, НЕ `useRecipe`.

---

## 📚 Больше информации

- `AI_RECOMMENDATION_CONTEXT_IMPROVEMENTS.md` — подробное описание улучшений
- `ARCHITECTURE_STATE_SEPARATION_DIAGRAM.md` — визуальная схема архитектуры
- `FINAL_CHECKLIST_AI_CONTEXT.md` — чеклист для проверки

**Есть вопросы? Смотрите полную документацию! 📖**
