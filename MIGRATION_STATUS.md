# 🎯 Миграция на Clean Architecture - Статус

## ✅ Что сделано:

### 1. Создана новая архитектура типов
- **`lib/types/ai-recipe.ts`** - Чистые DTO типы (RecipeScenario, RecipeConfidence, AIExplanationDTO)
- **`lib/api/ai-recipe.ts`** - Чистый API клиент (fetchAIRecipe, fetchNextAIRecipe)
- **`hooks/useAIRecommendation.ts`** - React hook для управления состоянием
- **`lib/constants/ai-recipe-ui.ts`** - UI константы (CTA тексты, цвета, иконки)
- **`components/assistant/AIRecommendationCardClean.tsx`** - Новый чистый компонент (reference)

### 2. Очищены debug логи
- ✅ `lib/api/recipe-matching.ts` - удалены console.log
- ✅ `app/(user)/assistant/page.tsx` - удалены лишние логи

### 3. Найдена проблема
❌ **`components/assistant/AIRecommendationCard.tsx` был повреждён при замене**

---

## 🚨 ТЕКУЩАЯ ПРОБЛЕМА

Компонент `AIRecommendationCard.tsx` нужно пересоздать, но он:
1. Большой (521 строка в оригинале)
2. Использует много props (onCook, onSave, onAddToCart, onRefresh, isCooking, isSaving, weeklyBudget)
3. Интегрирован в `app/(user)/assistant/page.tsx`

---

## 🎯 РЕШЕНИЕ

### Вариант A: Простой (рекомендуется)
Используем **существующие типы** `RecipeMatch` из `lib/api/recipe-matching.ts` и просто **УПРОЩАЕМ компонент**:

**Ключевое изменение**: 
```tsx
// ❌ БЫЛО (сложная логика перевода)
const ingredientName = getLocalizedIngredientName(
  {
    name: ing.name,
    namePl: (ing as any).name_pl || (ing as any).namePl,
    nameEn: (ing as any).name_en || (ing as any).nameEn,
    nameRu: (ing as any).name_ru || (ing as any).nameRu,
  },
  language
);

// ✅ СТАНЕТ (backend уже локализовал)
const ingredientName = ing.name;  // Backend УЖЕ отправил локализованное название!
```

### Вариант B: Идеальный (требует времени)
Создать новый endpoint `/api/ai-recipe/recommendation` который:
1. Получает язык из `User.settings`
2. Локализует все названия
3. Генерирует AI объяснение
4. Возвращает полный `AIRecipeResponse`

Затем использовать `AIRecommendationCardClean` из новой архитектуры.

---

## 📋 СЛЕДУЮЩИЕ ШАГИ

### Немедленно (восстановление работоспособности):

1. **Восстановить AIRecommendationCard.tsx** из Git:
```bash
cd /Users/dmitrijfomin/Desktop/cv-sushi_chef
git checkout HEAD -- components/assistant/AIRecommendationCard.tsx
```

2. **Применить МИНИМАЛЬНЫЕ изменения** (только убрать `getLocalizedIngredientName`):
```tsx
// Найти все вхождения:
// getLocalizedIngredientName({...}, language)

// Заменить на:
// ing.name  // Backend уже локализовал!
```

### Позже (чистая архитектура):

1. Создать новый API endpoint `/api/ai-recipe/recommendation`
2. Мигрировать на новые типы из `lib/types/ai-recipe.ts`
3. Использовать `AIRecommendationCardClean`

---

## 🔧 КОМАНДЫ ДЛЯ ВОССТАНОВЛЕНИЯ

```bash
# 1. Восстановить из Git
cd /Users/dmitrijfomin/Desktop/cv-sushi_chef
git checkout HEAD -- components/assistant/AIRecommendationCard.tsx

# 2. Проверить файл
cat components/assistant/AIRecommendationCard.tsx | head -50

# 3. Убедиться что нет ошибок
npm run build
```

---

## 📝 ЧТО УЗНАЛИ

### Backend ДОЛЖЕН отправлять:
```json
{
  "usedIngredients": [
    {
      "ingredientId": "123",
      "name": "свежие яйца",  // ← УЖЕ на русском!
      "name_en": "fresh eggs",
      "name_pl": "świeże jajka",
      "name_ru": "свежие яйца",
      "quantity": 2,
      "unit": "шт"
    }
  ]
}
```

### Frontend ПРОСТО рендерит:
```tsx
<span>{ing.name}</span>  // Всё! Никакой логики!
```

---

## ✅ ИТОГ

**Философия Clean Architecture:**
- Backend: думает, решает, локализует
- Frontend: рендерит DTO как есть
- Никаких `getLocalizedIngredientName`, `switch(language)`, вычислений на frontend

Сейчас нужно восстановить работающий компонент, а затем постепенно мигрировать.
