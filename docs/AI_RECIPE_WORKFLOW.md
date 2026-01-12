# AI Recipe Workflow API Documentation

## 📋 Overview

Complete workflow for AI-assisted recipe creation with preview, edit, and save functionality.

---

## 🔄 Workflow Steps

```
1. User fills form → 2. Preview (AI) → 3. User edits → 4. Save → 5. Update (optional)
```

---

## API Endpoints

### 1️⃣ Preview Recipe (AI Generation)

**Endpoint:** `POST /api/admin/recipes/preview-ai`

**Purpose:** Generate structured recipe with AI **without** saving to database

**Request:**
```typescript
{
  title: string;
  rawCookingText: string;
  language?: string; // Optional: 'ru', 'pl', 'en'
  ingredients: Array<{
    ingredientId: string;
    quantity: number;
    unit: string;
  }>;
}
```

**Response:**
```typescript
{
  success: true;
  data: {
    title: string;
    language: string;
    description: string;
    servings: number;
    time_minutes: number;
    difficulty: 'easy' | 'medium' | 'hard';
    calories: number;
    totalWeight?: number; // Calculated on frontend
    ingredients: Array<{
      ingredientId: string;
      name: string;
      amount: number;
      unit: string;
    }>;
    steps: Array<{
      order: number;
      text: string;
      time: number;
    }>;
  };
}
```

---

### 2️⃣ Save Recipe

**Endpoint:** `POST /api/admin/recipes/save`

**Purpose:** Save user-edited recipe to database (after preview)

**Request:**
```typescript
{
  title: string;
  language: string;
  description: string;
  servings: number;
  time_minutes: number;
  difficulty: 'easy' | 'medium' | 'hard';
  calories: number;
  ingredients: Array<{
    ingredientId: string;
    name: string;
    amount: number;
    unit: string;
  }>;
  steps: Array<{
    order: number;
    text: string;
    time: number;
  }>;
}
```

**Response:**
```typescript
{
  success: true;
  message: "Recipe saved successfully";
  data: {
    id: string; // UUID
    canonicalName: string;
    title: string;
    descriptionRu: string;
    // ... full recipe object
  };
}
```

**Errors:**
- `409` - Recipe with similar name already exists
- `401` - Unauthorized (no admin token)
- `400` - Invalid request body

---

### 3️⃣ Update Recipe

**Endpoint:** `PUT /api/admin/recipes/{recipeId}`

**Purpose:** Update existing recipe

**Request:** Same as Save

**Response:** Same as Save

**Errors:**
- `404` - Recipe not found
- `401` - Unauthorized

---

## TypeScript API Client

```typescript
import { 
  previewRecipeWithAI, 
  saveRecipe, 
  updateRecipe,
  type AIRecipeInput,
  type SaveRecipeRequest
} from '@/lib/api/recipes-ai.api';

// Step 1: Generate preview
const input: AIRecipeInput = {
  title: "Жареный лосось",
  rawCookingText: "Обжарить лосось на растительном масле до золотистой корочки",
  language: "ru",
  ingredients: [
    {
      ingredientId: "fe1c7431-b1b7-4d36-94bf-74276481983e",
      quantity: 340,
      unit: "g"
    },
    {
      ingredientId: "1b7cea8e-b026-4329-9d2e-c94952e3fa6c",
      quantity: 100,
      unit: "ml"
    }
  ]
};

const preview = await previewRecipeWithAI(input);
console.log('Preview:', preview);
// User sees: title, description, ingredients, steps, totalWeight (440g)

// Step 2: User edits preview (optional)
const editedRecipe: SaveRecipeRequest = {
  ...preview,
  title: "Жареный лосось (домашний рецепт)", // User changed
  servings: 2, // User changed
  time_minutes: 15, // User changed
};

// Step 3: Save to database
const savedRecipe = await saveRecipe(editedRecipe);
console.log('Saved Recipe ID:', savedRecipe.id);
// Redirect to /admin/recipes/{id} or show success message

// Step 4: Later, user wants to update
const updatedRecipe = await updateRecipe(savedRecipe.id, {
  ...savedRecipe,
  title: "Жареный лосось (авторский рецепт)",
  servings: 3
});
console.log('Recipe updated!');
```

---

## Example Component Usage

```tsx
import { useState } from 'react';
import { previewRecipeWithAI, saveRecipe } from '@/lib/api/recipes-ai.api';

export function CreateRecipeWithAI() {
  const [preview, setPreview] = useState(null);
  const [mode, setMode] = useState<'form' | 'preview' | 'saving'>('form');

  const handlePreview = async () => {
    setMode('preview');
    const result = await previewRecipeWithAI({
      title: formData.title,
      rawCookingText: formData.cookingText,
      language: 'ru',
      ingredients: formData.ingredients
    });
    setPreview(result);
  };

  const handleSave = async () => {
    setMode('saving');
    const saved = await saveRecipe({
      title: preview.title,
      language: preview.language,
      description: preview.description,
      servings: preview.servings,
      time_minutes: preview.time_minutes,
      difficulty: preview.difficulty,
      calories: preview.nutrition.calories,
      ingredients: preview.ingredients,
      steps: preview.steps
    });
    
    // Redirect or show success
    router.push(`/admin/recipes/${saved.id}`);
  };

  return (
    <div>
      {mode === 'form' && (
        <RecipeForm onPreview={handlePreview} />
      )}
      
      {mode === 'preview' && preview && (
        <RecipePreview 
          recipe={preview}
          onSave={handleSave}
          onEdit={() => setMode('form')}
        />
      )}
    </div>
  );
}
```

---

## Features

✅ **Language Support:** Pass `language: 'ru'` for Russian AI generation  
✅ **totalWeight:** Auto-calculated from ingredients (340g + 100ml = 440g)  
✅ **Accept-Language Header:** Sent automatically with language preference  
✅ **Error Handling:** All functions throw descriptive errors  
✅ **Debug Logging:** Console logs for request/response tracking  
✅ **Type Safety:** Full TypeScript interfaces for all data structures  

---

## Migration Status

- ✅ `POST /api/admin/recipes/preview-ai` - Migrated to `proxyToBackend()`
- ✅ `POST /api/admin/recipes/create-ai` - Migrated to `proxyToBackend()`
- ✅ `POST /api/admin/recipes/save` - **NEW** - Created with `proxyToBackend()`
- ✅ `PUT /api/admin/recipes/{id}` - Already exists with `proxyToBackend()`
- ✅ `GET /api/admin/recipes/{id}` - Already exists
- ✅ `DELETE /api/admin/recipes/{id}` - Already exists

---

## Testing

```bash
# 1. Preview
curl -X POST http://localhost:3000/api/admin/recipes/preview-ai \
  -H "Content-Type: application/json" \
  -H "Cookie: token=YOUR_TOKEN" \
  -H "Accept-Language: ru" \
  -d '{
    "title": "Жареный лосось",
    "rawCookingText": "Обжарить лосось",
    "ingredients": [
      {"ingredientId": "fe1c7431-b1b7-4d36-94bf-74276481983e", "quantity": 340, "unit": "g"}
    ]
  }'

# 2. Save
curl -X POST http://localhost:3000/api/admin/recipes/save \
  -H "Content-Type: application/json" \
  -H "Cookie: token=YOUR_TOKEN" \
  -d '{
    "title": "Жареный лосось",
    "language": "ru",
    "description": "Описание...",
    "servings": 1,
    "time_minutes": 10,
    "difficulty": "easy",
    "calories": 520,
    "ingredients": [...],
    "steps": [...]
  }'

# 3. Update
curl -X PUT http://localhost:3000/api/admin/recipes/{id} \
  -H "Content-Type: application/json" \
  -H "Cookie: token=YOUR_TOKEN" \
  -d '{...}'
```
