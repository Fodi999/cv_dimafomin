# 🎯 NOTIFICATION MODEL 2025 - Implementation Complete

**Date:** 21 января 2026  
**Status:** ✅ Implemented  
**Philosophy:** User reacts, not reads

---

## 🏆 GOLDEN RULE

```
Notification = Action required NOW
Action done → Notification dies → UI clean
```

**No history. No archive. No "show more". Ever.**

---

## 🧠 PHILOSOPHY (Why This Matters)

### In 2025:
- ✅ User **reacts** to notifications
- ❌ User does NOT **read** notifications

### Therefore:
```typescript
Notification = Action required NOW

If action done:
  → status = "resolved"
  → notification disappears from UI
  → FOREVER
```

---

## 🏗 ARCHITECTURE

### Backend = Brain (Decides Everything)

**Statuses:**
```typescript
type NotificationStatus = "active" | "resolved" | "expired"

active   → Show in UI (user must take action)
resolved → NEVER show (action taken, notification dies)
expired  → NEVER show (too old, auto-cleanup)
```

**Business Logic:**
```typescript
daysLeft ≤ 0  → CRITICAL → active
daysLeft = 1  → CRITICAL → active  
daysLeft ≤ 4  → WARNING  → active
daysLeft ≥ 5  → INFO     → auto-resolve (optional, or don't create)
```

**Badge Formula:**
```typescript
badge.total = active.critical + active.warning

❌ INFO does NOT participate in badge
❌ resolved does NOT participate
❌ expired does NOT participate
```

### Frontend = Eyes (Just Displays)

**What Frontend Shows:**
```typescript
// ONLY active notifications
notifications.filter(n => n.status === "active")

// Count for badge
count = { critical, warning, total: critical + warning }
```

**What Frontend NEVER Shows:**
```typescript
❌ notifications WHERE status = "resolved"
❌ notifications WHERE status = "expired"
❌ History tab
❌ Archive section
❌ "Show old notifications"
❌ Info level (backend auto-resolves them)
```

---

## 🎨 UI IMPLEMENTATION

### Panel Structure:
```
┌─────────────────────────────────────┐
│ Notifications          Mark all read │
├─────────────────────────────────────┤
│                                      │
│ 🚨 Critical (2)                      │
│ ┌─────────────────────────────────┐ │
│ │ 🧊 Product Expired!             │ │
│ │ Milk expired 2 days ago         │ │
│ │ 2h ago                          │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 🧊 Product Expiring Today!      │ │
│ │ Salmon expires in 1 day         │ │
│ │ 5min ago                        │ │
│ └─────────────────────────────────┘ │
│                                      │
│ ⚠️  Warning (1)                      │
│ ┌─────────────────────────────────┐ │
│ │ 🧊 Product Expiring Soon        │ │
│ │ Lettuce expires in 4 days       │ │
│ │ 1h ago                          │ │
│ └─────────────────────────────────┘ │
│                                      │
└─────────────────────────────────────┘

Total: 3 notifications (typical)
Maximum: 10 notifications (extreme case)
❌ NEVER: 99+
```

### Empty State:
```
┌─────────────────────────────────────┐
│ Notifications                      X │
├─────────────────────────────────────┤
│                                      │
│          ✅                          │
│     No notifications                │
│       All clear! 🎉                 │
│                                      │
└─────────────────────────────────────┘
```

### Badge States:
```typescript
// Critical notifications (red + pulse)
🔔 (2)  ← Red bell, animate-pulse, critical count

// Warning only (orange)
🔔 (1)  ← Orange bell, no pulse, warning count

// No active notifications
🔕     ← Badge hidden, UI clean
```

---

## 🔄 USER FLOW

### Scenario 1: User Clicks Notification
```
1. User sees: 🔔 (3)
2. Opens panel → 2 critical + 1 warning
3. Clicks "Milk expired 2 days ago"
4. Frontend: POST /api/notifications/{id}/resolve
5. Backend: status = "resolved", resolvedAt = now()
6. Frontend: Refetch notifications
7. Panel updates: 1 critical + 1 warning (2 total)
8. Badge updates: 🔔 (2)
9. User navigated to: /fridge?highlight=item_456
```

**Result:** Notification **died**. Never seen again.

### Scenario 2: Mark All As Read
```
1. User sees: 🔔 (3)
2. Opens panel → 2 critical + 1 warning
3. Clicks "Mark all as read"
4. Frontend: POST /api/notifications/resolve-all
5. Backend: All active notifications → status = "resolved"
6. Frontend: Refetch notifications
7. Panel shows: "No notifications - All clear! 🎉"
8. Badge: Hidden (count = 0)
```

**Result:** UI is **clean**. User can focus.

### Scenario 3: New Notification Arrives
```
1. User sees: Clean UI (no badge)
2. Backend CRON: Checks fridge (every hour)
3. Finds: Chicken expires tomorrow
4. Creates: Notification (level=critical, status=active)
5. Frontend: Auto-refresh (30s interval)
6. Badge appears: 🔔 (1) with red pulse
7. User clicks → Takes action → Notification dies
```

**Result:** Only **current problems** visible.

---

## 📦 DATABASE SCHEMA (Suggestion for Backend)

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Core fields
  level VARCHAR(10) NOT NULL CHECK (level IN ('critical', 'warning', 'info')),
  status VARCHAR(10) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'expired')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  
  -- Metadata (JSON for flexibility)
  meta JSONB NOT NULL,
  -- Example: {"fridgeItemId": "...", "ingredientId": "...", "ingredientName": "...", "expiresAt": "...", "daysLeft": 0}
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP DEFAULT NULL,
  
  -- Indexes for performance
  INDEX idx_user_status (user_id, status),
  INDEX idx_created_at (created_at),
  INDEX idx_resolved_at (resolved_at)
);

-- Query examples:
-- Get active notifications for user:
SELECT * FROM notifications 
WHERE user_id = ? AND status = 'active' 
ORDER BY 
  CASE level 
    WHEN 'critical' THEN 1 
    WHEN 'warning' THEN 2 
    WHEN 'info' THEN 3 
  END,
  created_at DESC;

-- Get badge count:
SELECT 
  COUNT(*) FILTER (WHERE level = 'critical') as critical,
  COUNT(*) FILTER (WHERE level = 'warning') as warning,
  COUNT(*) FILTER (WHERE level = 'info') as info,
  COUNT(*) FILTER (WHERE level IN ('critical', 'warning')) as total
FROM notifications
WHERE user_id = ? AND status = 'active';
```

---

## 🤖 BACKEND CRON JOBS

### 1. Generate Notifications (Hourly)
```typescript
// Every hour at :00
cron.schedule('0 * * * *', async () => {
  const users = await db.users.findAll();
  
  for (const user of users) {
    const fridgeItems = await db.fridgeItems.findByUserId(user.id);
    
    for (const item of fridgeItems) {
      const daysLeft = calculateDaysLeft(item.expiresAt);
      
      // Create notification based on daysLeft
      if (daysLeft <= 0) {
        await createNotification(user.id, {
          level: 'critical',
          title: 'Product Expired!',
          message: `${item.ingredientName} expired ${Math.abs(daysLeft)} days ago`,
          meta: { fridgeItemId: item.id, daysLeft, ... }
        });
      } else if (daysLeft === 1) {
        await createNotification(user.id, {
          level: 'critical',
          title: 'Product Expiring Today!',
          message: `${item.ingredientName} expires in 1 day`,
          meta: { fridgeItemId: item.id, daysLeft, ... }
        });
      } else if (daysLeft <= 4) {
        await createNotification(user.id, {
          level: 'warning',
          title: 'Product Expiring Soon',
          message: `${item.ingredientName} expires in ${daysLeft} days`,
          meta: { fridgeItemId: item.id, daysLeft, ... }
        });
      }
      // daysLeft >= 5 → Don't create notification (too far)
    }
  }
});
```

### 2. Cleanup Old Notifications (Daily)
```typescript
// Every day at 3am
cron.schedule('0 3 * * *', async () => {
  // Delete resolved notifications older than 30 days
  await db.notifications.deleteMany({
    status: 'resolved',
    resolvedAt: { $lt: new Date(Date.now() - 30 * 86400000) }
  });
  
  // Delete expired notifications older than 7 days
  await db.notifications.deleteMany({
    status: 'expired',
    createdAt: { $lt: new Date(Date.now() - 7 * 86400000) }
  });
  
  console.log('Old notifications cleaned up');
});
```

### 3. Auto-Resolve Outdated (Hourly)
```typescript
// Every hour at :30
cron.schedule('30 * * * *', async () => {
  // If fridge item was deleted → resolve its notifications
  await db.notifications.updateMany(
    {
      status: 'active',
      'meta.fridgeItemId': { $in: deletedItemIds }
    },
    {
      status: 'resolved',
      resolvedAt: new Date()
    }
  );
  
  // If product consumed → resolve notification
  // If daysLeft changed significantly → update or resolve
});
```

---

## 🔌 API ENDPOINTS

### GET /api/notifications/unread-count
**Purpose:** Get badge count

**Response:**
```json
{
  "critical": 2,
  "warning": 1,
  "info": 0,
  "total": 3
}
```

**Backend Logic:**
```sql
SELECT 
  COUNT(*) FILTER (WHERE level = 'critical') as critical,
  COUNT(*) FILTER (WHERE level = 'warning') as warning,
  COUNT(*) FILTER (WHERE level = 'info') as info,
  COUNT(*) FILTER (WHERE level IN ('critical', 'warning')) as total
FROM notifications
WHERE user_id = ? AND status = 'active';
```

### GET /api/notifications
**Purpose:** Get active notifications for panel

**Response:**
```json
{
  "critical": [
    {
      "id": "uuid",
      "level": "critical",
      "status": "active",
      "title": "Product Expired!",
      "message": "Milk expired 2 days ago",
      "meta": {
        "fridgeItemId": "item_456",
        "ingredientId": "ing_002",
        "ingredientName": "Milk",
        "expiresAt": "2026-01-19T10:00:00Z",
        "daysLeft": -2
      },
      "createdAt": "2026-01-21T08:00:00Z",
      "resolvedAt": null
    }
  ],
  "warning": [ ... ],
  "info": []
}
```

**Backend Logic:**
```sql
SELECT * FROM notifications
WHERE user_id = ? AND status = 'active'
ORDER BY
  CASE level
    WHEN 'critical' THEN 1
    WHEN 'warning' THEN 2
    WHEN 'info' THEN 3
  END,
  created_at DESC;
```

### POST /api/notifications/:id/resolve
**Purpose:** Mark single notification as resolved

**Request:** (empty body)

**Response:** `204 No Content`

**Backend Logic:**
```sql
UPDATE notifications
SET status = 'resolved', resolved_at = NOW()
WHERE id = ? AND user_id = ? AND status = 'active';
```

### POST /api/notifications/resolve-all
**Purpose:** Mark all active notifications as resolved

**Request:** (empty body)

**Response:** `204 No Content`

**Backend Logic:**
```sql
UPDATE notifications
SET status = 'resolved', resolved_at = NOW()
WHERE user_id = ? AND status = 'active';
```

---

## 🚫 ANTI-PATTERNS (What NOT to Do)

### ❌ Don't Create History Tab
```typescript
// BAD:
<Tab>Active</Tab>
<Tab>History</Tab> ❌

// GOOD:
Only active notifications visible ✅
```

### ❌ Don't Show Resolved Notifications
```typescript
// BAD:
notifications.filter(n => n.status === 'resolved')
  .map(n => <div style={{opacity: 0.5}}>...</div>) ❌

// GOOD:
notifications.filter(n => n.status === 'active')
  .map(n => <div>...</div>) ✅
```

### ❌ Don't Create Archive
```typescript
// BAD:
<button>Show archived notifications</button> ❌

// GOOD:
No archive. Resolved = died. ✅
```

### ❌ Don't Allow 99+
```typescript
// BAD:
if (count > 99) return "99+" ❌

// GOOD:
Typical: 1-5 notifications
Maximum: 10 in extreme cases
If user has 99+ → system design is broken ✅
```

### ❌ Don't Keep Info Visible
```typescript
// BAD:
<Section>Info (15)</Section> ❌

// GOOD:
Info auto-resolves or doesn't exist
Only critical + warning visible ✅
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Frontend (Completed):
- [x] Types updated (`status`, `resolvedAt` fields)
- [x] NotificationBadge shows `total = critical + warning`
- [x] NotificationPanel shows only critical + warning
- [x] Info section removed from UI
- [x] Mock data uses new structure
- [x] "Mark all as read" button
- [x] Click notification → navigate to fridge
- [x] Auto-refresh every 30 seconds
- [x] Empty state with "All clear! 🎉"
- [x] No TypeScript errors

### Backend (TODO):
- [ ] Add `status` field to notifications table
- [ ] Add `resolvedAt` timestamp
- [ ] Update GET /notifications to filter `WHERE status = 'active'`
- [ ] Update GET /unread-count to count only active
- [ ] Implement POST /:id/resolve endpoint
- [ ] Implement POST /resolve-all endpoint
- [ ] Create CRON job for notification generation
- [ ] Create CRON job for cleanup (30 days)
- [ ] Create CRON job for auto-resolve outdated
- [ ] Test badge count formula: `total = critical + warning`

---

## 📊 EXPECTED BEHAVIOR

### Typical User Journey:
```
Morning:
- Opens app → 🔔 (2)
- Sees: 1 critical (milk expired), 1 warning (lettuce expires in 3 days)
- Clicks milk → Goes to fridge → Throws away milk
- Notification dies → Badge updates to 🔔 (1)

Afternoon:
- Opens app → 🔔 (1)
- Sees: 1 warning (lettuce)
- Uses lettuce for salad → Marks as consumed in fridge
- Backend auto-resolves notification
- Badge disappears → 🔕 Clean UI

Evening:
- Opens app → Clean UI (no badge)
- Focuses on cooking, not notifications
```

### Maximum Notification Count:
```
Typical daily: 1-5 notifications
Extreme case (user abandoned fridge for weeks): max 10-15
If 99+: User needs email summary, not notifications
```

---

## 🎯 SUCCESS METRICS

### User sees notification → Takes action → Notification dies

**Good signs:**
- ✅ Average notification lifetime: < 2 hours
- ✅ Average active notifications: 1-3
- ✅ User engagement: Click-through > 80%
- ✅ Badge always relevant (not ignored)

**Bad signs:**
- ❌ Notifications pile up to 99+
- ❌ User ignores badge (learned helplessness)
- ❌ Requests for "clear all" or "archive"
- ❌ Scroll in notification panel

---

## 📚 DOCUMENTATION REFERENCES

Related docs:
- `NOTIFICATION_SYSTEM_IMPLEMENTATION.md` - Original implementation
- `NOTIFICATION_SYSTEM_QUICK_REFERENCE.md` - Quick start guide
- `BACKEND_NOTIFICATION_CHECKLIST.md` - Backend tasks
- `NOTIFICATION_BADGE_VISIBILITY_FIX.md` - Badge rendering fix
- `NOTIFICATION_MODEL_2025.md` - **This document (current)**

---

## 🎉 SUMMARY

### What We Built:

**Philosophy:**
```
Notification = Action required NOW
Action done → Notification dies
```

**Implementation:**
- ✅ Backend decides (critical/warning, status=active)
- ✅ Frontend displays (only active notifications)
- ✅ Badge shows `critical + warning` (info excluded)
- ✅ Click notification → status=resolved → disappears
- ✅ "Mark all read" → all resolved → UI clean
- ✅ No history, no archive, no "show more"

**Result:**
- Clean UI that user trusts
- Notifications that require action
- System that scales (1-10 notifications max)
- User that reacts, not reads

---

**Status:** 🎉 Model 2025 Implemented  
**Contact:** Dmitrij Fomin  
**Project:** CV-Sushi Chef  
**Date:** 21 января 2026
