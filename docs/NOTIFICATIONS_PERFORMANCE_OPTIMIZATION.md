# Notifications Performance Optimization

**Date**: 2026-01-16  
**Issue**: Slow SQL queries for notifications unread count (1.2s instead of 35ms)  
**Impact**: Backend logs show SLOW SQL warnings every polling interval

---

## 🔴 Problem

Backend logs showed:
```
[SLOW SQL >= 200ms] [1201.59ms] [rows:1] 
SELECT count(*) FROM "notifications" 
WHERE user_id = '407582be-59d5-4d21-873b-1a72d31b0d42' AND read_at IS NULL
```

- Query was running every **30 seconds** (too frequent)
- Sometimes took **1.2 seconds** vs normal 35ms
- Causing unnecessary backend load

---

## ✅ Frontend Optimizations (COMPLETED)

### 1. Increased Polling Interval
**Before**: 30 seconds  
**After**: 180 seconds (3 minutes)

**Rationale**:
- Notifications don't need real-time updates every 30s
- 3 minutes is reasonable for non-critical updates
- Reduces backend load by 6x

### 2. Visibility Check
**Added**: Only poll when page is visible

```typescript
if (document.visibilityState === 'visible') {
  fetchUnreadCount();
}
```

**Benefits**:
- No polling when user has tab in background
- Automatic fetch when user returns to tab
- Further reduces unnecessary API calls

### 3. File Changed
`/hooks/useNotifications.ts` lines 169-193

---

## 🔧 Backend Recommendations (TODO)

### Priority 1: Database Index
**Add composite index for faster queries:**

```sql
CREATE INDEX idx_notifications_user_unread 
ON notifications (user_id, read_at) 
WHERE read_at IS NULL;
```

**Expected Impact**:
- Query time: 1200ms → ~10ms
- Uses partial index (only unread notifications)
- Highly selective on user_id + read_at

### Priority 2: Caching Layer
**Implement Redis caching:**

```go
// Cache key: "notifications:unread:{userId}"
// TTL: 60 seconds

func GetUnreadCount(userId string) (int, error) {
    // Try cache first
    cached, err := redis.Get(ctx, "notifications:unread:" + userId)
    if err == nil {
        return strconv.Atoi(cached)
    }
    
    // Fallback to DB
    count := db.Model(&Notification{}).
        Where("user_id = ? AND read_at IS NULL", userId).
        Count(&count)
    
    // Cache for 60 seconds
    redis.SetEx(ctx, "notifications:unread:" + userId, count, 60)
    
    return count, nil
}
```

**Benefits**:
- Near-instant response from cache
- DB only hit once per minute per user
- Auto-invalidate on notification create/update

### Priority 3: Consider Real-Time Alternatives
**Instead of polling, use:**

1. **Server-Sent Events (SSE)**
   - One-way server → client stream
   - Lighter than WebSocket
   - Good for notifications

2. **WebSocket**
   - Full duplex
   - Overkill for just notifications

**Example SSE endpoint:**
```go
GET /api/notifications/stream
Content-Type: text/event-stream

event: unread-count
data: {"count": 3}

event: new-notification
data: {"id": "123", "title": "New message"}
```

---

## 📊 Expected Results

| Metric | Before | After Frontend | After Backend |
|--------|--------|----------------|---------------|
| Poll Frequency | 30s | 180s | Real-time (SSE) |
| API Calls/Hour | 120 | 20 | 0 (push) |
| Query Time | 1200ms | 1200ms | 10ms |
| Backend Load | High | Low | Minimal |

---

## 🧪 Testing

### Frontend Changes (Already Deployed)
- [x] Verify polling interval is 3 minutes
- [x] Test visibility change triggers fetch
- [x] Confirm no polling when tab hidden
- [x] Check unread count updates correctly

### Backend Changes (Pending)
- [ ] Add database index
- [ ] Test query performance with EXPLAIN
- [ ] Implement Redis caching
- [ ] Load test with 1000 concurrent users
- [ ] Consider SSE implementation

---

## 📝 Notes

1. **Why 3 minutes?**
   - Balance between freshness and performance
   - Users can manually refresh if needed
   - Exposed `refetchUnreadCount()` for manual trigger

2. **Visibility API Support**
   - Supported in all modern browsers
   - Graceful degradation (still polls if not supported)

3. **Future Improvements**
   - Add exponential backoff on errors
   - Implement SWR (stale-while-revalidate) pattern
   - Add React Query for better caching

---

## 🔗 Related Files

- `/hooks/useNotifications.ts` - Frontend polling logic
- `/app/api/notifications/unread-count/route.ts` - API endpoint
- Backend: `notifications` table schema (needs index)

---

## ✅ Status

- **Frontend**: ✅ COMPLETE
- **Backend Index**: ⏳ RECOMMENDED
- **Backend Cache**: ⏳ OPTIONAL
- **SSE Migration**: 💡 FUTURE CONSIDERATION
