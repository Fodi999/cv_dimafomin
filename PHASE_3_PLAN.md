# Phase 3: Refactor /academy/create

## 🎯 Mission
Transform 899-line monolith into maintainable, testable component architecture.

**Current Status:** 🔴 Critical Monolith  
**Target Status:** ✅ Modular, Maintainable  
**Priority:** HIGH (last major architectural issue)

---

## 📊 Current State Analysis

### File: `/app/academy/create/page.tsx`
- **Lines:** 899
- **Status:** Live production page
- **Issues:**
  - Mixed concerns (UI + business logic + state)
  - Hard to test
  - Difficult to extend
  - Poor reusability

### What It Does:
1. Recipe creation form
2. AI-powered recipe generation
3. Image upload handling
4. Ingredient nutrition fetching
5. Step-by-step recipe builder
6. Form validation & submission

---

## 🏗️ Target Architecture

### New Structure:
```
/app/academy/create/
├── page.tsx (~150 lines)
│   └── Main orchestrator with layout
│
└── components/
    ├── CreateRecipeForm.tsx (~200 lines)
    │   └── Main form container & submission logic
    │
    ├── IngredientInput.tsx (~150 lines)
    │   └── Ingredient management + nutrition fetching
    │
    ├── StepEditor.tsx (~120 lines)
    │   └── Step-by-step recipe editor
    │
    ├── AIPromptGenerator.tsx (~150 lines)
    │   └── AI recipe generation interface
    │
    ├── RecipePreview.tsx (~100 lines)
    │   └── Live preview of recipe
    │
    └── ImageUploader.tsx (~100 lines)
        └── Image upload & preview handling
```

**Total:** ~970 lines (+71 lines for better structure)  
**Benefit:** Modular, testable, reusable

---

## 📋 Implementation Plan (6 Steps)

### Step 1: Read & Analyze (1 hour)
**Goal:** Understand current code structure

- [ ] Read full `page.tsx` (899 lines)
- [ ] Identify state management patterns
- [ ] Map component dependencies
- [ ] Document business logic flows
- [ ] List all external dependencies

**Deliverable:** Analysis document

---

### Step 2: Extract ImageUploader (30 min)
**Goal:** First isolated component

**Lines:** ~100  
**Complexity:** Low (self-contained)

```tsx
// /app/academy/create/components/ImageUploader.tsx

interface ImageUploaderProps {
  imagePreview: string;
  onImageChange: (url: string) => void;
  uploading: boolean;
  setUploading: (loading: boolean) => void;
}

export default function ImageUploader({ ... }) {
  // Image upload logic
  // Preview display
  // Error handling
}
```

**Why First:**
- Self-contained logic
- No complex dependencies
- Easy to test
- Quick win

---

### Step 3: Extract IngredientInput (45 min)
**Goal:** Complex but reusable component

**Lines:** ~150  
**Complexity:** Medium (nutrition API integration)

```tsx
// /app/academy/create/components/IngredientInput.tsx

interface IngredientInputProps {
  ingredients: (string | IngredientData)[];
  onChange: (ingredients: (string | IngredientData)[]) => void;
  loadingNutrition: { [key: number]: boolean };
}

export default function IngredientInput({ ... }) {
  // Ingredient list management
  // Add/remove ingredients
  // Nutrition fetching per ingredient
  // Brutto/netto weight handling
}
```

**Challenges:**
- State coordination
- API integration
- Error handling

---

### Step 4: Extract StepEditor (30 min)
**Goal:** Simple list editor

**Lines:** ~120  
**Complexity:** Low

```tsx
// /app/academy/create/components/StepEditor.tsx

interface StepEditorProps {
  steps: string[];
  onChange: (steps: string[]) => void;
}

export default function StepEditor({ ... }) {
  // Add/remove/reorder steps
  // Step validation
  // Drag-and-drop (optional)
}
```

---

### Step 5: Extract AIPromptGenerator (1 hour)
**Goal:** AI integration component

**Lines:** ~150  
**Complexity:** Medium-High

```tsx
// /app/academy/create/components/AIPromptGenerator.tsx

interface AIPromptGeneratorProps {
  onGenerate: (recipe: Partial<CreateRecipePostData>) => void;
  generating: boolean;
}

export default function AIPromptGenerator({ ... }) {
  // Prompt input
  // AI API call
  // Response parsing
  // Error handling
  // Loading states
}
```

---

### Step 6: Create CreateRecipeForm & Refactor page.tsx (1.5 hours)
**Goal:** Clean orchestration layer

**CreateRecipeForm.tsx** (~200 lines):
```tsx
// Main form logic
// Field validation
// Submission handling
// State management
```

**page.tsx** (~150 lines):
```tsx
// Layout wrapper
// Component composition
// Route handling
// Auth guards (optional)
```

---

## 🎯 Expected Benefits

### Code Quality
- ✅ **Modular:** Each component has single responsibility
- ✅ **Testable:** Components can be unit tested
- ✅ **Reusable:** Ingredients/Steps can be used elsewhere
- ✅ **Maintainable:** Easier to find and fix bugs

### Developer Experience
- ✅ **Faster debugging:** Isolated components
- ✅ **Easier onboarding:** Clear component structure
- ✅ **Better collaboration:** Multiple devs can work on different components

### Performance
- ✅ **Code splitting:** Components can be lazy loaded
- ✅ **Optimized re-renders:** Better state isolation

---

## 📊 Metrics

### Before:
```
Files: 1
Lines: 899
Components: 0 (monolith)
Testability: Low
Maintainability: Low
```

### After:
```
Files: 7
Lines: ~970 (+71 for structure)
Components: 6 (modular)
Testability: High
Maintainability: High
```

**Trade-off:** +71 lines for MUCH better architecture

---

## ⚠️ Risks & Mitigations

### Risk 1: Breaking Existing Functionality
**Mitigation:**
- Extract components one at a time
- Test after each extraction
- Keep original file as reference

### Risk 2: State Management Complexity
**Mitigation:**
- Use props drilling initially (simplest)
- Consider Context if needed
- Document state flow

### Risk 3: Time Overrun
**Mitigation:**
- Start with simple components (Image, Steps)
- MVP first, polish later
- Can pause after each component

---

## ✅ Success Criteria

- [ ] All components extracted
- [ ] Original functionality preserved
- [ ] Build passes (0 errors)
- [ ] Recipe creation still works
- [ ] AI generation still works
- [ ] Image upload still works
- [ ] Form validation still works
- [ ] Code is more readable
- [ ] Components are testable

---

## 🚀 Timeline

| Step | Task | Time | Status |
|------|------|------|--------|
| 1 | Analysis | 1h | ⏳ Not started |
| 2 | ImageUploader | 30min | ⏳ Not started |
| 3 | IngredientInput | 45min | ⏳ Not started |
| 4 | StepEditor | 30min | ⏳ Not started |
| 5 | AIPromptGenerator | 1h | ⏳ Not started |
| 6 | Form + page.tsx | 1.5h | ⏳ Not started |
| 7 | Testing & Polish | 30min | ⏳ Not started |

**Total:** ~5.5 hours

---

## 📝 Commit Strategy

### Commit 1: Extract ImageUploader
```
feat: Extract ImageUploader component from /academy/create

- Created ImageUploader.tsx component
- Moved image upload logic
- Maintained original functionality
- Lines: create/page.tsx (899 → ~850)
```

### Commit 2: Extract IngredientInput
```
feat: Extract IngredientInput component

- Created IngredientInput.tsx
- Nutrition API integration preserved
- Lines: create/page.tsx (~850 → ~700)
```

### Commit 3: Extract StepEditor
```
feat: Extract StepEditor component

- Created StepEditor.tsx
- Simple step management
- Lines: create/page.tsx (~700 → ~580)
```

### Commit 4: Extract AIPromptGenerator
```
feat: Extract AIPromptGenerator component

- Created AIPromptGenerator.tsx
- AI integration isolated
- Lines: create/page.tsx (~580 → ~430)
```

### Commit 5: Final Refactor
```
feat: Complete /academy/create refactor

- Created CreateRecipeForm.tsx
- Refactored page.tsx to orchestrator
- All components integrated
- Build passes, functionality preserved
- Lines: create/page.tsx (~430 → ~150)

BREAKING: Internal structure changed (API unchanged)
```

---

## 🎓 Learning Goals

1. **Component extraction patterns**
2. **State management in React**
3. **API integration in components**
4. **Form handling best practices**
5. **File upload patterns**

---

## 📚 References

### Similar Refactorings:
- Phase 2: Feed/Community merge (component extraction)
- Admin pages: Good component structure examples

### Patterns to Follow:
- **Single Responsibility:** Each component does ONE thing
- **Props Over Context:** Start simple, upgrade if needed
- **Composition Over Inheritance:** Combine small components

---

## 🎯 Ready to Start

**Current Status:**
- ✅ Previous phases complete
- ✅ Architecture stable
- ✅ Build passing
- ✅ No blockers

**Next Action:**
Start Step 1 - Read and analyze `/app/academy/create/page.tsx`

---

**Let's finish the last monolith! 🚀**

**Documentation:** `PHASE_3_PLAN.md`  
**Target Completion:** Same day  
**Confidence:** High (foundation is solid)
