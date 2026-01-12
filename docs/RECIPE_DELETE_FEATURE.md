# Recipe Delete Feature - Documentation

## 📝 Overview
Implemented recipe deletion with confirmation dialog showing warning about irreversible action.

## ✅ Features Implemented

### 1. **RecipeDeleteDialog Component**
`components/admin/catalog/recipes/RecipeDeleteDialog.tsx`

**Features:**
- ⚠️ Red alert icon and title
- 📅 Shows recipe creation date
- 👀 Warning if recipe has views (popular recipe)
- 🗑️ Strong warning about irreversible action
- 🎨 Beautiful UI with amber warning cards for popular recipes

**Props:**
```typescript
interface RecipeDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  recipeTitle: string;
  viewsCount?: number;      // Shows warning if > 0
  createdAt?: string;        // Displays formatted date
}
```

**Visual Design:**
- Red accent color for destructive action
- Amber warning card for popular recipes (viewsCount > 0)
- Red warning card for irreversible action notice
- Cancel + Delete buttons with proper styling

### 2. **RecipesTab Integration**
`components/admin/catalog/RecipesTab.tsx`

**Changes:**
- Added state: `recipeToDelete`, `isDeleteDialogOpen`
- Modified `handleDeleteRecipe` - opens dialog instead of native confirm()
- Added `confirmDeleteRecipe` - actual deletion with refetch
- Renders `RecipeDeleteDialog` at the end

**Flow:**
```
User clicks Delete → handleDeleteRecipe() 
  → Opens dialog with recipe info 
  → User confirms 
  → confirmDeleteRecipe() 
  → deleteRecipe(id) 
  → refetch() 
  → Dialog closes
```

### 3. **API Endpoint**
`app/api/admin/recipes/[id]/route.ts`

**Already existed:**
```typescript
export async function DELETE(req, { params }) {
  const { id } = await params;
  return proxyToBackend(req, {
    endpoint: `/api/admin/recipes/${id}`,
    method: 'DELETE'
  });
}
```

**Backend Response:**
```json
{
  "message": "Recipe deleted successfully",
  "success": true
}
```

### 4. **Hook Integration**
`hooks/useAdminRecipes.ts`

**useAdminRecipeActions:**
```typescript
const deleteRecipe = async (id: string): Promise<boolean> => {
  // Calls DELETE /api/admin/recipes/:id
  // Shows success/error toast
  // Returns boolean for success
}
```

## 🎨 UI/UX Details

### Warning Levels:

1. **Always shown:**
   - 🗑️ Red card: "Безповоротна дія" (Irreversible action)
   - Lists what will be lost: ingredients, steps, images

2. **For popular recipes (viewsCount > 0):**
   - ⚠️ Amber card: "Увага!"
   - Warns that users may have saved the recipe
   - Shows view count

3. **Recipe info:**
   - Title with ChefHat icon
   - Creation date (formatted Ukrainian)

### Button States:
- **Cancel**: Gray, closes dialog
- **Delete**: Red, destructive action styling

## 🔄 User Flow

```
Admin Panel → Recipes Tab → Recipe Row
  ↓
Click "🗑️ Delete" button
  ↓
RecipeDeleteDialog opens
  ↓
Shows:
  - Recipe title
  - Creation date
  - View count warning (if > 0)
  - Irreversible action warning
  ↓
User clicks "Так, видалити назавжди"
  ↓
API call: DELETE /api/admin/recipes/:id
  ↓
Success toast: "Рецепт видалено"
  ↓
Table refreshes, recipe removed
```

## 🧪 Testing Backend

```bash
# 1. Get auth token
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin_password_123"}' \
  | jq -r '.data.token')

# 2. Delete recipe
curl -s -X DELETE \
  "http://localhost:8080/api/admin/recipes/RECIPE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.'

# Expected response:
# {
#   "message": "Recipe deleted successfully",
#   "success": true
# }
```

## 📊 Error Handling

**Frontend:**
- Toast error if API call fails
- Dialog stays open on error
- Console logs for debugging

**Backend:**
- 401: Unauthorized (no token)
- 404: Recipe not found
- 500: Internal server error

## 🎯 Key Improvements Over Native confirm()

| Feature | Native confirm() | RecipeDeleteDialog |
|---------|------------------|-------------------|
| Styling | Basic browser UI | Beautiful custom UI |
| Info | Only title | Title + date + views |
| Warnings | None | Multi-level warnings |
| UX | Abrupt | Smooth animations |
| Mobile | Poor | Responsive |
| Dark mode | Not supported | Full support |

## 🔮 Future Enhancements

- [ ] Add "Recently deleted" section (soft delete)
- [ ] Show ingredient count in warning
- [ ] Add "Restore" functionality
- [ ] Bulk delete with multi-select
- [ ] Delete confirmation via email for popular recipes
- [ ] Analytics: track deletion reasons

## 📝 Related Files

```
components/admin/catalog/recipes/
  ├── RecipeDeleteDialog.tsx      ← New component
  ├── RecipesTable.tsx            ← Calls onDelete
  └── RecipesTab.tsx              ← Main integration

app/api/admin/recipes/
  └── [id]/route.ts               ← DELETE endpoint

hooks/
  └── useAdminRecipes.ts          ← deleteRecipe action
```

## ✅ Checklist

- [x] Create RecipeDeleteDialog component
- [x] Add confirmation with warnings
- [x] Show recipe metadata (title, date, views)
- [x] Integrate with RecipesTab
- [x] Update RecipesTab handlers
- [x] Test DELETE API endpoint
- [x] Error handling with toasts
- [x] Dark mode support
- [x] Responsive design
- [x] TypeScript types
- [x] Documentation

## 🎉 Status: COMPLETE ✅

Recipe deletion is now fully functional with a beautiful confirmation dialog that warns users about the irreversible action!
