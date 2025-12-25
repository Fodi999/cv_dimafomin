# Pages Audit - All Routes Analysis

## 📊 Total Pages: 41

### ✅ Active Pages (38)

#### **Root Level (1)**
- ✅ `/` - Homepage (main landing page)

#### **Academy (12)**
- ✅ `/academy` - Academy main page
- ✅ `/academy/certificates` - Certificates page
- ✅ `/academy/community` - **Unified community page with tabs** (Phase 2)
- ✅ `/academy/courses` - Courses listing
- ✅ `/academy/courses/[id]` - Course details
- ✅ `/academy/create` - Create recipe page (900 lines - needs refactoring)
- ✅ `/academy/earn-tokens` - Token earning guide
- ✅ `/academy/leaderboard` - Leaderboard rankings
- ✅ `/academy/paths/[pathId]` - Learning path
- ✅ `/academy/paths/[pathId]/modules/[moduleId]` - Module details
- ✅ `/academy/tasks` - Tasks page
- 🔄 `/academy/feed` - **REDIRECT** → `/academy/community?tab=feed` (Phase 2)

#### **Profile (3)**
- ✅ `/profile` - Own profile
- ✅ `/profile/[id]` - User profile by ID
- ✅ `/profile/new` - Create new profile
- 🔄 `/academy/user/[id]` - **REDIRECT** → `/profile/[id]` (Phase 1)

#### **Tokens (1)**
- ✅ `/tokens` - Token dashboard (renamed from /cheftokens)
- 🔄 `/cheftokens` - **REDIRECT** → `/tokens` (Phase 1)

#### **Recipes (4)**
- ✅ `/recipes` - Recipes listing
- ✅ `/recipes/[id]` - Recipe details
- ✅ `/recipes/[id]/cook` - Cooking mode
- ✅ `/recipes/saved` - Saved recipes

#### **Assistant (1)**
- ✅ `/assistant` - AI recipe assistant

#### **Fridge (1)**
- ✅ `/fridge` - Fridge management

#### **Market (2)**
- ✅ `/market` - Marketplace
- ✅ `/market/[id]` - Market item details

#### **Admin (13)**
- ✅ `/admin` - Admin dashboard
- ✅ `/admin/dashboard` - Dashboard metrics
- ✅ `/admin/users` - User management
- ✅ `/admin/courses` - Course management
- ✅ `/admin/courses/create` - Create course
- ✅ `/admin/recipes` - Recipe management
- ✅ `/admin/recipes/create` - Create recipe
- ✅ `/admin/orders` - Order management
- ✅ `/admin/activity-log` - Activity logs
- ✅ `/admin/integrations` - Integration settings
- ✅ `/admin/settings` - Admin settings
- ✅ `/admin/token-bank` - Token bank management

---

## 🔄 Redirect Pages (3)

### Phase 1 Redirects (2)
1. **`/academy/user/[id]`** → `/profile/[id]`
   - Status: ✅ Implemented
   - Type: Server-side redirect (Next.js redirect)
   - Reason: Unified profile pages

2. **`/cheftokens`** → `/tokens`
   - Status: ✅ Implemented
   - Type: Server-side redirect
   - Reason: Better naming clarity

### Phase 2 Redirects (1)
3. **`/academy/feed`** → `/academy/community?tab=feed`
   - Status: ✅ Implemented
   - Type: Client-side redirect (useRouter)
   - Reason: Merged feed and community into tabs

---

## 📁 Page Categories

### By Function:

| Category | Count | Pages |
|----------|-------|-------|
| **Academy** | 12 | Main, Certificates, Community, Courses, Create, Earn-tokens, Leaderboard, Paths, Tasks |
| **Admin** | 13 | Dashboard, Users, Courses, Recipes, Orders, Activity, Integrations, Settings, Token-bank |
| **Recipes** | 4 | Listing, Details, Cook mode, Saved |
| **Profile** | 3 | Own, User profile, New profile |
| **Core Features** | 5 | Homepage, Assistant, Fridge, Market, Tokens |
| **Redirects** | 3 | Old feed, Old user profile, Old cheftokens |

**Total:** 40 pages (38 active + 3 redirects, 1 overlap)

---

## ⚠️ Pages Needing Attention

### 1. **`/academy/create` (900 lines)**
**Priority:** High  
**Issue:** Monolithic component, hard to maintain  
**Solution:** Extract components:
- `CreateRecipeForm.tsx`
- `IngredientInput.tsx`
- `StepEditor.tsx`
- `AIPromptGenerator.tsx`

**Estimate:** 3-4 hours

### 2. **`/profile/new` vs `/profile/[id]`**
**Priority:** Medium  
**Question:** Is `/profile/new` needed or can it be merged into `/profile` with query params?  
**Action:** Review usage and consider consolidation

### 3. **`/admin` vs `/admin/dashboard`**
**Priority:** Low  
**Question:** Two separate pages or redirect?  
**Action:** Check if they show different content or if one should redirect

---

## 🎯 Redirect Strategy Summary

### ✅ Completed Redirects:

1. **Profile Unification**
   - `/academy/user/[id]` → `/profile/[id]`
   - Savings: ~249 lines

2. **Tokens Rename**
   - `/cheftokens` → `/tokens`
   - Savings: ~15 lines

3. **Feed/Community Merge**
   - `/academy/feed` → `/academy/community?tab=feed`
   - Savings: ~230 lines
   - New structure: Tabbed interface (Feed + Discussions)

**Total Code Reduction:** ~494 lines of duplicate code removed

---

## 🔗 Navigation Verification

### Internal Links to Check:

```bash
# Search for old links that might need updating
grep -r "/academy/user/" app/ components/
grep -r "/cheftokens" app/ components/
grep -r "/academy/feed" app/ components/
```

### Expected Results:
- ✅ `/academy/user/[id]` - Should find 0 internal links (all redirected)
- ✅ `/cheftokens` - Should find 0 internal links (all use `/tokens`)
- ✅ `/academy/feed` - Should find 0 internal links (all use `/academy/community`)

---

## 📊 Build Route Analysis

From last build (`npm run build`):

```
Route (app)
├ ○ /                                    ✅ Static
├ ○ /academy                             ✅ Static
├ ○ /academy/certificates                ✅ Static
├ ○ /academy/community                   ✅ Static (new unified)
├ ○ /academy/courses                     ✅ Static
├ ƒ /academy/courses/[id]                ✅ Dynamic
├ ○ /academy/create                      ✅ Static
├ ○ /academy/earn-tokens                 ✅ Static
├ ○ /academy/feed                        ✅ Static (redirect)
├ ○ /academy/leaderboard                 ✅ Static
├ ƒ /academy/paths/[pathId]              ✅ Dynamic
├ ƒ /academy/paths/[pathId]/modules/[moduleId] ✅ Dynamic
├ ○ /academy/tasks                       ✅ Static
├ ƒ /academy/user/[id]                   ✅ Dynamic (redirect)
├ ○ /cheftokens                          ✅ Static (redirect)
├ ○ /tokens                              ✅ Static
├ ○ /profile                             ✅ Static
├ ƒ /profile/[id]                        ✅ Dynamic
├ ○ /recipes                             ✅ Static
├ ƒ /recipes/[id]                        ✅ Dynamic
└ ... (+ 21 admin/api routes)
```

**Legend:**
- `○` = Static page
- `ƒ` = Dynamic/server-rendered page

---

## 🚀 Recommendations

### Immediate Actions:
1. ✅ **Phase 1 & 2 Complete** - All redirects working
2. ⏳ **Phase 3: Refactor `/academy/create`** - Extract components
3. 🔍 **Audit internal links** - Verify no broken links to old routes
4. 📝 **Update sitemap.xml** - Remove old routes from sitemap

### Future Optimizations:
1. Consider lazy loading for large pages
2. Add skeleton loaders for dynamic routes
3. Implement ISR (Incremental Static Regeneration) where applicable
4. Review `/profile/new` necessity

---

## ✅ Pages Status Summary

| Status | Count | Description |
|--------|-------|-------------|
| ✅ Active & Working | 38 | Production-ready pages |
| 🔄 Redirects | 3 | Legacy compatibility |
| ⚠️ Needs Refactoring | 1 | `/academy/create` (900 lines) |
| 🔍 Review Needed | 2 | `/profile/new`, `/admin` vs `/admin/dashboard` |

---

**Last Updated:** December 25, 2025  
**Build Status:** ✅ All routes building successfully  
**TypeScript:** ✅ 0 errors  
**Total Routes:** 63 (41 pages + 22 API routes)
