# 🏗️ API Union Type Fix

## 🔴 Проблема (Root Cause)

### Что происходило:

1. **Backend корректно возвращал:**
```json
{
  "success": false,
  "message": "We couldn't find any recipes matching your fridge.",
  "error": "No recipes available"
}
```

2. **Frontend НЕ проверял `success` СНАЧАЛА:**
```typescript
// ❌ ПЛОХО: Проверка data.recipe ДО проверки success
const data = await apiFetch<{ recipe: {...}, match: {...} }>(...)

if (!data.recipe) { // 💥 data.recipe === undefined когда success: false
  // handle error
}
```

3. **Результат:**
```
⚠️ No recipe in response
TypeError: Cannot read properties of undefined (reading 'id')
```

---

## ✅ Решение (Architectural Fix)

### 1️⃣ **Union Type в TypeScript**

Изменили тип ответа API с конкретного объекта на **discriminated union**:

```typescript
const data = await apiFetch<
  // Success case
  | {
      success: true;
      recipe: {...};
      match: {...};
      economy: {...};
    }
  // Failure case (no recipes found)
  | {
      success: false;
      message: string;
      error?: string;
    }
>('/recipes/recommendations', {...});
```

### 2️⃣ **Правильный порядок проверок**

```typescript
// 🛡️ КРИТИЧНО: Проверяем success FIRST
if (!data.success) {
  console.warn('⚠️ Backend returned success: false');
  return {
    status: 'no-results',
    message: data.message || 'Nie znaleźliśmy pasującego przepisu',
    error: data.error || 'No recipes available'
  };
}

// ✅ Теперь TypeScript ЗНАЕТ, что data.recipe существует
if (!data.recipe || !data.recipe.id) {
  console.warn('⚠️ No recipe in response (success: true but no data)');
  return {
    status: 'no-results',
    message: 'Nie znaleźliśmy pasującego przepisu',
    error: 'No recipe data'
  };
}

// ✅ Безопасно используем data.recipe
const { recipe, match, economy } = data;
```

---

## 🎯 Архитектурные принципы

### ✅ **Правило 1: success FIRST**
Всегда проверяй `success` **перед** доступом к `data.recipe`

### ✅ **Правило 2: Union Types для состояний**
API-ответы должны быть discriminated unions:
```typescript
type APIResponse<T> =
  | { success: true; data: T }
  | { success: false; message: string; error?: string }
```

### ✅ **Правило 3: success: false — не баг**
Это **валидный сценарий**, не исключение:
- Пустая корзина → success: false
- Нет подходящих рецептов → success: false
- Все рецепты исключены → success: false

### ✅ **Правило 4: TypeScript как защита**
Используй discriminated unions для compile-time safety:
```typescript
if (!data.success) {
  // TypeScript знает: data = { success: false, message, error? }
  return handleNoResults(data.message);
}

// TypeScript знает: data = { success: true, recipe, match, economy }
const recipe = data.recipe; // ✅ Безопасно
```

---

## 📊 До vs После

### ❌ **ДО (Проблемный код):**
```typescript
const data = await apiFetch<{recipe: {...}}>(...)

// ⚠️ data.recipe может быть undefined если success: false
if (!data.recipe) { 
  return { status: 'no-results' };
}
```

### ✅ **ПОСЛЕ (Правильный код):**
```typescript
const data = await apiFetch<
  | { success: true; recipe: {...} }
  | { success: false; message: string }
>(...)

// 🛡️ Проверяем success FIRST
if (!data.success) {
  return { status: 'no-results', message: data.message };
}

// ✅ TypeScript гарантирует, что recipe существует
const recipe = data.recipe;
```

---

## 🧪 Тестовые сценарии

### ✅ **Сценарий 1: Пустая lodówka**
**Backend:**
```json
{ "success": false, "message": "Fridge is empty" }
```
**Frontend:**
- ✅ Показывает Empty State
- ✅ Кнопка "Dodaj produkty"
- ✅ Нет TypeError

### ✅ **Сценарий 2: Нет подходящих рецептов**
**Backend:**
```json
{ "success": false, "message": "No recipes matching your fridge" }
```
**Frontend:**
- ✅ Показывает "Nie znaleźliśmy..."
- ✅ CTA: Dodaj produkty / Zobacz zapisane
- ✅ Нет crash

### ✅ **Сценарий 3: Все рецепты excluded**
**Backend:**
```json
{ "success": false, "message": "All recipes already viewed" }
```
**Frontend:**
- ✅ Показывает "Spróbuj kliknąć Odśwież"
- ✅ Reset viewedRecipeIds
- ✅ Graceful handling

---

## 📝 Commit Message

```
🏗️ Architecture: Union Type for API Responses

Fixed critical issue where frontend assumed recipe always exists

BEFORE:
- Backend returned {success: false} correctly
- Frontend tried to access data.recipe.id → TypeError
- No compile-time safety for missing data

AFTER:
- Discriminated union type for API response
- Check success FIRST before accessing data.recipe
- TypeScript ensures type safety at compile time
- Graceful Empty State UI for no-results scenario

Changes:
- lib/api.ts: Added union type to /recommendations response
- lib/api.ts: Check data.success before data.recipe
- app/assistant/page.tsx: Handle status: 'no-results'
- UI: Blue Empty State card with CTAs

Test scenarios:
✅ Empty fridge → Shows "Dodaj produkty"
✅ No matching recipes → Shows Empty State
✅ All recipes excluded → Shows "Zacznij od nowa"
✅ Network error → Shows error toast

Result: No more crashes on success: false responses
```

---

## 🎓 Lessons Learned

1. **API Contract должен быть explicit**
   - Не предполагай, что данные всегда есть
   - Используй discriminated unions для возможных состояний

2. **TypeScript — твой друг**
   - Union types предотвращают runtime errors
   - Compile-time проверки дешевле production bugs

3. **success: false ≠ error**
   - Это валидный бизнес-сценарий
   - Нужен отдельный UI (Empty State, не Error Page)

4. **Order matters**
   - Проверяй success **перед** деструктуризацией
   - TypeScript сужает типы автоматически (type narrowing)

5. **Frontend никогда не должен "надеяться"**
   - Не предполагай, что AI всегда вернёт результат
   - Всегда обрабатывай все возможные состояния

---

## 🔗 Related Files

- `lib/api.ts` — Union type definition + success check
- `app/assistant/page.tsx` — Handle no-results status
- `components/assistant/AIRecommendationCard.tsx` — Recipe display
- `API_ENDPOINTS.md` — API documentation
