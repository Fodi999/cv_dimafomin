# Fix: AI Recipe Preview Flow

## 🐛 Problem

**Symptom**: Preview never appeared after clicking "Preview with AI" button

**Root Cause**: Form was skipping preview step and going straight to `create-ai` endpoint

**Flow was**:
```
Form → Submit → create-ai → redirect
```

**Should be**:
```
Form → Preview → Show AI Result → Confirm → create-ai → redirect
```

---

## 🔍 Why Preview Didn't Show

### Issue #1: Button Logic Mismatch

**Before:**
```tsx
<Button onClick={handleCreate}>Создать рецепт</Button>
```

- Button called `createRecipe()` directly
- No check for preview existence
- Preview was **optional**, not **required**

### Issue #2: No State Validation

```tsx
const handleCreate = async () => {
  // ❌ No check if preview exists
  await createRecipe(payload);
}
```

---

## ✅ Solution

### 1. Made Preview Required

```tsx
const handleCreate = useCallback(async () => {
  // ✅ Enforce preview-first workflow
  if (!preview) {
    toast.error("Сначала создайте превью с AI");
    return;
  }
  
  await createRecipe(payload);
}, [preview, createRecipe]);
```

### 2. Updated Button States

```tsx
<Button
  onClick={handleCreate}
  disabled={loading || previewing || !preview}  // ← Disabled without preview
  title={!preview ? "Сначала создайте превью с AI" : ""}
>
  Утвердить и создать
</Button>
```

### 3. Added Preview Card Actions

**Before:**
```tsx
<Button onClick={clearPreview}>Закрыть превью</Button>
```

**After:**
```tsx
<div className="flex gap-3">
  <Button variant="outline" onClick={clearPreview}>
    ✏️ Изменить
  </Button>
  
  <Button onClick={handleCreate} disabled={loading}>
    ✅ Утвердить и создать
  </Button>
</div>
```

---

## 🎯 Correct User Flow

### Step 1: Fill Form
```
- Title: "Grilled Salmon"
- Ingredients: Лосось (200g), Рис (150g)
- Cooking Text: "Grill salmon, boil rice..."
```

### Step 2: Click "Превью с AI"
```tsx
POST /api/admin/recipes/preview-ai
{
  title: "Grilled Salmon",
  ingredients: [...],
  rawCookingText: "..."
}
```

**Response:**
```json
{
  "title": "Grilled Salmon",
  "canonicalName": "grilled-salmon-teriyaki",
  "steps": ["1. Marinate...", "2. Grill...", "3. Serve..."],
  "time": 18,
  "servings": 1,
  "difficulty": "easy",
  "nutrition": {
    "calories": 380,
    "protein": 35,
    "carbs": 25,
    "fat": 12
  },
  "summary": "Delicious grilled salmon..."
}
```

### Step 3: Preview Card Shows
```
🧠 AI Preview
━━━━━━━━━━━━━━━━━━━━━━
Название: Grilled Salmon
Время: 18 мин | Порции: 1
Калории: 380 ккал

Шаги:
1. Marinate salmon...
2. Grill for 6 minutes...
3. Serve with rice...

[✏️ Изменить]  [✅ Утвердить и создать]
```

### Step 4: Click "Утвердить и создать"
```tsx
POST /api/admin/recipes/create-ai
// Same payload as preview

→ 201 Created
→ router.push('/admin/catalog')
```

---

## 🧪 Testing Checklist

- [ ] Click "Preview" → API called
- [ ] Preview card appears with AI data
- [ ] "Утвердить" button disabled until preview loads
- [ ] Click "Изменить" → preview closes, form editable
- [ ] Click "Утвердить и создать" → recipe saved
- [ ] Redirect to `/admin/catalog` after creation

---

## 📊 DevTools Expected Flow

```
1. User clicks "Preview"
   → POST /recipes/preview-ai (200 OK)
   → State: preview = {title, steps, ...}
   → Button "Утвердить" becomes enabled

2. User clicks "Утвердить"
   → POST /recipes/create-ai (201 Created)
   → router.push('/admin/catalog')
```

---

## 🧠 Architecture Correctness

**Backend was already correct:**
- ✅ Separate endpoints: `/preview-ai` and `/create-ai`
- ✅ Same payload format for both
- ✅ Preview returns full recipe structure
- ✅ Create saves to database

**Frontend had wrong flow:**
- ❌ Skipped preview step
- ❌ No state validation
- ❌ Button not linked to preview state

**Now fixed:**
- ✅ Preview is mandatory
- ✅ Button disabled without preview
- ✅ Clear UI feedback
- ✅ Edit/Confirm workflow

---

## 📝 Files Modified

- `/components/admin/recipes/CreateRecipeWithAI.tsx`
  - Added preview validation in `handleCreate`
  - Changed button text: "Создать рецепт" → "Утвердить и создать"
  - Added `disabled={!preview}` to create button
  - Enhanced preview card with "Изменить" and "Утвердить" buttons

---

## 🚀 Result

**UX Flow:**
```
Form → Preview (mandatory) → Review → Confirm → Save
```

**User sees:**
1. AI-generated steps
2. Calculated time/servings
3. Nutrition facts
4. Can edit or confirm

**Backend receives:**
- Preview request first (no save)
- Create request second (saves to DB)

---

**Date**: January 8, 2026  
**Status**: ✅ Fixed  
**Impact**: Preview now works as intended, proper AI workflow
