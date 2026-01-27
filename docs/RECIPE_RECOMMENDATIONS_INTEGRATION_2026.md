# Recipe Recommendations: Frontend Integration (2026-01-27)

## 📋 Status

✅ **COMPLETED:**
- RecipeRecommendationsList component created (Direct Go backend integration)
- API proxy route created (app/api/recipe-recommendations/route.ts)
- Tab integration on /admin/dishes/new/page.tsx
- Button navigation to create dish workflow
- Multilingual support (ru/en/pl)
- Error handling and loading states

## 🔗 API Integration

### Variant 1: Direct Backend (ACTIVE)
**Recommended for production** - Direct calls to Go backend

```tsx
// RecipeRecommendationsList.tsx
const apiUrl = process.env.NEXT_PUBLIC_API_URL; // http://localhost:8080
const response = await fetch(
  `${apiUrl}/api/recipe-recommendations?lang=ru&limit=10`,
  { headers: { Authorization: `Bearer ${token}` } }
);
```

### Variant 2: Next.js Proxy (Available)
**For local development** - Route created at app/api/recipe-recommendations/route.ts

```tsx
// Still use same fetch, but goes through Next.js
const response = await fetch(
  `/api/recipe-recommendations?lang=ru&limit=10`,
  { headers: { Authorization: `Bearer ${token}` } }
);
```

## 🏗️ Component Structure

```
app/admin/dishes/new/
├── page.tsx (SelectRecipePage - UPDATED with Tabs)
│   ├── Tab 1: RecipeRecommendationsList (from Go backend)
│   └── Tab 2: Manual search + grid
└── [recipeId]/
    └── page.tsx (CreateDishPage)
        └── CreateDishFromRecipe component
```

## 🎯 User Workflow

1. **Admin opens** `/admin/dishes/new`
2. **Tabs visible:**
   - ⚡ Recommendations (from fridge contents)
   - 🔍 All Recipes (search)
3. **User clicks recipe card**
   - Navigates to `/admin/dishes/new/{recipeId}`
   - CreateDishFromRecipe component loads
4. **In CreateDishFromRecipe:**
   - Edit: Set margin (10-100%)
   - Preview: See AI description + price calculation
   - Save: Creates draft dish

## 📊 Data Flow

```
Go Backend (localhost:8080)
    ↓
GET /api/recipe-recommendations
    ↓
Returns: RecipeRecommendation[] with:
  - match_percent (0-100%)
  - match_status (ready/almost_ready/not_ready)
  - available_ingredients[]
  - missing_ingredients[]
    ↓
Frontend displays in grid with status indicators
    ↓
User clicks "Выбрать рецепт" button
    ↓
Navigate to /admin/dishes/new/{recipe.id}
    ↓
CreateDishFromRecipe loads recipe details
```

## 🔑 Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8080  # or production URL
```

## 🧪 Testing Checklist

- [ ] Load `/admin/dishes/new`
- [ ] Check both tabs appear with correct labels
- [ ] Click on Recommendations tab → fetches from Go backend
- [ ] Check Console for 404 (should be GONE now)
- [ ] See recipe cards with match % and status badges
- [ ] Click "Выбрать рецепт" button → navigates to create dish page
- [ ] Verify dark mode UI appearance
- [ ] Test multilingual labels (ru/en/pl)

## 📝 API Endpoints (Go Backend)

| Endpoint | Method | Params | Status |
|----------|--------|--------|--------|
| /api/recipe-recommendations | GET | lang, limit | ✅ Ready |
| /api/recipe-recommendations/{id} | GET | lang | 🔨 TBD |
| /api/admin/dishes/calculate-cost | GET | recipeId | ✅ Ready |
| /api/admin/dishes | POST | body | ✅ Ready |

## 🐛 Troubleshooting

**Issue: 404 on recipe-recommendations**
- Solution: Check NEXT_PUBLIC_API_URL is set
- Check Go backend is running on localhost:8080
- Use browser DevTools Network tab to verify

**Issue: CORS errors**
- Solution: Backend must allow Next.js origin
- Or use Next.js proxy route (Variant 2)

**Issue: Empty recommendations list**
- Solution: Check if fridge has ingredients
- Verify backend matching logic

## 🚀 Next Steps

1. Backend team implements recommendations engine (already spec'd)
2. Local testing with Go backend running
3. Deploy to production with Koyeb URL
4. Add "Cook Now" button for quick dish creation from recommendation
5. Add margin presets (burger 25%, sushi 30%, etc.)
