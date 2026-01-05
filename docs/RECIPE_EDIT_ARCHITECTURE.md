# Recipe Edit Architecture

## Industry Standard Implementation ✅

Реализация профессионального редактирования рецептов по industry standard: **View mode ≠ Edit mode**

## Принципы архитектуры

### 🔍 View Mode (Read-only)
- **Route**: `/admin/catalog` → открыть рецепт
- **Component**: `RecipeViewDialog`
- **Цель**: Просмотр информации
- **UI**: Dialog с tabs (Overview, Translations, Nutrition, Steps, Technical)
- **Действия**: Read-only, кнопка "Редагувати"

### ✏️ Edit Mode (Separate screen)
- **Route**: `/admin/catalog/recipes/[id]/edit`
- **Component**: `EditRecipeForm`
- **Цель**: Редактирование данных
- **UI**: Full page с формой и tabs
- **Действия**: Edit fields, Save/Cancel с dirty state warning

## Файловая структура

```
app/
  admin/
    catalog/
      recipes/
        [id]/
          edit/
            page.tsx         # Edit page route

components/
  admin/
    catalog/
      recipes/
        RecipeViewDialog.tsx     # Read-only view
        EditRecipeForm.tsx       # Edit form with react-hook-form
        RecipesTable.tsx         # Table with Edit button

app/api/
  admin/
    recipes/
      [id]/
        route.ts            # PUT /api/admin/recipes/[id]
```

## Технологический стек

### Form Management
- **react-hook-form**: Controlled form state
- **zod**: Schema validation
- **zodResolver**: Integration между react-hook-form и zod

### Validation Schema
```typescript
const recipeSchema = z.object({
  localName: z.string().min(1, "Назва обов'язкова"),
  canonicalName: z.string().min(1, "Canonical name обов'язкова"),
  cuisine: z.string().min(1, "Кухня обов'язкова"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  status: z.enum(["draft", "published", "archived"]),
  timeMinutes: z.number().min(1),
  servings: z.number().min(1),
  // ... другие поля
});
```

## User Flow (Золотой стандарт)

```
Catalog (/admin/catalog)
  ↓
Recipe Row → [👁 View] → RecipeViewDialog (read-only)
                              ↓
                         [✏️ Редагувати] 
                              ↓
              /admin/catalog/recipes/[id]/edit (EditRecipeForm)
                              ↓
                    [Save] → PUT /api/admin/recipes/[id]
                              ↓
                    Navigate back to /admin/catalog
```

## Tabs Architecture

### View Mode Tabs
1. **Огляд** - Походження, Інгредієнти (read-only list)
2. **Переклади** - Назви та описи різними мовами
3. **Харчова** - Nutrition profile, calories
4. **Кроки** - Steps приготування (numbered list)
5. **Технічне** - ID, timestamps, source metadata

### Edit Mode Tabs
1. **Основне** - Form fields: назва, кухня, складність, статус, час, порції, вага, походження
2. **Інгредієнти** - Placeholder "в розробці" (next phase: IngredientsEditor)
3. **Кроки** - Placeholder "в розробці" (next phase: StepsEditor)
4. **Переклади** - Form fields для всіх мов (PL/EN/UK/RU)
5. **Технічне** - Read-only metadata

## Features Implemented ✅

### 1. Dirty State Warning
```typescript
const { isDirty } = useForm();

const handleCancel = () => {
  if (isDirty) {
    const confirmed = window.confirm("Незбережені зміни...");
    if (!confirmed) return;
  }
  onCancel();
};
```

### 2. Save Button State
- **Disabled** when `!isDirty` (no changes)
- **Disabled** when `isSaving` (in progress)
- **Label**: "Збереження..." during save

### 3. Edit Navigation
```typescript
// In RecipeViewDialog
const handleEdit = () => {
  onOpenChange(false);  // Close dialog
  router.push(`/admin/catalog/recipes/${recipe.id}/edit`);
};
```

### 4. API Proxy
```typescript
// PUT /api/admin/recipes/[id]
export async function PUT(request, { params }) {
  const token = request.cookies.get("auth_token")?.value;
  const body = await request.json();
  
  const response = await fetch(`${BACKEND}/api/admin/recipes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  
  return NextResponse.json(await response.json());
}
```

## Next Phase (TODO)

### IngredientsEditor Component
**Требования**:
- Autocomplete по существующим ингредиентам
- Table с колонками: Ingredient | Amount | Unit | Actions
- Добавление/удаление ингредиентов
- Drag & drop для порядка (позже)

**UI Pattern**:
```
[ + Додати інгредієнт ]

┌────────────┬────────┬──────┬─────┐
│ Ingredient │ Amount │ Unit │ Del │
├────────────┼────────┼──────┼─────┤
│ Ziemniak   │ 500    │ g    │ ❌  │
│ Twaróg     │ 250    │ g    │ ❌  │
└────────────┴────────┴──────┴─────┘
```

### StepsEditor Component
**Требования**:
- Numbered steps
- Textarea для каждого шага
- Добавление/удаление шагов
- Reorder steps (drag & drop)

**UI Pattern**:
```
Step 1
[ Textarea with instructions ]

Step 2
[ Textarea with instructions ]

[ + Додати крок ]
```

## UX Principles Applied

### ✅ Separation of Concerns
- View для чтения
- Edit для изменения
- NO inline editing в view mode

### ✅ Unsaved Changes Protection
- Dirty state tracking
- Confirm dialog на Cancel
- Visual indicator "• Незбережені зміни"

### ✅ Professional Form UI
- Меньше декора, больше функциональности
- Четкая структура через tabs
- Validation с понятными сообщениями
- Disabled states для UX clarity

### ✅ Navigation Pattern
```
View → Edit → Save → Back to Catalog
```

## Development Notes

### TypeScript Integration
- Zod schema generates TypeScript types
- `type RecipeFormData = z.infer<typeof recipeSchema>`
- Полная type safety from form to API

### State Management
- **Form state**: react-hook-form (не useState!)
- **Server state**: fetch в API route
- **Navigation**: useRouter from next/navigation

### Error Handling
```typescript
try {
  await fetch('/api/admin/recipes/' + id, { method: 'PUT', ... });
  toast.success("Рецепт успішно оновлено");
  router.push("/admin/catalog");
} catch (error) {
  toast.error("Помилка при оновленні рецепта");
}
```

## Build Status ✅

```bash
npm run build
# ✓ Compiled successfully
# ✓ Route: /admin/catalog/recipes/[id]/edit
```

## Architecture Compliance

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Separate Edit Route | ✅ | `/admin/catalog/recipes/[id]/edit` |
| react-hook-form | ✅ | With zodResolver |
| Zod Validation | ✅ | Complete schema |
| Dirty State | ✅ | `isDirty` tracking |
| Save/Cancel | ✅ | With confirmation |
| API Proxy | ✅ | PUT endpoint |
| Edit Button | ✅ | In ViewDialog + Table |
| Tabs Structure | ✅ | 5 tabs (same as view) |
| Professional UI | ✅ | Minimal, functional |

**Architecture Status**: ✅ Industry Standard Compliant
