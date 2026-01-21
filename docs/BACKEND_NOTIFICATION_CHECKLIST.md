# 🎯 Backend Implementation Checklist - Notification System

**Frontend Status:** ✅ Complete and Ready  
**Backend Status:** ⏳ Awaiting Implementation  
**Integration:** Can start as soon as backend endpoints are ready

---

## 📋 Required API Endpoints

### 1️⃣ GET /api/notifications/unread-count
**Priority:** 🔴 CRITICAL (needed for badge)

**Request:**
```http
GET /api/notifications/unread-count
Authorization: Bearer {token}
Accept-Language: en|ru|pl
```

**Response:**
```json
{
  "critical": 2,
  "warning": 5,
  "info": 10,
  "total": 7
}
```

**Business Logic:**
```
total = critical + warning
// ⚠️ ВАЖНО: info НЕ включается в total!

critical: дни <= 2 (или уже expired)
warning:  дни 3-5
info:     дни 6-10
```

**Notes:**
- Badge показывает `total` (critical + warning)
- Info не влияет на badge count
- Считаем только непрочитанные (`readAt = null`)

---

### 2️⃣ GET /api/notifications
**Priority:** 🟠 HIGH (needed for panel)

**Request:**
```http
GET /api/notifications
Authorization: Bearer {token}
Accept-Language: en|ru|pl
```

**Response:**
```json
{
  "critical": [
    {
      "id": "notif_123",
      "level": "critical",
      "title": "Product Expiring Today!",
      "message": "Salmon expires in 1 day",
      "meta": {
        "fridgeItemId": "item_456",
        "productName": "Salmon",
        "daysLeft": 1
      },
      "readAt": null,
      "createdAt": "2026-01-21T10:30:00Z"
    }
  ],
  "warning": [...],
  "info": [...]
}
```

**Business Logic:**
```
- Группировка по level (critical, warning, info)
- Сортировка внутри группы: новые сверху (createdAt DESC)
- Все уведомления (и прочитанные, и нет)
- meta.fridgeItemId обязателен для навигации
```

**Title/Message Templates:**
```typescript
// Critical (daysLeft <= 2)
title: "Product Expiring Today!" | "Product Expired!"
message: "{productName} expires in {daysLeft} day(s)" | "{productName} expired {daysAgo} day(s) ago"

// Warning (daysLeft 3-5)
title: "Product Expiring Soon"
message: "{productName} expires in {daysLeft} days"

// Info (daysLeft 6-10)
title: "Check Your Fridge"
message: "{productName} expires in {daysLeft} days"
```

---

### 3️⃣ POST /api/notifications/:id/resolve
**Priority:** 🟠 HIGH (needed for mark as read)

**Request:**
```http
POST /api/notifications/notif_123/resolve
Authorization: Bearer {token}
```

**Response:**
```http
204 No Content
```

**Business Logic:**
```sql
UPDATE notifications
SET readAt = NOW()
WHERE id = :id AND userId = :userId AND readAt IS NULL
```

**Side Effects:**
- Уменьшается unread count
- Badge автоматически обновится через 30 секунд (или при следующем запросе)

---

### 4️⃣ POST /api/notifications/resolve-all
**Priority:** 🟡 MEDIUM (nice to have)

**Request:**
```http
POST /api/notifications/resolve-all
Authorization: Bearer {token}
```

**Response:**
```http
204 No Content
```

**Business Logic:**
```sql
UPDATE notifications
SET readAt = NOW()
WHERE userId = :userId AND readAt IS NULL
```

**Side Effects:**
- Все непрочитанные уведомления пользователя → readAt = NOW()
- Badge исчезнет (count.total = 0)

---

## 🧠 Notification Generation Logic

### When to Create Notifications?

```typescript
// 1. При добавлении продукта в холодильник
if (daysUntilExpiry <= 10) {
  createNotification({
    level: daysUntilExpiry <= 2 ? 'critical' : daysUntilExpiry <= 5 ? 'warning' : 'info',
    fridgeItemId: item.id,
    productName: item.name,
    daysLeft: daysUntilExpiry
  });
}

// 2. Ежедневная проверка (cron job)
async function checkExpiringProducts() {
  const products = await getFridgeItemsExpiringIn(10); // daysLeft <= 10
  
  for (const product of products) {
    // Проверяем, есть ли уже активное уведомление
    const existingNotif = await getActiveNotification(product.id);
    
    if (!existingNotif) {
      await createNotification({
        level: calculateLevel(product.daysLeft),
        fridgeItemId: product.id,
        productName: product.name,
        daysLeft: product.daysLeft
      });
    } else {
      // Обновляем level если изменился (warning → critical)
      await updateNotificationLevel(existingNotif.id, product.daysLeft);
    }
  }
}

// 3. При удалении продукта
async function onProductDeleted(fridgeItemId) {
  // Удаляем или помечаем уведомления как неактуальные
  await archiveNotifications(fridgeItemId);
}
```

### Level Calculation
```typescript
function calculateLevel(daysLeft: number): NotificationLevel {
  if (daysLeft <= 0) return 'critical';  // Expired
  if (daysLeft <= 2) return 'critical';  // Expires today/tomorrow
  if (daysLeft <= 5) return 'warning';   // Expires this week
  if (daysLeft <= 10) return 'info';     // Expires soon
  return null; // No notification needed
}
```

---

## 🗄️ Database Schema Suggestion

```sql
CREATE TABLE notifications (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  level VARCHAR(20) NOT NULL CHECK (level IN ('critical', 'warning', 'info')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  
  -- Metadata for fridge notifications
  fridge_item_id VARCHAR(255),
  product_name VARCHAR(255),
  days_left INTEGER,
  
  -- Timestamps
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  INDEX idx_user_unread (user_id, read_at),
  INDEX idx_fridge_item (fridge_item_id),
  INDEX idx_created (created_at DESC),
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (fridge_item_id) REFERENCES fridge_items(id) ON DELETE CASCADE
);
```

**Key Points:**
- `read_at = null` → unread
- `read_at != null` → read
- `fridge_item_id` required for navigation
- Cascade delete when user/product deleted

---

## 🧪 Testing Scenarios

### Test 1: Badge Count Calculation
```
Given:
  - 2 critical unread notifications
  - 3 warning unread notifications
  - 5 info unread notifications

Expected GET /api/notifications/unread-count:
{
  "critical": 2,
  "warning": 3,
  "info": 5,
  "total": 5  // ⚠️ NOT 10! (critical + warning only)
}
```

### Test 2: Notification Grouping
```
Given:
  - 1 expired product (daysLeft = -2)
  - 1 expiring today (daysLeft = 0)
  - 1 expiring tomorrow (daysLeft = 1)
  - 1 expiring in 4 days (daysLeft = 4)
  - 1 expiring in 8 days (daysLeft = 8)

Expected GET /api/notifications:
{
  "critical": [
    { "message": "expired 2 days ago" },
    { "message": "expires today" },
    { "message": "expires in 1 day" }
  ],
  "warning": [
    { "message": "expires in 4 days" }
  ],
  "info": [
    { "message": "expires in 8 days" }
  ]
}
```

### Test 3: Mark as Read Flow
```
1. GET /api/notifications/unread-count → total: 5
2. POST /api/notifications/notif_123/resolve → 204
3. GET /api/notifications/unread-count → total: 4
```

### Test 4: Mark All as Read
```
1. GET /api/notifications/unread-count → total: 10
2. POST /api/notifications/resolve-all → 204
3. GET /api/notifications/unread-count → total: 0
```

---

## 🔒 Authorization

**Required:**
- All endpoints require valid JWT token
- Check `userId` from token matches notification owner
- Return 401 if no token
- Return 403 if wrong user

**Example:**
```typescript
// Middleware
const userId = getUserIdFromToken(token);
const notification = await getNotification(id);

if (notification.userId !== userId) {
  throw new ForbiddenError("Cannot access another user's notification");
}
```

---

## 🌍 Internationalization

**Title/Message Translation:**

Option A: Backend translates based on Accept-Language
```typescript
// Backend decides title/message based on language
const title = language === 'ru' 
  ? 'Продукт истекает сегодня!'
  : language === 'pl'
  ? 'Produkt wygasa dzisiaj!'
  : 'Product Expiring Today!';
```

Option B: Frontend translates (send keys)
```typescript
// Backend sends translation keys
{
  "title": "notification.fridge.expiring_today",
  "message": "notification.fridge.expires_in",
  "params": { "productName": "Salmon", "daysLeft": 1 }
}
```

**Рекомендация:** Option A (Backend translates)
- Проще для frontend
- Согласуется с текущей архитектурой (backend sends translations)

---

## ⚡ Performance Considerations

### Caching Strategy
```
GET /api/notifications/unread-count:
- Cache: 30 seconds
- Badge auto-refreshes every 30s anyway
- No need for real-time accuracy

GET /api/notifications:
- Cache: 10 seconds
- User doesn't open panel often
- Can be slightly stale
```

### Database Optimization
```sql
-- Index for fast unread count
CREATE INDEX idx_user_unread ON notifications(user_id, read_at, level);

-- Index for fast listing
CREATE INDEX idx_user_created ON notifications(user_id, created_at DESC);

-- Cleanup old read notifications (optional)
DELETE FROM notifications 
WHERE read_at IS NOT NULL 
  AND read_at < NOW() - INTERVAL 30 DAY;
```

---

## 📞 Integration Steps

### Step 1: Implement Endpoints
```bash
✅ POST /api/notifications (testing only)
✅ GET  /api/notifications/unread-count
✅ GET  /api/notifications
✅ POST /api/notifications/:id/resolve
✅ POST /api/notifications/resolve-all
```

### Step 2: Test with Frontend
```bash
# Frontend team will test:
1. Badge shows correct count
2. Panel displays notifications
3. Mark as read works
4. Mark all as read works
5. Auto-refresh (30s) works
```

### Step 3: Setup Cron Job
```bash
# Daily check for expiring products
0 9 * * * /path/to/check-expiring-products.sh
```

### Step 4: Monitor
```bash
# Metrics to track:
- Notification generation rate
- Read/unread ratio
- API response times
- Error rates
```

---

## 🚨 Common Pitfalls

### ❌ DON'T: Include info in total count
```json
// WRONG:
{ "total": 17 }  // critical + warning + info

// CORRECT:
{ "total": 7 }   // critical + warning ONLY
```

### ❌ DON'T: Return array for GET /api/notifications
```json
// WRONG:
[{ "id": 1 }, { "id": 2 }]

// CORRECT:
{
  "critical": [...],
  "warning": [...],
  "info": [...]
}
```

### ❌ DON'T: Forget fridgeItemId in meta
```json
// WRONG:
{ "meta": {} }

// CORRECT:
{ "meta": { "fridgeItemId": "item_456" } }
```

### ❌ DON'T: Send only unread in GET /api/notifications
```typescript
// WRONG: Filter WHERE readAt IS NULL
// Panel needs ALL notifications (read + unread) to show history

// CORRECT: Return all, let frontend filter if needed
```

---

## ✅ Definition of Done

- [ ] All 4 endpoints implemented and tested
- [ ] Unit tests for notification generation logic
- [ ] Integration tests for API endpoints
- [ ] Cron job for daily expiration checks
- [ ] Database indexes created
- [ ] Frontend integration tested
- [ ] Performance benchmarked (<200ms p95)
- [ ] Error handling and logging added
- [ ] Documentation updated

---

## 📚 Resources

- Frontend Types: `lib/types/notifications.ts`
- API Client: `lib/api/notifications.ts`
- Full Docs: `docs/NOTIFICATION_SYSTEM_IMPLEMENTATION.md`
- Quick Reference: `docs/NOTIFICATION_SYSTEM_QUICK_REFERENCE.md`

---

**Questions?** Contact frontend team for clarification on contract details.

**Ready to Start?** Frontend is waiting! 🚀
