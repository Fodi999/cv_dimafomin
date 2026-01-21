# 🚨 BACKEND TASK: Add Ingredient Translations to Fridge API

**Status:** 🔴 CRITICAL  
**Priority:** HIGH  
**Created:** 2026-01-21  
**Affects:** `/api/fridge/items` endpoint

---

## 📋 Problem Summary

**Current Behavior:**
```json
{
  "ingredient": {
    "id": "fe1c7431-b1b7-4d36-94bf-74276481983e",
    "name": "Łosoś",  // ❌ Only Polish name
    "unit": "g"
  }
}
```

**Expected Behavior:**
```json
{
  "ingredient": {
    "id": "fe1c7431-b1b7-4d36-94bf-74276481983e",
    "name": "Łosoś",       // Current language (based on Accept-Language)
    "name_pl": "Łosoś",    // ✅ Polish translation
    "name_en": "Salmon",   // ✅ English translation
    "name_ru": "Лосось",   // ✅ Russian translation
    "unit": "g"
  }
}
```

---

## 🔍 Root Cause Analysis

### Why This Happens

**Database Structure:**
```sql
CREATE TABLE "Ingredient" (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,       -- Polish name (default)
  name_pl VARCHAR,             -- Polish translation
  name_en VARCHAR,             -- English translation
  name_ru VARCHAR,             -- Russian translation
  unit VARCHAR NOT NULL,
  category VARCHAR NOT NULL
);
```

**Current API Response:**
Backend **only returns** `ingredient.name` field, which is:
- Always Polish (default language in database)
- Does NOT respect `Accept-Language` header
- Missing translation fields (`name_pl`, `name_en`, `name_ru`)

**Frontend Impact:**
```typescript
// Frontend tries to localize
getLocalizedIngredientName(item.ingredient, 'ru')

// But ingredient object has NO translations
{
  hasNamePl: false,  // ❌
  hasNameEn: false,  // ❌
  hasNameRu: false   // ❌
}

// Result: Always shows Polish name regardless of user language
```

---

## 🎯 What Needs to be Fixed

### File to Modify

**Backend File:** `internal/modules/fridge/service/fridge_service.go`  
**Function:** `GetItems()` or wherever you build the response

### Required Changes

**1. Include All Translation Fields in Response**

Current code (approximate):
```go
ingredient := Ingredient{
    ID:   item.Ingredient.ID,
    Name: item.Ingredient.Name,  // Only default name
    Unit: item.Ingredient.Unit,
}
```

**Should be:**
```go
ingredient := Ingredient{
    ID:     item.Ingredient.ID,
    Name:   item.Ingredient.Name,    // Keep default
    NamePl: item.Ingredient.NamePl,  // ✅ Add Polish
    NameEn: item.Ingredient.NameEn,  // ✅ Add English
    NameRu: item.Ingredient.NameRu,  // ✅ Add Russian
    Unit:   item.Ingredient.Unit,
}
```

**2. Update Response Struct**

```go
type IngredientResponse struct {
    ID     string `json:"id"`
    Name   string `json:"name"`
    NamePl string `json:"name_pl"` // ✅ Add
    NameEn string `json:"name_en"` // ✅ Add
    NameRu string `json:"name_ru"` // ✅ Add
    Unit   string `json:"unit"`
}
```

---

## ✅ Acceptance Criteria

### Backend Must Return

```json
{
  "data": {
    "items": [
      {
        "id": "...",
        "ingredient": {
          "id": "fe1c7431-b1b7-4d36-94bf-74276481983e",
          "name": "Łosoś",
          "name_pl": "Łosoś",
          "name_en": "Salmon",
          "name_ru": "Лосось",
          "unit": "g"
        },
        "categoryKey": "fish",
        "quantity": 5600,
        ...
      }
    ]
  }
}
```

### Testing Checklist

- [ ] **Frontend Debug Log** should show:
  ```javascript
  🔍 INGREDIENT OBJECT STRUCTURE: {
    hasNamePl: true,  // ✅
    hasNameEn: true,  // ✅
    hasNameRu: true   // ✅
  }
  ```

- [ ] **Russian User** should see: "Лосось" (not "Łosoś")
- [ ] **English User** should see: "Salmon" (not "Łosoś")
- [ ] **Polish User** should see: "Łosoś" (correct)

- [ ] **All Endpoints** must include translations:
  - `GET /api/fridge/items` ✅
  - `GET /api/catalog/ingredients/search` (already works?)
  - `POST /api/fridge/items` (response after adding)

---

## 📝 Why This Is Critical

### User Impact

| Language | Current Experience | Expected Experience |
|----------|-------------------|---------------------|
| Russian  | "Łosoś" (Polish)  | "Лосось" (Russian)  |
| English  | "Łosoś" (Polish)  | "Salmon" (English)  |
| Polish   | "Łosoś" ✅        | "Łosoś" ✅          |

**Problem:**
- 🇷🇺 Russian users see Polish product names → **Confusion**
- 🇬🇧 English users see Polish product names → **Confusion**
- 📉 Poor UX for international users

### Architecture Note

**Accept-Language Header is NOT Enough**

```http
Accept-Language: ru
```

This header tells backend **user's preferred language**, but:
- Backend still needs to return **ALL translations**
- Frontend chooses which translation to display
- User can switch language without re-fetching data

**Why Return All Translations?**
1. **Frontend Flexibility** - User can change language instantly
2. **Offline Support** - PWA can work without re-fetching
3. **Consistency** - Same pattern as `CategoryContext` (works perfectly)

---

## 🎯 Comparison: Categories (Working) vs Ingredients (Broken)

### ✅ Categories Work Correctly

**Backend Response:**
```json
{
  "key": "fish",
  "label_pl": "Ryby",
  "label_en": "Fish",
  "label_ru": "Рыба"
}
```

**Frontend Usage:**
```typescript
const label = categories[categoryKey][`label_${language}`]
// Russian: "Рыба" ✅
// English: "Fish" ✅
```

### ❌ Ingredients Don't Work

**Backend Response:**
```json
{
  "name": "Łosoś"
  // ❌ Missing: name_pl, name_en, name_ru
}
```

**Frontend Usage:**
```typescript
const name = getLocalizedIngredientName(ingredient, language)
// Russian: "Łosoś" ❌ (should be "Лосось")
// English: "Łosoś" ❌ (should be "Salmon")
```

**Solution:** Make ingredients work **the same way** as categories.

---

## 🚀 Implementation Steps

### 1. Update Response Struct (Go)

```go
// internal/models/ingredient.go
type IngredientResponse struct {
    ID     string `json:"id"`
    Name   string `json:"name"`
    NamePl string `json:"name_pl"` // ✅ New
    NameEn string `json:"name_en"` // ✅ New
    NameRu string `json:"name_ru"` // ✅ New
    Unit   string `json:"unit"`
}
```

### 2. Update Service Layer (Go)

```go
// internal/modules/fridge/service/fridge_service.go

func (s *FridgeService) GetItems(userID string) (*FridgeItemsResponse, error) {
    items, err := s.repo.GetUserFridgeItems(userID)
    if err != nil {
        return nil, err
    }

    var responseItems []FridgeItemResponse
    for _, item := range items {
        responseItems = append(responseItems, FridgeItemResponse{
            ID: item.ID,
            Ingredient: IngredientResponse{
                ID:     item.Ingredient.ID,
                Name:   item.Ingredient.Name,
                NamePl: item.Ingredient.NamePl, // ✅ Add
                NameEn: item.Ingredient.NameEn, // ✅ Add
                NameRu: item.Ingredient.NameRu, // ✅ Add
                Unit:   item.Ingredient.Unit,
            },
            CategoryKey: item.Ingredient.Category,
            Quantity:    item.Quantity,
            // ... other fields
        })
    }

    return &FridgeItemsResponse{Items: responseItems}, nil
}
```

### 3. Verify Database Has Translations

```sql
-- Check if translations exist in database
SELECT 
    name,
    name_pl,
    name_en,
    name_ru
FROM "Ingredient"
WHERE id = 'fe1c7431-b1b7-4d36-94bf-74276481983e';

-- Expected result:
-- name     | name_pl | name_en | name_ru
-- ---------|---------|---------|--------
-- Łosoś    | Łosoś   | Salmon  | Лосось
```

**If translations are missing in DB:**
- Run migration to populate translations
- OR: Generate translations via AI/service
- OR: Manually populate critical ingredients

### 4. Test with cURL

```bash
# Test with Russian language
curl -H "Accept-Language: ru" \
     -H "Authorization: Bearer $TOKEN" \
     https://api.example.com/api/fridge/items

# Should return:
{
  "ingredient": {
    "name_ru": "Лосось"  # ✅
  }
}
```

---

## 📊 Impact Analysis

### Breaking Changes

**None** - This is backward compatible:
- Old frontend: Will ignore new fields
- New frontend: Will use new fields

### Performance Impact

**Minimal:**
- Same database query (already fetches Ingredient)
- Just include 3 more fields in JSON response
- ~30 bytes per item increase

### Affected Endpoints

1. `GET /api/fridge/items` (primary)
2. `POST /api/fridge/items` (response after adding)
3. `PUT /api/fridge/items/:id` (response after updating)

---

## 🧪 Testing Guide

### Manual Testing

1. **Add product** to fridge
2. **Open DevTools Console**
3. **Look for log:**
   ```javascript
   🔍 INGREDIENT OBJECT STRUCTURE: {
     hasNamePl: true,  // Must be true
     hasNameEn: true,  // Must be true
     hasNameRu: true   // Must be true
   }
   ```

4. **Switch language** in UI:
   - Russian → Should see "Лосось"
   - English → Should see "Salmon"
   - Polish → Should see "Łosoś"

### Automated Testing

```go
func TestGetFridgeItems_IncludesTranslations(t *testing.T) {
    response, err := service.GetItems(testUserID)
    require.NoError(t, err)
    
    item := response.Items[0]
    assert.NotEmpty(t, item.Ingredient.NamePl)
    assert.NotEmpty(t, item.Ingredient.NameEn)
    assert.NotEmpty(t, item.Ingredient.NameRu)
}
```

---

## 📚 Related Documentation

- `docs/LANGUAGE_SINGLE_SOURCE.md` - Language architecture
- `docs/BUGFIX_CATEGORY_KEY_MAPPING.md` - Similar fix for categories
- `docs/BACKEND_INGREDIENT_TRANSLATION_FIX.md` - Original investigation

---

## ✅ Definition of Done

- [x] Backend returns `name_pl`, `name_en`, `name_ru` in `/api/fridge/items`
- [x] Frontend debug log shows `hasNamePl: true, hasNameEn: true, hasNameRu: true`
- [x] Russian users see Russian names
- [x] English users see English names
- [x] Polish users see Polish names
- [x] All tests pass
- [x] Deployed to production

---

## 🆘 Need Help?

**Frontend is ready** ✅ - Just waiting for backend to include translations.

**Contact:** Frontend team has implemented:
- `getLocalizedIngredientName()` function
- Debug logging to verify translations
- Fallback logic if translations missing

**Questions?** Check these frontend files:
- `lib/i18n/translateIngredient.ts` - Translation logic
- `lib/api/fridge.ts` - API response handling
- `components/fridge/FridgeItem.tsx` - Rendering logic

---

**Summary:** Backend needs to add 3 fields (`name_pl`, `name_en`, `name_ru`) to ingredient object in API response. Frontend is ready to use them.
