# 🎯 BUGFIX: Single Source of Truth для статуса рецепта

**Дата:** 22 января 2026  
**Статус:** ✅ ИСПРАВЛЕНО

---

## 🐛 Проблема

### Симптомы (UI показывает противоречия)

```
UI одновременно отображает:

1. "Нужно больше ингредиентов"   ← Общий заголовок
2. "Brakuje 0 składników"        ← Badge в карточке
3. Список всех ингредиентов      ← Без пропусков

ЭТО ЛОГИЧЕСКИ НЕВОЗМОЖНО!
```

### Корень проблемы

**Backend говорит:**
```json
{
  "decision": "CAN_COOK_NOW",
  "ingredients": [/* все 13 */],
  "missingIngredients": []
}
```

**Frontend читает из НЕСКОЛЬКИХ источников:**

```typescript
// ❌ Источник 1: matchStatus (backend decision)
const status = matchStatus || ...

// ❌ Источник 2: recipe.canCookNow (старый флаг)
recipe.canCookNow ? "ready" : ...

// ❌ Источник 3: recipe.missingCount (вычислено на фронте)
text: `Brakuje ${recipe.missingCount} składników`

// ❌ Источник 4: локальное вычисление
recipe.missingCount <= 2 ? "almost_ready" : "not_ready"
```

**Результат:** Каждый источник говорит своё → UI ломается

---

## 🎯 Решение: Single Source of Truth

### Правило

```
✅ ТОЛЬКО matchStatus (backend decision)
❌ НЕТ fallback на старые поля
❌ НЕТ вычислений на фронте
```

### Код ДО исправления

```typescript
// ❌ НЕПРАВИЛЬНО
const getRecipeStatus = () => {
  // Fallback на старую логику
  const status = matchStatus || (recipe.canCookNow ? "ready" : ...);
  
  switch (status) {
    case "ALMOST_READY":
      return {
        text: `Brakuje ${recipe.missingCount} składników`,  // ← читает старое поле
        //                 ^^^^^^^^^^^^^^^^^^
        // missingCount может быть 0, но backend сказал "NEED_MORE"
      };
  }
};
```

### Код ПОСЛЕ исправления

```typescript
// ✅ ПРАВИЛЬНО
const getRecipeStatus = () => {
  // ❌ NO fallback - backend MUST provide matchStatus
  if (!matchStatus) {
    console.error("❌ matchStatus is missing - backend contract violated");
    return { /* error state */ };
  }

  // ✅ Use ONLY backend decision
  const missingCount = recipe.missingIngredients?.length || recipe.missingCount || 0;
  
  switch (matchStatus) {
    case "CAN_COOK_NOW":
      return {
        text: "Możesz ugotować teraz",  // ← статичный текст
        canCook: true,
      };
    case "ALMOST_READY":
      return {
        text: missingCount > 0 ? `Brakuje ${missingCount} składników` : "Prawie gotowe",
        //                       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // Используем РЕАЛЬНЫЙ массив missingIngredients
        canCook: true,
      };
    case "NEED_MORE":
      return {
        text: missingCount > 0 ? `Brakuje ${missingCount} składników` : "Potrzeba więcej składników",
        canCook: false,
      };
  }
};
```

---

## 🔧 Изменения

### 1. AIRecommendationCard.tsx

**Убрали:**
- ❌ Fallback на `recipe.canCookNow`
- ❌ Локальное вычисление статуса
- ❌ Использование старого `recipe.missingCount` как источника правды

**Добавили:**
- ✅ Строгая проверка `matchStatus` (error если отсутствует)
- ✅ Вычисление `missingCount` из **реального массива** `recipe.missingIngredients`
- ✅ Поддержка legacy форматов (`ready`, `almost_ready`, `not_ready`)

### 2. assistant/page.tsx

**Убрали:**
- ❌ Дублирующую AI карточку выше рецепта
- ❌ Повторяющийся текст `data.ai.title` и `data.ai.reason`

**Добавили:**
- ✅ `tip` в `aiExplanation` (передаём из `data.ai.tip`)

### 3. AIRecommendationCard типы

**Добавили:**
```typescript
aiExplanation?: {
  title?: string;
  reason?: string;
  tip?: string; // ✅ NEW: AI tip from backend
};
```

---

## 📊 Таблица: Кто решает?

| Поле | Кто решает | Frontend делает |
|------|-----------|-----------------|
| `matchStatus` | ✅ Backend Rules Engine | Рендерит |
| `missingIngredients[]` | ✅ Backend | Считает `.length` для badge |
| `ai.title` | ✅ Backend AI | Рендерит |
| `ai.reason` | ✅ Backend AI | Рендерит |
| `ai.tip` | ✅ Backend AI | Рендерит |
| `canCookNow` | ⚠️ Legacy (deprecated) | Игнорирует |
| `missingCount` | ⚠️ Legacy (deprecated) | Игнорирует |

---

## 🧪 Как проверить исправление

### Тест 1: Статус согласован

```bash
1. Backend возвращает decision: "CAN_COOK_NOW"
2. Badge показывает "Możesz ugotować teraz" (🟢)
3. missingIngredients = []
4. Badge показывает "Brakuje 0 składników" или вообще не показывает missing

✅ НЕТ противоречий
```

### Тест 2: Нет дублирования

```bash
1. Открыть /assistant
2. Проверить, что AI объяснение показано ОДИН раз
   (внутри карточки рецепта, НЕ выше)

✅ Нет двух синих карточек с одним текстом
```

### Тест 3: Backend contract enforcement

```bash
1. Backend забыл отправить matchStatus
2. Console показывает: "❌ matchStatus is missing - backend contract violated"
3. UI показывает: "Status nieznany"

✅ Frontend не "думает" вместо backend
```

---

## 🎯 Принципы (ещё раз)

### ✅ ПРАВИЛЬНО

```typescript
// Backend решает
const status = matchStatus;

// Frontend рендерит
return <Badge status={status} />;
```

### ❌ НЕПРАВИЛЬНО

```typescript
// Frontend "думает"
const status = recipe.canCookNow ? "ready" : recipe.missingCount <= 2 ? "almost" : "not";

// Frontend интерпретирует
return <Badge status={status} />;
```

---

## 📚 Связанные документы

1. `AI_RECOMMENDATION_CONTEXT_SEPARATION_2026.md` — архитектура контекстов
2. `ARCHITECTURE_STATE_SEPARATION_DIAGRAM.md` — схемы изоляции
3. `FINAL_FIX_RECIPE_PROVIDER_ISOLATION.md` — изоляция RecipeProvider
4. `CHEAT_SHEET_FINAL_ARCHITECTURE.md` — шпаргалка

---

## ✅ Итог

**ДО:**
- UI читал из 4 источников
- Противоречия: "CAN_COOK_NOW" + "Brakuje 0 składników" + "Нужно больше"
- Дублирующий AI текст

**ПОСЛЕ:**
- UI читает ТОЛЬКО `matchStatus`
- Нет противоречий
- AI текст показан один раз (внутри карточки)
- Badge считает из реального массива `missingIngredients`

**Правило:**
```
Backend думает → Frontend рендерит
```

🎉 **Готово!**
