# 🔔 Notification System - Quick Reference

**Last updated:** 15 января 2026  
**Status:** ✅ Production Ready

---

## 🚀 Quick Start

### 1. Show Notifications in Component

```typescript
import { useNotifications } from '@/hooks/useNotifications';

function MyComponent() {
  const { notifications, unreadCount, isLoading } = useNotifications();
  
  return (
    <div>
      {isLoading ? 'Loading...' : `${unreadCount} unread`}
      {notifications.map(n => (
        <div key={n.id}>{n.title}: {n.message}</div>
      ))}
    </div>
  );
}
```

---

## 🔄 Trigger Refetch After Action

```typescript
import { useNotificationRefetch } from '@/contexts/NotificationRefetchContext';

function MyComponent() {
  const { triggerRefetch } = useNotificationRefetch();
  
  const handleAction = async () => {
    await performAction(); // Create product, delete item, etc.
    triggerRefetch(); // 🔥 Update notification badge immediately
  };
  
  return <button onClick={handleAction}>Do Action</button>;
}
```

---

## 🎯 Navigate with Highlight

```typescript
// In notification click handler:
router.push(`/fridge?highlight=${fridgeItemId}`);

// In target page:
const searchParams = useSearchParams();
const highlightId = searchParams.get('highlight');

<FridgeList highlightId={highlightId} />
```

---

## 📊 Notification Object

```typescript
interface Notification {
  id: string;
  userId: string;
  type: 'ai' | 'fridge' | 'order' | 'system' | 'error';
  level: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  data?: {
    fridgeItemId?: string;
    productName?: string;
    daysLeft?: number;
    price?: number;
    link?: string;
  };
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}
```

---

## 🎨 Notification Types & Icons

```typescript
type: 'ai'      → <Sparkles /> (Purple)
type: 'fridge'  → <Refrigerator /> (Blue)
type: 'order'   → <ShoppingBag /> (Green)
type: 'error'   → <AlertCircle /> (Red)
type: 'system'  → <CheckCircle /> (Gray)
```

---

## 🔧 Backend Integration

### Create Notification (Backend Task)

```go
// In fridge service after creating item:
notification := &Notification{
    UserID:  userID,
    Type:    "fridge",
    Level:   "info",
    Title:   "Produkt dodany do lodówki",
    Message: fmt.Sprintf("%s — %.0f %s", ingredientName, quantity, unit),
    Metadata: map[string]interface{}{
        "fridgeItemId": item.ID,
        "action": "item_added",
    },
    IsRead: false,
}
notificationService.Create(ctx, notification)
```

---

## 📡 API Endpoints

```bash
# Get all notifications
GET /api/notifications?page=1&limit=20&type=fridge&unread=true

# Get unread count
GET /api/notifications/unread-count

# Mark as read
PATCH /api/notifications/{id}/read

# Mark all as read
POST /api/notifications/read-all
```

---

## 🧪 Test Commands

```bash
# Check backend health
curl https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/health

# Get notifications
curl -s "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/notifications" \
  -H "Authorization: Bearer YOUR_TOKEN" | jq

# Get unread count
curl -s "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/notifications/unread-count" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎯 Common Patterns

### 1. Refetch After Multiple Actions

```typescript
const { triggerRefetch } = useNotificationRefetch();

const actions = {
  addItem: async () => { await api.add(); triggerRefetch(); },
  deleteItem: async () => { await api.delete(); triggerRefetch(); },
  updateItem: async () => { await api.update(); triggerRefetch(); },
};
```

### 2. Filter Notifications

```typescript
// Only fridge notifications
const { notifications } = useNotifications({ type: 'fridge' });

// Only unread
const { notifications } = useNotifications({ unread: true });

// Paginated
const { notifications, meta } = useNotifications({ page: 2, limit: 10 });
```

### 3. Manual Refetch

```typescript
const { refetch, refetchUnreadCount } = useNotifications();

// Refetch both
refetch();
refetchUnreadCount();
```

---

## 🐛 Troubleshooting

### Notifications Not Updating

```typescript
// 1. Check provider is mounted
<NotificationRefetchProvider>
  <YourApp />
</NotificationRefetchProvider>

// 2. Check refetch is registered
// In NotificationCenter.tsx:
useEffect(() => {
  registerRefetch(() => {
    refetch();
    refetchUnreadCount();
  });
}, [registerRefetch]);

// 3. Check trigger is called
const { triggerRefetch } = useNotificationRefetch();
triggerRefetch(); // After action
```

### Badge Not Updating

```bash
# Check backend response
curl -s ".../api/notifications/unread-count" -H "Authorization: Bearer TOKEN"

# Should return:
{"data": {"count": 3}}
```

### Highlight Not Working

```typescript
// 1. Check URL has highlight param
console.log(searchParams.get('highlight')); // Should print UUID

// 2. Check prop is passed
<FridgeList highlightId={highlightId} />

// 3. Check item exists
console.log(items.find(i => i.id === highlightId)); // Should print item
```

---

## 📚 Documentation

- **Full Guide:** `docs/active/NOTIFICATIONS_COMPLETE_IMPLEMENTATION.md`
- **Backend Task:** `docs/active/BACKEND_TASK_NOTIFICATION_ON_ADD.md`
- **System Design:** `docs/NOTIFICATION_SYSTEM_GUIDE.md`

---

**Made with ❤️ for FodiFoods MVP**
