# 🐛 Bug Fix: Ingredient Names Not Translated

## 🔍 Problem

**Issue:** Ingredient names displayed in English instead of user's selected language (Russian/Polish)

**Example:**
```
User language: ru (Russian)
Expected: "свежие яйца", "Растительное масло", "Соль каменная"
Actual: "fresh eggs", "Vegetable oil", "Rock salt"
```

**Location:** Recipe cards showing 100% match on `/assistant` page

---

## 🎯 Root Cause

Components were displaying `ing.name` (canonical name) directly without using the localization helper.

**Backend returns:**
```json
{
  "name": "fresh eggs",       // Canonical name (English)
  "name_pl": "świeże jaja",   // Polish translation
  "name_en": "fresh eggs",    // English translation
  "name_ru": "свежие яйца"    // Russian translation
}
```

**Frontend was using:**
```tsx
// ❌ WRONG: Always shows canonical name (English)
<span>{ing.name}</span>
```

---

## ✅ Solution

Use `getLocalizedIngredientName()` helper from `lib/i18n/translateIngredient.ts` to get the correct translation based on user's language.

**Fixed code:**
```tsx
// ✅ CORRECT: Shows translation based on user language
const ingredientName = getLocalizedIngredientName(
  {
    name: ing.name,
    namePl: (ing as any).name_pl || (ing as any).namePl,
    nameEn: (ing as any).name_en || (ing as any).nameEn,
    nameRu: (ing as any).name_ru || (ing as any).nameRu,
  },
  language
);

<span>{ingredientName}</span>
```

---

## 📝 Files Modified

### 1. `components/recipes/RecipeMatchCard.tsx`

**Lines fixed:**
- Line ~317: Used ingredients list (in fridge)
- Line ~343: Missing ingredients list (to buy)

**Changes:**
- Added import: `import { getLocalizedIngredientName } from "@/lib/i18n/translateIngredient";`
- Updated ingredient rendering to use `getLocalizedIngredientName()`

### 2. `components/assistant/AIRecommendationCard.tsx`

**Lines fixed:**
- Line ~242: Used ingredients list (in fridge)
- Line ~268: Missing ingredients list (to buy)

**Changes:**
- Added import: `import { getLocalizedIngredientName } from "@/lib/i18n/translateIngredient";`
- Updated ingredient rendering to use `getLocalizedIngredientName()`

---

## 🧪 Testing

### Manual Test:
1. Switch language to Russian in settings
2. Go to `/assistant` page
3. Check AI recommendation card ingredients
4. **Expected:** All ingredient names in Russian

### Console Logs (Fixed):
```
✅ [LanguageContext] Dictionary loaded for: ru
🌍 AIRecommendationCard - Current language: ru

Before Fix:
- fresh eggs ❌
- Vegetable oil ❌
- Rock salt ❌

After Fix:
- свежие яйца ✅
- Растительное масло ✅
- Соль каменная ✅
```

---

## 🔧 Helper Function

Located in `lib/i18n/translateIngredient.ts`:

```ts
export function getLocalizedIngredientName(
  ingredient: {
    name: string;
    namePl?: string;
    nameEn?: string;
    nameRu?: string;
  },
  language: string
): string {
  switch (language) {
    case 'ru':
      return ingredient.nameRu || ingredient.name;
    case 'en':
      return ingredient.nameEn || ingredient.name;
    case 'pl':
    default:
      return ingredient.namePl || ingredient.name;
  }
}
```

**Fallback chain:**
- If language = `ru` → try `nameRu` → fallback to `name`
- If language = `en` → try `nameEn` → fallback to `name`
- If language = `pl` → try `namePl` → fallback to `name`

---

## 📊 Impact

**Before:**
- ❌ Ingredient names always in English (canonical)
- ❌ Poor UX for Russian/Polish users
- ❌ Inconsistent language (UI in Russian, ingredients in English)

**After:**
- ✅ Ingredient names match user's selected language
- ✅ Consistent localization across entire app
- ✅ Better UX for multilingual users

---

## 🚀 Related Components

Other components that might need similar fixes:

- [ ] `app/(user)/assistant/page.tsx` (line 573) - toast notification with ingredient list
- [ ] `components/fridge/FridgeItemsList.tsx` - if it displays ingredient names
- [ ] `app/(user)/recipes/[id]/page.tsx` - recipe details page ingredients

**Note:** Most of these already use the backend's localized `localName` field, so they should be fine.

---

## ⚠️ **BACKEND ACTION REQUIRED**

### Problem
Backend endpoint `GET /api/recipes/match` returns ingredient names **without translation fields**.

**Current response:**
```json
{
  "recipes": [{
    "usedIngredients": [
      {
        "name": "fresh eggs",     // ❌ Only canonical name
        "quantity": 2,
        "unit": "pcs"
        // ❌ Missing: name_pl, name_en, name_ru
      }
    ]
  }]
}
```

**Expected response:**
```json
{
  "recipes": [{
    "usedIngredients": [
      {
        "name": "świeże jajka",         // Canonical (Polish)
        "name_pl": "świeże jajka",      // ✅ Polish
        "name_en": "fresh eggs",        // ✅ English
        "name_ru": "свежие яйца",       // ✅ Russian
        "quantity": 2,
        "unit": "pcs"
      }
    ],
    "missingIngredients": [
      {
        "name": "Cebula",
        "name_pl": "Cebula",
        "name_en": "Onion",
        "name_ru": "Лук",
        "quantity": 100,
        "unit": "g"
      }
    ]
  }]
}
```

### Backend Fix Required

**File:** `internal/handler/recipes.go` (or similar)  
**Endpoint:** `GET /api/recipes/match`

**Add translations to ingredient objects:**

```go
type RecipeMatchIngredient struct {
    Name     string  `json:"name"`
    NamePl   string  `json:"name_pl"`   // ← Add
    NameEn   string  `json:"name_en"`   // ← Add
    NameRu   string  `json:"name_ru"`   // ← Add
    Quantity float64 `json:"quantity"`
    Unit     string  `json:"unit"`
    // ... other fields
}
```

**Populate from database:**
```go
// When building response, include ingredient translations
ingredient := RecipeMatchIngredient{
    Name:     ing.CanonicalName,
    NamePl:   ing.NamePl,
    NameEn:   ing.NameEn,
    NameRu:   ing.NameRu,
    Quantity: ing.Quantity,
    Unit:     ing.Unit,
}
```

**Same fix needed for:**
- ✅ `GET /api/fridge/items` (already working)
- ❌ `GET /api/recipes/match` (needs fix)
- ❌ `POST /api/recipes/cook` response (needs fix)
- ❌ Any other endpoint returning ingredient names

---

## 📚 Related Docs

- `LANGUAGE_BUTTON_DEBUG.md` - Language switching architecture
- `LANGUAGE_SYNC_COMPLETE.md` - Language synchronization flow
- `lib/i18n/translateIngredient.ts` - Translation helper functions

---

**Status:** ✅ FIXED  
**Date:** 2026-01-17  
**Priority:** P1 (User-facing bug)
