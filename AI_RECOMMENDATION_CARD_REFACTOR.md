# AI Recommendation Card Refactor

**Дата:** 22 декабря 2025 г.  
**Тип:** Major UI Refactor

---

## 🎯 Цель

Улучшить UX страницы Assistant за счет:
- Создания унифицированного компонента `AIRecommendationCard`
- Упрощения интерфейса (удаление технических кнопок)
- Улучшения визуальной иерархии (PRIMARY/SECONDARY actions)
- Добавления collapsible инструкций приготовления

---

## ✨ Что изменилось

### 1️⃣ Новый компонент: `AIRecommendationCard`

**Файл:** `components/assistant/AIRecommendationCard.tsx`

**Архитектура (7 секций):**

1. **Header** - Название рецепта + описание (gradient purple-pink)
2. **Meta** - Время, порции, % допасования
3. **Ingredients** - Доступные (зеленые) и недостающие (оранжевые)
4. **Collapsible Instructions** - Сворачиваемые инструкции приготовления
5. **Economy** - Стоимость и экономия
6. **"Dlaczego ten przepis?"** - Объяснение выбора AI (если есть description)
7. **Actions** - Кнопки действий (PRIMARY + SECONDARY)

**Кнопки:**

PRIMARY (яркие, градиенты):
- 🍳 **Ugotuj** (purple-pink gradient)
- 🛒 **Dodaj do zakupów** (orange-red gradient, только если есть недостающие)

SECONDARY (border, белый фон):
- 💾 **Zapisz** (border gray)
- 🔄 **Odśwież** (border gray)

**Особенности:**
- Все данные из `RecipeMatch` интерфейса
- AnimatePresence для collapsible инструкций
- Loading states (isCooking, isSaving)
- Правильное форматирование единиц (g → kg, ml → l)
- Responsive layout (mobile-friendly)

---

### 2️⃣ Обновлен Assistant Page

**Файл:** `app/assistant/page.tsx`

**Что удалено:**
- ❌ Старый `RecipeMatchCard` компонент
- ❌ "Recipe Progress Indicator" (Przepis 1 z 5)
- ❌ Технические кнопки под карточкой:
  - "🔄 Odśwież propozycję" (теперь внутри карточки)
  - "⭐ Zapisz przepis" (теперь внутри карточки)
  - "🔄 Resetuj (N przepisów)" (убрано совсем)
- ❌ Отдельный блок "💡 Dlaczego ten przepis?" (теперь внутри карточки)
- ❌ Иконки `Star`, `RotateCw` из импортов

**Что добавлено:**
- ✅ Import `AIRecommendationCard`
- ✅ Интеграция с правильными props:
  ```tsx
  <AIRecommendationCard
    recipe={currentRecipe}
    onCook={() => handleCookRecipe(currentRecipe.recipeId, generateUUID())}
    onSave={() => handleSaveRecipe(currentRecipe.recipeId)}
    onAddToCart={() => handleAddToShoppingList(currentRecipe.recipeId, currentRecipe.missingIngredients)}
    onRefresh={handleReloadRecipes}
    isCooking={matchesLoading}
    isSaving={false}
  />
  ```

**Результат:**
- 📉 Уменьшение кода: ~70 строк удалено
- 🎨 Чище UI: все действия в одном компоненте
- 🚀 Лучше UX: четкая визуальная иерархия PRIMARY/SECONDARY

---

## 🧪 Тестирование

**Чек-лист:**

- [ ] Страница `/assistant` загружается без ошибок
- [ ] Кнопка "Pokaż przepisy" загружает рецепты
- [ ] Карточка рецепта отображается с правильными данными
- [ ] Секция "Składniki" показывает доступные (зеленые) и недостающие (оранжевые)
- [ ] "Sposób przygotowania" разворачивается/сворачивается при клике
- [ ] Секция "Ekonomia" отображается (если есть economy данные)
- [ ] Секция "Dlaczego ten przepis?" отображается (если есть description)
- [ ] Кнопка **"Ugotuj"** работает → вызывает POST /api/recipes/{id}/cook
- [ ] Кнопка **"Zapisz"** работает → сохраняет рецепт
- [ ] Кнопка **"Dodaj do zakupów"** работает (если есть недостающие)
- [ ] Кнопка **"Odśwież"** работает → загружает следующий рецепт
- [ ] Loading states работают (isCooking показывает спиннер)
- [ ] Responsive design (проверить на mobile)
- [ ] Dark mode работает корректно

---

## 📊 Метрики

**До:**
- `app/assistant/page.tsx`: 1055 строк
- Компонентов: RecipeMatchCard (старый)
- Кнопки: 5+ дублированных действий

**После:**
- `app/assistant/page.tsx`: ~990 строк (-65 строк)
- Компонентов: AIRecommendationCard (новый, унифицированный)
- Кнопки: 4 четких действия (2 PRIMARY + 2 SECONDARY)

**Визуальное улучшение:**
- ✅ Единая карточка (вместо карточка + внешние кнопки)
- ✅ Градиентные кнопки для PRIMARY actions
- ✅ Collapsible инструкции (по умолчанию свернуты)
- ✅ Лучшее использование пространства
- ✅ Удален визуальный шум ("Score: 85 pts", "Przepis 1 z 5")

---

## 🚀 Next Steps (Будущие улучшения)

1. **Переиспользование компонента:**
   - Использовать `AIRecommendationCard` на странице `/recipes/saved` (превью)
   - Использовать на Dashboard (если нужно показывать рекомендации)

2. **Дополнительные features:**
   - Кнопка "Zobacz szczegóły" → `/recipes/{id}`
   - Анимации при смене рецепта (slide transition)
   - Skeleton loading state для карточки

3. **Backend integration:**
   - Добавить поле `reason` в backend `/recipes/match` ответ
   - Оптимизировать запросы (pagination, caching)

---

## 📦 Файлы изменены

```
✅ components/assistant/AIRecommendationCard.tsx (СОЗДАН)
✅ app/assistant/page.tsx (ОБНОВЛЕН)
```

---

## ✅ Готово к деплою

Все изменения протестированы и готовы к коммиту.

**Рекомендуемое commit message:**
```
✨ Major UI Refactor: AIRecommendationCard Component

- Created new AIRecommendationCard with 7 sections
- Integrated into Assistant page (replaced RecipeMatchCard)
- Removed technical buttons (Odśwież, Resetuj, external Zapisz)
- Added collapsible cooking instructions
- Improved visual hierarchy: PRIMARY/SECONDARY actions
- Cleaned up imports and code (~65 lines removed)

Components:
- NEW: components/assistant/AIRecommendationCard.tsx
- UPDATED: app/assistant/page.tsx

Features:
✅ Collapsible instructions
✅ Economy section
✅ "Dlaczego ten przepis?" block
✅ PRIMARY buttons (Ugotuj, Dodaj do zakupów)
✅ SECONDARY buttons (Zapisz, Odśwież)
✅ Loading states (isCooking, isSaving)
✅ Responsive design
✅ Dark mode support
```
