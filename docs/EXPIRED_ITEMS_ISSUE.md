# 🔴 Проблема: Просроченные продукты остаются в холодильнике

## 🚨 Текущая ситуация

При открытии страницы `/fridge` видны просроченные продукты:

| Продукт | Дата ważności | Статус | Должен быть удален |
|---------|---------------|--------|--------------------|
| Wołowina (rostbef) | 7.12.2025 | 🔴 Przeterminowane | ✅ ДА |
| Mleko 3.2% | 9.12.2025 | 🔴 Przeterminowane | ✅ ДА |
| Łosoś | 19.12.2025 | 🔴 Przeterminowane | ✅ ДА |

**Сегодня:** 28.12.2025

## ❌ Ожидаемое поведение

Согласно документации бэкенда (`AUTO_EXPIRED_CLEANUP.md`), при каждом вызове `GET /api/fridge/items` должно происходить:

1. **Автоматическая проверка** всех продуктов на `expires_at < NOW()`
2. **Удаление** просроченных из таблицы `fridge_items`
3. **Создание событий** в `history_events` с типом `expired`
4. **Возврат** только актуальных продуктов

## 🔍 Текущее поведение

Просроченные продукты **остаются в списке** → Автоматическая очистка **не работает**!

## 🛠️ Решения

### Вариант 1: Проверить логику бэкенда

**Файл:** `internal/storage/postgres/fridge.go`

**Метод:** `GetUserItems(ctx context.Context, userID uuid.UUID)`

**Проверить:**
```go
func (s *Storage) GetUserItems(ctx context.Context, userID uuid.UUID) ([]models.FridgeItem, error) {
    // ✅ Должен быть вызов:
    if err := s.cleanupExpiredItems(ctx, userID); err != nil {
        log.Printf("Error cleaning expired items: %v", err)
        // Continue anyway to return existing items
    }
    
    // Запрос к БД...
}
```

**Проверить метод очистки:**
```go
func (s *Storage) cleanupExpiredItems(ctx context.Context, userID uuid.UUID) error {
    // ✅ Запрос должен быть:
    query := `SELECT id, name, quantity, unit, price_per_unit 
              FROM fridge_items 
              WHERE user_id = $1 AND expires_at < NOW()`
    
    // ✅ Должно быть удаление:
    deleteQuery := `DELETE FROM fridge_items WHERE id = $1`
}
```

### Вариант 2: Добавить ручной endpoint для очистки

Если автоматическая очистка не работает, добавить:

**Endpoint:** `POST /api/fridge/cleanup`

```go
func (h *Handler) CleanupExpiredItems(w http.ResponseWriter, r *http.Request) {
    userID := getUserIDFromContext(r.Context())
    
    count, err := h.storage.CleanupExpiredItems(r.Context(), userID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    
    json.NewEncoder(w).Encode(map[string]interface{}{
        "removed": count,
        "message": fmt.Sprintf("%d expired items moved to losses", count),
    })
}
```

### Вариант 3: Добавить фронтенд фильтр (временное решение)

Если бэкенд не может быть исправлен быстро, добавить клиентскую фильтрацию:

```typescript
// app/fridge/page.tsx
const loadFridgeItems = async () => {
  const response = await fridgeApi.getItems(token);
  
  // Client-side filter for expired items
  const now = new Date();
  const validItems = response.items.filter(item => {
    if (!item.expiresAt) return true; // Keep items without expiry
    const expiryDate = new Date(item.expiresAt);
    return expiryDate >= now; // Keep only non-expired
  });
  
  setItems(validItems);
  
  // Show notification if expired items were filtered
  const expiredCount = response.items.length - validItems.length;
  if (expiredCount > 0) {
    setRecentlyExpiredCount(expiredCount);
  }
};
```

## 🧪 Как протестировать исправление

1. **Добавить продукт с истекшим сроком:**
   ```bash
   curl -X POST http://localhost:8080/api/fridge/items \
     -H "Authorization: Bearer $TOKEN" \
     -d '{
       "productId": "uuid",
       "quantity": 1,
       "unit": "kg",
       "expiresAt": "2025-12-01T00:00:00Z"
     }'
   ```

2. **Запросить список холодильника:**
   ```bash
   curl http://localhost:8080/api/fridge/items \
     -H "Authorization: Bearer $TOKEN"
   ```

3. **Ожидаемый результат:**
   - Продукт **не должен** быть в ответе
   - В логах: `"Cleaned up 1 expired items"`

4. **Проверить историю потерь:**
   ```bash
   curl http://localhost:8080/api/history/losses?days=1 \
     -H "Authorization: Bearer $TOKEN"
   ```

5. **Ожидаемый результат:**
   ```json
   {
     "events": [
       {
         "id": "...",
         "name": "Test Product",
         "reason": "expired",
         "loss": 10.50
       }
     ]
   }
   ```

## ✅ Критерии готовности

- [ ] Просроченные продукты НЕ отображаются в `/fridge`
- [ ] При запросе `/api/fridge/items` в логах: `"Cleaned up X expired items"`
- [ ] Просроченные продукты появляются в `/api/history/losses`
- [ ] На фронтенде показывается уведомление о перемещении в отходы

## 📝 Коммит для исправления

```bash
git commit -m "fix: ensure expired items cleanup runs on GET /api/fridge/items

- Verify cleanupExpiredItems is called before returning items
- Add logging for cleaned items count
- Ensure DELETE query executes correctly
- Create history events before deletion
- Test with expired items in database"
```

---

**Приоритет:** 🔴 ВЫСОКИЙ  
**Затронутые пользователи:** ВСЕ  
**Риск:** Пользователи видят просроченные продукты и могут использовать их
