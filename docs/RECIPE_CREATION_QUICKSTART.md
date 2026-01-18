# Recipe Creation - Quick Start Guide

## 🚀 TL;DR

```typescript
// 1️⃣ Import hook
import { useRecipeCreate } from '@/hooks/useRecipeCreate';

// 2️⃣ Use in component
const { createRecipe, creating } = useRecipeCreate({
  onSuccess: (recipe) => router.push(`/recipes/${recipe.canonicalName}`)
});

// 3️⃣ Submit form
await createRecipe({
  localName: "Яичница",     // Any language
  namePl: "Jajecznica",
  nameEn: "Scrambled Eggs",
  nameRu: "Яичница",
  difficulty: "easy",
  timeMinutes: 10,
  servings: 2,
  ingredients: [...],
});

// 4️⃣ Backend returns canonicalName
// → "scrambled_eggs"
```

## 📦 What's Included

### Types (`lib/types/recipe.ts`)
```typescript
interface Recipe {
  canonicalName: string;  // Backend-generated English slug
  titles?: {              // Localized names
    pl?: string;
    en?: string;
    ru?: string;
  };
  // ... other fields
}
```

### API Client (`lib/api/recipe.ts`)
```typescript
import { recipeApi } from '@/lib/api/recipe';

// Create recipe
const response = await recipeApi.createRecipe(data, token);
console.log(response.data.recipe.canonicalName); // "scrambled_eggs"

// Get recipe by canonicalName
const recipe = await recipeApi.getRecipe('scrambled_eggs');

// Update recipe
await recipeApi.updateRecipe('scrambled_eggs', { timeMinutes: 15 }, token);
```

### Hook (`hooks/useRecipeCreate.ts`)
```typescript
import { useRecipeCreate } from '@/hooks/useRecipeCreate';

const { 
  createRecipe,    // Function to create recipe
  creating,        // Loading state
  error,           // Error message
  createdRecipe    // Created recipe object
} = useRecipeCreate({
  onSuccess: (recipe) => {
    // Navigate to recipe page
    router.push(`/recipes/${recipe.canonicalName}`);
  }
});
```

### Helper Functions
```typescript
import { 
  getRecipeTitle,
  getRecipeUrl,
  formatCanonicalName 
} from '@/lib/types/recipe';

// Get localized title
const title = getRecipeTitle(recipe, 'pl'); // "Jajecznica"

// Get SEO-friendly URL
const url = getRecipeUrl(recipe); // "/recipes/scrambled_eggs"

// Format for display
const display = formatCanonicalName('fried_salmon'); // "Fried Salmon"
```

## 🎯 Key Concepts

### 1. Backend Generates canonicalName
```
Frontend sends:  "Яичница" (localName)
Backend returns: "scrambled_eggs" (canonicalName)
```

**Why:**
- English slug for global audience
- AI translation ensures consistency
- Unique constraint in database

### 2. Localized Titles (Optional)
```typescript
{
  canonicalName: "scrambled_eggs",
  titles: {
    pl: "Jajecznica",
    en: "Scrambled Eggs",
    ru: "Яичница"
  }
}
```

**Fallback:**
```
titles[lang] → titles.en → titles.pl → formatCanonicalName()
```

### 3. SEO-Friendly URLs
```
✅ /recipes/scrambled_eggs
✅ /recipes/greek_salad
❌ /recipes/123-яичница
```

## 📋 API Contract

### POST /api/recipes

**Request:**
```json
{
  "localName": "Яичница",
  "namePl": "Jajecznica",
  "nameEn": "Scrambled Eggs",
  "difficulty": "easy",
  "timeMinutes": 10,
  "servings": 2,
  "ingredients": [...]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recipe": {
      "id": "uuid",
      "canonicalName": "scrambled_eggs",  // ← Generated
      "titles": {
        "pl": "Jajecznica",
        "en": "Scrambled Eggs",
        "ru": "Яичница"
      }
    }
  }
}
```

## 💻 Example Component

```tsx
'use client';

import { useRecipeCreate } from '@/hooks/useRecipeCreate';
import { useRouter } from 'next/navigation';

export function CreateRecipeForm() {
  const router = useRouter();
  const { createRecipe, creating } = useRecipeCreate({
    onSuccess: (recipe) => {
      router.push(`/recipes/${recipe.canonicalName}`);
    }
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await createRecipe({
      localName: "Яичница",
      namePl: "Jajecznica",
      nameEn: "Scrambled Eggs",
      nameRu: "Яичница",
      difficulty: "easy",
      timeMinutes: 10,
      servings: 2,
      ingredients: [],
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button disabled={creating}>
        {creating ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

## ✅ Checklist

### Frontend Setup
- [x] `lib/types/recipe.ts` - Type definitions
- [x] `lib/api/recipe.ts` - API client
- [x] `hooks/useRecipeCreate.ts` - React hook
- [x] `components/recipes/RecipeCreateForm.tsx` - Example form
- [x] `docs/RECIPE_CANONICAL_NAME_ARCHITECTURE.md` - Full docs

### Backend TODO
- [ ] Add `canonical_name` column to `recipes` table
- [ ] Implement `GenerateCanonicalName()` function
- [ ] Add UNIQUE constraint
- [ ] Update POST /api/recipes endpoint
- [ ] Add translation service (OpenAI)

### Migration TODO
- [ ] Generate canonicalName for existing recipes
- [ ] Update recipe display components
- [ ] Update URLs to use canonicalName
- [ ] Set up redirects from old URLs

## 📚 Full Documentation

See `docs/RECIPE_CANONICAL_NAME_ARCHITECTURE.md` for:
- Detailed architecture explanation
- Backend implementation guide
- Migration strategy
- Best practices

## 🔗 Related

- `ASSISTANT_PAGE_MIGRATION_2025.md` - Backend-driven patterns
- `API_BASE_URL_FIX.md` - API routing
- `LANGUAGE_ARCHITECTURE.md` - Localization
