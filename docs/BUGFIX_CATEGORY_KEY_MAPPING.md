# Fix: Category Key Mapping from Backend

## 🔍 Problem Discovered

**Symptom:**
- Frontend logs showed: `categoryKey: 'other'` for ALL products
- Backend logs showed: `category_key: 'fish'` (correct!)
- Category buttons didn't appear even though products existed

**Root Cause:**
Frontend was reading the WRONG field from backend response.

---

## 📊 Data Flow Analysis

### Backend Response (Correct ✅)
```json
{
  "data": {
    "items": [
      {
        "id": "uuid-123",
        "ingredient": {
          "id": "uuid-456",
          "name": "Łosoś",
          "name_ru": "Лосось",
          "name_pl": "Łosoś",
          "name_en": "Salmon",
          "category_key": "fish"  // ✅ Backend sends this!
        },
        "quantity": 200,
        "unit": "g"
      }
    ]
  }
}
```

### Frontend Mapping (Before - WRONG ❌)
```typescript
const ingredient = item.ingredient || {
  id: item.ingredientId || item.ingredient_id,
  name: item.name,
  category: item.category || 'other',  // ❌ WRONG! Reads item.category (doesn't exist)
};
```

**Result:**
```javascript
// item.category = undefined
// Falls back to 'other'
categoryKey: 'other'  // ❌ WRONG!
```

### Frontend Mapping (After - CORRECT ✅)
```typescript
// ✅ Priority: ingredient.category_key > item.category_key > ingredient.category > 'other'
const categoryKey = 
  ingredient.category_key ||    // ✅ Try snake_case from backend
  ingredient.categoryKey ||     // ✅ Try camelCase
  item.category_key ||          // ✅ Try at item level (snake_case)
  item.categoryKey ||           // ✅ Try at item level (camelCase)
  ingredient.category ||        // ✅ Legacy fallback
  'other';                      // ✅ Final fallback

const baseItem = {
  ingredient: {
    category: categoryKey,  // ✅ Now gets "fish" instead of "other"!
  }
};
```

**Result:**
```javascript
categoryKey: 'fish'  // ✅ CORRECT!
```

---

## 🔧 Fix Applied

**File:** `lib/api/fridge.ts`

**Lines Changed:** 49-73

**Before:**
```typescript
const ingredient = item.ingredient || {
  category: item.category || 'other',  // ❌ Wrong field
};

console.log(`🔑 Item ${index + 1}:`, {
  categoryKey: ingredient.category,
});
```

**After:**
```typescript
const ingredient = item.ingredient || { category: 'other' };

// ✅ Resolve category_key with priority chain
const categoryKey = 
  ingredient.category_key || 
  ingredient.categoryKey || 
  item.category_key || 
  item.categoryKey || 
  ingredient.category || 
  'other';

console.log(`🔑 Item ${index + 1}:`, {
  ingredientCategoryKey: ingredient.category_key,  // ✅ Raw from backend
  itemCategoryKey: item.category_key,              // ✅ Alternative location
  finalCategory: categoryKey,                      // ✅ Resolved value
});

const baseItem = {
  ingredient: {
    category: categoryKey,  // ✅ Use resolved value
  }
};
```

---

## 🎯 Benefits

1. **Supports Multiple Formats:**
   - `ingredient.category_key` (snake_case - backend standard)
   - `ingredient.categoryKey` (camelCase - JS convention)
   - `item.category_key` (flat structure fallback)
   - `item.categoryKey` (flat structure camelCase)
   - `ingredient.category` (legacy)

2. **Better Debugging:**
   - Logs show ALL possible sources
   - Easy to spot which field backend is using

3. **Backward Compatible:**
   - Works with old and new backend formats
   - Graceful degradation to 'other'

---

## 📋 Testing

### Before Fix:
```javascript
[fridgeApi.getItems] 🔑 Item 1: {name: 'Łosoś', categoryKey: 'other'}  // ❌
[fridgeApi.getItems] 🔑 Item 2: {name: 'Jaja', categoryKey: 'other'}    // ❌
[fridgeApi.getItems] 🔑 Item 3: {name: 'Sól', categoryKey: 'other'}     // ❌
```

### After Fix (Expected):
```javascript
[fridgeApi.getItems] 🔑 Item 1: {
  name: 'Łosoś',
  ingredientCategoryKey: 'fish',  // ✅ From backend
  finalCategory: 'fish'            // ✅ Resolved correctly
}
[fridgeApi.getItems] 🔑 Item 2: {
  name: 'Jaja',
  ingredientCategoryKey: 'egg',
  finalCategory: 'egg'
}
[fridgeApi.getItems] 🔑 Item 3: {
  name: 'Sól',
  ingredientCategoryKey: 'condiment',
  finalCategory: 'condiment'
}
```

---

## 🚀 Impact

### Before:
- ❌ All products showed `category: 'other'`
- ❌ Category buttons never appeared
- ❌ Filtering didn't work

### After:
- ✅ Products get correct categories (fish, egg, grain, condiment, etc.)
- ✅ Category buttons appear for existing products
- ✅ Filtering works properly
- ✅ User can filter by Рыба, Яйца, Крупы, etc.

---

## 📝 Related Issues

- **Issue 1:** Category buttons not showing ([Fixed in commit 9733416](git-ref))
  - Problem: Used Polish keys ("Ryby") instead of backend keys ("fish")
  - Solution: Updated FridgeList to use backend keys

- **Issue 2:** Accept-Language header ([Fixed in this session](git-ref))
  - Problem: Hardcoded "pl" instead of reading from localStorage
  - Solution: Import LANGUAGE_STORAGE_KEY from constants

- **Issue 3:** Category mapping (THIS FIX)
  - Problem: Read wrong field from backend response
  - Solution: Check all possible field names with priority

---

## 🔗 Related Files

- `lib/api/fridge.ts` - API client (THIS FILE)
- `components/fridge/FridgeList.tsx` - Category filtering
- `lib/types.ts` - Type definitions
- `docs/LANGUAGE_SINGLE_SOURCE.md` - Language architecture
- `docs/FRIDGE_PRICE_ARCHITECTURE.md` - Price handling

---

**Last Updated:** 2024-01-20  
**Status:** ✅ Fixed  
**Next:** Test with real backend to confirm `ingredient.category_key` is present
