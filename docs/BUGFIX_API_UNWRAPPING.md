# Bug Fix: API Response Unwrapping Issue

## 🐛 Problem

**Symptom**: Autocomplete showed no results despite API returning data:
```
GET /api/admin/ingredients/suggest?q=лосось&limit=5
→ 200 OK
→ {data: Array(5)}

But UI showed: "Query: лосось → Results: 0"
```

## 🔍 Root Cause

**Hidden data transformation in `apiFetch()`**:

```typescript
// base.ts line 138-140
if (isApiResponse<T>(data)) {
  return data.data;  // ❌ Unwraps {data: [...]} → returns array directly
}
```

**Flow**:
1. Backend returns: `{data: [{name_ru: "Лосось"}]}`
2. `apiFetch` detects `"data" in response` → triggers unwrapping
3. `apiFetch` returns **array directly** (not `{data: [...]}`)
4. `getIngredientSuggestions` checks `response.data` → undefined
5. Returns `{suggestions: []}` → empty results

## ❌ Broken Code

```typescript
// ingredients.api.ts (old)
const response = await apiFetch<any>('/suggest?...');

// response is ARRAY, not object!
if (response.data) {  // ❌ Array has no .data property
  return { suggestions: response.data };
}
```

## ✅ Fixed Code

```typescript
// ingredients.api.ts (new)
const response = await apiFetch<any>('/suggest?...');

// Case 1: apiFetch already unwrapped → response is Array
if (Array.isArray(response)) {
  return { suggestions: response };
}

// Case 2: Old format {suggestions: [...]}
if (response.suggestions) {
  return response;
}

// Case 3: New format {data: [...]}
if (response.data) {
  return { suggestions: response.data };
}
```

## 🎯 Key Lesson

**`apiFetch()` automatically unwraps `ApiResponse<T>` format**:

```typescript
// Backend returns:
{data: T, meta?: {...}}

// apiFetch returns:
T  // Just the data!
```

**Always check**:
1. Is response an array? → use directly
2. Is response an object? → check properties

## 🔧 Detection Pattern

Add logging to catch this:
```typescript
console.log('response type:', Array.isArray(response) ? 'array' : typeof response);
```

If you see `"response type: array"` but expect object → `apiFetch` unwrapped it.

## 📝 Related Files

- `/lib/api/base.ts` (lines 138-140) - unwrapping logic
- `/lib/api/types.ts` (line 442) - `isApiResponse()` check
- `/lib/api/ingredients.api.ts` (line 63-90) - fixed handling

## 🚀 Status

✅ **Fixed** - 2025-01-08
- Added `Array.isArray()` check
- Handles both wrapped and unwrapped responses
- All 3 cases covered (array, suggestions, data)

---

**Author**: AI + User collaboration  
**Date**: January 8, 2026  
**Impact**: Critical UX bug → autocomplete now works
