# Recipe Creation Architecture - canonicalName Pattern

## 🎯 Цель
Унифицировать создание рецептов с автоматической генерацией `canonicalName` на backend'е.

## 📋 Ключевые принципы

### 1️⃣ canonicalName - Backend Responsibility
```typescript
// ❌ НЕПРАВИЛЬНО (Frontend генерирует)
const canonicalName = slugify(localName); // "Яичница" → "яичница"

// ✅ ПРАВИЛЬНО (Backend генерирует)
const response = await createRecipe({
  localName: "Яичница",  // Любой язык
  // Backend вернет: canonicalName: "scrambled_eggs"
});
```

**Почему Backend:**
- **English slug:** Всегда на английском для глобального масштабирования
- **Уникальность:** UNIQUE constraint в PostgreSQL
- **AI Translation:** Используется OpenAI для перевода → slug
- **Стабильность:** Не зависит от frontend логики

### 2️⃣ Localized Titles (Опционально)
```typescript
{
  canonicalName: "scrambled_eggs",  // Backend generated
  titles: {
    pl: "Jajecznica",
    en: "Scrambled Eggs",
    ru: "Яичница"
  }
}
```

**Fallback Chain:**
```
titles[currentLang] → titles.en → titles.pl → titles.ru → formatCanonicalName()
```

### 3️⃣ SEO-Friendly URLs
```typescript
// ✅ Используем canonicalName для URLs
/recipes/scrambled_eggs
/recipes/fried_salmon
/recipes/greek_salad

// ❌ НЕ используем ID или localName
/recipes/123-яичница  // Плохо для SEO
```

## 🔧 API Contract

### POST /api/recipes

**Request:**
```json
{
  "localName": "Яичница",
  "namePl": "Jajecznica",
  "nameEn": "Scrambled Eggs",
  "nameRu": "Яичница",
  "descriptionPl": "Prosta jajecznica...",
  "descriptionEn": "Simple scrambled eggs...",
  "descriptionRu": "Простая яичница...",
  "difficulty": "easy",
  "timeMinutes": 10,
  "servings": 2,
  "category": "breakfast",
  "country": "PL",
  "ingredients": [
    {
      "ingredientId": "uuid-eggs",
      "quantity": 3,
      "unit": "шт"
    }
  ],
  "steps": [
    {
      "stepNumber": 1,
      "description": "Взбить яйца",
      "duration": 2
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recipe": {
      "id": "uuid-generated",
      "canonicalName": "scrambled_eggs",  // ← Backend generated
      "category": "breakfast",
      "difficulty": "easy",
      "timeMinutes": 10,
      "servings": 2,
      "titles": {
        "pl": "Jajecznica",
        "en": "Scrambled Eggs",
        "ru": "Яичница"
      },
      "descriptions": {
        "pl": "Prosta jajecznica...",
        "en": "Simple scrambled eggs...",
        "ru": "Простая яичница..."
      },
      "ingredients": [...],
      "steps": [...],
      "createdAt": "2026-01-18T10:00:00Z"
    }
  }
}
```

## 💻 Frontend Usage

### 1️⃣ Hook: useRecipeCreate
```typescript
import { useRecipeCreate } from '@/hooks/useRecipeCreate';
import { useRouter } from 'next/navigation';

function CreateRecipeForm() {
  const router = useRouter();
  
  const { createRecipe, creating } = useRecipeCreate({
    onSuccess: (recipe) => {
      // Navigate using canonicalName
      router.push(`/recipes/${recipe.canonicalName}`);
    }
  });
  
  const handleSubmit = async (formData) => {
    await createRecipe({
      localName: formData.localName,
      namePl: formData.namePl,
      nameEn: formData.nameEn,
      nameRu: formData.nameRu,
      difficulty: formData.difficulty,
      timeMinutes: formData.timeMinutes,
      servings: formData.servings,
      ingredients: formData.ingredients,
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={creating}>
        {creating ? 'Creating...' : 'Create Recipe'}
      </button>
    </form>
  );
}
```

### 2️⃣ Helper Functions
```typescript
import { 
  getRecipeTitle, 
  getRecipeUrl, 
  formatCanonicalName 
} from '@/lib/types/recipe';

// Get localized title
const title = getRecipeTitle(recipe, 'pl'); // "Jajecznica"

// Get SEO URL
const url = getRecipeUrl(recipe); // "/recipes/scrambled_eggs"

// Format for display
const displayName = formatCanonicalName('scrambled_eggs'); // "Scrambled Eggs"
```

### 3️⃣ Recipe List Display
```tsx
function RecipeCard({ recipe }: { recipe: Recipe }) {
  const { t, language } = useLanguage();
  const title = getRecipeTitle(recipe, language);
  const url = getRecipeUrl(recipe);
  
  return (
    <Link href={url}>
      <h3>{title}</h3>
      <p>{recipe.timeMinutes} min · {recipe.difficulty}</p>
    </Link>
  );
}
```

## 🔒 Backend Constraints

### PostgreSQL Schema
```sql
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_name VARCHAR(255) UNIQUE NOT NULL,  -- Auto-generated
  local_name VARCHAR(255) NOT NULL,             -- User input
  
  -- Localized fields
  name_pl VARCHAR(255),
  name_en VARCHAR(255),
  name_ru VARCHAR(255),
  
  description_pl TEXT,
  description_en TEXT,
  description_ru TEXT,
  
  -- Classification
  category VARCHAR(50),
  country VARCHAR(10),
  difficulty VARCHAR(20) NOT NULL,
  
  -- Metrics
  time_minutes INT NOT NULL,
  servings INT NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for SEO URLs
CREATE INDEX idx_recipes_canonical_name ON recipes(canonical_name);
```

### Backend Logic (Go)
```go
func GenerateCanonicalName(localName string) (string, error) {
    // 1. Translate to English using OpenAI
    englishName, err := translateToEnglish(localName)
    if err != nil {
        return "", err
    }
    
    // 2. Create slug
    slug := createSlug(englishName) // "Scrambled Eggs" → "scrambled_eggs"
    
    // 3. Check uniqueness
    if exists := checkCanonicalNameExists(slug); exists {
        // Add suffix: scrambled_eggs_2
        slug = makeUnique(slug)
    }
    
    return slug, nil
}
```

## ✅ Benefits

### 1. SEO Optimization
- **English slugs:** Понятны глобальной аудитории
- **Stable URLs:** Не меняются при переводах
- **Clean paths:** `/recipes/greek_salad` > `/recipes/123`

### 2. Scalability
- **Unique identifiers:** UNIQUE constraint в БД
- **AI-friendly:** Рекомендации работают на English slugs
- **Multi-tenant:** Каждый рецепт уникален глобально

### 3. Developer Experience
- **Type-safe:** TypeScript interfaces
- **Consistent:** Единый формат везде
- **Predictable:** Backend всегда генерирует одинаково

## 📊 Migration Path

### Legacy Code → New Architecture

#### Before (Mixed approach):
```typescript
// Inconsistent
recipe.title // Sometimes Polish, sometimes English
recipe.localName // Sometimes exists, sometimes not
recipe.id // Used in URLs (bad for SEO)
```

#### After (canonicalName):
```typescript
// Consistent
recipe.canonicalName // Always English slug
recipe.titles[lang] // Localized with fallback
getRecipeUrl(recipe) // Always /recipes/{canonicalName}
```

## 🚀 Next Steps

1. **Backend Implementation:**
   - [ ] Add `canonical_name` column to `recipes` table
   - [ ] Implement `GenerateCanonicalName()` function
   - [ ] Add UNIQUE constraint
   - [ ] Update POST /api/recipes endpoint

2. **Frontend Migration:**
   - [x] Create `lib/types/recipe.ts` with new interfaces
   - [x] Create `lib/api/recipe.ts` API client
   - [x] Create `hooks/useRecipeCreate.ts` hook
   - [ ] Update recipe forms to use new types
   - [ ] Migrate recipe lists to use `getRecipeTitle()`
   - [ ] Update URLs to use `canonicalName`

3. **Data Migration:**
   - [ ] Generate `canonical_name` for existing recipes
   - [ ] Verify uniqueness
   - [ ] Set up redirects from old URLs

## 📚 Related Docs
- `ASSISTANT_PAGE_MIGRATION_2025.md` - Backend-driven architecture
- `API_BASE_URL_FIX.md` - API routing patterns
- `LANGUAGE_ARCHITECTURE.md` - Localization strategy
