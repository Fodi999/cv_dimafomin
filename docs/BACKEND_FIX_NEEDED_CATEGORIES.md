# Backend Fix Needed: Публичные Endpoint'ы

**Дата:** 2026-01-26  
**Приоритет:** HIGH  
**Проблема:** Backend требует авторизацию для публичного endpoint'а категорий

---

## Проблема

Backend логи:
```
2026/01/26 18:29:34 🔐 AuthMiddleware: GET /api/catalog/ingredient-categories
2026/01/26 18:29:34 📋 Auth header present: false, length: 0
2026/01/26 18:29:34 ❌ No Authorization header for GET /api/catalog/ingredient-categories
2026/01/26 18:29:34 [xxxxx] "GET .../api/catalog/ingredient-categories" - 401 42B
```

**Endpoint:** `GET /api/catalog/ingredient-categories`  
**Текущее поведение:** Требует `Authorization` header  
**Ожидаемое поведение:** Публичный доступ без токена

---

## Почему это важно

1. **UX**: Категории нужны для отображения продуктов
2. **SEO**: Публичные страницы должны загружаться без авторизации
3. **Производительность**: Fallback категории могут быть устаревшими

---

## Что нужно исправить в Backend

### 1. Настроить AuthMiddleware

Endpoint `/api/catalog/ingredient-categories` должен быть **публичным**.

**Было:**
```go
// Все /api/catalog/* endpoints требуют авторизацию
router.Use(authMiddleware)
router.GET("/api/catalog/ingredient-categories", handlers.GetCategories)
```

**Должно быть:**
```go
// Публичные endpoints (без auth)
publicGroup := router.Group("/api/catalog")
publicGroup.GET("/ingredient-categories", handlers.GetCategories)

// Приватные catalog endpoints (с auth)
privateGroup := router.Group("/api/catalog")
privateGroup.Use(authMiddleware)
privateGroup.POST("/ingredient-categories", handlers.CreateCategory) // Только админ
```

### 2. Или: Опциональная авторизация

Альтернативный подход - сделать авторизацию опциональной:

```go
func OptionalAuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        
        if authHeader == "" {
            // Нет токена - продолжаем без авторизации
            c.Next()
            return
        }
        
        // Токен есть - валидируем его
        token := strings.TrimPrefix(authHeader, "Bearer ")
        claims, err := validateJWT(token)
        
        if err != nil {
            // Невалидный токен - 401
            c.JSON(401, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }
        
        // Валидный токен - добавляем claims в context
        c.Set("user", claims)
        c.Next()
    }
}

// Использование
router.Use(OptionalAuthMiddleware())
router.GET("/api/catalog/ingredient-categories", handlers.GetCategories)
```

### 3. Handler должен работать без user

```go
func GetCategories(c *gin.Context) {
    // Получаем язык из заголовка
    lang := c.GetHeader("Accept-Language")
    if lang == "" {
        lang = "pl" // default
    }
    
    // Опционально: проверяем есть ли user (для расширенных данных)
    user, exists := c.Get("user")
    
    categories := fetchCategoriesFromDB(lang)
    
    // Если user залогинен - добавляем дополнительные данные
    if exists {
        userID := user.(*Claims).UserID
        categories = enrichCategoriesForUser(categories, userID)
    }
    
    c.JSON(200, gin.H{
        "success": true,
        "data": gin.H{
            "categories": categories,
        },
    })
}
```

---

## Список публичных endpoints

Следующие endpoints должны быть публичными:

✅ **Обязательно публичные:**
- `GET /api/catalog/ingredient-categories`
- `GET /api/catalog/ingredients/search?q=...`
- `GET /api/recipes/public`
- `GET /api/stats/public`
- `GET /api/health`

⚠️ **Опциональная авторизация** (работают без токена, но дают больше данных с токеном):
- `GET /api/catalog/ingredients` (базовый список всегда доступен)
- `GET /api/recipes` (публичные рецепты всегда, свои рецепты с токеном)

🔒 **Требуют авторизацию:**
- `GET /api/user/profile`
- `GET /api/fridge`
- `POST /api/recipes`
- `GET /api/wallet`

---

## Временное решение на Frontend

До исправления backend используем fallback категории:

```typescript
// lib/api/categoryApi.ts
export async function fetchCategories(language: string): Promise<Category[]> {
  // ⚠️ ВРЕМЕННО: Backend требует авторизацию
  // Используем fallback категории
  console.log(`[categoryApi] ⚠️ Using fallback categories`);
  return getFallbackCategories(language);
}
```

**Fallback категории:**
- 10 базовых категорий
- Поддержка pl/en/ru
- Локально определены в `categoryApi.ts`

---

## Тестирование после исправления

### 1. Без токена (публичный доступ):

```bash
curl -H "Accept-Language: pl" \
  http://localhost:8080/api/catalog/ingredient-categories
```

**Ожидаемый результат:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {"key": "all", "label": "Wszystkie", "icon": "🧊", "sortOrder": 0},
      {"key": "fish", "label": "Ryby", "icon": "🐟", "sortOrder": 1},
      ...
    ]
  }
}
```

**Статус код:** `200 OK` (НЕ 401!)

### 2. С токеном (авторизованный пользователь):

```bash
curl -H "Accept-Language: pl" \
     -H "Authorization: Bearer eyJhbGc..." \
  http://localhost:8080/api/catalog/ingredient-categories
```

**Ожидаемый результат:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {"key": "all", "label": "Wszystkie", "icon": "🧊", "sortOrder": 0, "count": 42},
      {"key": "fish", "label": "Ryby", "icon": "🐟", "sortOrder": 1, "count": 5},
      ...
    ]
  }
}
```

**Дополнительно:** `count` - количество продуктов пользователя в каждой категории

---

## После исправления backend

1. Убрать временный код из `lib/api/categoryApi.ts`
2. Раскомментировать оригинальный код API запроса
3. Протестировать:
   - Неавторизованный пользователь → 200 OK
   - Авторизованный пользователь → 200 OK + расширенные данные
   - Невалидный токен → 401 (только если токен передан)

---

## Чеклист для Backend разработчика

- [ ] Определить список публичных endpoints
- [ ] Настроить routing без authMiddleware для публичных
- [ ] Или: Реализовать OptionalAuthMiddleware
- [ ] Обновить handlers для работы без user
- [ ] Протестировать без токена → 200 OK
- [ ] Протестировать с токеном → 200 OK + дополнительные данные
- [ ] Обновить документацию API
- [ ] Уведомить frontend команду о готовности

---

**Статус:** ⏳ Ожидает исправления backend  
**Блокирует:** Загрузку категорий из базы данных  
**Workaround:** Используем fallback категории на frontend
