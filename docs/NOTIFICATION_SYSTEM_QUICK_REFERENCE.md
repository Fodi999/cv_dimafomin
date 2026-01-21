# 🔔 Notification System - Quick Reference

## 📊 Architecture Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND (BRAIN)                      │
│  • Monitors fridge items                                     │
│  • Calculates expiration dates                              │
│  • Decides critical/warning/info                            │
│  • Generates notifications                                   │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ REST API
                      │ /api/notifications/*
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    API CLIENT (MESSENGER)                    │
│  lib/api/notifications.ts                                    │
│  • getNotifications(token) → NotificationGroup              │
│  • getUnreadCount(token) → UnreadCount                      │
│  • resolveNotification(id, token)                           │
│  • resolveAllNotifications(token)                           │
│  ✅ Zero logic, just fetch and return                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ TypeScript Types
                      │ lib/types/notifications.ts
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (EYES)                          │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  NotificationBadge                                    │  │
│  │  • Shows: count.total (critical + warning)           │  │
│  │  • Red pulse: critical > 0                           │  │
│  │  • Orange badge: warning only                        │  │
│  │  • Auto-refresh: 30s                                 │  │
│  │  • Race condition protected ✅                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│                           │ onClick                          │
│                           ▼                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  NotificationPanel                                    │  │
│  │  • Slide-in from right                               │  │
│  │  • Critical: always visible (red) 🔴                 │  │
│  │  • Warning: always visible (orange) 🟠               │  │
│  │  • Info: collapsed (blue) 🔵                         │  │
│  │  • Click → mark as read + navigate                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                  │
│                           │ navigate to fridge               │
│                           ▼                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Fridge Page (ЭТАП 5 - TODO)                         │  │
│  │  • ?highlight=itemId                                 │  │
│  │  • Auto-scroll to item                               │  │
│  │  • Pulse animation (3s)                              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Visual States

### Badge States
```
┌─────────────────────────────────────────────┐
│  Critical (count.critical > 0)              │
│  ┌───┐                                      │
│  │ 🔔│  ← Red bell                          │
│  └───┘                                      │
│    (7) ← Red badge with pulse animation    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Warning Only (critical = 0, warning > 0)   │
│  ┌───┐                                      │
│  │ 🔔│  ← Orange bell                       │
│  └───┘                                      │
│    (3) ← Orange badge (no animation)       │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  None (count.total = 0)                     │
│  (badge hidden)                             │
└─────────────────────────────────────────────┘
```

### Panel Layout
```
┌────────────────────────────────────────┐
│  Notifications              [Mark All] [X] │
├────────────────────────────────────────┤
│  🚨 Critical (2)                       │
│  ┌────────────────────────────────┐   │
│  │ 🥩 Product Expiring Today!     │   │
│  │ Salmon expires in 1 day        │   │
│  │ 5min ago                        │   │
│  └────────────────────────────────┘   │
│  ┌────────────────────────────────┐   │
│  │ 🥛 Product Expired!            │   │
│  │ Milk expired 2 days ago        │   │
│  │ 2h ago                          │   │
│  └────────────────────────────────┘   │
│                                        │
│  ⚠️  Warning (5)                       │
│  ┌────────────────────────────────┐   │
│  │ 🥬 Product Expiring Soon        │   │
│  │ Lettuce expires in 3 days      │   │
│  │ 1d ago                          │   │
│  └────────────────────────────────┘   │
│  ... (4 more)                          │
│                                        │
│  ℹ️  Info (10) ▼ (collapsed)           │
│                                        │
└────────────────────────────────────────┘
```

---

## 🔑 Key Rules

### Badge Count Formula
```typescript
badge.count.total = critical + warning
// ❌ Info не считается в badge!
```

### Display Hierarchy
```
Priority 1: Critical (always visible, red, animated)
Priority 2: Warning (always visible, orange)
Priority 3: Info (collapsed, blue, expandable)
```

### State Management
```
Backend decides:     Frontend displays:
├─ critical         ├─ red + pulse
├─ warning          ├─ orange
└─ info             └─ blue (collapsed)

❌ Frontend НИКОГДА не вычисляет уровень важности
✅ Frontend ТОЛЬКО отображает то, что получил
```

---

## 📦 Component Props

### NotificationBadge
```typescript
interface NotificationBadgeProps {
  onClick?: () => void          // Open panel
  className?: string             // Custom styling
  refreshInterval?: number       // Default: 30000ms
}
```

### NotificationPanel
```typescript
interface NotificationPanelProps {
  isOpen: boolean               // Show/hide panel
  onClose: () => void            // Close handler
}
```

---

## 🔌 API Endpoints (Backend TODO)

```
GET    /api/notifications/unread-count
GET    /api/notifications
POST   /api/notifications/:id/resolve
POST   /api/notifications/resolve-all
```

**Authorization:** Bearer token in header  
**Response Format:** JSON (see types in `lib/types/notifications.ts`)

---

## ✅ Status Summary

```
ЭТАП 1: Types        ✅ Complete
ЭТАП 2: API Client   ✅ Complete
ЭТАП 3: Badge        ✅ Complete
ЭТАП 4: Panel UI     ✅ Complete
ЭТАП 5: Integration  📋 TODO (fridge highlight)
```

**Backend:** ⏳ Pending implementation  
**Frontend:** ✅ Ready for integration  

---

## 🎯 Quick Start (After Backend Ready)

1. **Test Badge:**
```bash
# Badge should auto-fetch on mount
# Should show count if > 0
# Should hide if count = 0
```

2. **Test Panel:**
```bash
# Click badge → panel opens
# Critical/Warning always visible
# Info collapsed by default
# Click notification → marks as read + navigates
```

3. **Test Integration:**
```bash
# Click fridge notification
# Should navigate to /fridge?highlight=itemId
# Should scroll to item
# Should pulse for 3 seconds
```

---

**Need Help?** See full documentation: `docs/NOTIFICATION_SYSTEM_IMPLEMENTATION.md`
