# ⚡ Quick Auth Fix - 5 минут

**Проблема**: `/api/history/losses` → 404/401
**Причина**: Endpoint проверяет только Bearer header, игнорирует cookie

---

## 🔧 Решение (Go Backend)

### 1️⃣ Создать `middleware/auth.go`

```go
package middleware

import (
    "context"
    "net/http"
    "strings"
)

type contextKey string
const UserContextKey contextKey = "user"

func RequireAuth(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        var token string
        
        // Cookie-first
        if cookie, err := r.Cookie("session"); err == nil {
            token = cookie.Value
        }
        
        // Fallback: Bearer header
        if token == "" {
            if auth := r.Header.Get("Authorization"); strings.HasPrefix(auth, "Bearer ") {
                token = strings.TrimPrefix(auth, "Bearer ")
            }
        }
        
        if token == "" {
            http.Error(w, "Unauthorized", 401)
            return
        }
        
        user, err := validateToken(token)
        if err != nil {
            http.Error(w, "Invalid token", 401)
            return
        }
        
        ctx := context.WithValue(r.Context(), UserContextKey, user)
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}
```

---

### 2️⃣ Применить к `/history` routes

```go
// router/routes.go
protected := r.PathPrefix("/api").Subrouter()
protected.Use(middleware.RequireAuth)

// Все protected endpoints
protected.HandleFunc("/history/losses", historyHandler.GetLosses).Methods("GET")
protected.HandleFunc("/fridge/items", fridgeHandler.GetItems).Methods("GET")
protected.HandleFunc("/settings", settingsHandler.Get).Methods("GET")
```

---

### 3️⃣ Упростить handler

```go
// handlers/history.go
func (h *HistoryHandler) GetLosses(w http.ResponseWriter, r *http.Request) {
    // ❌ Удалить
    // authHeader := r.Header.Get("Authorization")
    // if authHeader == "" { return 401 }
    
    // ✅ Просто извлечь из context
    user := r.Context().Value(middleware.UserContextKey).(*User)
    
    // Cleanup expired items
    h.service.CleanupExpiredItems(user.ID)
    
    // Get losses
    losses, _ := h.service.GetLosses(user.ID, 30)
    json.NewEncoder(w).Encode(map[string]interface{}{
        "events": losses,
        "summary": calculateSummary(losses),
    })
}
```

---

## ✅ Результат

```
GET /api/history/losses?days=30 → 200 OK
{
  "events": [...],
  "summary": { "products": 3, "totalLoss": 69.71 }
}
```

**Frontend не требует изменений!** ✅

---

## 🧪 Тест

```bash
# Cookie auth
curl -H 'Cookie: session=TOKEN' http://localhost:8080/api/history/losses?days=30

# Bearer auth
curl -H 'Authorization: Bearer TOKEN' http://localhost:8080/api/history/losses?days=30
```

Оба должны вернуть **200 OK**.

---

**Время исправления**: 5 минут  
**Файлов изменено**: 2-3  
**Frontend изменений**: 0 ✅
