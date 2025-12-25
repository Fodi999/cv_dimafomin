# 🎯 PAGES & DUPLICATES - EXECUTIVE SUMMARY

**Дата:** 25 декабря 2025  
**Всего страниц:** 38  
**Critical issues:** 6 страниц требуют немедленного решения

---

## 📊 Quick Stats

```
✅ REFERENCE:    1 (2.6%)   — Main page эталон
⚠️ PARTIAL:      3 (7.9%)   — Используют PageLayout частично
❌ NO DESIGN:    2 (5.3%)   — Не используют Design System
🔴 DUPLICATES:   4 (10.5%)  — Дубликаты/конфликты
❓ UNKNOWN:      28 (73.7%) — Требуют проверки
```

---

## 🔴 CRITICAL ISSUES (Решить СЕГОДНЯ)

### 1. Profile Duplication - 🔴 HIGHEST PRIORITY

**Проблема:**
```
/profile/[id]          232 строки - Public profile
/academy/user/[id]     274 строки - Academy profile

❌ ДВА API для одного пользователя
❌ ДВА layout
❌ РАЗНЫЕ данные (health vs awards)
❌ Дублирование логики
```

**Решение:**
```
✅ Consolidate to /profile/[id]
✅ Delete /academy/user/[id]
✅ Merge APIs (userApi + academyApi)
✅ Single ProfileView component
```

**Impact:** -200 строк кода, единый источник правды  
**Effort:** 4-6 hours  
**Files:** 2 pages, 2 APIs, 1 component

---

### 2. Academy Create - 🔴 MONOLITH

**Проблема:**
```
/academy/create        900 строк в одном файле!

❌ Монолит
❌ Нет проверки прав
❌ Неясная роль (user vs admin)
```

**Решение:**
```
✅ Split into components:
   - CreateRecipeForm
   - IngredientInput
   - StepEditor
   - AIPromptGenerator
✅ Add auth guards
✅ Reuse in /admin/recipes/create
```

**Impact:** 900 строк → 300 строк + reusability  
**Effort:** 6-8 hours  
**Files:** 1 page → 4 components

---

### 3. Feed vs Community - 🟠 POTENTIAL DUPLICATE

**Проблема:**
```
/academy/feed          256 строк - Global feed
/academy/community     322 строк - Community posts

⚠️ Почти идентичный функционал
⚠️ Оба показывают recipe posts
```

**Решение (требует product decision):**
```
Option A: Merge → /academy/community (tabs: Feed/Trending/Following)
Option B: Split logic → Feed = Personal, Community = Explore

👉 NEEDS DECISION
```

**Impact:** -300 строк (if merged) или унифицированный UI  
**Effort:** 2-4 hours  
**Files:** 2 pages → 1 page (if merged)

---

### 4. Tokens Confusion - 🟡 RENAME NEEDED

**Проблема:**
```
/cheftokens            Token dashboard (неясное название)
/academy/earn-tokens   How to earn guide
/admin/token-bank      Admin control
```

**Решение:**
```
✅ Rename /cheftokens → /profile/tokens
✅ Create shared components:
   - TokenBalance
   - TokenHistory
   - TokenMission
```

**Impact:** Consistency + clear naming  
**Effort:** 3-4 hours  
**Files:** 1 page rename + 3 components

---

## 📋 Immediate Action Plan

### TODAY (6 hours)
1. ✅ **DECIDE:** Profile consolidation strategy
   - Delete `/academy/user/[id]` or redirect?
   - Merge APIs: userApi + academyApi
   
2. ✅ **DECIDE:** Feed vs Community
   - Merge or split?
   - Product owner decision needed

3. ✅ **START:** Academy create refactor
   - Extract CreateRecipeForm component
   - Extract IngredientInput component

### THIS WEEK (14 hours)
4. ✅ **COMPLETE:** Profile migration
   - Implement chosen strategy
   - Test all profile routes
   - Update navigation

5. ✅ **COMPLETE:** Academy create
   - All components extracted
   - Auth guards added
   - Reused in admin

6. ✅ **IMPLEMENT:** Feed/Community decision
   - Merge or document differences
   - Unify UI components

7. ✅ **RENAME:** /cheftokens → /profile/tokens
   - Update routes
   - Create shared components

---

## 🎯 Expected Outcomes

### Code Reduction:
```
Before: ~2000 строк дублирований
After:  ~800 строк + shared components

Reduction: 60%
```

### Architecture Clarity:
```
Before:
- 2 profile systems (confused)
- 900-line monolith
- Unclear token pages
- Feed/Community duplication

After:
- 1 profile system (clear)
- Component-based (maintainable)
- Clear token hierarchy
- Unified or documented social
```

### Maintenance:
```
Before: Update profile → 2 places to change
After:  Update profile → 1 place

Time saved: 50% on future features
```

---

## 🚨 Blockers & Decisions Needed

### 🔴 IMMEDIATE DECISIONS:

1. **Profile Strategy** (MUST DECIDE TODAY)
   - [ ] Option A: Delete `/academy/user/[id]` entirely
   - [ ] Option B: Redirect to `/profile/[id]`
   
2. **Feed vs Community** (MUST DECIDE THIS WEEK)
   - [ ] Option A: Merge into `/academy/community`
   - [ ] Option B: Keep separate, document differences

### 🟡 PRODUCT QUESTIONS:

1. Who can create recipes in `/academy/create`?
   - [ ] Any user (UGC)
   - [ ] Only verified chefs
   - [ ] Admin only
   
2. What's the difference between Feed and Community?
   - [ ] Feed = Personal, Community = Global
   - [ ] No difference (merge them)

---

## 📚 Documentation

### Created:
- ✅ `PAGES_AUDIT.md` — All 38 pages analyzed
- ✅ `DUPLICATES_ANALYSIS.md` — Detailed duplicate analysis
- ✅ `DESIGN_SYSTEM.md` — Style guide (complete)
- ✅ `DESIGN_SYSTEM_QUICK.md` — Quick reference

### To Update:
- [ ] `README.md` — Add architecture decisions
- [ ] `ARCHITECTURE.md` — Document routing strategy
- [ ] Update navigation after changes

---

## 🎉 Success Metrics

After completion:

✅ **Single profile system** (not two)  
✅ **Component reusability** (60% less code)  
✅ **Clear architecture** (documented)  
✅ **Consistent UX** (Design System applied)  
✅ **Faster development** (shared components)  

---

## 📞 Next Steps

### Right Now:
1. ☎️ **Call meeting:** Discuss profile strategy
2. ☎️ **Product decision:** Feed vs Community
3. 💻 **Start coding:** Academy create refactor

### This Week:
4. 🔨 **Implement decisions:** Profile + Feed
5. 🧪 **Test thoroughly:** All routes
6. 📝 **Update docs:** Architecture decisions

---

**Priority:** 🔴 CRITICAL  
**Total Effort:** ~20 hours  
**Impact:** 60% code reduction + Clear architecture  
**Timeline:** Complete by end of week

**Next Review:** После resolution критичных дубликатов
