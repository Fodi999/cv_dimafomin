# Cookie-Based Authentication для Token Economy

## 🔄 Изменения

### Было (localStorage):
```typescript
// ❌ Плохо: небезопасно, не работает на сервере
const token = localStorage.getItem("authToken");
fetch("/api/endpoint", {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

### Стало (Cookies):
```typescript
// ✅ Хорошо: безопасно, автоматическая передача
fetch("/api/endpoint", {
  credentials: "include" // Браузер автоматически отправляет cookies
});
```

---

## 📝 Обновленные файлы

### 1. Proxy Routes (все упрощены)

**Паттерн для всех proxy routes:**
```typescript
const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE || "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app";

export async function GET(req: Request) {
  const backendUrl = `${BACKEND_URL}/api/endpoint`;

  const res = await fetch(backendUrl, {
    method: "GET",
    headers: {
      Authorization: req.headers.get("authorization") || "",
      Cookie: req.headers.get("cookie") || "",
    },
  });

  const data = await res.text();
  return new Response(data, { status: res.status });
}
```

**Обновленные routes:**
- ✅ `/app/api/admin/token-bank/treasury/route.ts`
- ✅ `/app/api/admin/treasury/stream/route.ts`
- ✅ `/app/api/token-bank/me/route.ts`
- ✅ `/app/api/token-bank/me/transactions/route.ts`
- ✅ `/app/api/tasks/route.ts`

### 2. Frontend компоненты

**RealTimeTreasuryBalance.tsx:**
```typescript
// Было:
const token = localStorage.getItem("authToken");
fetch("/api/admin/token-bank/treasury", {
  headers: { Authorization: `Bearer ${token}` }
});

// Стало:
fetch("/api/admin/token-bank/treasury", {
  credentials: "include"
});
```

**SSE Connection:**
```typescript
// Было:
const token = localStorage.getItem("authToken");
new EventSource(`/api/admin/treasury/stream?token=${token}`);

// Стало:
new EventSource("/api/admin/treasury/stream", {
  withCredentials: true
});
```

---

## 🔐 Как работает Cookie Authentication

### 1. Логин (бэкенд устанавливает cookie)
```
POST /api/auth/login
Response:
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict
```

### 2. Браузер автоматически отправляет cookie
```
GET /api/admin/token-bank/treasury
Cookie: session=abc123
```

### 3. Next.js proxy проксирует cookie
```typescript
// Next.js автоматически получает Cookie из req.headers
const res = await fetch(backendUrl, {
  headers: {
    Cookie: req.headers.get("cookie") || "",
  },
});
```

### 4. Go backend валидирует cookie
```go
// Backend читает cookie и проверяет сессию
session := r.Cookie("session")
```

---

## ✅ Преимущества Cookie-Based Auth

| Критерий | localStorage | Cookies (HttpOnly) |
|----------|-------------|-------------------|
| **XSS защита** | ❌ Уязвимо | ✅ Защищено |
| **CSRF защита** | ✅ Не нужна | ⚠️ Нужна (SameSite) |
| **Server-Side Rendering** | ❌ Не работает | ✅ Работает |
| **Автоматическая передача** | ❌ Нужен код | ✅ Автоматически |
| **Истечение срока** | ❌ Ручное | ✅ Автоматическое |

---

## 🚀 Что нужно на бэкенде

### 1. Установка cookie при логине
```go
http.SetCookie(w, &http.Cookie{
    Name:     "session",
    Value:    jwtToken,
    HttpOnly: true,  // Защита от XSS
    Secure:   true,  // Только HTTPS
    SameSite: http.SameSiteStrictMode, // Защита от CSRF
    MaxAge:   86400, // 24 часа
    Path:     "/",
})
```

### 2. Чтение cookie в middleware
```go
func AuthMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        cookie, err := r.Cookie("session")
        if err != nil {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return
        }
        
        // Валидация JWT
        token := cookie.Value
        // ... validate token
        
        next.ServeHTTP(w, r)
    })
}
```

### 3. CORS настройки
```go
c := cors.New(cors.Options{
    AllowedOrigins:   []string{"http://localhost:3000", "https://dima-fomin.pl"},
    AllowCredentials: true, // ВАЖНО!
    AllowedHeaders:   []string{"Content-Type", "Authorization"},
})
```

---

## 📋 Checklist для бэкенда

- [ ] Установить cookie при успешном логине
- [ ] Добавить `HttpOnly: true` для защиты от XSS
- [ ] Добавить `Secure: true` для HTTPS
- [ ] Добавить `SameSite: Strict` для защиты от CSRF
- [ ] Включить `AllowCredentials: true` в CORS
- [ ] Добавить middleware для чтения cookie
- [ ] Поддерживать оба метода: Cookie И Authorization header (для совместимости)

---

## 🧪 Тестирование

### 1. Проверить cookie в DevTools
```javascript
// В консоли браузера
document.cookie
// Должен показать: "session=..."
```

### 2. Проверить запросы в Network Tab
```
Request Headers:
  Cookie: session=abc123
  
Response Headers (при логине):
  Set-Cookie: session=abc123; HttpOnly; Secure
```

### 3. Проверить автоматическую отправку
```typescript
// Этот запрос должен автоматически включать cookie
fetch("/api/admin/token-bank/treasury", {
  credentials: "include"
});
```

---

## 🐛 Troubleshooting

### Проблема: 401 Unauthorized
**Причина:** Cookie не отправляется
**Решение:**
1. Добавить `credentials: "include"` в fetch
2. Проверить CORS: `AllowCredentials: true`
3. Проверить домены: должны совпадать или использовать SameSite=None

### Проблема: Cookie не устанавливается
**Причина:** CORS или Secure flag
**Решение:**
1. Проверить `Secure: true` только на HTTPS
2. Добавить `SameSite: None` если cross-origin
3. Проверить `Path: "/"` охватывает все роуты

### Проблема: SSE не работает с cookies
**Причина:** EventSource не поддерживает custom headers
**Решение:**
```typescript
// EventSource автоматически отправляет cookies если withCredentials: true
new EventSource("/api/stream", { withCredentials: true });
```

---

## 📚 Дополнительные ресурсы

- [MDN: HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [OWASP: Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [Next.js: API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

## 🎯 Итого

**Все proxy routes теперь:**
1. ✅ Автоматически проксируют `Authorization` header
2. ✅ Автоматически проксируют `Cookie` header
3. ✅ Простые и понятные (без сложной логики)
4. ✅ Безопасные (нет доступа к токенам из JS)
5. ✅ Работают с SSR и client-side

**Frontend компоненты:**
1. ✅ Не используют localStorage
2. ✅ Автоматически отправляют cookies через `credentials: "include"`
3. ✅ Работают без изменений после логина/логаута
