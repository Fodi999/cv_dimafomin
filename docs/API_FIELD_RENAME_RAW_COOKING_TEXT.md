# API Field Rename: instructions → rawCookingText

## 🎯 Why This Change Matters

**Architecture Alignment**: Professional food-tech / AI SaaS pattern

| User Provides | AI Generates |
|---------------|--------------|
| Title | `canonicalName` |
| Ingredients list | Normalized structure |
| Weights | Per-serving calculations |
| **Raw cooking text** | **`steps[]` array** |
| ❌ No structured steps | ✅ Step-by-step instructions |

---

## ❌ Before (Wrong Field Name)

```typescript
{
  title: "Grilled Salmon",
  ingredients: [...],
  instructions: "Marinate salmon, grill it, serve"  // ❌ Confusing name
}
```

**Problem**: `instructions` implies structured steps, but we send raw text.

---

## ✅ After (Correct Field Name)

```typescript
{
  title: "Grilled Salmon",
  ingredients: [...],
  rawCookingText: "Marinate salmon, grill it, serve"  // ✅ Clear semantics
}
```

**Benefit**: Name clearly indicates:
- **Input**: Unstructured text
- **AI transforms**: Raw text → structured steps

---

## 🔧 Changes Made

### 1. Type Definition

**File**: `/lib/api/recipes-ai.api.ts`

```typescript
export interface AIRecipeInput {
  title: string;
  ingredients: AIRecipeIngredient[];
  rawCookingText: string; // ✅ Renamed from 'instructions'
}
```

### 2. Component State

**File**: `/components/admin/recipes/CreateRecipeWithAI.tsx`

```typescript
// Before
const [instructions, setInstructions] = useState("");

// After
const [cookingText, setCookingText] = useState("");
```

### 3. API Calls

```typescript
// Before
await previewRecipe({
  title,
  ingredients,
  instructions: instructions.trim()
});

// After
await previewRecipe({
  title,
  ingredients,
  rawCookingText: cookingText.trim()  // ✅ New field name
});
```

### 4. API Route Validation

**Files**: 
- `/app/api/admin/recipes/preview-ai/route.ts`
- `/app/api/admin/recipes/create-ai/route.ts`

```typescript
// Before
if (!body.instructions) {
  return NextResponse.json({ 
    error: 'Missing required fields: title, ingredients, instructions' 
  }, { status: 400 });
}

// After
if (!body.rawCookingText) {
  return NextResponse.json({ 
    error: 'Missing required fields: title, ingredients, rawCookingText' 
  }, { status: 400 });
}
```

---

## 🧠 Semantic Clarity

### Old Name: `instructions`
- ❌ Implies structured data
- ❌ Suggests array of steps
- ❌ Backend might expect different format

### New Name: `rawCookingText`
- ✅ Clearly indicates unstructured input
- ✅ Shows AI will parse/structure it
- ✅ Backend knows to expect plain text

---

## 📊 Data Flow

```
User Input
  ↓
const cookingText = "Marinate salmon, grill, serve"
  ↓
API Request
{
  title: "...",
  ingredients: [...],
  rawCookingText: "Marinate salmon, grill, serve"  ← Raw text
}
  ↓
Backend AI Processing
  ↓
Response
{
  steps: [                                         ← Structured!
    "Marinate salmon in teriyaki sauce for 15 min",
    "Preheat grill to medium-high heat",
    "Grill salmon 4-5 minutes per side",
    "Serve with rice"
  ]
}
```

---

## 🎨 UI Label (Unchanged)

**Label in form**: "Процесс приготовления" (Cooking Process)

**Why it's fine**: 
- User-facing label describes purpose
- Internal field name (`rawCookingText`) describes data format
- Separation of concerns

---

## ✅ Result

**Before**: Confusing contract (`instructions` = text or array?)  
**After**: Clear contract (`rawCookingText` = always plain text)

**Backend benefit**: No ambiguity about expected format

---

## 📝 Files Modified

- `/lib/api/recipes-ai.api.ts` - Type definition
- `/components/admin/recipes/CreateRecipeWithAI.tsx` - Component state
- `/app/api/admin/recipes/preview-ai/route.ts` - Validation
- `/app/api/admin/recipes/create-ai/route.ts` - Validation
- `/docs/AI_RECIPE_CREATION.md` - Documentation

---

**Date**: January 8, 2026  
**Status**: ✅ Complete  
**Pattern**: Industry-standard food-tech AI naming convention
