# 🎯 Backend Task: Add Notifications on Fridge Actions

**Priority:** P1  
**Estimated time:** 15-20 minutes  
**Type:** Feature Enhancement  
**Updated:** 16 января 2026 - Added delete notification

---

## 📋 Task Description

Add automatic notification creation when user performs actions with fridge items.

**Actions to track:**
1. ✅ Add product → Green notification with Plus icon
2. ✅ Delete product → Red notification with Trash icon
3. 🔜 Discard expired → Orange notification (future)

**Current behavior:**
- User adds/deletes product via API
- Product is saved/deleted in database
- ❌ No notification created

**Expected behavior:**
- User performs action via API
- Database updated
- ✅ **Notification created** with type `fridge`, appropriate level & action
- Frontend shows colored notification immediately

---

## 🔨 Implementation

### 1. Locate the files

Find where fridge actions are handled:

```bash
# Likely files:
internal/modules/fridge/service/fridge_service_v2.go
internal/modules/fridge/transport/http/fridge_handlers.go
```

### 2. Add notification on CREATE

**In `FridgeServiceV2.CreateItem` method (or handler):**

```go
package service

import (
    "context"
    "fmt"
    
    notificationService "github.com/yourusername/backend/internal/modules/notifications/service"
    notificationModel "github.com/yourusername/backend/internal/modules/notifications/domain"
)

func (s *FridgeServiceV2) CreateItem(ctx context.Context, req CreateFridgeItemRequest) (*FridgeItem, error) {
    // ... existing code to create item ...
    
    // Create the fridge item
    item, err := s.repository.Create(ctx, fridgeItem)
    if err != nil {
        return nil, fmt.Errorf("failed to create fridge item: %w", err)
    }
    
    // 🆕 CREATE NOTIFICATION
    err = s.createItemNotification(ctx, item, userID, "item_added")
    if err != nil {
        // ⚠️ Log error but don't fail the request
        log.Printf("Failed to create notification for fridge item: %v", err)
    }
    
    return item, nil
}

// 🆕 NEW METHOD
func (s *FridgeServiceV2) createItemNotification(ctx context.Context, item *FridgeItem, userID string, action string) error {
    // Get ingredient name
    ingredientName := item.Ingredient.Name
    if item.Ingredient.NamePl != "" {
        ingredientName = item.Ingredient.NamePl
    }
    
    // Format quantity
    quantityStr := fmt.Sprintf("%.1f %s", item.Quantity, item.Unit)
    
    // Determine title based on action
    var title string
    switch action {
    case "item_added":
        title = "Produkt dodany"
    case "item_deleted":
        title = "Produkt usunięty"
    default:
        title = "Zmiana w lodówce"
    }
    
    // Create notification
    notification := &notificationModel.Notification{
        UserID:  userID,
        Type:    "fridge",  // Type: fridge (not AI)
        Level:   "info",    // Level: info (not warning/critical)
        Title:   title,
        Message: fmt.Sprintf("%s — %s", ingredientName, quantityStr),
        Metadata: map[string]interface{}{
            "fridgeItemId":  item.ID,
            "ingredientId":  item.IngredientID,
            "quantity":      item.Quantity,
            "unit":          item.Unit,
            "action":        action,  // 🔥 IMPORTANT: Frontend uses this for color coding
        },
        IsRead: false,
    }
    
    return s.notificationService.Create(ctx, notification)
}
```

### 3. Add service dependency

**In `FridgeServiceV2` struct:**

```go
type FridgeServiceV2 struct {
    repository          FridgeRepository
    ingredientService   IngredientService
    notificationService *notificationService.NotificationService  // 🆕 ADD THIS
}

func NewFridgeServiceV2(
    repo FridgeRepository,
    ingredientSvc IngredientService,
    notificationSvc *notificationService.NotificationService,  // 🆕 ADD THIS
) *FridgeServiceV2 {
    return &FridgeServiceV2{
        repository:          repo,
        ingredientService:   ingredientSvc,
        notificationService: notificationSvc,  // 🆕 ADD THIS
    }
}
```

### 4. Wire up in main.go

**In `cmd/server/main.go`:**

```go
// Initialize services
notificationRepo := notificationRepository.NewNotificationRepository(db)
notificationSvc := notificationService.NewNotificationService(notificationRepo, aiService)

fridgeRepo := fridgeRepository.NewFridgeRepository(db)
fridgeSvc := fridgeService.NewFridgeServiceV2(
    fridgeRepo,
    ingredientSvc,
    notificationSvc,  // 🆕 PASS NOTIFICATION SERVICE
)
```

### 5. 🆕 Add notification on DELETE

**In `FridgeServiceV2.DeleteItem` method:**

```go
func (s *FridgeServiceV2) DeleteItem(ctx context.Context, itemID string, userID string) error {
    // 🆕 GET ITEM BEFORE DELETION (for notification)
    item, err := s.repository.GetByID(ctx, itemID)
    if err != nil {
        return fmt.Errorf("failed to get fridge item: %w", err)
    }
    
    // Verify ownership
    if item.UserID != userID {
        return ErrUnauthorized
    }
    
    // Delete the item
    err = s.repository.Delete(ctx, itemID)
    if err != nil {
        return fmt.Errorf("failed to delete fridge item: %w", err)
    }
    
    // 🆕 CREATE DELETE NOTIFICATION
    err = s.createItemNotification(ctx, item, userID, "item_deleted")
    if err != nil {
        // ⚠️ Log error but don't fail the request
        log.Printf("Failed to create delete notification: %v", err)
    }
    
    return nil
}
```

**⚠️ Important:** Get item **before** deletion to have all data for notification.

---

## 📝 Notification Format

### Actions & Colors

| Action | Frontend Color | Icon | Use Case |
|--------|---------------|------|----------|
| `item_added` | 🟢 Green | Plus | User added product |
| `item_deleted` | 🔴 Red | Trash | User deleted product |
| `item_expiring` | 🟡 Orange | Clock | CRON: expires in 1-3 days |
| `item_expired` | 🔴 Red | AlertCircle | CRON: already expired |

### Type & Level
```json
{
  "type": "fridge",
  "level": "info"
}
```

**Why `info` and not `success`?**
- `info` - neutral, informational
- `success` - reserved for completed actions (e.g., "Recipe saved")
- `warning` - for expiring items (CRON job)
- `critical` - for expired items (CRON job)

### Title (i18n)

**Add:**
```
PL: "Produkt dodany do lodówki"
EN: "Product added to fridge"
RU: "Продукт добавлен в холодильник"
```

**Delete:**
```
PL: "Produkt удалён из lodówki"
EN: "Product removed from fridge"
RU: "Продукт удалён из холодильника"
```

**For now:** Use Polish only (backend locale is `pl`)

### Message Format

```
{ingredientName} — {quantity} {unit}
```

**Examples:**
```
Czerwona cebula — 1.3 kg
Mleko 3.2% — 2 l
Jajka — 10 szt
```

### Metadata

```json
{
  "fridgeItemId": "uuid-here",
  "ingredientId": "uuid-here",
  "quantity": 1.3,
  "unit": "kg",
  "action": "item_added"
}
```

**Purpose:**
- `fridgeItemId` - for click-to-action (navigate to item)
- `ingredientId` - for future features (e.g., "Find recipes")
- `action` - for analytics/filtering

---

## 🧪 Testing

### 1. Manual Test

```bash
# 1. Add item
curl -X POST "http://localhost:8080/api/fridge/items" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ingredientId": "2c3405e0-60cf-4e5f-9872-0bb8d1f91b83",
    "quantity": 1.3
  }'

# Expected: 201 Created

# 2. Check notifications
curl -s "http://localhost:8080/api/notifications/unread-count" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Expected: {"count": 1}

# 3. Get notification
curl -s "http://localhost:8080/api/notifications" \
  -H "Authorization: Bearer YOUR_TOKEN" | jq '.data[0]'

# Expected:
# {
#   "type": "fridge",
#   "level": "info",
#   "title": "Produkt dodany do lodówki",
#   "message": "Czerwona cebula — 1.3 kg",
#   "metadata": {
#     "fridgeItemId": "...",
#     "action": "item_added"
#   },
#   "isRead": false
# }
```

### 2. Integration Test

```go
func TestCreateItem_CreatesNotification(t *testing.T) {
    // Arrange
    mockNotificationSvc := &MockNotificationService{}
    service := NewFridgeServiceV2(mockRepo, mockIngredientSvc, mockNotificationSvc)
    
    // Act
    item, err := service.CreateItem(ctx, req)
    
    // Assert
    assert.NoError(t, err)
    assert.NotNil(t, item)
    assert.Equal(t, 1, mockNotificationSvc.CreateCallCount)
    assert.Equal(t, "fridge", mockNotificationSvc.LastNotification.Type)
    assert.Equal(t, "info", mockNotificationSvc.LastNotification.Level)
}
```

---

## 🎯 Success Criteria

✅ After adding product via UI:
- Notification appears in dropdown
- Badge shows count: 🔔 **(1)**
- Notification text: "{Product} — {quantity} {unit}"
- Notification type: `fridge` / `info`

✅ Error handling:
- If notification creation fails, product is still added
- Error is logged but doesn't break the flow

✅ Performance:
- Adding product takes < 1s total
- Notification creation is non-blocking

---

## 🔗 Related Files

**Backend:**
- `internal/modules/fridge/service/fridge_service_v2.go`
- `internal/modules/notifications/service/notification_service.go`
- `cmd/server/main.go`

**Frontend (already ready):**
- `components/NotificationCenter.tsx`
- `hooks/useNotifications.ts`
- `app/api/notifications/**`

**Documentation:**
- `docs/NOTIFICATION_SYSTEM_GUIDE.md`
- `docs/NOTIFICATIONS_QUICK_REF.md`

---

## 📊 Timeline

- **Implementation:** 10 minutes
- **Testing:** 5 minutes
- **Total:** 15 minutes

---

## 🚀 Deployment

After implementation:

```bash
# 1. Test locally
go test ./internal/modules/fridge/...

# 2. Commit
git add -A
git commit -m "feat: Add notification on fridge item creation

- Create 'fridge' notification when user adds product
- Type: fridge, Level: info
- Non-blocking, errors logged only
- Closes #NOTIFICATION-ITEM-ADDED"

# 3. Push
git push origin main

# 4. Koyeb will auto-deploy
# 5. Test in production
```

---

**Assigned to:** Backend Developer  
**Reviewer:** Tech Lead  
**Status:** 📝 Ready for implementation

---

Made with ❤️ for FodiFoods MVP
