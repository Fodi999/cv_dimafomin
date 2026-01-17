# 🔥 JWT SUB FIX - КРИТИЧНОЕ ОБНОВЛЕНИЕ

**Дата:** 16 января 2026  
**Приоритет:** 🔥🔥🔥 КРИТИЧНО  
**Статус:** ⏳ В процессе

---

## 🎯 Проблема

### Текущее состояние JWT:

```json
{
  "email": "fodi85@gmail.ru",
  "role": "home_chef",
  "sub": undefined  // ❌ КРИТИЧНО: нет стабильного user ID
}
```

### Последствия:

1. **Нет стабильного user ID** → React думает, что пользователь «новый» при каждой загрузке
2. **RecipeContext очищает localStorage** → `🗑️ RecipeContext: Cleared localStorage` постоянно
3. **Нельзя масштабироваться** → нет способа связать данные с конкретным пользователем
4. **AI рекомендации нестабильные** → нет персонализации
5. **История и сохранения теряются** → нет привязки к пользователю

---

## ✅ Решение

### Backend (Go):

```go
// handlers/auth.go

// ❌ СЕЙЧАС (плохо):
claims := jwt.MapClaims{
  "email": user.Email,
  "role":  user.Role,
  // sub отсутствует ❌
}

// ✅ ДОЛЖНО БЫТЬ:
claims := jwt.MapClaims{
  "sub":   user.ID.String(),  // 🔥 КЛЮЧЕВО: стабильный user ID
  "email": user.Email,
  "role":  user.Role,
  "exp":   time.Now().Add(24 * time.Hour).Unix(),
}

token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
signedToken, err := token.SignedString([]byte(jwtSecret))
```

### Frontend (React):

**1. TokenValidator.tsx** - добавить логирование `sub`:

```typescript
const payload = JSON.parse(atob(token.split('.')[1]));
console.log("✅ Token validated:", {
  sub: payload.sub,      // 🔥 ДОЛЖЕН БЫТЬ user.id
  email: payload.email,
  role: payload.role,
});

// ⚠️ Если sub отсутствует → логаут
if (!payload.sub) {
  console.error("❌ Token missing 'sub' claim - invalid token");
  logout();
}
```

**2. AuthContext.tsx** - сохранять `sub` в localStorage:

```typescript
// После login/register:
const { token, user } = data.data;

// Декодировать JWT для получения sub
const payload = JSON.parse(atob(token.split('.')[1]));

// Сохранить sub отдельно (для быстрого доступа)
localStorage.setItem("userId", payload.sub);
localStorage.setItem("token", token);
localStorage.setItem("role", user.role);
```

**3. UserContext.tsx** - использовать `sub` как `userId`:

```typescript
// Читать userId из localStorage (из JWT.sub)
const userId = localStorage.getItem("userId");

// Использовать в запросах
const response = await fetch(`/api/user/profile`, {
  headers: {
    "X-User-ID": userId,  // Передавать sub в заголовках
    "Authorization": `Bearer ${token}`,
  },
});
```

**4. RecipeContext.tsx** - НЕ очищать если есть userId:

```typescript
useEffect(() => {
  const userId = localStorage.getItem("userId");
  
  if (!userId) {
    // Только если userId отсутствует
    localStorage.removeItem(STORAGE_KEY);
    console.log("🗑️ RecipeContext: Cleared localStorage (no userId)");
  } else {
    console.log("✅ RecipeContext: User ID present, preserving data");
  }
}, []);
```

---

## 📋 План Миграции

### Шаг 1: Backend (Go) ✅ КРИТИЧНО

```bash
# 1. Найти handlers/auth.go (или аналогичный файл с JWT генерацией)
# 2. Добавить "sub": user.ID.String() в MapClaims
# 3. Перезапустить backend
# 4. Проверить новый JWT через /api/auth/login
```

**Проверка:**
```bash
# Декодировать JWT (jwt.io или base64):
echo "JWT_TOKEN" | cut -d'.' -f2 | base64 -d | jq

# Должно быть:
{
  "sub": "407582be-59d5-4d21-873b-1a72d31b0d42",  # ✅ UUID
  "email": "fodi85@gmail.ru",
  "role": "home_chef",
  "exp": 1737091200
}
```

---

### Шаг 2: Frontend (React) - Обновить TokenValidator ✅

**Файл:** `components/auth/TokenValidator.tsx`

**Изменения:**
1. Добавить проверку наличия `sub`
2. Сохранить `sub` в localStorage как `userId`
3. Если `sub` отсутствует → логаут

---

### Шаг 3: Frontend - Обновить AuthContext ✅

**Файл:** `contexts/AuthContext.tsx`

**Изменения:**
1. После login/register декодировать JWT
2. Сохранить `payload.sub` в localStorage как `userId`
3. Добавить `userId` в состояние контекста

---

### Шаг 4: Frontend - Обновить UserContext ✅

**Файл:** `contexts/UserContext.tsx`

**Изменения:**
1. Читать `userId` из localStorage
2. Использовать `userId` вместо `user.id` (который приходит из API)
3. Передавать `userId` в заголовках API запросов

---

### Шаг 5: Frontend - Обновить RecipeContext ✅

**Файл:** `contexts/RecipeContext.tsx`

**Изменения:**
1. Проверять наличие `userId` перед очисткой localStorage
2. Если `userId` есть → НЕ очищать
3. Логировать причину очистки

---

## ✅ Результат После Миграции

### Логи в консоли:

```bash
# TokenValidator:
✅ Token validated: {
  sub: "407582be-59d5-4d21-873b-1a72d31b0d42",
  email: "fodi85@gmail.ru",
  role: "home_chef"
}
✅ User ID saved to localStorage: 407582be-59d5-4d21-873b-1a72d31b0d42

# UserContext:
✅ User loaded: fodi85@gmail.ru (ID: 407582be-59d5-4d21-873b-1a72d31b0d42)

# RecipeContext:
✅ RecipeContext: User ID present, preserving data
💾 RecipeContext: Saved to localStorage

# ❌ БОЛЬШЕ НЕ ДОЛЖНО БЫТЬ:
🗑️ RecipeContext: Cleared localStorage
```

---

## 🎓 Принципы

### 1. **sub = Личность**
```typescript
sub:   user.ID     // Стабильный идентификатор (UUID)
email: user.Email  // Атрибут (может измениться)
role:  user.Role   // Атрибут (может измениться)
```

### 2. **sub = Источник истины для userId**
```typescript
// ✅ ПРАВИЛЬНО:
const userId = localStorage.getItem("userId");  // из JWT.sub

// ❌ НЕПРАВИЛЬНО:
const userId = user?.id;  // из API (может быть null при загрузке)
```

### 3. **Проверка sub при каждой загрузке**
```typescript
// TokenValidator должен проверить:
if (!payload.sub) {
  console.error("❌ Token missing 'sub' - logout");
  logout();
}
```

---

## 🐛 Частые Проблемы

### Проблема 1: RecipeContext очищает localStorage

**Причина:** `userId` отсутствует или не синхронизирован с JWT.sub

**Решение:**
```typescript
// В TokenValidator:
localStorage.setItem("userId", payload.sub);

// В RecipeContext:
const userId = localStorage.getItem("userId");
if (!userId) {
  clearLocalStorage();
}
```

---

### Проблема 2: AI рекомендации сбрасываются

**Причина:** Нет стабильного userId для привязки рекомендаций

**Решение:** После добавления `sub` в JWT, AI будет использовать userId для персонализации

---

### Проблема 3: sub = undefined

**Причина:** Backend не добавил `sub` в JWT

**Решение:** Обновить backend (handlers/auth.go):
```go
claims := jwt.MapClaims{
  "sub": user.ID.String(),  // 🔥 ДОБАВИТЬ
}
```

---

## 📊 Диаграмма: До и После

### ❌ ДО (Проблема):

```
Backend JWT:
{
  email: "user@mail.ru",
  role: "home_chef"
  // ❌ sub отсутствует
}
    ↓
Frontend:
- userId = undefined
- RecipeContext очищает localStorage
- AI не персонализирован
- История теряется
```

### ✅ ПОСЛЕ (Решение):

```
Backend JWT:
{
  sub: "407582be-...",  // ✅ user.id
  email: "user@mail.ru",
  role: "home_chef"
}
    ↓
Frontend:
- userId = "407582be-..." (стабильный)
- RecipeContext сохраняет данные
- AI персонализирован
- История привязана к пользователю
```

---

## 🚀 Следующие Шаги

### Немедленно:

1. **Backend:** Добавить `sub` в JWT (handlers/auth.go)
2. **Frontend:** Обновить TokenValidator для сохранения `userId`
3. **Frontend:** Обновить RecipeContext для проверки `userId`

### После фикса:

4. Проверить логи (не должно быть `🗑️ RecipeContext: Cleared localStorage`)
5. Протестировать AI рекомендации (должны сохраняться)
6. Проверить историю рецептов (должна сохраняться)

---

## 📝 Итог

```
✅ sub = стабильный user ID (из backend)
✅ userId = localStorage.getItem("userId") (из JWT.sub)
✅ RecipeContext НЕ очищает если userId есть
✅ AI, история, сохранения привязаны к userId
✅ Масштабирование возможно
```

**Статус:** ⏳ Ждём фикса backend (добавление `sub` в JWT)
