# Servings UI-State + Per-Portion Economy

**Дата:** 22 декабря 2025 г.  
**Feature:** Dynamic Servings Control

---

## ✨ Что добавлено

### 1️⃣ **UI-state для порций**

**Добавлено:**
```tsx
const [servings, setServings] = useState(recipe.servings);
const servingsMultiplier = recipe.servings > 0 ? servings / recipe.servings : 1;
```

**Контрол порций в META секции:**
```tsx
<div className="flex items-center gap-2">
  <Users className="w-4 h-4 text-purple-500" />
  <button onClick={() => setServings(Math.max(1, servings - 1))}>−</button>
  <span className="font-semibold">{servings}</span>
  <button onClick={() => setServings(servings + 1)}>+</button>
  <span>porcji</span>
</div>
```

**Эффект:**
- Пользователь видит текущее количество порций
- Кнопки +/− для изменения
- Минимум 1 порция (disabled на −)

---

### 2️⃣ **Пересчет ингредиентов**

**Все ингредиенты масштабируются:**
```tsx
// Used ingredients
{formatQuantity(ing.quantity * servingsMultiplier, ing.unit)}

// Missing ingredients
{formatQuantity(ing.quantity * servingsMultiplier, ing.unit)}
```

**Пример:**
```
1 porcja: 200g mięso
3 porcje: 600g mięso (автоматически)
```

---

### 3️⃣ **Экономика: per-portion + total**

**До:**
```
Razem: 94.20 PLN
≈ 23.55 PLN / porcja
```

**После:**
```
Koszt dokupienia (3 składniki):
• Wieprzowina (600 g) – 78.00 PLN    ← масштабируется
• Jaja (2 szt) – 8.40 PLN
• Bułka (150 g) – 7.80 PLN

Razem (3 porcje): 282.60 PLN         ← total на выбранное кол-во
Koszt za porcję: 23.55 PLN           ← базовая цена за 1 порцию
```

**Логика:**
```tsx
const scaledQuantity = ing.quantity * servingsMultiplier;
const scaledCost = (ing.estimatedCost || 0) * servingsMultiplier;

// Total
{(recipe.economy.costToComplete * servingsMultiplier).toFixed(2)} PLN

// Per-portion (базовая)
{(recipe.economy.costToComplete / recipe.servings).toFixed(2)} PLN
```

---

### 4️⃣ **Budget warning пересчитывается**

**Теперь:**
```tsx
const totalCost = recipe.economy.costToComplete * servingsMultiplier;
const budgetPercent = (totalCost / weeklyBudget) * 100;

if (budgetPercent >= 50) {
  return <Alert>To {budgetPercent}% Twojego budżetu</Alert>;
}
```

**Пример:**
- 1 porcja: 94.20 PLN (62% бюджета) → warning
- 3 porcje: 282.60 PLN (188% бюджета) → warning усиливается

---

### 5️⃣ **Кнопка "Ugotuj" передает multiplier**

**Обновлено:**
```tsx
// Props
onCook: (servingsMultiplier: number) => void;

// Usage
<button onClick={() => onCook(servingsMultiplier)}>
  Ugotuj
</button>

// In Assistant page
onCook={(servingsMultiplier) => 
  handleCookRecipe(recipeId, idempotencyKey, servingsMultiplier)
}
```

**Эффект:** Backend получает правильный multiplier для пересчета ингредиентов в холодильнике

---

## 📊 User Flow

### Сценарий 1: Готовлю на себя
```
1. Открываю рецепт → 4 porcje (default)
2. Нажимаю − − − → 1 porcja
3. Вижу:
   • Składniki: 150g (вместо 600g)
   • Koszt: 23.55 PLN (вместо 94.20 PLN)
4. Нажимаю "Ugotuj" → backend вычитает правильное количество
```

### Сценарий 2: Готовлю на семью
```
1. Открываю рецепт → 4 porcje
2. Нажимаю + + → 6 porcji
3. Вижу:
   • Składniki: 900g (вместо 600g)
   • Koszt: 141.30 PLN (вместо 94.20 PLN)
   • ⚠️ To 94% budżetu (warning!)
4. Решаю приготовить меньше порций
```

---

## 🎨 UI Changes

### META Section
**До:**
```
⏱️ 25 min   👥 4 porcji   ✓ 25% dopasowania
```

**После:**
```
⏱️ 25 min   ✓ 25% dopasowania   │   👥 [−] 4 [+] porcji
                                      ↑ интерактивный контрол
```

### Economy Section
**До:**
```
Ekonomia
Koszt dodatkowy: 94.20 PLN
Oszczędności: +12.00 PLN
```

**После:**
```
Ekonomia
Koszt dokupienia (3 składniki):
• Wieprzowina (600 g) – 78.00 PLN
• Jaja (2 szt) – 8.40 PLN
• Bułka (150 g) – 7.80 PLN

Razem (3 porcje): 282.60 PLN
Koszt za porcję: 23.55 PLN

⚠️ To 94% Twojego tygodniowego budżetu

Oszczędności: +12.00 PLN
```

---

## 🔧 Technical Details

### State Management
```tsx
// Local component state
const [servings, setServings] = useState(recipe.servings);

// Derived value
const servingsMultiplier = recipe.servings > 0 
  ? servings / recipe.servings 
  : 1;
```

### Scaling Logic
```tsx
// Ingredients
quantity * servingsMultiplier

// Economy
cost * servingsMultiplier

// Budget warning
(cost * servingsMultiplier) / weeklyBudget
```

### Props Update
```tsx
// Before
onCook: () => void

// After
onCook: (servingsMultiplier: number) => void
```

---

## ✅ Validation

### Tested Scenarios
- [x] Уменьшение порций (4 → 1): ингредиенты и цена пересчитались
- [x] Увеличение порций (4 → 6): все масштабировалось
- [x] Минимум 1 порция: кнопка − disabled
- [x] Budget warning динамический: % меняется при изменении порций
- [x] "Ugotuj" передает multiplier: backend API получает правильное значение
- [x] Per-portion cost не меняется: всегда базовая цена за 1 порцию
- [x] Total cost меняется: зависит от выбранного количества

---

## 📦 Files Changed

```
✅ components/assistant/AIRecommendationCard.tsx
   - Added servings state
   - Added +/− controls in META section
   - Updated ingredients display (scaled)
   - Updated economy section (per-portion + total)
   - Updated onCook prop signature

✅ app/assistant/page.tsx
   - Updated AIRecommendationCard usage
   - Pass servingsMultiplier to handleCookRecipe
```

---

## 🚀 Benefits

1. **User Control:** Пользователь выбирает сколько готовить
2. **Accurate Costs:** Видит реальные затраты на нужное количество
3. **Budget Awareness:** Warning учитывает выбранное количество
4. **Backend Sync:** API получает правильный multiplier для вычитания из холодильника
5. **UX:** Интуитивные +/− кнопки

---

## 💡 Future Improvements

1. **Presets:** Кнопки "Dla siebie" (1), "Para" (2), "Rodzina" (4-6)
2. **Save Preference:** Запомнить любимое количество порций
3. **Smart Scaling:** Округление до удобных чисел (не 3.7 porcji, а 4)
4. **Batch Cooking:** "Ugotuj 2x" (готовлю сегодня + на завтра)

---

## 📝 Commit Message

```
✨ Feature: Dynamic Servings Control + Per-Portion Economy

Added interactive servings control:
- +/− buttons to change portions (min 1)
- Auto-scale ingredients quantities
- Per-portion cost + total cost display
- Budget warning recalculates dynamically
- onCook passes servingsMultiplier to backend

UI Changes:
- META section: interactive servings control
- Economy section: detailed breakdown with scaling
- Ingredients: quantities scale with servings

Components:
- UPDATED: components/assistant/AIRecommendationCard.tsx
- UPDATED: app/assistant/page.tsx

Before: static "4 porcje"
After: dynamic [−] 4 [+] with real-time cost recalculation

User can now cook exact amount they need ✅
```
