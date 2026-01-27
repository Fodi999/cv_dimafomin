# 🏗️ RECIPE RECOMMENDATIONS: ARCHITECTURE DIAGRAM (27.01.2026)

## 📊 Request Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     BROWSER (Admin)                              │
│  http://localhost:3000/admin/dishes/new                          │
└─────────────────────────────────────────────────────────────────┘
                               ↓
                    ┌──────────────────────┐
                    │  SelectRecipePage    │
                    │  (app/...new/page)   │
                    └──────────────────────┘
                               ↓
                    ┌──────────────────────┐
                    │  Tabs Component      │
                    │  ⚡ | 🔍             │
                    └──────────────────────┘
                      ↓                ↓
          ┌─────────────────┐    ┌──────────────┐
          │ Recommendations │    │ Search All   │
          │ Tab (DEFAULT)   │    │ Recipes Tab  │
          └─────────────────┘    └──────────────┘
                      ↓
        ┌──────────────────────────────────┐
        │ RecipeRecommendationsList        │
        │ (Component)                      │
        └──────────────────────────────────┘
                      ↓
            🔗 VARIANT 1 (ACTIVE)
            ↓
┌──────────────────────────────────────────┐
│  Direct API Call                         │
│  fetch(`${NEXT_PUBLIC_API_URL}/api/...`) │
└──────────────────────────────────────────┘
            ↓
          INTERNET
            ↓
   ┌────────────────────────┐
   │  Go Backend            │
   │  localhost:8080        │
   │  OR koyeb.app          │
   ├────────────────────────┤
   │ GET /api/              │
   │   recipe-recommendations│
   │   ?lang=ru&limit=10    │
   └────────────────────────┘
            ↓
┌──────────────────────────────────┐
│  Database (PostgreSQL)           │
│  - recipes                       │
│  - user_fridge_ingredients       │
│  - matching engine               │
└──────────────────────────────────┘
            ↓
        Response JSON
            ↓
   RecipeRecommendation[]
   - id, title, image_url
   - match_percent (0-100%)
   - match_status (ready/...)
   - available_ingredients[]
   - missing_ingredients[]
            ↓
     Display in Grid
     (RecipeRecommendationsList)
            ↓
      User clicks "Выбрать"
            ↓
   router.push(`/admin/dishes/new/${id}`)
            ↓
┌──────────────────────────────────┐
│ CreateDishPage                   │
│ /admin/dishes/new/[recipeId]     │
└──────────────────────────────────┘
            ↓
   CreateDishFromRecipe Component
   - Load recipe details
   - Get cost from backend
   - Set margin slider
   - Calculate price
   - AI description
   - Save as draft
```

---

## 🔀 VARIANT 2 (Available as fallback)

```
Browser
  ↓
fetch("/api/recipe-recommendations?lang=ru")
  ↓
┌──────────────────────────────────────┐
│ Next.js API Route                    │
│ app/api/recipe-recommendations/route │
└──────────────────────────────────────┘
  ↓
  (Proxy logic)
  ↓
fetch(`${NEXT_PUBLIC_API_URL}/api/recipe-recommendations`)
  ↓
Go Backend (localhost:8080)
  ↓
Response
```

---

## 📦 Component Tree

```
AdminLayout (app/admin/layout.tsx)
└── SelectRecipePage (app/admin/dishes/new/page.tsx)
    ├── Header with sticky top-16
    └── Tabs
        ├── TabsContent[recommendations]
        │   └── RecipeRecommendationsList
        │       └── Recipe Cards Grid
        │           ├── Image + Match % Badge
        │           ├── Title + Meta (time, servings)
        │           ├── Available Ingredients (✓)
        │           ├── Missing Ingredients (✗)
        │           └── Button "Выбрать рецепт"
        │               → router.push(/admin/dishes/new/{id})
        │
        └── TabsContent[search]
            ├── Search Input
            └── Recipes Grid
                └── Recipe Cards (same as above)

CreateDishPage (app/admin/dishes/new/[recipeId]/page.tsx)
└── Header with back button
└── CreateDishFromRecipe
    ├── Mode: Edit
    │   ├── Recipe Title (read-only)
    │   ├── Dish Title (input)
    │   ├── Cost (read-only from API)
    │   ├── Margin Slider (10-100%)
    │   └── Price (auto-calculated)
    │
    ├── Mode: Preview
    │   ├── AI-generated Description
    │   ├── Price Summary (3 columns)
    │   └── Buttons: Back, Save
    │
    └── Mode: Saving
        └── Loading state
```

---

## 🔐 Authentication Flow

```
1. Browser has localStorage.token
   ↓
2. Fetch includes header:
   Authorization: Bearer ${token}
   ↓
3. Go Backend validates JWT
   ├─ Valid → Returns recommendations filtered by user's fridge
   └─ Invalid → 401 Unauthorized
   ↓
4. Frontend shows:
   ├─ Loading state (while fetching)
   ├─ Error alert if 401/500
   └─ Data if 200 OK
```

---

## 🎨 UI States

### RecipeRecommendationsList

1. **Loading State**
   ```
   ⏳ Loading spinner + text
   ```

2. **Error State**
   ```
   ⚠️ Error message
   "Failed to load recipes"
   ```

3. **Empty State**
   ```
   🍳 No recipes found
   "Рецепты не найдены"
   ```

4. **Data State**
   ```
   ┌─────────────────────────────────┐
   │ 🍳 Рецепты из вашего холодильника│
   │ 3 recipes found                  │
   │                                 │
   │ ┌──────┐ ┌──────┐ ┌──────┐     │
   │ │ 75%  │ │ 50%  │ │ 25%  │     │
   │ │ ✓RDY │ │ ⏳ALM │ │ ❌NED │     │
   │ │ ...  │ │ ...  │ │ ...  │     │
   │ └──────┘ └──────┘ └──────┘     │
   └─────────────────────────────────┘
   ```

### Tab Labels (i18n)

| Language | Tab 1 | Tab 2 |
|----------|-------|-------|
| 🇷🇺 RU | ⚡ Рекомендации | 🔍 Все рецепты |
| 🇬🇧 EN | ⚡ Recommendations | 🔍 All Recipes |
| 🇵🇱 PL | ⚡ Rekomendacje | 🔍 Wszystkie przepisy |

---

## 🔗 Endpoint Mapping

### Active: Direct to Go Backend

| Endpoint | Method | Status | Response |
|----------|--------|--------|----------|
| `${NEXT_PUBLIC_API_URL}/api/recipe-recommendations?lang=ru&limit=10` | GET | ✅ | RecipeRecommendation[] |

### Fallback: Next.js Proxy

| Endpoint | Method | Status | Response |
|----------|--------|--------|----------|
| `/api/recipe-recommendations?lang=ru&limit=10` | GET | ✅ Available | RecipeRecommendation[] |

---

## 🧬 Data Structures

### RecipeRecommendation

```typescript
{
  id: string;                           // "recipe-sushi-rolls"
  title: string;                        // "California Rolls"
  canonical_name: string;               // "california_rolls"
  image_url: string;                    // "https://..."
  cook_time: number;                    // 30 (minutes)
  servings: number;                     // 4
  
  match_percent: number;                // 0-100%
  match_status: "ready"                 // "ready" | "almost_ready" | "not_ready"
                | "almost_ready"
                | "not_ready";
  
  available_ingredients: [              // ✓ что есть
    {
      id: string;                       // "ing-rice"
      canonical_name: string;           // "rice"
      display_name: string;             // "рис"
      quantity: number;                 // 500
      unit: string;                     // "гр"
      category: string;                 // "grains"
    }
  ];
  
  missing_ingredients: [                // ✗ чего нет
    {
      id: string;
      canonical_name: string;
      display_name: string;
      quantity: number;
      unit: string;
      category: string;
    }
  ];
  
  steps: string[];                      // cooking steps
}
```

### RecommendationResponse

```typescript
{
  decision: "ready" | "almost_ready" | "not_ready";
  summary: string;                      // "У вас есть все для 3 рецептов"
  total_matches: number;                // 3
  recipes: RecipeRecommendation[];
}
```

---

## 🎯 Status Badge Colors

| Status | Color | Icon | Meaning |
|--------|-------|------|---------|
| `ready` | 🟢 Green | ✓ | All ingredients available |
| `almost_ready` | 🟡 Yellow | ⏳ | 75-90% ingredients available |
| `not_ready` | 🔴 Red | ❌ | <75% ingredients available |

---

## 🔄 Environment Configuration

### Development
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Production
```env
NEXT_PUBLIC_API_URL=https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app
```

---

## ✨ Key Features

✅ **Direct Backend Integration**
- No extra Next.js layer
- Minimal latency
- Simple debugging

✅ **Dual Variant Support**
- Variant 1: Direct (active)
- Variant 2: Proxy (fallback)
- Easy switching

✅ **Full i18n**
- Russian (RU)
- English (EN)
- Polish (PL)

✅ **Robust Error Handling**
- Loading states
- Error messages
- Console logging

✅ **Responsive Design**
- 1 col mobile
- 2 cols tablet
- 3 cols desktop

✅ **Dark Mode**
- Full support
- Color-coded status
- Clear contrast

---

## 🚀 Deployment Checklist

- [ ] Verify NEXT_PUBLIC_API_URL set in production
- [ ] Test with production backend URL
- [ ] Check CORS headers on Go backend
- [ ] Verify JWT token format
- [ ] Test with different languages
- [ ] Check dark mode appearance
- [ ] Monitor API response times
- [ ] Set up error logging/monitoring

