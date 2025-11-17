# RecipeWizard Redesign - 3-Phase Dynamic UI

## What Changed

The recipe creation wizard has been completely redesigned from a **10-step progression** to a **3-phase system** with dynamic photo upload.

## Old Structure (10 Steps)
1. Description (Опис)
2. Photo 1 (Primary)
3. Photos 2-8 (Additional, fixed 8 slots)
4. YouTube Video

**Problem**: Fixed 8 photo slots were rigid. Users had to go through individual steps for each photo.

## New Structure (3 Phases)

### Phase 1: Description (📝)
- Recipe name (обов'язковий)
- Description (обов'язковий)
- Cuisine selection (обов'язковий)
- Difficulty level

✅ **Validation**: Name + Description + Cuisine

### Phase 2: Photos (📸)
- Dynamic photo gallery (variable count)
- Upload as many photos as needed (1, 7, 9, etc.)
- First photo automatically marked as "Основне" (Primary)
- Hover to delete individual photos
- Progress shows number of uploaded photos
- File type: JPG, PNG, WebP, GIF
- Max size per file: 5MB

✅ **Validation**: Min 1 photo required

### Phase 3: Video (🎥)
- YouTube URL input
- Validation regex checks YouTube format
- Live embed preview when URL is valid
- Error message for invalid URLs
- Examples provided (youtube.com/watch?v=... or youtu.be/...)

✅ **Validation**: Valid YouTube URL required

## Progress Tracking

- **Progress Bar**: 33% → 66% → 100%
- **Phase Indicators**: 3 buttons showing completion status
  - Green checkmark when phase is complete
  - Disabled until previous phase complete
  - Active state when currently on that phase

## Key Features

### Dynamic Photo Upload
```typescript
handleAddImage(file: File) {
  // Validates file size (max 5MB)
  // Converts to base64 DataURL
  // Appends to images array
}

handleRemoveImage(index: number) {
  // Removes photo at specific index
  // Preserves first photo as primary
}
```

### Template System Integration
- When cuisine selected → displays available templates
- Select template → pre-fills all description phase fields
- Generate Random → creates random recipe with slight variations

### Responsive Design
- Mobile: Full width panel
- Tablet: 2/3 width (`md:w-2/3`)
- Desktop: 50% width (`lg:w-1/2`)
- Large Desktop: 5/12 width (`xl:w-5/12`)

## Validation Flow

```
Phase 1 Complete?
  ✓ Name, Description, Cuisine
  ✓ Min 1 Ingredient
  ✓ Min 1 Instruction
  → Button to Phase 2

Phase 2 Complete?
  ✓ Min 1 Photo
  → Button to Phase 3

Phase 3 Complete?
  ✓ Valid YouTube URL
  → Submit Button (Publish/Save)
```

## UI Components Used

- **Button**: Custom styled with variants
- **Input**: Text inputs for name, tags, YouTube URL
- **Select**: Dropdowns for cuisine, difficulty, units
- **Textarea**: For description and instructions
- **Framer Motion**: Smooth phase transitions and animations
- **Lucide Icons**: ChefHat, Upload, Check, X, Plus, Trash2, etc.

## Dark Mode Support

All phases have full dark mode styling:
- `dark:bg-slate-900` for panels
- `dark:text-white` for text
- `dark:border-slate-700` for borders
- Color-appropriate status indicators

## No More Errors

✅ TypeScript compilation clean
✅ No `primaryImage` vs `images` conflict
✅ Single `images: string[]` array for all photos
✅ Phase-based validation instead of step-based
✅ Proper state management with React hooks

## File Changes

- **Deleted**: Old RecipeWizard.tsx (935 lines of step-based code)
- **Created**: New RecipeWizard.tsx (600 lines of phase-based code)
- **No changes needed**: pages/admin/recipes/page.tsx (import already correct)

## Ready for Production

The component is production-ready with:
- Complete form validation
- Error messages for users
- Responsive design across all devices
- Dark/light theme support
- Smooth animations and transitions
- Accessibility attributes
