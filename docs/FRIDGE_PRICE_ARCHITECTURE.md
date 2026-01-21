# Fridge Price Architecture

## 📋 Overview
This document describes the proper backend architecture for handling price data in the fridge system, with price aggregation from price history.

## 🎯 Problem Statement
**Current (INCORRECT):**
- Backend returns flat price fields: `totalPrice`, `pricePerUnit`, `currency`
- No connection to price history table
- Prices are stored in `user_fridge_items` but never updated from history

**Desired (CORRECT):**
- Backend queries `user_fridge_price_history` table
- Returns last known price with proper aggregation
- Frontend receives structured price object with computed values

---

## 🏗️ Backend Architecture

### 1. Database Query (Go Backend)

In `fridge_service.go`, when fetching fridge items:

```go
// Query fridge items
SELECT * FROM user_fridge_items WHERE user_id = $1 AND status != 'expired'

// For each item, query last price from history
SELECT * FROM user_fridge_price_history
WHERE user_fridge_item_id = $1
ORDER BY created_at DESC
LIMIT 1
```

### 2. Response DTO Structure

**Example Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "ingredient": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Salmon",
    "name_pl": "Łosoś",
    "name_en": "Salmon",
    "name_ru": "Лосось",
    "category": "fish",
    "key": "salmon"
  },
  "quantity": 2.0,
  "quantityTotal": 2.0,
  "quantityRemaining": 2.0,
  "unit": "g",
  "arrivedAt": "2024-01-15T10:00:00Z",
  "expiresAt": "2024-01-20T10:00:00Z",
  "daysLeft": 5,
  "status": "fresh",
  
  "price": {
    "value": 6.3,      // Original price from history (6.30 PLN/kg)
    "per": "kg"        // Unit from history ("kg")
  },
  
  "computed": {
    "unitPrice": 0.0063,   // Normalized to smallest unit (g): 6.3 / 1000 = 0.0063 PLN/g
    "totalCost": 0.0126    // Total cost: 0.0063 * 2 = 0.0126 PLN for 2g
  },
  
  "currency": "PLN"
}
```

### 3. Backend Computation Logic

```go
// Example pseudo-code for computing prices
func EnrichFridgeItemWithPrice(item *FridgeItem, priceHistory *PriceHistory) {
    if priceHistory == nil {
        return // No price data available
    }
    
    // Set original price from history
    item.Price = &PriceObject{
        Value: priceHistory.Price,      // e.g., 6.3
        Per:   priceHistory.PriceUnit,  // e.g., "kg"
    }
    
    // Compute normalized unit price
    // Example: 6.3 PLN/kg → 0.0063 PLN/g
    unitPrice := normalizeToSmallestUnit(priceHistory.Price, priceHistory.PriceUnit, item.Unit)
    
    // Compute total cost for purchased quantity
    // Example: 0.0063 PLN/g * 2g = 0.0126 PLN
    totalCost := unitPrice * item.Quantity
    
    item.Computed = &ComputedPrice{
        UnitPrice: unitPrice,
        TotalCost: totalCost,
    }
    
    item.Currency = priceHistory.Currency // e.g., "PLN"
}
```

---

## 🔧 Frontend Support

### 1. Type Definitions (TypeScript)

**File:** `lib/types.ts`

```typescript
// 💰 NEW: Price aggregation from history
export interface PriceObject {
  value: number;     // Price value (e.g., 6.3 for "6.30 PLN/kg")
  per: string;       // Price unit (e.g., "kg", "l", "pcs")
}

// 💰 NEW: Computed price fields
export interface ComputedPrice {
  unitPrice: number;  // Price normalized per smallest unit (e.g., 0.0063 PLN/g)
  totalCost: number;  // Total cost for purchased quantity (e.g., 0.0126 PLN for 2g)
}

export interface FridgeItem {
  // ... other fields ...
  
  // 💰 Price (NEW FORMAT from backend)
  price?: PriceObject;           // ✅ NEW: Price from history
  computed?: ComputedPrice;      // ✅ NEW: Computed values
  
  // 💰 Price (LEGACY FORMAT - fallback)
  totalPrice?: number;           // LEGACY: Total price paid
  pricePerUnit?: number;         // LEGACY: Price per unit
  currency?: string;             // Currency code (e.g., "PLN")
}
```

### 2. API Client (Price Parsing)

**File:** `lib/api/fridge.ts`

```typescript
// ✅ NEW FORMAT: Backend returns price object with value/per
const priceObject = item.price;
const computedObject = item.computed;

// ✅ LEGACY FORMAT: Old flat structure (fallback)
const totalPrice = computedObject?.totalCost || item.totalPrice || item.total_price;
const pricePerUnit = computedObject?.unitPrice || priceObject?.value || item.pricePerUnit || item.price_per_unit;
const currency = item.currency || 'PLN';
```

**✅ Backward Compatibility:**
- Frontend tries new format first (`computed.totalCost`)
- Falls back to legacy format (`totalPrice`)
- Supports both snake_case and camelCase

### 3. Component Usage

**Example: FridgeItem.tsx**

```typescript
export function FridgeItem({ item }: { item: FridgeItem }) {
  // Frontend already receives normalized values
  const displayPrice = item.pricePerUnit; // Works with both formats
  const totalValue = item.totalPrice;     // Works with both formats
  
  return (
    <div>
      <span>{displayPrice?.toFixed(2)} {item.currency}/{item.unit}</span>
      <span>Total: {totalValue?.toFixed(2)} {item.currency}</span>
    </div>
  );
}
```

---

## 📊 Price History Table Schema

**Table:** `user_fridge_price_history`

```sql
CREATE TABLE user_fridge_price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_fridge_item_id UUID NOT NULL REFERENCES user_fridge_items(id) ON DELETE CASCADE,
  price DECIMAL(10, 2) NOT NULL,           -- e.g., 6.30
  price_unit VARCHAR(20) NOT NULL,         -- e.g., "kg"
  currency VARCHAR(10) DEFAULT 'PLN',      -- e.g., "PLN"
  source VARCHAR(50),                      -- e.g., "manual", "receipt", "ai"
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_fridge_item_created (user_fridge_item_id, created_at DESC)
);
```

---

## 🔄 Migration Strategy

### Phase 1: Backend Preparation
1. ✅ Create `PriceObject` and `ComputedPrice` structs in Go
2. ✅ Update `fridge_service.go` to query price history
3. ✅ Add price computation logic
4. ✅ Return new format in response DTO

### Phase 2: Frontend Preparation (DONE ✅)
1. ✅ Add `PriceObject` and `ComputedPrice` types to `lib/types.ts`
2. ✅ Update `lib/api/fridge.ts` to support both formats
3. ✅ Test with old backend (legacy format)

### Phase 3: Backend Deployment
1. Deploy updated backend with new price format
2. Verify price history queries work correctly
3. Monitor logs for any missing price data

### Phase 4: Testing
1. Test price display in FridgeItem cards
2. Test price stats in FridgeStats component
3. Verify currentValue calculation works
4. Test with products that have/don't have price history

### Phase 5: Cleanup (FUTURE)
1. Remove legacy fields after 100% migration
2. Update types to make `price` and `computed` required
3. Remove fallback logic from frontend

---

## 📝 Example Scenarios

### Scenario 1: Product with Price History
**Backend Response:**
```json
{
  "id": "abc123",
  "ingredient": { "name": "Salmon", "category": "fish" },
  "quantity": 2.0,
  "unit": "g",
  "price": { "value": 6.3, "per": "kg" },
  "computed": { "unitPrice": 0.0063, "totalCost": 0.0126 },
  "currency": "PLN"
}
```

**Frontend Display:**
- Price: `6.30 PLN/kg`
- Total Value: `0.01 PLN` (for 2g)

### Scenario 2: Product without Price History (Legacy)
**Backend Response:**
```json
{
  "id": "def456",
  "ingredient": { "name": "Salt", "category": "condiment" },
  "quantity": 100,
  "unit": "g",
  "totalPrice": 2.50,
  "pricePerUnit": 0.025,
  "currency": "PLN"
}
```

**Frontend Display:**
- Price: `0.03 PLN/g` (from legacy `pricePerUnit`)
- Total Value: `2.50 PLN` (from legacy `totalPrice`)

---

## 🎯 Benefits

1. **Data Integrity**: Price always comes from authoritative source (price_history)
2. **Historical Tracking**: Can show price trends over time
3. **Accurate Calculations**: Backend computes normalized prices correctly
4. **Flexibility**: Supports different units (kg, l, pcs) properly
5. **Backward Compatible**: Frontend works with both old and new formats

---

## 🚀 Next Steps

### For Backend Developer:
1. Review `user_fridge_price_history` table schema
2. Implement price query in `fridge_service.go`
3. Add price computation logic (`normalizeToSmallestUnit`)
4. Update response DTO to include `price` and `computed` objects
5. Test with existing products

### For Frontend Developer:
1. ✅ Types updated (DONE)
2. ✅ API client updated (DONE)
3. Test with new backend once deployed
4. Add price trend charts (FUTURE)
5. Add price history modal (FUTURE)

---

## 📚 Related Documentation
- `FRIDGE_CATEGORY_FILTER_IMPLEMENTATION.md` - Category architecture
- `API_STRUCTURE_MAP.md` - API endpoints overview
- `ARCHITECTURE_COOK_NOW_CONTRACT.md` - Contracts between backend/frontend

---

**Last Updated:** 2024-01-15  
**Status:** ✅ Frontend Ready | ⏳ Backend Pending  
**Migration Phase:** Phase 2 Complete
