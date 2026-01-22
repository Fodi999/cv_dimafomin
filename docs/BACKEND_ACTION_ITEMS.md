# 🔧 Backend Action Items — Kitchen Dashboard

**Priority:** 🔴 CRITICAL (Blocks Deployment)  
**Date:** 22 января 2026

---

## 📋 Required Backend Fix

### Issue: Auto-Complete Status on Menu Save

#### Problem
```
When user adds recipe to menu:
  POST /api/user/recipes/save → Backend creates MenuItem
  
Expected: status = "planned"
Actual:   status = "completed" ❌
```

#### Root Cause
The `POST /api/user/recipes/save` endpoint (or downstream logic) creates MenuItem with wrong status.

#### Impact
```
User adds recipe → appears as already "done"
Instead of → appears as "to cook"

Result: Kitchen Dashboard doesn't work (completed = 1, planned = 0)
```

---

## 🎯 What Needs to Change

### Current Behavior
```go
// Somewhere in backend when handling POST /api/user/recipes/save
func SaveRecipe(userId, recipeId) {
  item := MenuItem{
    UserID: userId,
    RecipeID: recipeId,
    Status: "completed"     // ❌ WRONG
    PlannedFor: TODAY,
    CreatedAt: NOW(),
  }
  db.Save(item)
}
```

### Required Fix
```go
// After fix:
func SaveRecipe(userId, recipeId) {
  item := MenuItem{
    UserID: userId,
    RecipeID: recipeId,
    Status: "planned"       // ✅ CORRECT
    PlannedFor: TODAY,
    CreatedAt: NOW(),
  }
  db.Save(item)
}
```

---

## 📍 Location (Best Guess)

### API Endpoint
```
POST /api/user/recipes/save
```

### Backend Code
- Look for: `MenuItem` creation
- Search for: `status: "completed"` or `Status: "completed"`
- In context of: Recipe saving

### Possible Filenames
```
• handlers/menu.go
• handlers/recipes.go
• services/menu_service.go
• models/menu_item.go
• controllers/menu_controller.go
```

---

## ✅ Implementation Checklist

### Step 1: Find the Code
```
[ ] Locate POST /api/user/recipes/save endpoint
[ ] Find where MenuItem is created
[ ] Identify where status is set
```

### Step 2: Change Status
```
[ ] Change: status = "completed"
[ ] To:     status = "planned"
```

### Step 3: Verify Logic
```
[ ] Only this endpoint needs change? (or does create menu also?)
[ ] Initial status should always be "planned"
[ ] No other place sets "completed" on new items?
```

### Step 4: Test Locally
```
[ ] Start backend locally
[ ] POST /api/user/recipes/save with valid recipe ID
[ ] GET /api/menu/today
[ ] Verify status = "planned"
```

### Step 5: Deploy
```
[ ] Push changes
[ ] Merge to main
[ ] Deploy to production
[ ] Verify on staging/prod
```

---

## 📡 API Verification

### Before Fix
```bash
# 1. Add recipe to menu
curl -X POST http://localhost:8080/api/user/recipes/save \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"recipeId": "abc123"}'

# Response should be:
# ✅ 200 OK

# 2. Get today's menu
curl http://localhost:8080/api/menu/today \
  -H "Authorization: Bearer {token}"

# Expected (AFTER FIX):
# [
#   {
#     "id": "menu-456",
#     "status": "planned",        ← ✅ Should be "planned" (not "completed")
#     "recipe": { "id": "abc123", ... }
#   }
# ]
```

### After Fix — Expected Response
```json
{
  "id": "uuid-of-menu-item",
  "status": "planned",
  "planned_for": "2026-01-22",
  "created_at": "2026-01-22T10:00:00Z",
  "started_cooking_at": null,
  "completed_at": null,
  "servings": 2,
  "recipe": {
    "id": "recipe-uuid",
    "title": "Борщ",
    "image_url": "...",
    "cook_time": 45,
    "servings": 2
  }
}
```

---

## 🧪 Post-Fix Testing

### Test Scenario 1: Add Recipe
```
1. Call: POST /api/user/recipes/save
2. Wait for response
3. Call: GET /api/menu/today
4. Verify: status = "planned"
   
Expected Result: ✅ PASS
```

### Test Scenario 2: Start Cooking
```
1. Add recipe (status = "planned")
2. Call: POST /api/menu/{id}/start
3. Call: GET /api/menu/today
4. Verify: status = "cooking"
   
Expected Result: ✅ PASS
```

### Test Scenario 3: Complete Cooking
```
1. Start cooking (status = "cooking")
2. Call: POST /api/menu/{id}/complete
3. Call: GET /api/menu/today
4. Verify: status = "completed"
   
Expected Result: ✅ PASS
```

### Test Scenario 4: Multiple Items
```
1. Add 3 recipes
   - Item 1: status = "planned"
   - Item 2: status = "planned"
   - Item 3: status = "planned"

2. Start Item 1:
   - Item 1: status = "cooking"
   - Item 2: status = "planned"
   - Item 3: status = "planned"

3. Complete Item 1:
   - Item 1: status = "completed"
   - Item 2: status = "planned"
   - Item 3: status = "planned"
   
Expected Result: ✅ PASS (all statuses correct)
```

---

## 📝 Notes for Backend Developer

### Why This Matters
```
The Kitchen Dashboard frontend expects this workflow:

1. Add recipe    → status: "planned"  ← Entry point
2. Start cooking → status: "cooking"
3. Finish        → status: "completed"

If (1) creates "completed" instead of "planned",
the entire workflow is broken.
```

### No Other Changes Needed
```
Frontend is already:
✅ Calling the right endpoints
✅ Handling responses correctly
✅ Filtering by status

Only the initial status value is wrong.
```

### Minimal Fix
```
This should be a 1-2 line change:
- Find where status is set to "completed"
- Change to "planned"
- Test
- Deploy

Estimated time: 5-10 minutes
```

---

## 🔍 How We Found This

### Frontend Logs
```
Kitchen Dashboard stats:
  "In Queue": 0
  "Cooking": 0
  "Completed": 1

But backend data:
  "id": "menu-item-456",
  "status": "completed",  ← ❌ Should be "planned"
  "recipe": { ... }
```

### Console Error Chain
```
1. User clicks ❤️ "Add to menu"
2. POST /api/user/recipes/save → 200 OK
3. Toast: "Recipe added!"
4. User opens /recipes (Kitchen Dashboard)
5. GET /api/menu/today → Returns 1 item
6. But: status = "completed" (not "planned")
7. So item appears in wrong section
```

### Root Cause Analysis
```
Frontend filtering:
  const planned = items.filter(i => i.status === "planned")
  const completed = items.filter(i => i.status === "completed")

Backend returning:
  { status: "completed", ... }

Result:
  planned.length = 0 ❌
  completed.length = 1 ❌

Should be:
  planned.length = 1 ✅
  completed.length = 0 ✅
```

---

## 📞 Communication

### Frontend Team Says:
> "Our code is correct. Backend is returning wrong status. Need to fix initial status to 'planned' not 'completed'."

### Proof
```
✅ Console logs show correct filtering logic
✅ Component renders correct sections
✅ Transitions (cooking → completed) work
✅ Only initial status is wrong
```

---

## ⏰ Timeline

### Now
```
⏳ Backend developer fixes status value
```

### After Fix (Same Day)
```
1. Deploy backend fix to staging
2. Frontend team runs test scenarios
3. If all pass → Deploy to production
```

### Estimate
```
Fix: 5-10 minutes
Test: 10-15 minutes
Deploy: 5 minutes
Total: 30 minutes
```

---

## 📋 Sign-Off Checklist

After fix is deployed, verify:

```
[ ] GET /api/menu/today returns status: "planned"
[ ] POST /api/menu/{id}/start changes status to "cooking"
[ ] POST /api/menu/{id}/complete changes status to "completed"
[ ] Multiple items work correctly
[ ] Frontend kitchen dashboard shows items in right sections
[ ] No console errors
[ ] No network errors
```

---

## 🎯 Summary

**What:** Backend creates MenuItem with wrong initial status  
**Fix:** Change `status: "completed"` to `status: "planned"`  
**Time:** ~5-10 minutes to fix & deploy  
**Impact:** Unblocks Kitchen Dashboard deployment  

**After this fix → Frontend is production-ready!**

---

**Created:** 22 января 2026  
**Priority:** 🔴 CRITICAL  
**Blocker For:** Kitchen Dashboard production deployment
