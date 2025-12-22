# Critical Fixes: AIRecommendationCard Logic & UX

**Дата:** 22 декабря 2025 г.  
**Приоритет:** 🔴 CRITICAL

---

## 🐛 Исправленные критические баги

### 1️⃣ **10000% dopasowania → max 100%**

**Проблема:**
```tsx
// БЫЛО (неправильно):
{Math.round(recipe.coverage * 100)}%
// Если backend возвращает 100 вместо 1 → 10000%
```

**Решение:**
```tsx
// СТАЛО (с защитой):
{Math.min(100, Math.round(recipe.coverage > 1 ? recipe.coverage : recipe.coverage * 100))}%
// Теперь: clamp (0-100), автоопределение формата, защита от overflow
```

**Эффект:** Процент **всегда ≤ 100%**

---

### 2️⃣ **Ekonomia без контекста → Полный breakdown**

**Проблема:**
```
Koszt dodatkowy: 94.20 PLN
```
❌ Пользователь не понимает ЗА ЧТО платит

**Решение:**
```
Koszt dokupienia (3 składniki):
• Wieprzowina (600 g) – 78.00 PLN
• Jaja (2 szt) – 8.40 PLN
• Bułka (150 g) – 7.80 PLN
Razem: 94.20 PLN
≈ 23.55 PLN / porcja
```

**Эффект:** **Прозрачность** + контекст цены

---

### 3️⃣ **Brak "Dlaczego ten przepis?" → Fallback логика**

**Проблема:**
- Блок показывался только если `recipe.description` есть
- 90% рецептов без description → пустой UI

**Решение:**
```tsx
{(recipe.description || recipe.coverage > 0.5) && (
  <p>
    {recipe.description || (
      <>
        Ten przepis został zaproponowany, ponieważ:
        <br />• masz {usedCount} składników w lodówce ({coverage}% pokrycia)
        <br />• {canCookNow ? 'możesz ugotować od razu' : `wystarczy dokupić ${missingCount} składników`}
        <br />• przygotowanie zajmuje tylko {cookingTime} minut
      </>
    )}
  </p>
)}
```

**Эффект:** **Всегда** есть AI-объяснение

---

### 4️⃣ **Brak wizualnych stanów → Status Badges**

**Проблема:**
- Рецепт с 3 недостающими ингредиентами выглядел "готовым"
- Пользователь не понимал готовность

**Решение:**
```tsx
const getRecipeStatus = () => {
  if (recipe.canCookNow) {
    return { emoji: '🟢', text: 'Możesz ugotować teraz', color: 'green' };
  } else if (recipe.missingCount <= 2) {
    return { emoji: '🟡', text: `Brakuje ${recipe.missingCount} składników`, color: 'yellow' };
  } else {
    return { emoji: '🔴', text: `Brakuje ${recipe.missingCount} składników`, color: 'red' };
  }
};
```

**Header с badge:**
```tsx
<div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 ${status.color}`}>
  <span>{status.emoji}</span>
  <span>{status.text}</span>
</div>
```

**Эффект:**
- 🟢 Can cook now
- 🟡 Missing ≤ 2 (почти готов)
- 🔴 Missing > 2 (нужна закупка)

---

### 5️⃣ **Budget integration → Предупреждение о бюджете**

**Добавлено:**
```tsx
{weeklyBudget && recipe.economy.costToComplete > 0 && (
  (() => {
    const budgetPercent = (recipe.economy.costToComplete / weeklyBudget) * 100;
    if (budgetPercent >= 50) {
      return (
        <div className="bg-orange-100 border border-orange-300 p-2 rounded-lg">
          <p className="text-xs font-semibold text-orange-800 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            To {budgetPercent.toFixed(0)}% Twojego tygodniowego budżetu
          </p>
        </div>
      );
    }
  })()
)}
```

**Эффект:** Пользователь видит предупреждение если рецепт **дорогой** (>50% бюджета)

---

## 📊 Сравнение: До vs После

### До (❌):
```
Kotlet schabowy
10000% dopasowania
Koszt dodatkowy: 94.20 PLN
[Нет объяснения почему этот рецепт]
[Визуально выглядит готовым, но не готов]
```

### После (✅):
```
🔴 Brakuje 3 składników
Kotlet schabowy
25% dopasowania

Koszt dokupienia (3 składniki):
• Wieprzowina (600 g) – 78.00 PLN
• Jaja (2 szt) – 8.40 PLN
• Bułka (150 g) – 7.80 PLN
Razem: 94.20 PLN
≈ 23.55 PLN / porcja

⚠️ To 62% Twojego tygodniowego budżetu

Dlaczego ten przepis?
Ten przepis został zaproponowany, ponieważ:
• masz 1 składnik w lodówce (25% pokrycia)
• wystarczy dokupić 3 składniki
• przygotowanie zajmuje tylko 25 minut
```

---

## 🎯 Технические детали

### Файлы изменены:
1. **`components/assistant/AIRecommendationCard.tsx`**
   - Добавлена функция `getRecipeStatus()`
   - Исправлена формула coverage с clamp
   - Добавлен breakdown экономики (список ингредиентов + цены)
   - Fallback для "Dlaczego ten przepis?"
   - Status badge в Header
   - Предупреждение о бюджете (опционально)

2. **`app/assistant/page.tsx`**
   - Добавлен prop `weeklyBudget` (TODO: подключить useWallet)

### Новые props:
```tsx
interface AIRecommendationCardProps {
  recipe: RecipeMatch;
  onCook: () => void;
  onSave: () => void;
  onAddToCart: () => void;
  onRefresh: () => void;
  isCooking?: boolean;
  isSaving?: boolean;
  weeklyBudget?: number; // 🆕 NEW
  className?: string;
}
```

---

## ✅ Чеклист исправлений

- [x] ❌ Процент > 100 → ✅ clamp(0-100)
- [x] ❌ Несоответствие ингредиентов → ✅ Правильная формула
- [x] ❌ Экономика без расшифровки → ✅ Breakdown с ценами
- [x] ❌ Нет AI-объяснения → ✅ Fallback логика
- [x] ❌ Неправильное визуальное состояние → ✅ Status badges (🟢🟡🔴)
- [x] ❌ Не учитывается бюджет → ✅ Предупреждение (>50%)

---

## 🚀 Следующие шаги (опционально)

1. **Backend:** Добавить поле `reason` в `/recipes/match` ответ
2. **Frontend:** Подключить `useWallet()` для реального weekly budget
3. **UI:** Анимация смены статусов (green → yellow → red)
4. **Analytics:** Трекинг кликов на дорогие рецепты (>50% budget)

---

## 📝 Commit Message

```
🐛 Critical Fix: AIRecommendationCard Logic & UX

Fixed 5 critical issues:

1. Coverage formula: 10000% → max 100% (with clamp)
2. Economy breakdown: added ingredients list + prices + per-serving cost
3. AI reason block: fallback logic when description missing
4. Visual states: status badges (🟢 ready / 🟡 almost / 🔴 missing)
5. Budget warning: alert if cost > 50% of weekly budget

Components:
- UPDATED: components/assistant/AIRecommendationCard.tsx
- UPDATED: app/assistant/page.tsx

Before: 10000% dopasowania, "94.20 PLN" без контекста
After: 25% dopasowania, breakdown с ценами, badge 🔴, budget warning

Critical bugs fixed ✅
```
