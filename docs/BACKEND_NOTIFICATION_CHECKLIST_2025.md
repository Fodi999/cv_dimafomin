# ✅ Backend Notification Checklist - Model 2025

**Date:** 21 января 2026  
**Priority:** 🔴 HIGH  
**Philosophy:** User reacts, not reads

---

## 🎯 GOLDEN RULE

```
Notification = Action required NOW
Action done → status = resolved → NEVER show again
```

**No history. No archive. Just current problems.**

---

## 📋 QUICK CHECKLIST

### Phase 1: Database (Priority 🔴 CRITICAL)
- [ ] Add `status` field: `VARCHAR(10) CHECK (status IN ('active', 'resolved', 'expired'))`
- [ ] Add `resolvedAt` timestamp: `TIMESTAMP DEFAULT NULL`
- [ ] Remove `readAt` field (deprecated, use `resolvedAt`)
- [ ] Add indexes: `(user_id, status)`, `(created_at)`, `(resolved_at)`
- [ ] Migration: Convert existing `readAt` to `resolvedAt` where not null

### Phase 2: API Endpoints (Priority 🔴 CRITICAL)
- [ ] **GET /api/notifications/unread-count** → Filter `WHERE status = 'active'`
- [ ] **GET /api/notifications** → Filter `WHERE status = 'active'`
- [ ] **POST /api/notifications/:id/resolve** → Set `status = 'resolved', resolvedAt = NOW()`
- [ ] **POST /api/notifications/resolve-all** → Resolve all active for user

### Phase 3: Business Logic (Priority 🟠 HIGH)
- [ ] Notification generation: Only create if `daysLeft ≤ 4`
- [ ] Badge formula: `total = COUNT(critical) + COUNT(warning)` (exclude info)
- [ ] Auto-resolve: When fridge item deleted/consumed
- [ ] Level calculation:
  - `daysLeft ≤ 0` → `critical`
  - `daysLeft = 1` → `critical`
  - `daysLeft ≤ 4` → `warning`
  - `daysLeft >= 5` → Don't create or auto-resolve

### Phase 4: CRON Jobs (Priority 🟡 MEDIUM)
- [ ] Hourly: Generate notifications for expiring products
- [ ] Hourly: Auto-resolve outdated notifications
- [ ] Daily: Cleanup old notifications (`resolved_at > 30 days`)

### Phase 5: Testing (Priority 🟢 LOW)
- [ ] Test badge count excludes info
- [ ] Test resolved notifications never returned
- [ ] Test "mark all" resolves all active
- [ ] Test navigation with `?highlight=itemId`

---

## 🗄️ DATABASE MIGRATION

### Step 1: Add New Fields
```sql
ALTER TABLE notifications
  ADD COLUMN status VARCHAR(10) NOT NULL DEFAULT 'active' 
    CHECK (status IN ('active', 'resolved', 'expired')),
  ADD COLUMN resolved_at TIMESTAMP DEFAULT NULL;
```

### Step 2: Migrate Existing Data
```sql
-- Convert readAt to resolvedAt
UPDATE notifications
SET 
  status = CASE 
    WHEN read_at IS NOT NULL THEN 'resolved'
    ELSE 'active'
  END,
  resolved_at = read_at
WHERE read_at IS NOT NULL;
```

### Step 3: Drop Old Field (after testing)
```sql
ALTER TABLE notifications DROP COLUMN read_at;
```

### Step 4: Add Indexes
```sql
CREATE INDEX idx_notifications_user_status ON notifications(user_id, status);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_notifications_resolved_at ON notifications(resolved_at);
```

---

## 🔌 API IMPLEMENTATION

### 1. GET /api/notifications/unread-count

**Purpose:** Badge count (critical + warning only)

**Query:**
```sql
SELECT 
  COUNT(*) FILTER (WHERE level = 'critical') as critical,
  COUNT(*) FILTER (WHERE level = 'warning') as warning,
  COUNT(*) FILTER (WHERE level = 'info') as info,
  COUNT(*) FILTER (WHERE level IN ('critical', 'warning')) as total
FROM notifications
WHERE user_id = $1 AND status = 'active';
```

**Response:**
```json
{
  "critical": 2,
  "warning": 1,
  "info": 0,
  "total": 3
}
```

**⚠️ CRITICAL:** `total = critical + warning` (info excluded!)

---

### 2. GET /api/notifications

**Purpose:** Get active notifications for panel

**Query:**
```sql
SELECT 
  id, level, status, title, message, meta,
  created_at, resolved_at
FROM notifications
WHERE user_id = $1 AND status = 'active'
ORDER BY
  CASE level
    WHEN 'critical' THEN 1
    WHEN 'warning' THEN 2
    WHEN 'info' THEN 3
  END,
  created_at DESC;
```

**Group by level:**
```typescript
const notifications = await db.query(...);

const grouped = {
  critical: notifications.filter(n => n.level === 'critical'),
  warning: notifications.filter(n => n.level === 'warning'),
  info: notifications.filter(n => n.level === 'info')
};

return grouped;
```

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

---

### 3. POST /api/notifications/:id/resolve

**Purpose:** Mark single notification as resolved

**Request:** (empty body)

**Logic:**
```sql
UPDATE notifications
SET 
  status = 'resolved',
  resolved_at = NOW()
WHERE 
  id = $1 
  AND user_id = $2 
  AND status = 'active';
```

**Response:** `204 No Content`

**Error Cases:**
- 404: Notification not found or already resolved
- 403: Notification belongs to different user

---

### 4. POST /api/notifications/resolve-all

**Purpose:** Mark all active notifications as resolved

**Request:** (empty body)

**Logic:**
```sql
UPDATE notifications
SET 
  status = 'resolved',
  resolved_at = NOW()
WHERE 
  user_id = $1 
  AND status = 'active';
```

**Response:** `204 No Content`

---

## 🤖 CRON JOBS

### Job 1: Generate Notifications (Every Hour at :00)

**Purpose:** Check fridge items and create notifications

```typescript
cron.schedule('0 * * * *', async () => {
  const users = await db.users.findAll();
  
  for (const user of users) {
    const fridgeItems = await db.fridgeItems.findByUserId(user.id);
    
    for (const item of fridgeItems) {
      const now = new Date();
      const expiresAt = new Date(item.expiresAt);
      const daysLeft = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));
      
      let level = null;
      let title = '';
      let message = '';
      
      // 🎯 MODEL 2025: Only create if daysLeft ≤ 4
      if (daysLeft <= 0) {
        level = 'critical';
        title = 'Product Expired!';
        message = `${item.ingredientName} expired ${Math.abs(daysLeft)} day(s) ago`;
      } else if (daysLeft === 1) {
        level = 'critical';
        title = 'Product Expiring Today!';
        message = `${item.ingredientName} expires in 1 day`;
      } else if (daysLeft <= 4) {
        level = 'warning';
        title = 'Product Expiring Soon';
        message = `${item.ingredientName} expires in ${daysLeft} days`;
      }
      // daysLeft >= 5 → Don't create notification
      
      if (level) {
        // Check if notification already exists
        const existing = await db.notifications.findOne({
          userId: user.id,
          'meta.fridgeItemId': item.id,
          status: 'active'
        });
        
        if (!existing) {
          await db.notifications.create({
            userId: user.id,
            level,
            status: 'active',
            title,
            message,
            meta: {
              fridgeItemId: item.id,
              ingredientId: item.ingredientId,
              ingredientName: item.ingredientName,
              expiresAt: item.expiresAt,
              daysLeft
            }
          });
        }
      }
    }
  }
  
  console.log('Notifications generated');
});
```

---

### Job 2: Auto-Resolve Outdated (Every Hour at :30)

**Purpose:** Resolve notifications for deleted/consumed items

```typescript
cron.schedule('30 * * * *', async () => {
  // Find fridge items that were deleted/consumed
  const deletedItems = await db.fridgeItems.findDeleted({
    deletedAfter: new Date(Date.now() - 3600000) // last hour
  });
  
  const deletedItemIds = deletedItems.map(item => item.id);
  
  if (deletedItemIds.length > 0) {
    // Resolve notifications for deleted items
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
    
    console.log(`Auto-resolved ${deletedItemIds.length} notifications`);
  }
});
```

---

### Job 3: Cleanup Old Notifications (Daily at 3am)

**Purpose:** Delete resolved notifications older than 30 days

```typescript
cron.schedule('0 3 * * *', async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
  
  // Delete resolved notifications older than 30 days
  const resolvedDeleted = await db.notifications.deleteMany({
    status: 'resolved',
    resolvedAt: { $lt: thirtyDaysAgo }
  });
  
  // Delete expired notifications older than 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
  const expiredDeleted = await db.notifications.deleteMany({
    status: 'expired',
    createdAt: { $lt: sevenDaysAgo }
  });
  
  console.log(`Cleanup: ${resolvedDeleted.deletedCount} resolved, ${expiredDeleted.deletedCount} expired`);
});
```

---

## 🧪 TESTING SCENARIOS

### Test 1: Badge Count Excludes Info
```typescript
// Given: User has 2 critical, 1 warning, 3 info notifications (all active)
// When: GET /api/notifications/unread-count
// Then: Response = { critical: 2, warning: 1, info: 3, total: 3 }
// Badge shows: 🔔 (3) not 🔔 (6)
```

### Test 2: Resolved Never Returned
```typescript
// Given: User has 5 notifications, 3 are resolved
// When: GET /api/notifications
// Then: Returns only 2 active notifications
// Resolved notifications: NEVER in response
```

### Test 3: Mark All Resolves Everything
```typescript
// Given: User has 5 active notifications
// When: POST /api/notifications/resolve-all
// Then: All 5 updated to status='resolved'
// Then: GET /unread-count returns { total: 0 }
// Then: Badge hidden
```

### Test 4: Single Resolve
```typescript
// Given: User has notification with id='abc'
// When: POST /api/notifications/abc/resolve
// Then: Notification status='resolved', resolvedAt=NOW()
// Then: GET /notifications doesn't include 'abc'
// Then: Badge count decreases by 1
```

### Test 5: Auto-Resolve on Item Delete
```typescript
// Given: User has notification for fridgeItemId='item_123'
// When: User deletes item_123 from fridge
// When: CRON runs (auto-resolve job)
// Then: Notification status='resolved'
// Then: Badge count decreases
```

---

## 🚫 WHAT NOT TO DO

### ❌ Don't Return Resolved Notifications
```typescript
// BAD:
SELECT * FROM notifications WHERE user_id = ?;

// GOOD:
SELECT * FROM notifications WHERE user_id = ? AND status = 'active';
```

### ❌ Don't Include Info in Badge
```typescript
// BAD:
total = critical + warning + info;

// GOOD:
total = critical + warning; // info excluded
```

### ❌ Don't Create Notifications Too Early
```typescript
// BAD:
if (daysLeft <= 14) { create notification } // Too noisy!

// GOOD:
if (daysLeft <= 4) { create notification } // Actionable
```

### ❌ Don't Keep Resolved Forever
```typescript
// BAD:
Never delete resolved notifications

// GOOD:
DELETE WHERE status='resolved' AND resolved_at < NOW() - INTERVAL '30 days'
```

---

## 📊 EXPECTED METRICS

### After Implementation:

**Database:**
```sql
-- Typical user
SELECT COUNT(*) FROM notifications 
WHERE user_id = ? AND status = 'active';
-- Expected: 1-5 rows

-- Extreme case (abandoned fridge)
-- Expected: max 10-15 rows

-- If 99+: System design issue
```

**API Performance:**
```
GET /notifications/unread-count → < 50ms
GET /notifications → < 100ms
POST /resolve → < 50ms
POST /resolve-all → < 200ms
```

**User Behavior:**
```
Average notification lifetime: < 2 hours
Click-through rate: > 80%
"Mark all read" usage: < 20% (most resolve individually)
```

---

## 🎯 SUCCESS CRITERIA

### When Backend is Complete:

✅ Frontend can remove mock data  
✅ Badge shows real count (critical + warning only)  
✅ Panel shows real notifications (only active)  
✅ Click notification → marks resolved → disappears  
✅ "Mark all read" → all resolved → UI clean  
✅ No history, no archive visible  
✅ CRON generates notifications hourly  
✅ Old notifications cleanup daily  
✅ Auto-resolve when item deleted  

---

## 📚 DOCUMENTATION REFERENCES

- **NOTIFICATION_MODEL_2025.md** - Complete philosophy and implementation
- **lib/types/notifications.ts** - TypeScript interfaces (frontend reference)
- **components/notifications/** - Frontend components (reference only)

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Database Migration
```bash
# Run migration
npm run migrate:notifications

# Verify
SELECT COUNT(*), status FROM notifications GROUP BY status;
```

### Step 2: Deploy API Changes
```bash
# Deploy endpoints
npm run deploy:api

# Test
curl -H "Authorization: Bearer $TOKEN" \
  https://api.example.com/api/notifications/unread-count
```

### Step 3: Deploy CRON Jobs
```bash
# Start CRON service
npm run cron:start

# Check logs
tail -f logs/cron.log
```

### Step 4: Remove Frontend Mock Data
```typescript
// NotificationBadge.tsx - Delete lines 35-42, 54-63
// NotificationPanel.tsx - Delete lines 40-110, 120-170
// Restore: if (!count || count.total === 0) return null;
```

### Step 5: Integration Testing
```bash
# Test full flow
npm run test:notifications

# Monitor production
npm run monitor:notifications
```

---

## 🎉 SUMMARY

### What to Implement:

**Database:**
- ✅ Add `status` field (active/resolved/expired)
- ✅ Add `resolvedAt` timestamp
- ✅ Migrate existing `readAt` data
- ✅ Add indexes for performance

**API:**
- ✅ Filter `WHERE status = 'active'` in all queries
- ✅ Badge formula: `total = critical + warning`
- ✅ Implement resolve endpoints
- ✅ Return grouped notifications

**CRON:**
- ✅ Generate notifications (hourly)
- ✅ Auto-resolve outdated (hourly)
- ✅ Cleanup old (daily)

**Business Logic:**
- ✅ Only create if `daysLeft ≤ 4`
- ✅ Resolve when item deleted
- ✅ Level: `≤0 = critical`, `=1 = critical`, `≤4 = warning`

---

**Status:** 🎯 Ready for Implementation  
**Priority:** 🔴 HIGH  
**Estimated Time:** 4-6 hours  
**Contact:** Dmitrij Fomin  
**Project:** CV-Sushi Chef  
**Date:** 21 января 2026
