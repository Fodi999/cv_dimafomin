# Fix: Language Support for Ingredient Autocomplete

## 🐛 Problem

**Symptom**: Autocomplete displayed `name: 'Salmon'` instead of localized names when searching in Russian (e.g., "лосось")

**Logs showed**:
```
Accept-Language: pl
name: 'Salmon', nameRu: undefined, name_ru: undefined
```

## 🔍 Root Causes

1. **Missing Language Parameter**: `getIngredientSuggestions()` didn't pass current language to API
2. **Wrong Fallback Order**: Localized fields checked before generic `name` field
3. **API received wrong language**: User searches in Russian, but API got `Accept-Language: pl`

## ✅ Solution

### 1. Updated API Function Signature

**Before**:
```typescript
export async function getIngredientSuggestions(query: string, limit: number = 5)
```

**After**:
```typescript
export async function getIngredientSuggestions(
  query: string, 
  limit: number = 5, 
  language?: string  // NEW: Pass to Accept-Language header
)
```

### 2. Pass Language to API

```typescript
const response = await apiFetch('/suggest?...', {
  language: language  // Now backend gets correct Accept-Language
});
```

### 3. Updated Display Logic

**Before**:
```typescript
case 'ru':
  return nameRu || namePl || name || 'Unknown';
```

**After**:
```typescript
const fallbackName = ingredient.name;  // Generic field

case 'ru':
  return nameRu || fallbackName || namePl || 'Unknown';
  // Now 'name' is prioritized if nameRu is missing
```

### 4. Updated Components

**IngredientAutocomplete.tsx**:
```typescript
// Pass language to API
const response = await getIngredientSuggestions(value, 10, language);

// Add language dependency
}, [value, language]);
```

**AddIngredientDialog.tsx**:
```typescript
// Same changes
const result = await getIngredientSuggestions(name, 5, language);
}, [name, language]);
```

## 📊 Result

Now when user searches "лосось":
1. API receives `Accept-Language: ru` 
2. Backend returns localized fields (or generic `name`)
3. UI displays correct language or falls back gracefully
4. Dropdown shows: **"Salmon"** (generic) or **"Лосось"** (localized)

## 🧪 Testing

1. Search in Russian: "лосось" → should show results
2. Search in Polish: "łosoś" → should show results
3. Search in English: "salmon" → should show results
4. Check console: `Accept-Language` should match user's current language

## 📝 Files Modified

- `/lib/api/ingredients.api.ts` - Added `language` parameter
- `/components/admin/recipes/IngredientAutocomplete.tsx` - Pass language, update fallback
- `/components/admin/catalog/ingredients/AddIngredientDialog.tsx` - Pass language

---

**Date**: January 8, 2026  
**Status**: ✅ Fixed  
**Impact**: Multi-language search now works correctly
