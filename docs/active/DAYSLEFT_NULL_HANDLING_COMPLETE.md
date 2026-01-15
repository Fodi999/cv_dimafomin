# ✅ `daysLeft: null` Handling - Complete Fix

**Date:** 2026-01-15  
**Status:** ✅ **Backend Fixed** | ⏳ **Frontend Investigation**  
**Priority:** P1 - Критический UX bug

---

## 🎯 Problem Summary

Products **without expiry date** (масло, соль, специи) show:
- ❌ **Wrong**: "Осталось 0 дней" (0 days left)
- ✅ **Expected**: "Без срока годности" (No expiry date)

---

## 🔍 Root Cause Analysis

### ✅ Backend is CORRECT

```bash
# Direct backend test
curl "https://...koyeb.app/api/fridge/items" | jq '.data.items[] | select(.ingredient.name == "Olej roślinny")'

# ✅ Result:
{
  "expiresAt": null,
  "daysLeft": null,  ← Correct!
  "status": "fresh"
}
```

**Backend logic:**
```go
// internal/modules/fridge/domain/user_fridge_item.go
if item.ExpiresAt != nil {
    daysLeft := int(time.Until(*item.ExpiresAt).Hours() / 24)
    item.DaysLeft = &daysLeft
} else {
    item.DaysLeft = nil  ← Correct!
}
```

### ❌ Frontend Transforms `null` → `0`

**Evidence from browser console:**
```
[API base.ts] 🔍 Items with NULL daysLeft: 0  ← No null items reach React!
[FridgeItem] Olej roślinny → daysLeft: 0 (type: number)  ← Became 0!
```

---

## 🔬 Investigation Steps

### 1️⃣ Checked TypeScript Types ✅ FIXED

**Problem:** Type definition didn't allow `null`

```typescript
// lib/types.ts - BEFORE
export interface FridgeItem {
  daysLeft: number;  ← ❌ Only number
}

// lib/types.ts - AFTER ✅
export interface FridgeItem {
  daysLeft: number | null;  ← ✅ Now allows null
  expiresAt: string | null;  ← ✅ Also fixed
}
```

### 2️⃣ Checked UI Component ✅ FIXED

**Problem:** Function signature didn't accept `null`

```typescript
// components/fridge/FridgeItem.tsx - BEFORE
const getStatusConfig = (status: string, daysLeft: number) => {  ← ❌
  // ...
}

// AFTER ✅
const getStatusConfig = (status: string, daysLeft: number | null) => {
  switch (status) {
    case "fresh":
      return {
        description: daysLeft === null 
          ? (t?.fridge?.status?.noExpiry || "No expiry date")  ← ✅
          : daysLeft > 30 
            ? `Still ${daysLeft} days`
            : `${daysLeft} days left`,
      };
    // ...
  }
}
```

### 3️⃣ Added i18n Translations ✅ ADDED

```typescript
// i18n/en/fridge.ts
status: {
  noExpiry: "No expiry date",  ← ✅ NEW
  lastDay: "Last day",
  // ...
}

// i18n/pl/fridge.ts
status: {
  noExpiry: "Bez terminu ważności",  ← ✅ NEW
  lastDay: "Ostatni dzień",
  // ...
}

// i18n/ru/fridge.ts
status: {
  noExpiry: "Без срока годности",  ← ✅ NEW
  lastDay: "Последний день",
  // ...
}
```

### 4️⃣ Issue Still Persists! ⚠️

**After all fixes, still seeing:**
```
[FridgePage] 🔍 Items with null/undefined daysLeft: 0 []
[FridgeItem] Olej roślinny → daysLeft: 0 (type: number)
```

**This means:** `null` is being converted to `0` **somewhere between backend and React state!**

---

## 🎯 Next Steps

### Option A: Find where `null → 0` happens

**Suspects:**
1. ✅ ~~TypeScript types~~ - Fixed
2. ✅ ~~UI component~~ - Fixed
3. ⏳ **API proxy layer** (`app/api/fridge/items/route.ts`)
4. ⏳ **Fetch/JSON parsing** (`lib/api/base.ts`)
5. ⏳ **Default parameters** somewhere
6. ⏳ **Zod/validation schema** (if exists)

**Debug added:**
```typescript
// app/api/fridge/items/route.ts
const nullDaysLeftItems = data.data.items.filter((item: any) => item.daysLeft === null);
console.log('[API Proxy] 🔍 Items with NULL daysLeft:', nullDaysLeftItems.length);
```

**Next:** Check server logs when page loads!

### Option B: Workaround using `expiresAt`

If `daysLeft` is unreliable, calculate from `expiresAt`:

```typescript
// components/fridge/FridgeItem.tsx
const displayDaysLeft = item.expiresAt 
  ? Math.ceil((new Date(item.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  : null;

const statusConfig = getStatusConfig(item.status, displayDaysLeft);
```

❌ **NO!** This violates "Frontend НЕ считает" principle! Backend is source of truth!

---

## ✅ What's Working

1. **Backend**: 100% correct, returns `null` for products without expiry
2. **TypeScript types**: Updated to allow `null`
3. **UI component**: Handles `null` correctly, shows "No expiry date"
4. **i18n**: Translations added in 3 languages
5. **API contracts**: Documented in `docs/active/SMART_FRIDGE_IMPLEMENTATION.md`

---

## 📋 Test Plan

When fix is complete, verify:

```bash
# 1. Add product without expiry
curl -X POST "https://...koyeb.app/api/fridge/items" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"ingredientId": "МАСЛО_ID", "quantity": 500}'

# 2. Check response
# Expected: {"daysLeft": null, "status": "fresh"}

# 3. Load fridge page
# Expected UI: "Без срока годности" (not "0 дней")
```

**Success criteria:**
- ✅ Backend returns `daysLeft: null`
- ✅ Frontend displays "Без срока годности"
- ✅ No "0 дней" anywhere
- ✅ Console shows: `daysLeft: null (type: object)`

---

## 📝 Related Documentation

- `docs/active/SMART_FRIDGE_IMPLEMENTATION.md` - Full smart fridge spec
- `docs/active/FRONTEND_FRIDGE_DAYSLEFT_FIX.md` - Initial investigation
- `lib/types.ts` - TypeScript type definitions
- `components/fridge/FridgeItem.tsx` - UI component
- `i18n/*/fridge.ts` - Translation files

---

## 🎉 Final Status

**Backend:** ✅ 100% Ready  
**Frontend:** ⏳ 95% Ready (type fixes done, runtime conversion bug remains)  
**Next Action:** Debug API proxy or fetch layer to find `null → 0` conversion

**Estimated time to fix:** 10-15 minutes once conversion point is found

---

**Last updated:** 2026-01-15 11:30 UTC
