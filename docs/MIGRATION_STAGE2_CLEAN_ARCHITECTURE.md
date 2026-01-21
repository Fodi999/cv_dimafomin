# Stage 2: Clean Architecture Migration

## 🎯 Overview

After backend implements proper API contract, we migrate frontend to clean architecture:
- Remove all "guessing" logic from fridgeApi
- Use CategoryContext for filters
- Display labels/icons from category dictionary

---

## 📋 New Backend Contract

### Response Structure (After Backend Fix)
```json
{
  "data": {
    "items": [
      {
        "id": "uuid-123",
        "ingredient": {
          "id": "fe1c7431-...",
          "name": "Лосось",      // ✅ Localized via Accept-Language
          "unit": "g"
        },
        "categoryKey": "fish",    // ✅ Stable key from DB
        "quantity": 2000,
        "unit": "g",
        "currentPrice": {
          "value": 12.34,
          "per": "kg",
          "currency": "PLN",
          "updatedAt": "2026-01-20T10:30:00Z"
        },
        "arrivedAt": "2026-01-15T10:00:00Z",
        "expiresAt": "2026-01-20T10:00:00Z",
        "daysLeft": 5,
        "status": "fresh"
      }
    ]
  }
}
```

### Key Changes from Backend:
1. ✅ `ingredient` is now nested object (not flat)
2. ✅ `categoryKey` always present (from `Ingredient.Category`)
3. ✅ `ingredient.name` is localized (uses `Accept-Language`)
4. ✅ `currentPrice` replaces flat `price` field
5. ✅ No more `category_key` vs `categoryKey` confusion

---

## 🔧 Frontend Changes Required

### 1. Update `lib/api/fridge.ts` - Remove Priority Chain

**BEFORE (Temporary Workaround):**
```typescript
// ❌ REMOVE THIS "GUESSING" LOGIC:
const categoryKey = 
  ingredient.category_key || 
  ingredient.categoryKey || 
  item.category_key || 
  item.categoryKey || 
  ingredient.category || 
  'other';

console.log(`[fridgeApi.getItems] 🔑 Item ${index + 1}:`, {
  ingredientCategoryKey: ingredient.category_key,
  itemCategoryKey: item.category_key,
  finalCategory: categoryKey,
});
```

**AFTER (Clean Architecture):**
```typescript
// ✅ SIMPLE: Trust backend contract
const ingredient = item.ingredient; // Nested object
const categoryKey = item.categoryKey || 'other'; // Stable key from backend

console.log(`[fridgeApi.getItems] 🔑 Item ${index + 1}:`, {
  ingredientId: ingredient.id,
  ingredientName: ingredient.name,  // Already localized!
  categoryKey: categoryKey,         // Stable key
});

const baseItem = {
  id: item.id,
  ingredient: {
    id: ingredient.id,
    name: ingredient.name,     // ✅ Use backend localized name
    namePl: ingredient.name,   // ❌ REMOVE - backend handles this
    nameEn: ingredient.name,   // ❌ REMOVE - backend handles this
    nameRu: ingredient.name,   // ❌ REMOVE - backend handles this
    category: categoryKey,      // ✅ Stable key
    key: ingredient.key,
  },
  // ... rest of fields
};
```

**File:** `lib/api/fridge.ts`  
**Lines:** 49-73 (remove priority chain)

---

### 2. Update `components/fridge/FridgeList.tsx` - Use CategoryContext

**BEFORE (Hardcoded Categories):**
```typescript
const getCategoryConfig = () => {
  return [
    { value: "all", label: t?.fridge?.categories?.all || "All", Icon: Filter },
    { value: "fish", label: t?.fridge?.categories?.fish || "Fish", Icon: Fish },
    { value: "egg", label: t?.fridge?.categories?.egg || "Eggs", Icon: Package },
    // ... etc
  ];
};
```

**AFTER (Dynamic from API):**
```typescript
import { useCategories } from '@/contexts/CategoryContext';

export default function FridgeList({ items, onDelete }: FridgeListProps) {
  const { categories, isLoading } = useCategories();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  // ✅ Build buttons from CategoryContext
  const categoryButtons = [
    { key: "all", name: t?.fridge?.categories?.all || "All", icon: "🏷️" },
    ...categories.map(cat => ({
      key: cat.key,        // "fish", "egg", "grain"
      name: cat.name,      // Localized from backend
      icon: cat.icon || "📦"
    }))
  ];
  
  // ✅ Count items per category
  const categoryCounts = items.reduce((acc, item) => {
    const category = item.ingredient?.category || 'other';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // ✅ Filter by category
  const filteredItems = activeCategory === "all" 
    ? items 
    : items.filter(item => (item.ingredient?.category || 'other') === activeCategory);
  
  return (
    <div>
      {/* Category buttons */}
      <div className="flex gap-2 overflow-x-auto">
        {categoryButtons.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={activeCategory === cat.key ? 'active' : ''}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
            {cat.key !== "all" && <span>({categoryCounts[cat.key] || 0})</span>}
          </button>
        ))}
      </div>
      
      {/* Item list */}
      {filteredItems.map(item => (
        <FridgeItem key={item.id} item={item} onDelete={onDelete} />
      ))}
    </div>
  );
}
```

**File:** `components/fridge/FridgeList.tsx`  
**Lines:** Remove `getCategoryConfig()` function  
**Add:** `import { useCategories }` from CategoryContext

---

### 3. Update `components/fridge/FridgeItem.tsx` - Use Category Dictionary

**BEFORE (Direct Display):**
```typescript
<div className="category">
  {item.ingredient?.category} {/* Just shows "fish" */}
</div>
```

**AFTER (Lookup in Dictionary):**
```typescript
import { useCategories } from '@/contexts/CategoryContext';

export default function FridgeItem({ item }: FridgeItemProps) {
  const { getCategoryByKey } = useCategories();
  
  const category = getCategoryByKey(item.ingredient?.category || 'other');
  
  return (
    <div>
      <div className="category">
        <span>{category?.icon || '📦'}</span>
        <span>{category?.name || item.ingredient?.category}</span>
      </div>
      
      <div className="name">
        {item.ingredient?.name} {/* ✅ Already localized by backend! */}
      </div>
      
      {item.currentPrice && (
        <div className="price">
          {item.currentPrice.value} {item.currentPrice.currency}/{item.currentPrice.per}
        </div>
      )}
    </div>
  );
}
```

**File:** `components/fridge/FridgeItem.tsx`  
**Add:** Category lookup and icon display

---

### 4. Update Type Definitions

**File:** `lib/types.ts`

```typescript
export interface FridgeItem {
  id: string;
  ingredient: {
    id: string;           // ✅ NEW: Ingredient ID
    name: string;         // ✅ Already localized from backend
    category: string;     // ✅ Stable key (fish, egg, grain)
    key?: string;         // Language-independent key
  };
  categoryKey?: string;   // ✅ NEW: Top-level category (same as ingredient.category)
  quantity: number;
  unit: string;
  
  arrivedAt?: string;
  expiresAt: string | null;
  daysLeft: number | null;
  status: FridgeItemStatus;
  
  // ✅ NEW: Structured price
  currentPrice?: {
    value: number;
    per: string;
    currency: string;
    updatedAt?: string;
  };
  
  // ❌ DEPRECATED: Remove after migration
  totalPrice?: number;
  pricePerUnit?: number;
  currency?: string;
}
```

---

## 🎯 Migration Checklist

### Backend Prerequisites (DONE ✅)
- [x] Backend returns `ingredient` as nested object
- [x] Backend sets `categoryKey` from `Ingredient.Category`
- [x] Backend localizes `ingredient.name` via `Accept-Language`
- [x] Backend includes `currentPrice` structure
- [x] Backend deployed to production

### Frontend Tasks (TODO ⏳)
- [ ] Remove priority chain from `lib/api/fridge.ts`
- [ ] Update interface in `lib/types.ts`
- [ ] Replace hardcoded categories in `FridgeList.tsx`
- [ ] Add `useCategories` hook to `FridgeList.tsx`
- [ ] Add category lookup to `FridgeItem.tsx`
- [ ] Test with real backend data
- [ ] Remove deprecated fields after testing

---

## 🧪 Testing Plan

### Test 1: Verify Backend Contract
```bash
# Check backend logs for new structure
curl -H "Accept-Language: ru" https://api.example.com/fridge/items

# Expected log:
{
  "accept_language": "ru",
  "ingredient_name": "Лосось",    // ✅ Russian
  "category_key": "fish",         // ✅ Stable key
  "has_current_price": true
}
```

### Test 2: Frontend Integration
1. Open fridge page
2. Check DevTools console:
   ```javascript
   [fridgeApi.getItems] 🔑 Item 1: {
     ingredientName: "Лосось",    // ✅ Localized
     categoryKey: "fish"          // ✅ Stable key
   }
   ```
3. Verify category buttons appear
4. Verify filtering works
5. Verify icons/labels show correctly

### Test 3: Language Switching
1. Switch language to Polish
2. Refresh fridge page
3. Check that:
   - Product names are in Polish ("Łosoś")
   - Category buttons use Polish labels ("Ryby")
   - Category keys stay the same ("fish")

---

## 📊 Before/After Comparison

### Data Flow (Before - Complex ❌)
```
Backend → Frontend → Priority Chain → Multiple Fallbacks → Display
```

### Data Flow (After - Simple ✅)
```
Backend → Frontend → Direct Use → Display
```

### Code Complexity (Before ❌)
- **fridgeApi.ts:** 20 lines of priority chain logic
- **FridgeList.tsx:** 42 lines of hardcoded categories
- **FridgeItem.tsx:** Direct field access (no lookup)

### Code Complexity (After ✅)
- **fridgeApi.ts:** 3 lines (trust backend)
- **FridgeList.tsx:** Dynamic from CategoryContext
- **FridgeItem.tsx:** Category dictionary lookup

---

## 🚀 Deployment Plan

### Step 1: Verify Backend (DONE ✅)
- Backend deployed with new contract
- Logs show correct structure
- Accept-Language working

### Step 2: Update Frontend Types
```bash
git checkout -b feat/clean-architecture-stage2
# Update lib/types.ts
git commit -m "feat: update types for new backend contract"
```

### Step 3: Update API Client
```bash
# Remove priority chain from lib/api/fridge.ts
git commit -m "refactor: remove category guessing logic"
```

### Step 4: Update Components
```bash
# Update FridgeList.tsx to use CategoryContext
# Update FridgeItem.tsx to use category dictionary
git commit -m "feat: use CategoryContext for dynamic filters"
```

### Step 5: Test & Deploy
```bash
npm run build
# Test locally
# Deploy to production
git push origin feat/clean-architecture-stage2
```

---

## 📝 Related Files

- `lib/api/fridge.ts` - API client (remove priority chain)
- `lib/types.ts` - Type definitions (update interface)
- `components/fridge/FridgeList.tsx` - Category buttons (use context)
- `components/fridge/FridgeItem.tsx` - Item display (use dictionary)
- `contexts/CategoryContext.tsx` - Category provider (already exists)
- `docs/BUGFIX_CATEGORY_KEY_MAPPING.md` - Stage 1 documentation
- `docs/LANGUAGE_SINGLE_SOURCE.md` - Language architecture

---

**Status:** ⏳ Ready to start (Backend deployed)  
**Priority:** High (Remove technical debt)  
**Effort:** ~2 hours  
**Risk:** Low (backward compatible)

---

**Next Action:** Update `lib/api/fridge.ts` to remove priority chain
