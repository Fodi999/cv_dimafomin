# 🔥 BACKEND ISSUE: Fridge Items Missing Ingredient Translations

**Date:** 2026-01-21  
**Priority:** HIGH  
**Status:** ⏳ WAITING FOR BACKEND FIX

---

## 📋 Problem Summary

`GET /api/fridge/items` returns ingredient object **WITHOUT translations**, causing frontend to display Polish names regardless of user's language setting.

---

## 🔍 Current Backend Response

```json
{
  "id": "443cef46-2fff-46dd-9bc5-a825c63ac7e8",
  "name": "Łosoś",
  "ingredient": {
    "id": "fe1c7431-b1b7-4d36-94bf-74276481983e",
    "name": "Łosoś",    // ❌ ONLY Polish name
    "unit": "g"
    // ❌ MISSING: name_pl, name_en, name_ru
  },
  "categoryKey": "fish",
  ...
}
```

**Frontend Detection Log:**
```javascript
🔍 INGREDIENT OBJECT STRUCTURE: {
  hasId: true, 
  hasName: true, 
  hasNamePl: false,   // ❌ Missing
  hasNameEn: false,   // ❌ Missing
  hasNameRu: false,   // ❌ Missing
  hasUnit: true
}
```

---

## ✅ Required Backend Response

```json
{
  "id": "443cef46-2fff-46dd-9bc5-a825c63ac7e8",
  "name": "Łosoś",
  "ingredient": {
    "id": "fe1c7431-b1b7-4d36-94bf-74276481983e",
    "name": "Łosoś",        // Current language (for backward compatibility)
    "name_pl": "Łosoś",     // ✅ Polish translation
    "name_en": "Salmon",    // ✅ English translation
    "name_ru": "Лосось",    // ✅ Russian translation
    "unit": "g"
  },
  "categoryKey": "fish",
  ...
}
```

---

## 🎯 Why This is Critical

### Current Behavior:
1. User selects language: **Russian** 🇷🇺
2. Frontend sends: `Accept-Language: ru`
3. Backend returns: `"name": "Łosoś"` (Polish)
4. Frontend tries: `getLocalizedIngredientName(ingredient, "ru")`
5. **Result:** Shows "Łosoś" instead of "Лосось" ❌

### Expected Behavior:
1. User selects language: **Russian** 🇷🇺
2. Frontend receives ALL translations in `ingredient` object
3. Frontend picks: `ingredient.name_ru || ingredient.nameRu`
4. **Result:** Shows "Лосось" ✅

---

## 🔧 Backend Implementation Guide

### Option 1: JOIN with Ingredient table (RECOMMENDED)

```go
// In user_fridge_repository.go or fridge_service.go

func (r *FridgeRepository) GetUserItems(userID string) ([]FridgeItemResponse, error) {
    var items []FridgeItem
    
    // ✅ Preload Ingredient with all translation fields
    err := r.db.
        Preload("Ingredient").  // This should load ALL fields from Ingredient table
        Where("user_id = ?", userID).
        Order("expires_at ASC").
        Find(&items).Error
    
    if err != nil {
        return nil, err
    }
    
    // Map to response format
    response := make([]FridgeItemResponse, len(items))
    for i, item := range items {
        response[i] = FridgeItemResponse{
            ID:          item.ID,
            Name:        item.Name,
            Ingredient: IngredientDTO{
                ID:     item.Ingredient.ID,
                Name:   item.Ingredient.Name,      // Current/default
                NamePl: item.Ingredient.NamePl,    // ✅ Polish
                NameEn: item.Ingredient.NameEn,    // ✅ English
                NameRu: item.Ingredient.NameRu,    // ✅ Russian
                Unit:   item.Ingredient.Unit,
            },
            CategoryKey: item.CategoryKey,
            // ... other fields
        }
    }
    
    return response, nil
}
```

### Option 2: Select specific fields

```go
err := r.db.
    Select(`
        user_fridge_items.*,
        ingredients.id as ingredient_id,
        ingredients.name as ingredient_name,
        ingredients.name_pl as ingredient_name_pl,
        ingredients.name_en as ingredient_name_en,
        ingredients.name_ru as ingredient_name_ru,
        ingredients.unit as ingredient_unit
    `).
    Joins("LEFT JOIN ingredients ON user_fridge_items.ingredient_id = ingredients.id").
    Where("user_fridge_items.user_id = ?", userID).
    Find(&items).Error
```

---

## 📊 Database Schema Verification

**Ensure `Ingredient` table has translation columns:**

```sql
-- Check if columns exist
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'ingredients' 
  AND column_name IN ('name_pl', 'name_en', 'name_ru');

-- Expected result:
-- name_pl
-- name_en
-- name_ru
```

If columns are missing, create migration:

```sql
ALTER TABLE ingredients 
ADD COLUMN IF NOT EXISTS name_pl VARCHAR(255),
ADD COLUMN IF NOT EXISTS name_en VARCHAR(255),
ADD COLUMN IF NOT EXISTS name_ru VARCHAR(255);
```

---

## 🧪 Testing Checklist

After backend fix, verify:

- [ ] `GET /api/fridge/items` returns `ingredient.name_pl` ✅
- [ ] `GET /api/fridge/items` returns `ingredient.name_en` ✅
- [ ] `GET /api/fridge/items` returns `ingredient.name_ru` ✅
- [ ] Frontend log shows `hasNamePl: true` ✅
- [ ] Frontend log shows `hasNameEn: true` ✅
- [ ] Frontend log shows `hasNameRu: true` ✅
- [ ] Russian user sees "Лосось" instead of "Łosoś" ✅
- [ ] English user sees "Salmon" instead of "Łosoś" ✅

---

## 🔗 Related Documentation

- **Frontend Architecture:** `docs/LANGUAGE_SINGLE_SOURCE.md`
- **Category Fix:** `docs/BUGFIX_CATEGORY_KEY_MAPPING.md`
- **Migration Plan:** `docs/MIGRATION_STAGE2_CLEAN_ARCHITECTURE.md`

---

## 📝 Current Workaround (Frontend)

**None available** — Frontend CANNOT guess translations without backend data.

Frontend helper [`getLocalizedIngredientName()`](lib/i18n/translateIngredient.ts) expects:

```typescript
interface Ingredient {
  name: string;
  name_pl?: string;  // ❌ Currently undefined
  name_en?: string;  // ❌ Currently undefined
  name_ru?: string;  // ❌ Currently undefined
  namePl?: string;   // Camel case variant
  nameEn?: string;   // Camel case variant
  nameRu?: string;   // Camel case variant
}
```

---

## 🎯 Action Items

### For Backend Team:
1. [ ] Add `Preload("Ingredient")` to fridge items query
2. [ ] Ensure DTO includes `name_pl`, `name_en`, `name_ru` fields
3. [ ] Test with `Accept-Language: ru` header
4. [ ] Verify log shows all translation fields populated
5. [ ] Deploy to staging/production

### For Frontend Team:
1. [x] Add detection log to verify backend response structure
2. [x] Document required API contract
3. [ ] Remove detection log after backend fix
4. [ ] Test with real translated data
5. [ ] Remove fallback comments

---

## 🚀 Expected Impact

**Before Fix:**
- All users see Polish names ("Łosoś", "Jaja", "Sól")
- Language switcher has no effect on ingredient names
- Poor UX for international users

**After Fix:**
- Russian users see: "Лосось", "Яйца", "Соль"
- English users see: "Salmon", "Eggs", "Salt"
- Polish users see: "Łosoś", "Jaja", "Sól"
- Perfect multilingual experience ✅

---

## 📞 Contact

**Issue Reporter:** Frontend Team  
**Assigned To:** Backend Team  
**Slack Channel:** #backend-api  
**Priority:** HIGH (affects all non-Polish users)

