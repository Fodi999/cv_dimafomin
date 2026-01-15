# TODO: Remove Client-Side Category Filter

## Context
Temporary client-side filtering was added to `ProductsTab.tsx` because the backend doesn't properly filter ingredients by category yet.

## When to Remove
Remove this workaround once the backend properly implements category filtering at:
- **Endpoint**: `GET /api/admin/ingredients`
- **Parameter**: `?category=protein` (and other categories)

## How to Test Backend is Fixed
1. Open browser console
2. Go to Admin → Products Catalog
3. Select a category (e.g., "🥩 М'ясо і білок")
4. Check console logs:
   ```
   📡 [useIngredients] Fetching with filters: {category: 'protein', ...}
   ✅ [useIngredients] Received data: {count: 30-40, total: 30-40, category: 'protein'}
   ```
5. If `total` matches the filtered count (not 224), backend is fixed!

## Code to Remove

### File: `components/admin/catalog/ProductsTab.tsx`

1. **Remove comment block** (lines ~14-19):
```typescript
/**
 * ⚠️ TEMPORARY FIX: Client-side category filtering active
 * Backend currently ignores category parameter (as of 2026-01-14)
 * TODO: Remove client-side filter once backend is fixed
 * @see docs/BACKEND_CATEGORY_FILTER_BUG.md
 */
```

2. **Remove client-side filtering** (lines ~52-56):
```typescript
// 🔧 TEMPORARY: Client-side filtering until backend fix is deployed
// Backend currently ignores category parameter, so we filter on frontend
const filteredIngredients = localCategory === "all" 
  ? safeIngredients
  : safeIngredients.filter(ing => ing.category === localCategory);
```
**Replace with**:
```typescript
const filteredIngredients = safeIngredients;
```

3. **Remove warning message** (lines ~130-135):
```typescript
{localCategory !== "all" && (
  <span className="text-orange-600 dark:text-orange-400 font-medium mr-2">
    ⚠️ Client-side filter active
  </span>
)}
```

4. **Simplify count text** (line ~137):
```typescript
{t.common.showing}: {filteredIngredients.length} {t.common.of} {meta.total}
{localCategory !== "all" && ` (filtered by category)`}
```
**Replace with**:
```typescript
{t.common.showing}: {filteredIngredients.length} {t.common.of} {meta.total}
```

5. **Optional: Remove debug logs** if no longer needed:
```typescript
console.log('🔍 [ProductsTab] Search filter changed:', ...);
console.log('🏷️ [ProductsTab] Category filter changed:', ...);
```

### File: `hooks/useIngredients.ts`

**Optional**: Remove debug logs (lines ~65-70, ~87-92) if no longer needed:
```typescript
console.log('📡 [useIngredients] Fetching with filters:', ...);
console.log('✅ [useIngredients] Received data:', ...);
```

## Files to Delete After Removal
- ✅ `docs/BACKEND_CATEGORY_FILTER_BUG.md`
- ✅ `docs/TODO_REMOVE_CLIENT_SIDE_FILTER.md` (this file)

## Verification
After removal:
1. Category filter should work without client-side filtering
2. Total count should change when category is selected
3. No warning message should appear
4. Performance should be better (server-side filtering + pagination)

---
**Created**: 2026-01-14
**Status**: ⏳ Waiting for backend fix
**Priority**: Low (workaround is functional)
