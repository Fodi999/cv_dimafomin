# 🔒 Architectural Contract: cook_now Scenario

**Version:** 1.0  
**Last Updated:** 2026-01-16  
**Status:** 🟢 Active & Enforced  
**Type:** Canonical Rule (DO NOT MODIFY without approval)

---

## 📜 Canonical Rule

> **The `cook_now` scenario ALWAYS uses deterministic rules-based matching via `GET /api/recipes/match` and NEVER uses AI recommendations.**

This is an architectural contract, not a temporary implementation detail.

---

## 🎯 What is cook_now?

**User Intent:** "Що можу приготувати зараз з того, що є в холодильнику?"  
**English:** "What can I cook right now with what I have in the fridge?"

**Expected Behavior:**
- Show instant recipes from existing catalog
- Prioritize recipes with highest ingredient coverage
- Filter out recipes already viewed by user
- NO AI generation, NO delays, NO extra costs

---

## 🔧 Technical Implementation

### Primary Endpoint
```
GET /api/recipes/match
```

**Parameters (COOK_NOW_PARAMS):**
```typescript
const COOK_NOW_PARAMS = {
  limit: 20,           // Top 20 matches for rotation
  sort: 'coverage',    // Highest ingredient coverage first
  order: 'desc',       // Best matches at the top
  minCoverage: 0,      // Allow any match (filter frontend-side)
} as const;
```

### Forbidden Endpoint
```
❌ POST /api/recipes/recommendations
```

**Why forbidden?**
- AI recommendations are 100x more expensive
- User expects instant results
- Catalog recipes already exist

---

## 🧠 Why Rules-Based, Not AI?

| Aspect | Rules-Based (✅) | AI-Powered (❌) |
|--------|------------------|-----------------|
| **Latency** | 50-100ms | 2-5s |
| **Cost** | $0.0001/request | $0.01/request |
| **Determinism** | 100% consistent | Varies by run |
| **Catalog Use** | Uses existing recipes | Generates new ones |
| **User Expectation** | "Show me what exists" | "Create something new" |
| **Economy** | Free (catalog query) | Expensive (LLM tokens) |

---

## 📊 Selection Logic (Frontend)

When multiple recipes match, select **ONE CARD AT A TIME** using this priority:

1. **coverage DESC** → Максимальное использование холодильника
2. **score DESC** → Лучший общий балл рецепта
3. **usedCount DESC** → Больше ингредиентов из холодильника
4. **cookingTime ASC** → Быстрее приготовить

**Example:**
- Яичница (3 eggs, 100% coverage, 5 min) → **WINS**
- Борщ (12 ingredients, 60% coverage, 90 min) → Later

---

## 🎨 UX Contract

### If `count > 0` (recipes found)
✅ **DO:** Show recipe cards from catalog  
❌ **DON'T:** Call AI  
❌ **DON'T:** Show "no recipes" message  
❌ **DON'T:** Ask user to generate

### If `count === 0` (no recipes match)
✅ **DO:** Show `AIMessageCard` with code: `NO_RECIPES_FOR_FRIDGE`  
✅ **DO:** Suggest adding products or exploring catalog  
❌ **DON'T:** Automatically call AI (user must explicitly request)

### If all recipes viewed
✅ **DO:** Show `AIMessageCard` with code: `ALL_RECIPES_VIEWED`  
✅ **DO:** Offer "Start over" button to reset viewed list

---

## 🔒 Enforcement

### Code Location
- **File:** `app/(user)/assistant/page.tsx`
- **Function:** `handleAnalyze(goal: AIGoal)`
- **Lines:** ~20-60 (architectural comment block)
- **Lines:** ~685-710 (implementation)

### Contract Verification
```typescript
if (goal === "cook_now") {
  // ✅ MUST use rules-based matching
  await loadRecipeMatches(); // Uses GET /api/recipes/match
  
  // ❌ MUST NOT call AI
  // await runAI(goal); // FORBIDDEN
  
  return; // Stop here, never proceed to AI
}
```

### Architectural Comments
Look for blocks marked with:
```typescript
// ═══════════════════════════════════════════════════════════════════════════
// 🔒 ARCHITECTURAL CONTRACT: cook_now Scenario
// ═══════════════════════════════════════════════════════════════════════════
```

---

## 📈 Strategic Context

### Why This Matters
You officially closed the most complex product scenario:

> **"AI as decision dispatcher, not content generator"**

### Industry Pattern (Wrong Way)
1. Start with AI chat
2. Suffer from costs ($10K/month)
3. Try to add rules-based fallbacks
4. Fail due to technical debt

### Your Pattern (Right Way) ✅
1. Start with rules-based matching (cheap, fast)
2. Add AI only where truly needed (empty catalog)
3. Clear separation of concerns
4. Economy under control from day 1

---

## 🚀 Future Scenarios (Recommended Order)

### Scenario 2: `expiring_soon`
**Rule:** "Що псується сьогодні-завтра?"

**Implementation:**
```typescript
if (goal === "expiring_soon") {
  return api.get("/api/recipes/match", {
    params: {
      prioritizeExpiring: true,
      maxDaysToExpiry: 2,
      limit: 20,
    }
  });
}
```

### Scenario 3: `save_money`
**Rule:** "Максимально використати холодильник"

**Implementation:**
```typescript
if (goal === "save_money") {
  return api.get("/api/recipes/match", {
    params: {
      sort: 'usedValue',
      order: 'desc',
      minCoverage: 50,
    }
  });
}
```

### Scenario 4: `quick_meal`
**Rule:** "Швидкий рецепт до 30 хв"

**Implementation:**
```typescript
if (goal === "quick_meal") {
  return api.get("/api/recipes/match", {
    params: {
      maxTimeMinutes: 30,
      sort: 'cookingTime',
      order: 'asc',
    }
  });
}
```

---

## 🧪 Testing Contract

### Manual Test
1. Open `/assistant` page
2. Click "Що можу приготувати зараз?"
3. **Verify:** Console shows `GET /api/recipes/match`
4. **Verify:** Console shows `🚫 AI fallback: DISABLED`
5. **Verify:** Recipe appears in <1 second
6. **Verify:** No AI tokens consumed

### Automated Test (TODO)
```typescript
describe('cook_now contract', () => {
  it('MUST use GET /api/recipes/match', async () => {
    const spy = jest.spyOn(recipeMatchingApi, 'getRecipeMatches');
    await handleAnalyze('cook_now');
    expect(spy).toHaveBeenCalledWith(COOK_NOW_PARAMS, token);
  });
  
  it('MUST NOT use POST /api/recipes/recommendations', async () => {
    const spy = jest.spyOn(recipeMatchingApi, 'getRecommendation');
    await handleAnalyze('cook_now');
    expect(spy).not.toHaveBeenCalled();
  });
  
  it('MUST NOT call AI when recipes found', async () => {
    mockRecipeMatch({ count: 5, recipes: [...] });
    const spy = jest.spyOn(aiApi, 'analyze');
    await handleAnalyze('cook_now');
    expect(spy).not.toHaveBeenCalled();
  });
});
```

---

## 🎓 When to Use AI

AI should ONLY be used when:

1. **Empty Catalog:** `GET /api/recipes/match` returns `count === 0`
2. **Explicit Request:** User clicks "Generate new recipe" button
3. **Exploration Mode:** User wants creative suggestions beyond catalog

**Example:**
```typescript
const result = await recipeMatchingApi.getRecipeMatches(params, token);

if (result.count === 0) {
  // ✅ NOW you can offer AI generation
  showMessage("В каталозі немає рецептів. Згенерувати новий?");
  
  if (userClicksYes) {
    await aiApi.generateRecipe(fridgeItems);
  }
}
```

---

## 📝 Change Log

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2026-01-16 | 1.0 | Initial contract established | System |

---

## 🔐 Approval Required

Any changes to this contract require:
- [ ] Product Owner approval
- [ ] Technical Lead review
- [ ] Performance impact analysis
- [ ] Cost analysis (AI tokens vs rules)
- [ ] UX flow validation

---

## 📚 Related Documentation

- `docs/AI_RECIPE_WORKFLOW.md` - Overall AI strategy
- `docs/RECIPES_FILTERS.md` - Recipe matching logic
- `lib/api/recipe-matching.ts` - API implementation
- `app/(user)/assistant/page.tsx` - Frontend implementation

---

## ✅ Status Check

- [x] Contract defined
- [x] Implementation complete
- [x] Architectural comments added
- [x] Constants defined (COOK_NOW_PARAMS)
- [ ] Automated tests written
- [ ] Performance monitoring enabled
- [ ] Cost tracking dashboard

---

**Last Reviewed:** 2026-01-16  
**Next Review:** 2026-02-16  
**Owner:** Engineering Team  
**Escalation:** Product + Engineering Leadership
