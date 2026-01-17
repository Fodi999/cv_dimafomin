# 🚀 БЫСТРАЯ ПРОВЕРКА ЯЗЫКОВОЙ АРХИТЕКТУРЫ

**Дата:** 16 января 2026

---

## ✅ Что проверить прямо сейчас

### 1. Открой консоль браузера

```bash
# 1. Перезагрузи страницу (авторизованный пользователь)
# 2. Смотри логи SettingsContext:

⚙️ Loading settings from backend...
✅ Settings loaded: { language: "ru", currency: "PLN", ... }

# Если cookie не совпадает с backend:
🔄 Language mismatch: cookie="pl", backend="ru"
🔄 Updating cookie to match backend: ru
🔄 Reloading page with correct language...
```

---

### 2. Проверь смену языка

```bash
# 1. Кликни "RU" в LanguageSwitcher
# 2. Смотри логи:

🌍 [1/3] Saving language to backend: ru
✅ [2/3] Language saved to DB: ru
🔄 [3/3] Reloading settings from backend...
✅ Settings reloaded, AI will use new language: ru

# 3. Страница перезагружается
# 4. UI показывает русский язык
```

---

### 3. Проверь cookie

```bash
# Открой DevTools → Application → Cookies
# Найди cookie "app_language"
# Значение должно совпадать с backend

# Проверь через Network:
# GET /api/settings → { "language": "ru" }
# Cookie "app_language" → "ru"
```

---

### 4. Проверь AI

```bash
# 1. Смени язык на RU
# 2. Открой чат с AI
# 3. AI должен отвечать на русском
# 4. ✅ Язык AI совпадает с UI
```

---

## ❌ Что ПОКА НЕ работает

### JWT без `sub`

```bash
# Открой консоль:
✅ Token validated: {sub: undefined, email: "fodi85@gmail.ru", role: "home_chef"}
                          ^^^^^^^^^ ❌ ПРОБЛЕМА

# Должно быть:
✅ Token validated: {sub: 123, email: "fodi85@gmail.ru", role: "home_chef"}
                          ^^^ ✅ user.id
```

### RecipeContext очищает localStorage

```bash
🗑️ RecipeContext: Cleared localStorage
🗑️ RecipeContext: Cleared localStorage

# Это происходит из-за отсутствия sub в JWT
# После фикса JWT это исчезнет
```

---

## 🔥 Срочный фикс на backend

```go
// handlers/auth.go (Go)

token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
  "sub":   user.ID,          // 🔥 ДОБАВИТЬ ЭТУ СТРОКУ
  "email": user.Email,
  "role":  user.Role,
  "exp":   time.Now().Add(24 * time.Hour).Unix(),
})
```

---

## 📊 Итог

```
✅ Язык синхронизируется автоматически (backend → cookie)
✅ Смена языка проходит через backend
✅ AI, уведомления, UI используют один язык
❌ JWT без sub (требует фикса на backend)
⏳ RecipeContext очищает localStorage (решится после фикса JWT)
```

**Следующий шаг:** Добавить `sub` в JWT
