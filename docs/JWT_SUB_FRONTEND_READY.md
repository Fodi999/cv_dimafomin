# ✅ JWT SUB - FRONTEND ГОТОВ

**Дата:** 16 января 2026  
**Статус:** ✅ Frontend обновлён, ждёт backend фикса

---

## 🎯 Что Сделано

### Frontend готов к работе с `sub`:

1. **TokenValidator.tsx** ✅
   - Декодирует JWT и проверяет наличие `sub`
   - Сохраняет `payload.sub` в `localStorage.userId`
   - Логирует предупреждение если `sub` отсутствует
   - **НЕ** логаутит (для обратной совместимости)

2. **AuthContext.tsx** ✅
   - При login декодирует JWT и сохраняет `sub` в `localStorage.userId`
   - При register декодирует JWT и сохраняет `sub` в `localStorage.userId`
   - При logout очищает `localStorage.userId`

3. **RecipeContext.tsx** ✅
   - Проверяет наличие `userId` перед очисткой localStorage
   - Если `userId` есть → **НЕ очищает** данные
   - Логирует причину: `"User ID present, preserving data"`

---

## 🔄 Как Работает Сейчас

### Сценарий 1: Backend УЖЕ отправляет `sub` ✅

```bash
# 1. Login/Register → Backend возвращает JWT:
{
  "sub": "407582be-59d5-4d21-873b-1a72d31b0d42",
  "email": "fodi85@gmail.ru",
  "role": "home_chef"
}

# 2. AuthContext декодирует JWT:
✅ User ID from sub: 407582be-59d5-4d21-873b-1a72d31b0d42

# 3. TokenValidator сохраняет userId:
✅ User ID saved: 407582be-59d5-4d21-873b-1a72d31b0d42

# 4. RecipeContext проверяет userId:
✅ RecipeContext: User ID present, preserving data
💾 RecipeContext: Saved to localStorage

# ✅ РЕЗУЛЬТАТ: Данные НЕ очищаются
```

---

### Сценарий 2: Backend ЕЩЁ НЕ отправляет `sub` ⚠️

```bash
# 1. Login/Register → Backend возвращает JWT БЕЗ sub:
{
  "email": "fodi85@gmail.ru",
  "role": "home_chef"
  # ❌ sub отсутствует
}

# 2. AuthContext пытается декодировать:
⚠️ Token missing 'sub' - userId not saved

# 3. TokenValidator предупреждает:
❌ Token missing 'sub' claim - INVALID TOKEN
⚠️ Backend must include 'sub' (user.id) in JWT

# 4. RecipeContext проверяет userId:
🗑️ RecipeContext: Cleared localStorage (no userId)

# ⚠️ РЕЗУЛЬТАТ: Данные очищаются (как раньше)
```

**Вывод:** Frontend готов к обоим сценариям, но полная функциональность требует `sub` в JWT.

---

## 🔥 Следующий Шаг: Backend

### Обязательное изменение в Go:

**Файл:** `handlers/auth.go` (или аналогичный)

```go
// ❌ СЕЙЧАС (неправильно):
claims := jwt.MapClaims{
  "email": user.Email,
  "role":  user.Role,
  // sub отсутствует ❌
}

// ✅ ДОЛЖНО БЫТЬ (правильно):
claims := jwt.MapClaims{
  "sub":   user.ID.String(),  // 🔥 ДОБАВИТЬ ЭТУ СТРОКУ
  "email": user.Email,
  "role":  user.Role,
  "exp":   time.Now().Add(24 * time.Hour).Unix(),
}

token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
signedToken, err := token.SignedString([]byte(jwtSecret))
```

---

## 📋 Изменённые Файлы

### 1. `components/auth/TokenValidator.tsx`

**Добавлено:**
```typescript
// Проверка наличия sub
if (!payload.sub) {
  console.error("❌ Token missing 'sub' claim - INVALID TOKEN");
  console.warn("⚠️ Backend must include 'sub' (user.id) in JWT");
} else {
  // Сохранить userId из sub
  localStorage.setItem('userId', payload.sub);
  console.log(`✅ User ID saved: ${payload.sub}`);
}
```

---

### 2. `contexts/AuthContext.tsx`

**Добавлено в login():**
```typescript
// Декодировать JWT для получения sub
try {
  const payload = JSON.parse(atob(token.split('.')[1]));
  if (payload.sub) {
    localStorage.setItem("userId", payload.sub);
    console.log("✅ User ID from sub:", payload.sub);
  } else {
    console.warn("⚠️ Token missing 'sub' - userId not saved");
  }
} catch (e) {
  console.error("❌ Failed to decode JWT:", e);
}
```

**Добавлено в register():**
```typescript
// То же самое - декодировать JWT и сохранить sub
```

**Добавлено в logout():**
```typescript
localStorage.removeItem("userId");  // 🔥 Очистить userId из sub
```

---

### 3. `contexts/RecipeContext.tsx`

**Изменена логика очистки:**
```typescript
// 🔥 КРИТИЧНО: Только очищать если нет userId
const userId = localStorage.getItem("userId");
if (!userId) {
  // Нет userId → очистить
  localStorage.removeItem(STORAGE_KEY);
  console.log("🗑️ RecipeContext: Cleared localStorage (no userId)");
} else {
  // userId есть → НЕ очищать
  console.log("✅ RecipeContext: User ID present, preserving data");
}
```

---

## ✅ Ожидаемый Результат После Backend Фикса

### Логи в консоли:

```bash
# TokenValidator:
✅ Token validated: {
  sub: "407582be-59d5-4d21-873b-1a72d31b0d42",
  email: "fodi85@gmail.ru",
  role: "home_chef"
}
✅ User ID saved: 407582be-59d5-4d21-873b-1a72d31b0d42

# AuthContext (login):
✅ Login successful, role: home_chef
✅ User ID from sub: 407582be-59d5-4d21-873b-1a72d31b0d42

# RecipeContext:
✅ RecipeContext: User ID present, preserving data
💾 RecipeContext: Saved to localStorage

# ❌ БОЛЬШЕ НЕ ДОЛЖНО БЫТЬ:
🗑️ RecipeContext: Cleared localStorage
```

---

## 🐛 Как Проверить

### 1. Открой консоль браузера

```bash
# Перезагрузи страницу (авторизованный пользователь)
# Смотри логи:

# Если backend УЖЕ отправляет sub:
✅ User ID saved: 407582be-...
✅ RecipeContext: User ID present, preserving data

# Если backend ЕЩЁ НЕ отправляет sub:
❌ Token missing 'sub' claim - INVALID TOKEN
⚠️ Backend must include 'sub' (user.id) in JWT
🗑️ RecipeContext: Cleared localStorage (no userId)
```

---

### 2. Проверь localStorage

```bash
# Открой DevTools → Application → Local Storage
# Должны быть:
- token: "eyJhbGciOiJIUzI1Ni..."
- role: "home_chef"
- userId: "407582be-..."  # ✅ Если backend отправляет sub

# Если userId отсутствует → backend НЕ отправляет sub
```

---

### 3. Проверь JWT

```bash
# Декодируй токен (jwt.io или base64):
const token = localStorage.getItem("token");
const payload = JSON.parse(atob(token.split('.')[1]));
console.log(payload);

# Должно быть:
{
  sub: "407582be-...",  # ✅ UUID пользователя
  email: "user@mail.ru",
  role: "home_chef",
  exp: 1737091200
}

# Если sub отсутствует → backend требует фикса
```

---

## 📊 Статус

```
✅ TokenValidator готов к sub
✅ AuthContext сохраняет userId из sub
✅ RecipeContext проверяет userId перед очисткой
✅ Logout очищает userId
✅ 0 TypeScript ошибок
⏳ Ждём backend фикса (добавление sub в JWT)
```

---

## 🚀 Следующие Шаги

### 1. Backend (Go) - КРИТИЧНО

```go
// handlers/auth.go
claims := jwt.MapClaims{
  "sub":   user.ID.String(),  // 🔥 ДОБАВИТЬ
  "email": user.Email,
  "role":  user.Role,
  "exp":   time.Now().Add(24 * time.Hour).Unix(),
}
```

### 2. Проверка после backend фикса

```bash
# 1. Разлогиниться
# 2. Залогиниться заново
# 3. Проверить консоль:
#    ✅ User ID saved: 407582be-...
#    ✅ RecipeContext: User ID present, preserving data
# 4. Проверить localStorage:
#    ✅ userId: "407582be-..."
```

### 3. Удалить старые предупреждения (опционально)

После того как backend будет отправлять `sub`, можно включить строгую проверку:

```typescript
// TokenValidator.tsx
if (!payload.sub) {
  console.error("❌ Token missing 'sub' - logging out");
  logout();  // 🔥 Строгая проверка
  return;
}
```

---

## 📝 Итог

```
✅ Frontend полностью готов к работе с sub
✅ Обратная совместимость сохранена
✅ RecipeContext НЕ очищает данные если userId есть
⏳ Ждём backend фикса для полной функциональности
```

**Статус:** ✅ Frontend готов, ждёт backend
