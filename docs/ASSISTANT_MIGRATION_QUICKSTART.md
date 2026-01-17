# 🎯 AI Assistant Page - Quick Start (2025 Architecture)

## Что изменилось?

**Было**: Смешанная архитектура (AI generation + Rules Engine)  
**Стало**: Чистый Backend-driven Rules Engine

## Файлы

- ✅ **Новая версия**: `app/(user)/assistant/page.tsx` (370 строк)
- 📦 **Backup**: `app/(user)/assistant/page-old.tsx` (1165 строк)

## Как работает сейчас

### 1 API call вместо 3:
```typescript
GET /api/ai-recipe/recommendation
```

### 1 hook вместо 5:
```typescript
const { data, loading, error, refetch, loadNext } = useAIRecommendation(token);
```

### 1 компонент вместо 2:
```tsx
{data && <AIRecommendationCard recipe={data.recipe} />}
```

## Ключевые изменения

### ❌ Удалено
- AI generation (`useAI`, `runAI`, `handleCreateSingleRecipe`)
- Frontend логика (`recomputeMissingIngredients`, `loadRecipeMatches`)
- localStorage persistence (`recipeMatches`, `viewedRecipeIds`)
- Multiple state variables (15+ → 1)
- Conditional flows и fallbacks

### ✅ Добавлено
- Единый источник данных (`useAIRecommendation`)
- Типы из `@/lib/types/ai-recipe`
- AI контекст (title, reason, tip, ingredientsUsed)
- Простой UX (автозагрузка + refresh)

## Метрики

| Метрика | До | После | Результат |
|---------|-----|-------|-----------|
| Строк кода | 1165 | 370 | **-68%** |
| State vars | 15+ | 1 | **-93%** |
| API calls | 3 | 1 | **-66%** |
| Сложность | High | Low | ✅ |

## Следующие шаги

1. **Тестирование**
   ```bash
   npm run dev
   # Открыть /assistant
   # Проверить все сценарии
   ```

2. **Если нужен AI generation**
   - Создать `/assistant/generate`
   - Перенести логику из `page-old.tsx`

3. **Если нужно откатиться**
   ```bash
   mv app/(user)/assistant/page.tsx app/(user)/assistant/page-new.tsx
   mv app/(user)/assistant/page-old.tsx app/(user)/assistant/page.tsx
   ```

## Документация

См. полную документацию: `docs/ASSISTANT_PAGE_MIGRATION_2025.md`

## Контракт 2025

**Backend решает**: scenario, confidence, ingredients, economy, AI explanation  
**Frontend рендерит**: одна карточка с решением backend  
**Frontend НЕ решает**: что показывать, как фильтровать, какой fallback

---

**Дата**: 17.01.2026  
**Статус**: ✅ Готово к тестированию
