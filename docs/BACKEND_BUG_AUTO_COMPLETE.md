# 🐛 Backend Bug: Auto-Complete Status on Menu Save

## 📋 Symptom

When adding recipe to menu:
1. Frontend: `POST /api/user/recipes/save` (Add to menu)
2. Backend responds with recipe added
3. Frontend: `GET /api/menu/today` (Fetch today's menu)
4. **❌ Response contains the recipe with `status: "completed"` instead of `"planned"`**

Expected flow:
```
Add → planned → (user clicks button) → cooking → (user clicks button) → completed
```

Actual flow:
```
Add → completed  ❌
```

## 🔬 Observed Facts (from logs)

```
Kitchen Dashboard stats:
- ✅ В очереди: 0
- ✅ Готовится: 0  
- ✅ Завершено: 1

Menu items after filtering:
{
  planned: 0,
  cooking: 0,
  completed: 1  ← ❌ Should be planned: 1
}
```

## 🎯 Root Cause Analysis

### Option 1: Backend saves with wrong status
When `POST /api/user/recipes/save` executes, backend might be creating MenuItem with:
```go
status: "completed"  // ❌ Should be "planned"
```

### Option 2: /api/menu/today endpoint wrong logic
When `GET /api/menu/today` returns items, it's filtering or transforming with wrong status.

### Option 3: Integration issue
The `/api/user/recipes/save` endpoint might be calling a wrong internal handler that auto-completes.

## 🔧 What Should Happen

### Step 1: Add to Menu
```bash
POST /api/user/recipes/save
Content-Type: application/json

{
  "recipeId": "abc123"
}
```

**Expected backend response:**
- ✅ Create `MenuItem` with `status: "planned"`
- ✅ Record `created_at: NOW()`
- ✅ Set `servings` from recipe defaults
- ✅ Store relationship to recipe

**Expected `/api/menu/today` response:**
```json
[
  {
    "id": "menu-item-456",
    "status": "planned",              ← PLANNED, not COMPLETED
    "planned_for": "2026-01-22",
    "created_at": "2026-01-22T10:30:00Z",
    "recipe": {
      "id": "abc123",
      "title": "Жареные яйца",
      "image_url": "...",
      "cook_time": 15,
      "servings": 2
    }
  }
]
```

### Step 2: User clicks "Начать готовить"
```bash
POST /api/menu/{id}/start
```

**Backend action:**
```go
// Change status and record start time
item.status = "cooking"
item.started_cooking_at = NOW()
```

**Frontend shows:** Card moves to "Готовится" section

### Step 3: User clicks "Готово!"
```bash
POST /api/menu/{id}/complete
```

**Backend action:**
```go
// Change status and record completion time
item.status = "completed"
item.completed_at = NOW()
```

**Frontend shows:** Card moves to "✅ Приготовлено сегодня" section

## 🔴 Current Frontend Code (CORRECT)

The frontend correctly handles 3 states:

```typescript
// lib/api/menu.ts
export type MenuItemStatus = "planned" | "cooking" | "completed";

// app/(user)/recipes/page.tsx
const planned = menu.filter(i => i.status === "planned");
const cooking = menu.filter(i => i.status === "cooking");
const completed = menu.filter(i => i.status === "completed");

// Components render based on status
{planned.length > 0 && <Section title="В очереди" items={planned} />}
{cooking.length > 0 && <Section title="Готовится" items={cooking} />}
{completed.length > 0 && <Section title="✅ Приготовлено сегодня" items={completed} />}
```

**Frontend is NOT the problem.** ✅

## 🚨 What Needs to be Fixed (BACKEND)

### Location
The issue is in the backend workflow when `POST /api/user/recipes/save` executes.

### Fix Required
1. When creating `MenuItem`, set:
   - `status: "planned"` ← **NOT** `"completed"`
   - `planned_for: TODAY`
   - `created_at: NOW()`

2. DO NOT auto-complete the item upon creation

3. Only change status when explicit endpoints called:
   - `POST /api/menu/{id}/start` → `status: "cooking"`
   - `POST /api/menu/{id}/complete` → `status: "completed"`

## 📊 Test Verification

After backend fix, test this flow:

```
1. Open /assistant
2. Click ❤️ "В меню" on any recipe
   Expected in console: ✅ Recipe saved successfully
   
3. Open /recipes (Kitchen Dashboard)
   Expected: Card appears in "В очереди" section
   
4. Click "Начать готовить"
   Expected: Card moves to "Готовится" section
   
5. Click "Готово!"
   Expected: Card moves to "✅ Приготовлено сегодня" section
```

## 📝 Summary

| Component | Status |
|-----------|--------|
| Frontend logic | ✅ CORRECT |
| Frontend rendering | ✅ CORRECT |
| Frontend API calls | ✅ CORRECT |
| **Backend status logic** | ❌ **BUG: Auto-completes on save** |

**Action:** Fix backend `MenuItem` creation logic to set `status: "planned"` instead of `"completed"`.
