# 🔧 Backend Auth Middleware Fix

**Дата**: 28 декабря 2025
**Проблема**: `/api/history/losses` возвращает 404/401, хотя пользователь авторизован
**Причина**: Endpoint проверяет только `Authorization: Bearer`, игнорируя cookie

---

## 🔍 Диагностика

### ✅ Что работает (через cookie)
- `/api/settings` → 200 OK
- `/api/fridge/items` → 200 OK  
- `/api/user/profile` → 200 OK

### ❌ Что НЕ работает
- `/api/history/losses` → 404/401

### 🧪 Frontend логи
```
GET http://localhost:3000/api/history/losses?days=30 404 (Not Found)
```

Frontend правильно:
- Отправляет `credentials: 'include'`
- Имеет валидный cookie `session`
- Обрабатывает ошибки gracefully

---

## ✅ Решение: Унифицированный requireAuth

### Текущая архитектура (проблемная)

```go
// ❌ Сейчас в /history/losses
func (h *HistoryHandler) GetLosses(w http.ResponseWriter, r *http.Request) {
    // Проверяет ТОЛЬКО header
    authHeader := r.Header.Get("Authorization")
    if authHeader == "" {
        http.Error(w, "Unauthorized", 401)
        return
    }
    // ...
}
```

```go
// ✅ В других endpoints
func (h *FridgeHandler) GetItems(w http.ResponseWriter, r *http.Request) {
    // Проверяет cookie
    user, err := h.getUserFromSession(r)
    if err != nil {
        http.Error(w, "Unauthorized", 401)
        return
    }
    // ...
}
```

---

## 🔑 Унифицированное решение

### 1. Создать единый `requireAuth` middleware

```go
// middleware/auth.go
package middleware

import (
    "context"
    "net/http"
    "strings"
)

type contextKey string

const UserContextKey contextKey = "user"

// RequireAuth проверяет авторизацию: cookie-first + fallback на Bearer header
func RequireAuth(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        var token string
        
        // 1️⃣ Приоритет: проверяем cookie (для browser/SSR)
        if cookie, err := r.Cookie("session"); err == nil && cookie.Value != "" {
            token = cookie.Value
        }
        
        // 2️⃣ Fallback: проверяем Authorization header (для mobile/API)
        if token == "" {
            authHeader := r.Header.Get("Authorization")
            if strings.HasPrefix(authHeader, "Bearer ") {
                token = strings.TrimPrefix(authHeader, "Bearer ")
            }
        }
        
        // 3️⃣ Нет токена → 401
        if token == "" {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return
        }
        
        // 4️⃣ Валидация токена
        user, err := validateToken(token)
        if err != nil {
            http.Error(w, "Invalid token", http.StatusUnauthorized)
            return
        }
        
        // 5️⃣ Сохраняем user в context
        ctx := context.WithValue(r.Context(), UserContextKey, user)
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}

// GetUserFromContext извлекает user из context
func GetUserFromContext(r *http.Request) (*User, error) {
    user, ok := r.Context().Value(UserContextKey).(*User)
    if !ok {
        return nil, errors.New("user not found in context")
    }
    return user, nil
}
```

---

### 2. Применить middleware ко ВСЕМ protected routes

```go
// router/routes.go
package router

func SetupRoutes(r *mux.Router) {
    // Public routes
    r.HandleFunc("/api/auth/login", authHandler.Login).Methods("POST")
    r.HandleFunc("/api/auth/register", authHandler.Register).Methods("POST")
    
    // Protected routes (cookie + Bearer support)
    protected := r.PathPrefix("/api").Subrouter()
    protected.Use(middleware.RequireAuth)
    
    // Settings
    protected.HandleFunc("/settings", settingsHandler.Get).Methods("GET")
    protected.HandleFunc("/settings", settingsHandler.Update).Methods("PUT")
    
    // Fridge
    protected.HandleFunc("/fridge/items", fridgeHandler.GetItems).Methods("GET")
    protected.HandleFunc("/fridge/items", fridgeHandler.AddItem).Methods("POST")
    protected.HandleFunc("/fridge/items/{id}", fridgeHandler.DeleteItem).Methods("DELETE")
    
    // 🔥 History (ГЛАВНОЕ)
    protected.HandleFunc("/history/losses", historyHandler.GetLosses).Methods("GET")
    protected.HandleFunc("/history/recipes", historyHandler.GetRecipes).Methods("GET")
}
```

---

### 3. Упростить handlers (убрать дублирующую auth логику)

```go
// handlers/history.go
package handlers

func (h *HistoryHandler) GetLosses(w http.ResponseWriter, r *http.Request) {
    // ❌ УДАЛИТЬ старую проверку
    // authHeader := r.Header.Get("Authorization")
    // if authHeader == "" { ... }
    
    // ✅ Просто извлекаем user из context
    user, err := middleware.GetUserFromContext(r)
    if err != nil {
        // Этого не должно случиться, т.к. middleware уже проверил
        http.Error(w, "Unauthorized", 401)
        return
    }
    
    // Получаем параметры
    daysStr := r.URL.Query().Get("days")
    days, _ := strconv.Atoi(daysStr)
    if days == 0 {
        days = 30
    }
    
    // Cleanup expired items перед возвратом данных
    if err := h.service.CleanupExpiredItems(user.ID); err != nil {
        log.Printf("Error cleaning expired items: %v", err)
    }
    
    // Получаем данные
    losses, err := h.service.GetLosses(user.ID, days)
    if err != nil {
        http.Error(w, err.Error(), 500)
        return
    }
    
    summary := calculateSummary(losses)
    
    json.NewEncoder(w).Encode(map[string]interface{}{
        "events":  losses,
        "summary": summary,
    })
}
```

---

## 🧪 Проверка после исправлений

### 1. Перезапустить backend
```bash
go run cmd/server/main.go
```

### 2. Проверить логи frontend
Должны увидеть:
```
GET /api/history/losses?days=30 → 200 OK
✅ API Success: { products: 3, totalLoss: 69.71 }
```

### 3. Проверить UI
- Блок потерь появляется
- Уведомления о просроченных продуктах работают
- Нет ошибок в консоли

### 4. Проверить оба варианта auth
```bash
# Тест 1: Cookie (browser)
curl -X GET 'http://localhost:8080/api/history/losses?days=30' \
  -H 'Cookie: session=YOUR_TOKEN' \
  -H 'Content-Type: application/json'

# Тест 2: Bearer header (mobile/API)
curl -X GET 'http://localhost:8080/api/history/losses?days=30' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json'
```

Оба должны вернуть **200 OK**.

---

## 📊 Архитектурные преимущества

### До исправления ❌
- Разрозненная auth логика в каждом handler
- Cookie работает где-то, Bearer где-то
- Дублирование кода
- Сложно тестировать
- Проблемы с mobile/desktop apps

### После исправления ✅
- **Единая точка входа** для auth
- **Cookie-first** (browser/SSR)
- **Bearer fallback** (mobile/API/webhooks)
- **Чистые handlers** (без auth логики)
- **Enterprise-grade** архитектура
- **Готово к масштабированию**

---

## 🔥 Важный вывод

Это **НЕ баг frontend**.

Frontend написан **правильно**:
- ✅ Использует `credentials: 'include'`
- ✅ Использует единый `apiFetch()`
- ✅ Обрабатывает ошибки gracefully
- ✅ Не ломает UI

Проблема была в **рассинхроне backend auth logic**.

После исправления:
- 🎯 Все endpoints работают одинаково
- 🎯 Cookie + Bearer support everywhere
- 🎯 Production-ready архитектура

---

## 📝 Чеклист для backend разработчика

- [ ] Создать `middleware/auth.go` с `RequireAuth`
- [ ] Обновить `router/routes.go` - применить middleware
- [ ] Упростить `handlers/history.go` - убрать дублирующую auth
- [ ] Упростить остальные handlers (по желанию)
- [ ] Протестировать cookie auth
- [ ] Протестировать Bearer auth
- [ ] Проверить frontend логи (200 OK)
- [ ] Проверить UI (блок потерь отображается)
- [ ] Задеплоить на Koyeb
- [ ] Проверить production

---

## 🚀 Deployment checklist (Koyeb)

1. Убедиться что переменные окружения установлены:
   ```
   JWT_SECRET=your_secret
   DATABASE_URL=postgres://...
   ```

2. Пересобрать и задеплоить:
   ```bash
   git add .
   git commit -m "feat: unify auth middleware (cookie + Bearer)"
   git push origin main
   ```

3. Koyeb автоматически задеплоит новую версию

4. Проверить health endpoint:
   ```bash
   curl https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/health
   ```

5. Проверить losses endpoint с production токеном:
   ```bash
   curl -X GET 'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/history/losses?days=30' \
     -H 'Cookie: session=PRODUCTION_TOKEN' \
     -H 'Content-Type: application/json'
   ```

---

**Готово!** 🎉

После этих исправлений система будет работать как единый организм с унифицированной auth логикой.
