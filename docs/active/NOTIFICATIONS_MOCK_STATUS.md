# 🔔 Notification System - Mock Implementation Status

**Date:** 15 января 2026 г.  
**Status:** ✅ Mock данные работают, ждём backend

---

## 📊 Current Status

### ✅ Frontend Implementation Complete

**4 API Routes Created:**

1. **GET `/api/notifications`**
   - Returns mock list of 3 notifications (fridge x2, AI x1)
   - Fallback когда backend возвращает 404
   - Status: ✅ **Working**

2. **GET `/api/notifications/unread-count`**
   - Returns `{ count: 2 }`
   - Fallback когда backend возвращает 404
   - Status: ✅ **Working** (confirmed in logs)

3. **PATCH `/api/notifications/:id/read`**
   - Mock marks notification as read
   - Fallback когда backend возвращает 404
   - Status: ✅ **Working**

4. **POST `/api/notifications/read-all`**
   - Mock marks all as read (`markedCount: 2`)
   - Fallback когда backend возвращает 404
   - Status: ✅ **Working**

### 🎨 Components

**`<NotificationCenter />`**
- ✅ Bell icon with unread badge
- ✅ Dropdown with scrollable list
- ✅ Type-specific icons (Refrigerator, Sparkles, ShoppingBag, etc.)
- ✅ Click-to-action: navigate to `/fridge?highlight={itemId}`
- ✅ Mark as read button (✓)
- ✅ "Mark all as read" action
- ✅ Auto-refresh every 30 seconds

**`useNotifications` Hook**
- ✅ Fetches notifications list
- ✅ Fetches unread count
- ✅ Pagination support
- ✅ Type filtering (ai, fridge, order, system, error)
- ✅ Auto-polling
- ✅ Loading states

### ❌ Backend NOT Ready

Backend endpoints return **404**:

```
2026/01/15 10:20:29 "GET /api/notifications/unread-count" - 404 19B in 24µs
2026/01/15 10:20:58 "GET /api/notifications/unread-count" - 404 19B in 24µs
```

**Expected behavior:** Frontend detects 404 → uses mock data → everything works!

---

## 🎯 Mock Data Examples

### Notification List

```json
{
  "data": {
    "notifications": [
      {
        "id": "notif-1",
        "type": "fridge",
        "title": "Produkt wkrótce się zepsuje",
        "message": "Mleko 3.2% - wygasa za 2 dni",
        "isRead": false,
        "createdAt": "2026-01-15T09:50:00.000Z",
        "data": {
          "itemId": "d7b5bb9d-3243-47bd-a6c8-ad6d1a0fba30",
          "itemName": "Mleko 3.2%",
          "daysLeft": 2,
          "status": "warning"
        }
      },
      {
        "id": "notif-2",
        "type": "fridge",
        "title": "Produkt przeterminowany",
        "message": "Łosoś - przeterminowany (utracono 1.55 PLN)",
        "isRead": false,
        "createdAt": "2026-01-15T08:20:00.000Z",
        "data": {
          "itemId": "c6770373-0cb2-4a94-a3e5-3f6d27b67f48",
          "itemName": "Łosoś",
          "daysLeft": -21,
          "status": "expired",
          "lostMoney": 1.55
        }
      },
      {
        "id": "notif-3",
        "type": "ai",
        "title": "Nowy przepis AI",
        "message": "Przepis \"Sałatka grecka\" został wygenerowany",
        "isRead": true,
        "createdAt": "2026-01-15T05:20:00.000Z",
        "data": {
          "recipeId": "recipe-123",
          "recipeName": "Sałatka grecka"
        }
      }
    ],
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 3,
      "totalPages": 1
    }
  },
  "success": true
}
```

### Unread Count

```json
{
  "data": {
    "count": 2
  },
  "success": true
}
```

---

## 🔄 Auto-Upgrade Path

**Когда backend реализует эти endpoints:**

1. ❌ Backend перестанет возвращать 404
2. ✅ Frontend автоматически начнёт использовать реальные данные
3. 🗑️ Mock код можно будет удалить (помечен `TODO` комментариями)

**No code changes needed!** Всё заработает автоматически.

---

## 📝 Backend Requirements

Backend должен реализовать эти endpoints:

### 1. GET `/api/notifications`

**Query params:**
- `page`: number (default: 1)
- `limit`: number (default: 20)
- `unread`: boolean (optional) - filter только непрочитанные
- `type`: string (optional) - "ai" | "fridge" | "order" | "system" | "error"

**Response:**
```json
{
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "fridge",
        "title": "string",
        "message": "string",
        "isRead": false,
        "createdAt": "ISO8601",
        "data": {
          "itemId": "uuid",
          "itemName": "string",
          "daysLeft": -5,
          "status": "expired",
          "lostMoney": 10.50
        }
      }
    ],
    "meta": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  },
  "success": true
}
```

### 2. GET `/api/notifications/unread-count`

**Response:**
```json
{
  "data": {
    "count": 5
  },
  "success": true
}
```

### 3. PATCH `/api/notifications/:id/read`

Mark single notification as read.

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "isRead": true
  },
  "success": true
}
```

### 4. POST `/api/notifications/read-all`

Mark all user notifications as read.

**Response:**
```json
{
  "data": {
    "markedCount": 10
  },
  "success": true
}
```

---

## 🧪 How to Test

### Visual Test

1. Open app in browser: `http://localhost:3000`
2. Look at top navigation → bell icon 🔔
3. **Should see:** Red badge with number "2"
4. Click bell → dropdown opens
5. **Should see:** 3 notifications:
   - 🧊 "Mleko 3.2% - wygasa za 2 dni"
   - 🗑️ "Łosoś - przeterminowany (utracono 1.55 PLN)"
   - ✨ "Przepis 'Sałatka grecka' został wygenerowany" (read)

### Console Test

Open DevTools Console, check for logs:

```
[Notifications] Backend not ready, using mock unread count
[Notifications] Backend not ready, using mock data
```

### Network Test

Open DevTools → Network tab:
- `GET /api/notifications/unread-count` → Status **200** (frontend mock)
- `GET /api/notifications?page=1&limit=20` → Status **200** (frontend mock)

Backend logs show 404:
```
"GET /api/notifications/unread-count" - 404 19B
```

**This is expected!** Frontend handles fallback gracefully.

---

## ✅ What Works Now

1. ✅ Notification bell with badge
2. ✅ Dropdown displays mock notifications
3. ✅ Type-specific icons (Refrigerator, Sparkles)
4. ✅ Relative timestamps ("30 min ago", "2h ago")
5. ✅ Click fridge notification → navigate to `/fridge?highlight={id}`
6. ✅ Mark as read button
7. ✅ Mark all as read
8. ✅ Auto-refresh every 30 seconds
9. ✅ Loading states
10. ✅ No console errors

---

## 🚧 What's Next

### Phase 1: Backend Implementation
Backend team needs to implement 4 endpoints (see requirements above).

### Phase 2: Real Data Integration
Once backend is ready, frontend will automatically use real data.

### Phase 3: Smart Fridge Notifications
Backend should automatically create notifications when:
- ❗ Item expires in ≤3 days → type: "fridge", status: "critical"
- ⚠️ Item expires in 4-7 days → type: "fridge", status: "warning"  
- 🗑️ Item expired → type: "fridge", status: "expired", include `lostMoney`

### Phase 4: AI Recipe Notifications
When AI generates recipe → create notification:
- type: "ai"
- title: "Nowy przepis AI"
- message: "Przepis '{name}' został wygenerowany"
- data: { recipeId, recipeName }

### Phase 5: Remove Mocks
Once everything works with real backend:
1. Remove `TODO` sections in API routes
2. Remove mock data arrays
3. Keep only `proxyToBackend()` calls

---

## 📚 Related Files

**API Routes:**
- `app/api/notifications/route.ts`
- `app/api/notifications/unread-count/route.ts`
- `app/api/notifications/[id]/read/route.ts`
- `app/api/notifications/read-all/route.ts`

**Components:**
- `components/NotificationCenter.tsx`
- `components/layout/UserNavigation.tsx`
- `components/NavigationBurger.tsx`

**Hooks:**
- `hooks/useNotifications.ts`

**Documentation:**
- `docs/active/SMART_FRIDGE_IMPLEMENTATION.md`
- `docs/active/NOTIFICATIONS_MOCK_STATUS.md` (this file)

---

## 🎉 Success Criteria

✅ **Mock phase complete when:**
- [x] Bell icon shows unread count
- [x] Dropdown displays notifications
- [x] Click notification navigates correctly
- [x] No console errors
- [x] Graceful 404 handling

🚀 **Production ready when:**
- [ ] Backend implements 4 endpoints
- [ ] Frontend auto-switches to real data
- [ ] Smart fridge auto-creates notifications
- [ ] AI recipe completion creates notifications
- [ ] Mock code removed

---

**Last updated:** 15 января 2026 г. 10:25
**Status:** ✅ Mock implementation working, awaiting backend
