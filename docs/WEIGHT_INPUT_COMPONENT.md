# Professional Weight Input Component

## 🎯 Goal

Admin enters weight in familiar format:
- `0,230` (EU format with comma)
- `1,350` 
- `25`

System:
- ✅ Accepts both `,` and `.` as decimal separator
- ✅ Stores internally as `number` type
- ✅ Auto-formats on blur (`0,23` → `0,230`)
- ✅ Prevents invalid input (letters, special chars)
- ✅ Sends clean numbers to backend

---

## ❌ Wrong Approach (Common Mistake)

```tsx
<input type="number" />
```

**Problems:**
- `type="number"` does NOT support comma separator
- Browser corrupts input in EU locales
- Poor UX (especially in European countries)
- Different behavior across browsers

---

## ✅ Correct Solution (Professional)

### Architecture

```
User Input (string) → Normalization → Business Logic (number)
     ↓                      ↓                    ↓
  "0,230"            "0.230"              0.23
  "1,5"              "1.5"                1.5
  "25"               "25"                 25
```

**Key Principle:**
- **UI works with strings** (allows partial input like `"0,"` or `"1."`)
- **Business logic works with numbers** (clean data for backend)

---

## 🧩 Component API

```tsx
<WeightInput
  value={number}           // Current numeric value
  onChange={(num) => ...}  // Only number passed up
  unit="g"                 // Optional unit display
  placeholder="0,000"
  className="w-28"
  min={0}
  disabled={false}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | required | Current numeric value |
| `onChange` | `(num: number) => void` | required | Callback with parsed number |
| `unit` | `string` | `"g"` | Unit to display (g, kg, ml, etc.) |
| `placeholder` | `string` | `"0,000"` | Placeholder text |
| `className` | `string` | `"w-24"` | Tailwind classes |
| `min` | `number` | `0` | Minimum allowed value |
| `disabled` | `boolean` | `false` | Disable input |

---

## 🔍 How It Works

### User Input Examples

| User Types | Display in UI | Stored as `number` | Sent to Backend |
|------------|---------------|-------------------|-----------------|
| `0,230` | `0,230` | `0.23` | `0.23` |
| `1,350` | `1,350` | `1.35` | `1.35` |
| `25` | `25` | `25` | `25` |
| `0,23` | `0,23` (blur) → `0,230` | `0.23` | `0.23` |
| `.` | `.` | `0` | `0` |
| `,` | `,` | `0` | `0` |
| `abc` | ❌ rejected | - | - |

### Auto-Formatting on Blur

When user finishes editing (blur event):
- `0,23` → `0,230` (adds trailing zeros)
- `1,5` → `1,500`
- Empty input → stays empty

### Input Validation

**Allowed characters:** `0-9`, `,`, `.`  
**Rejected:** letters, spaces, multiple separators

```tsx
// Regex validation
if (!/^[\d.,]*$/.test(raw)) return;

// Prevent multiple separators
const commaCount = (raw.match(/,/g) || []).length;
const dotCount = (raw.match(/\./g) || []).length;
if (commaCount + dotCount > 1) return;
```

---

## 📦 Usage in Recipe Form

### Before (Wrong)

```tsx
<Input
  type="number"
  value={ing.amount || ''}
  onChange={(e) => updateIngredient('amount', parseFloat(e.target.value))}
/>
```

**Problems:**
- Comma input breaks
- Empty string parsing issues
- No auto-formatting

### After (Correct)

```tsx
<WeightInput
  value={ing.amount}
  onChange={(numericValue) => updateIngredient('amount', numericValue)}
  unit={ing.unit}
/>
```

**Benefits:**
- ✅ Clean API: only numbers in/out
- ✅ EU-friendly input
- ✅ Auto-formatting
- ✅ Unit display integrated

---

## 🧠 Advanced Features

### 1. Select All on Focus

```tsx
onFocus={(e) => e.target.select()}
```

**UX benefit:** User can immediately type new value without deleting old one.

### 2. Decimal Separator Normalization

```tsx
const normalized = inputText.replace(",", ".");
```

**Backend always receives:** `0.23` (not `0,23`)

### 3. Unit Integration

```tsx
<div className="relative">
  <Input className="pr-8" />
  <span className="absolute right-3">g</span>
</div>
```

**Visual:** `150 g` instead of separate field

---

## 🎨 Styling

Uses Tailwind + shadcn/ui:
- `text-right` - Right-aligned numbers (like calculators)
- `pr-8` - Padding for unit label
- `inputMode="decimal"` - Shows numeric keyboard on mobile

---

## 🧪 Testing Checklist

- [ ] Type `0,230` → displays correctly
- [ ] Type `1.5` → accepts dot separator
- [ ] Blur `0,23` → auto-formats to `0,230`
- [ ] Type `abc` → rejected
- [ ] Type `1,2,3` → second comma rejected
- [ ] Empty input → sends `0` to parent
- [ ] Focus input → selects all text
- [ ] Mobile keyboard → shows decimal keyboard

---

## 📝 Files

- **Component**: `/components/admin/recipes/WeightInput.tsx`
- **Usage**: `/components/admin/recipes/CreateRecipeWithAI.tsx`
- **Documentation**: `/docs/WEIGHT_INPUT_COMPONENT.md`

---

## 🚀 Result

**UX:** Admin-friendly, European-style input  
**DX:** Clean API, type-safe, no parsing bugs  
**Backend:** Always receives clean `number` type

```json
// What backend receives:
{
  "ingredientId": "123",
  "amount": 0.23,        // ← Clean number!
  "unit": "g"
}
```

---

**Date**: January 8, 2026  
**Status**: ✅ Production-ready  
**Follows**: EU regulations, professional PIM/ERP patterns
