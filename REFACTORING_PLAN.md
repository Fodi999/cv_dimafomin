# 🎯 REFACTORING PLAN - Implementation

**Дата:** 25 декабря 2025  
**Статус:** Ready to implement  
**Приоритет:** 🔴 CRITICAL

---

## ✅ DECISIONS MADE

### 1. Profile Strategy: **Option B - Redirect**
```
/academy/user/[id] → REDIRECT → /profile/[id]

✅ Quick implementation (1-2 hours)
✅ Keep both APIs separate initially
✅ Zero data migration
✅ Gradual consolidation later
```

### 2. Feed/Community Strategy: **Option A - Merge**
```
/academy/feed + /academy/community → /academy/community

✅ Single page with tabs: All | Trending | Following
✅ Reduce code duplication
✅ Better UX (one place for all social)
```

### 3. Tokens Strategy: **Rename**
```
/cheftokens → /tokens

✅ Clear naming
✅ Consistent with profile routes
✅ Easy to find
```

---

## 📋 Implementation Plan

### Phase 1: Quick Wins (2-3 hours) 🚀

#### Task 1.1: Redirect Academy User to Profile
**Files to change:**
- [ ] Create `/app/academy/user/[id]/page.tsx` with redirect
- [ ] Update navigation links (if any)
- [ ] Test redirect flow

**Code:**
```tsx
// /app/academy/user/[id]/page.tsx
import { redirect } from 'next/navigation';

export default function AcademyUserRedirect({ 
  params 
}: { 
  params: { id: string } 
}) {
  redirect(`/profile/${params.id}`);
}
```

**Impact:** -274 lines of duplicate code

---

#### Task 1.2: Rename ChefTokens to Tokens
**Files to change:**
- [ ] Rename folder: `/app/cheftokens` → `/app/tokens`
- [ ] Update navigation components
- [ ] Update sitemap.ts
- [ ] Update any internal links

**Commands:**
```bash
mv app/cheftokens app/tokens
```

**Impact:** Clearer naming convention

---

### Phase 2: Merge Feed & Community (4-5 hours) 🔄

#### Task 2.1: Create Unified Community Page
**Files to create:**
```
/app/academy/community/page.tsx (enhanced)
/components/academy/RecipePostCard.tsx (extracted)
/components/academy/FeedFilter.tsx (new)
```

**Features:**
- Tab navigation: All | Trending | Following
- Shared RecipePostCard component
- Search functionality
- Filter state management

**Code structure:**
```tsx
// /app/academy/community/page.tsx
export default function CommunityPage() {
  const [filter, setFilter] = useState<'all' | 'trending' | 'following'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <PageLayout>
      <PageHeader>Community</PageHeader>
      
      <FeedFilter 
        filter={filter} 
        onFilterChange={setFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <RecipePostList 
        filter={filter} 
        searchQuery={searchQuery} 
      />
    </PageLayout>
  );
}
```

---

#### Task 2.2: Extract Shared Components
**Components to create:**

1. **RecipePostCard** (reusable)
   - Used in community, profile, search results
   - Props: post, showAuthor, onLike, onComment
   
2. **FeedFilter** (reusable)
   - Tab navigation
   - Search input
   - Sort options

3. **RecipePostList** (container)
   - Handles loading/error states
   - Pagination
   - Empty state

---

#### Task 2.3: Delete Old Feed Page
**Files to delete:**
- [ ] `/app/academy/feed/page.tsx`
- [ ] Update sitemap.ts
- [ ] Redirect `/academy/feed` → `/academy/community`

**Code:**
```tsx
// /app/academy/feed/page.tsx
import { redirect } from 'next/navigation';

export default function FeedRedirect() {
  redirect('/academy/community');
}
```

**Impact:** -256 lines of duplicate code

---

### Phase 3: Academy Create Refactor (6-8 hours) 🏗️

#### Task 3.1: Extract CreateRecipeForm Component
**File:** `/components/academy/CreateRecipeForm.tsx`

**Responsibilities:**
- Main form layout
- Title, description inputs
- Image upload
- Submit logic

**Size:** ~200 lines

---

#### Task 3.2: Extract IngredientInput Component
**File:** `/components/academy/IngredientInput.tsx`

**Responsibilities:**
- Single ingredient input
- Nutrition lookup
- Amount/unit selection
- Add/remove actions

**Size:** ~150 lines  
**Reusable:** Yes (use in recipes, fridge, shopping)

---

#### Task 3.3: Extract StepEditor Component
**File:** `/components/academy/StepEditor.tsx`

**Responsibilities:**
- Recipe steps list
- Step reordering
- Add/edit/delete steps
- Step duration input

**Size:** ~120 lines  
**Reusable:** Yes (use in recipes, admin)

---

#### Task 3.4: Extract AIPromptGenerator Component
**File:** `/components/academy/AIPromptGenerator.tsx`

**Responsibilities:**
- AI prompt input
- Generate recipe from prompt
- Parse AI response
- Fill form with AI data

**Size:** ~150 lines  
**Reusable:** Yes (use in assistant, recipes)

---

#### Task 3.5: Refactor Main Page
**File:** `/app/academy/create/page.tsx`

**New structure:**
```tsx
export default function CreateRecipePage() {
  return (
    <PageLayout>
      <PageHeader>Create Recipe</PageHeader>
      
      <Section>
        <AIPromptGenerator onGenerate={handleAIGenerate} />
      </Section>
      
      <Section>
        <CreateRecipeForm
          initialData={aiGeneratedData}
          onSubmit={handleSubmit}
        >
          <IngredientInput />
          <StepEditor />
        </CreateRecipeForm>
      </Section>
    </PageLayout>
  );
}
```

**Size:** 900 lines → ~300 lines  
**Impact:** 4 reusable components created

---

## 🎯 Expected Results

### Code Metrics:
```
Before:
- /academy/user/[id]:  274 lines (duplicate)
- /academy/feed:       256 lines (duplicate)
- /academy/create:     900 lines (monolith)
- /cheftokens:         unclear naming
Total:                 1430+ lines of issues

After:
- Redirect:            ~10 lines
- /academy/community:  ~200 lines (merged)
- CreateRecipeForm:    ~200 lines
- IngredientInput:     ~150 lines
- StepEditor:          ~120 lines
- AIPromptGenerator:   ~150 lines
- /tokens:             clear naming
Total:                 ~830 lines + reusability

Reduction: 42% + 4 reusable components
```

### Architecture Benefits:
✅ Single community page (not two)  
✅ Clear profile routing (redirect)  
✅ Reusable recipe components  
✅ Consistent naming (/tokens)  
✅ Maintainable structure  

---

## 📅 Timeline

### Day 1 (Today) - Quick Wins
- **2-3 hours**
- ✅ Profile redirect
- ✅ Tokens rename
- ✅ Test both changes

### Day 2 - Feed/Community Merge
- **4-5 hours**
- ✅ Extract RecipePostCard
- ✅ Merge pages
- ✅ Add tab navigation
- ✅ Delete old feed

### Day 3-4 - Academy Create Refactor
- **6-8 hours**
- ✅ Extract 4 components
- ✅ Refactor main page
- ✅ Add auth guards
- ✅ Test all flows

### Day 5 - Testing & Documentation
- **2-3 hours**
- ✅ E2E testing
- ✅ Update docs
- ✅ Deploy

**Total:** 14-19 hours over 5 days

---

## 🚨 Testing Checklist

### Profile Redirect:
- [ ] `/academy/user/123` redirects to `/profile/123`
- [ ] No 404 errors
- [ ] Navigation works
- [ ] SEO redirects (301)

### Tokens Rename:
- [ ] `/tokens` loads correctly
- [ ] Navigation updated
- [ ] Sitemap updated
- [ ] Old `/cheftokens` redirects

### Community Merge:
- [ ] All tab filters work
- [ ] Search works
- [ ] Posts load correctly
- [ ] `/academy/feed` redirects to `/academy/community`
- [ ] No duplicate posts

### Create Refactor:
- [ ] All 4 components work independently
- [ ] Form submission works
- [ ] AI generation works
- [ ] Ingredient lookup works
- [ ] Step reordering works
- [ ] Image upload works

---

## 📝 Documentation Updates

### Files to update:
- [ ] `PAGES_AUDIT.md` - Mark resolved issues
- [ ] `DUPLICATES_ANALYSIS.md` - Document solutions
- [ ] `PAGES_SUMMARY.md` - Update metrics
- [ ] `README.md` - Update architecture
- [ ] `ARCHITECTURE.md` - Document routing decisions

---

## 🎉 Success Criteria

After completion:

✅ **Zero duplicate pages**  
✅ **Clear routing structure**  
✅ **4 reusable components created**  
✅ **42% code reduction**  
✅ **All tests passing**  
✅ **Documentation updated**  

---

**Next Step:** Start with Task 1.1 - Profile Redirect

**Ready to implement?** 🚀
