# Smart Fridge & Notifications - Implementation Guide

**Date**: 2026-01-15  
**Status**: 🚧 In Progress  
**Priority**: P0 (Critical UX)

---

## Philosophy

> **Frontend = визуализация решений backend-а**

### ❌ Frontend НЕ должен:
- Считать сроки годности
- Фильтровать expired на клиенте
- Дублировать бизнес-логику
- Добавлять "умные" useEffect'ы

### ✅ Frontend ДОЛЖЕН:
- Рендерить то, что дал backend
- Показывать риск и деньги
- Использовать уведомления как центр событий
- Делать холодильник "умным", а не списком

---

## 🔴 P0: Must Have (Critical)

### 1. Unified Notification Center ✅

**Goal**: Single place for ALL notifications (AI, Fridge, Orders, Errors, System)

#### API Routes Created:
```typescript
✅ GET  /api/notifications                    // List with filters
✅ GET  /api/notifications/unread-count       // Badge counter
✅ PATCH /api/notifications/:id/read          // Mark single as read
✅ POST /api/notifications/read-all           // Mark all as read
```

#### Hook Created:
```typescript
// hooks/useNotifications.ts
export function useNotifications(filters?: {
  page?: number;
  limit?: number;
  unread?: boolean;
  type?: 'ai' | 'fridge' | 'order' | 'system' | 'error';
}) {
  return {
    notifications,      // Notification[]
    unreadCount,        // number
    isLoading,          // boolean
    meta,               // pagination
    markAsRead,         // (id: string) => Promise<boolean>
    markAllAsRead,      // () => Promise<boolean>
    refetch,            // () => void
  };
}
```

#### Component Created:
```typescript
// components/NotificationCenter.tsx
<NotificationCenter />
```

**Features**:
- 🔔 Bell icon with unread badge
- 📋 Dropdown with all notification types
- 🎨 Type-specific icons (Sparkles for AI, Refrigerator for Fridge)
- ⚡ Click-to-action (navigate to fridge/recipe)
- ♻️ Auto-refresh every 30 seconds
- ✅ Mark as read functionality

---

### 2. Fridge: Show ONLY Fresh ⏳

**Status**: TODO

**Goal**: Main fridge screen shows ONLY fresh products (backend decides)

#### Implementation:
```typescript
// app/fridge/page.tsx
export default function FridgePage() {
  const { items } = useFridgeItems({ view: 'fresh' }); // ✅ Default view
  
  return (
    <>
      {/* ❌ NO filtering by dates on frontend */}
      {items.map(item => (
        <FridgeItemCard key={item.id} item={item} />
      ))}
    </>
  );
}
```

**Rules**:
- ❌ NO `if (item.expiresAt < today)` on frontend
- ❌ NO client-side date calculations
- ✅ Render what backend returns
- ✅ If backend didn't return expired → don't show them

---

### 3. "Virtual Trash" Tab ⏳

**Status**: TODO

**Goal**: Second tab showing money lost (expired/discarded items)

#### UI Structure:
```typescript
<Tabs defaultValue="fresh">
  <TabsList>
    <TabsTrigger value="fresh">🧊 Fridge</TabsTrigger>
    <TabsTrigger value="trash">🗑️ Losses</TabsTrigger>
  </TabsList>

  <TabsContent value="fresh">
    <FridgeItemsList view="fresh" />
  </TabsContent>

  <TabsContent value="trash">
    <FridgeLossesList view="trash" />
  </TabsContent>
</Tabs>
```

#### API:
```typescript
GET /api/fridge/items?view=trash
```

#### Data Structure:
```typescript
interface FridgeLoss {
  id: string;
  productName: string;
  expiresAt: string;
  priceLost: number;         // 🔴 Money at risk
  status: 'expired' | 'discarded';
  discardedAt?: string;
}
```

#### Display:
- Product name
- Expiration date
- **Price lost (RED)**: `124.50 PLN` 
- Status badge: "Expired" or "Discarded"
- ❌ NO "Cook" buttons (this is history)

---

## 🟡 P1: Enhanced Value (Recommended)

### 4. Visual Urgency Markers ⏳

**Status**: TODO

**Goal**: Color-code products by urgency (backend provides `daysLeft`)

#### Rules:
```typescript
daysLeft === 0  → 🔴 Red (urgent!)
daysLeft === 1  → 🟠 Orange (today/tomorrow)
daysLeft === 2-3 → 🟡 Yellow (soon)
daysLeft > 3    → 🟢 Green (safe)
```

#### Implementation:
```typescript
// lib/utils/urgency.ts
export function getUrgencyColor(daysLeft: number): string {
  if (daysLeft === 0) return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  if (daysLeft === 1) return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
  if (daysLeft <= 3) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
  return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
}

export function getUrgencyBadge(daysLeft: number): { text: string; variant: string } {
  if (daysLeft === 0) return { text: 'Use today!', variant: 'destructive' };
  if (daysLeft === 1) return { text: 'Expires tomorrow', variant: 'warning' };
  if (daysLeft <= 3) return { text: `${daysLeft} days left`, variant: 'secondary' };
  return { text: 'Fresh', variant: 'success' };
}
```

**Usage**:
```tsx
<Card className={getUrgencyColor(item.daysLeft)}>
  <Badge variant={getUrgencyBadge(item.daysLeft).variant}>
    {getUrgencyBadge(item.daysLeft).text}
  </Badge>
</Card>
```

❌ **NOT** calculating dates on frontend  
✅ **ONLY** styling based on backend's `daysLeft`

---

### 5. CTA from Notification → Fridge ⏳

**Status**: TODO

**Goal**: Click AI notification → navigate to fridge with highlighted item

#### Flow:
```
1. User gets notification: "Cook carp today (expires in 0 days, 15.50 PLN at risk)"
2. User clicks notification
3. → Navigate to /fridge?highlight={itemId}
4. → Scroll to item + highlight with animation
5. → Show "Cook" CTA
```

#### Implementation:
```typescript
// app/fridge/page.tsx
export default function FridgePage() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get('highlight');
  
  return (
    <>
      {items.map(item => (
        <FridgeItemCard
          key={item.id}
          item={item}
          highlighted={item.id === highlightId}  // ✅ Visual highlight
        />
      ))}
    </>
  );
}

// components/fridge/FridgeItemCard.tsx
export function FridgeItemCard({ item, highlighted }) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (highlighted && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlighted]);
  
  return (
    <Card
      ref={ref}
      className={cn(
        "transition-all duration-300",
        highlighted && "ring-2 ring-blue-500 shadow-lg"
      )}
    >
      {/* ... */}
    </Card>
  );
}
```

---

## 🟢 P2: Wow Effect (After Stabilization)

### 6. AI Recommendations Block ⏳

**Status**: TODO

**Goal**: "What to cook today" block with top 2-3 urgent products

#### UI:
```tsx
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Sparkles className="w-5 h-5" />
      AI Recommendations
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-3">
      {urgentItems.slice(0, 3).map(item => (
        <div key={item.id} className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          <div className="flex-1">
            <p className="font-medium">{item.productName}</p>
            <p className="text-sm text-muted-foreground">
              {item.daysLeft === 0 ? 'Expires today' : `${item.daysLeft} days left`}
              {item.price && ` • ${item.price.toFixed(2)} PLN at risk`}
            </p>
          </div>
          <Button size="sm" variant="default">
            Find Recipe
          </Button>
        </div>
      ))}
    </div>
  </CardContent>
</Card>
```

#### Data:
```typescript
GET /api/fridge/items?view=fresh&sort=urgency&limit=3
```

---

### 7. Mini Analytics ⏳

**Status**: TODO

**Goal**: Show money lost in last 30 days

#### UI:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Losses (Last 30 Days)</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold text-red-600 dark:text-red-400">
      {losses.total.toFixed(2)} PLN
    </div>
    <p className="text-sm text-muted-foreground mt-1">
      {losses.itemCount} products discarded
    </p>
  </CardContent>
</Card>
```

#### API:
```typescript
GET /api/fridge/analytics?period=30
```

#### Response:
```json
{
  "success": true,
  "data": {
    "total": 124.50,
    "itemCount": 12,
    "topLosses": [
      { "product": "Carp fillet", "price": 45.00, "date": "2026-01-10" },
      { "product": "Chicken breast", "price": 28.50, "date": "2026-01-08" }
    ]
  }
}
```

---

## Files Created

### API Routes
- ✅ `app/api/notifications/route.ts`
- ✅ `app/api/notifications/unread-count/route.ts`
- ✅ `app/api/notifications/[id]/read/route.ts`
- ✅ `app/api/notifications/read-all/route.ts`

### Hooks
- ✅ `hooks/useNotifications.ts`

### Components
- ✅ `components/NotificationCenter.tsx`

### Utils (TODO)
- ⏳ `lib/utils/urgency.ts` - Color/badge helpers

### Pages (TODO)
- ⏳ `app/fridge/page.tsx` - Update with tabs
- ⏳ `app/notifications/page.tsx` - Full notifications page

---

## Implementation Order

### Phase 1: Notifications (✅ Complete)
1. ✅ API routes for notifications
2. ✅ `useNotifications` hook
3. ✅ `NotificationCenter` component
4. ⏳ Replace old `NotificationBell` with `NotificationCenter`

### Phase 2: Fridge Fresh View (⏳ Next)
1. ⏳ Update `/fridge` to show only `view=fresh`
2. ⏳ Remove client-side date filtering
3. ⏳ Add tabs: Fridge / Losses

### Phase 3: Losses Tab
1. ⏳ Create `FridgeLossesList` component
2. ⏳ Add API call with `view=trash`
3. ⏳ Show price lost prominently

### Phase 4: Urgency Colors
1. ⏳ Create `urgency.ts` utility
2. ⏳ Apply color coding to fridge items
3. ⏳ Add urgency badges

### Phase 5: Smart CTAs
1. ⏳ Implement `highlight` query param
2. ⏳ Scroll + highlight animation
3. ⏳ Link from notifications

### Phase 6: AI Recommendations
1. ⏳ Create AI recommendations block
2. ⏳ Fetch top 3 urgent items
3. ⏳ Add "Find Recipe" CTA

### Phase 7: Analytics
1. ⏳ Create analytics API endpoint
2. ⏳ Display mini analytics card
3. ⏳ Add historical loss tracking

---

## Backend Requirements

### APIs Needed:
```typescript
✅ GET  /api/notifications
✅ GET  /api/notifications/unread-count
✅ PATCH /api/notifications/:id/read
✅ POST /api/notifications/read-all
⏳ GET  /api/fridge/items?view=fresh|trash
⏳ GET  /api/fridge/items?sort=urgency
⏳ GET  /api/fridge/analytics?period=30
```

### Data Structure:
```typescript
interface FridgeItem {
  id: string;
  userId: string;
  productName: string;
  quantity: number;
  unit: string;
  price: number;
  purchasedAt: string;
  expiresAt: string;
  daysLeft: number;        // ✅ Backend calculates
  status: 'fresh' | 'expiring' | 'expired';  // ✅ Backend decides
  createdAt: string;
}

interface Notification {
  id: string;
  userId: string;
  type: 'ai' | 'fridge' | 'order' | 'system' | 'error';
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

## Key Principles

### 1. Trust Backend
```typescript
// ❌ DON'T
if (new Date(item.expiresAt) < new Date()) {
  // filter expired
}

// ✅ DO
const { items } = useFridgeItems({ view: 'fresh' });
// Backend already filtered
```

### 2. Visualize, Don't Calculate
```typescript
// ❌ DON'T
const daysLeft = Math.floor((new Date(item.expiresAt) - new Date()) / 86400000);

// ✅ DO
const { daysLeft } = item; // Backend provides this
```

### 3. Unified Notifications
```typescript
// ✅ ALL notifications in ONE place
- AI: "Cook carp today"
- Fridge: "3 items expiring"
- Orders: "New order #123"
- System: "Backup complete"
- Errors: "API unavailable"
```

### 4. Money First
```typescript
// ✅ Show financial impact
<span className="text-red-600 font-bold">
  {item.price.toFixed(2)} PLN at risk
</span>
```

---

## Next Steps

1. **Replace NotificationBell** with NotificationCenter in layout
2. **Update Fridge page** with tabs (Fresh / Losses)
3. **Create urgency utils** for color coding
4. **Implement highlight** from notification clicks
5. **Add AI recommendations** block
6. **Create analytics** endpoint and display

---

**Status**: Phase 1 Complete ✅  
**Next**: Phase 2 - Fridge Fresh View
