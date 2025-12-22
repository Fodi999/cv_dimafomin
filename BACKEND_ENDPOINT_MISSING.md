# 🚨 КРИТИЧНО: Backend Endpoint Missing

## ❌ Проблема

Frontend пытается получить каталог рецептов через:
```
GET /api/recipes
```

Но **backend этот endpoint НЕ реализовал**.

---

## 📊 Текущая ситуация

### ✅ Что работает на backend:
- `GET /api/recipes/stats` → `{ totalRecipes: 10, byCategory: {...} }`
- `POST /api/recipes/recommendations` → AI recommendations
- `GET /api/recipes/{id}` → Single recipe by ID

### ❌ Что НЕ работает:
- `GET /api/recipes` → **405 Method Not Allowed / 404**

---

## 🔧 Временное решение (Frontend)

Добавлен fallback в `/app/api/recipes/route.ts`:

```typescript
// If backend returns 404/405, return empty array
if (response.status === 404 || response.status === 405) {
  return NextResponse.json({
    success: true,
    data: [],
    message: "Backend endpoint not implemented yet"
  });
}
```

**Результат**: Страница `/recipes` показывает пустой каталог вместо ошибки.

---

## ✅ Что нужно сделать на Backend (Go)

### 1️⃣ Создать endpoint: `GET /api/recipes`

**Путь**: `backend/handlers/recipes.go` (или где у вас находятся handlers)

**Пример реализации**:

```go
// GetRecipeCatalog returns all recipes from database
// Public endpoint - no auth required
func (h *Handler) GetRecipeCatalog(c *gin.Context) {
    var recipes []models.Recipe
    
    // Query all recipes from database
    if err := h.db.Find(&recipes).Error; err != nil {
        c.JSON(500, gin.H{
            "success": false,
            "message": "Failed to fetch recipes",
            "error":   err.Error(),
        })
        return
    }
    
    c.JSON(200, gin.H{
        "success": true,
        "data":    recipes,
    })
}
```

### 2️⃣ Зарегистрировать route

```go
// В файле где регистрируются routes (main.go или routes.go)

// Public routes
public := router.Group("/api")
{
    public.GET("/recipes", handlers.GetRecipeCatalog)       // ← NEW!
    public.GET("/recipes/stats", handlers.GetRecipeStats)   // ← существует
    public.GET("/recipes/:id", handlers.GetRecipeByID)      // ← существует
}

// Protected routes
protected := router.Group("/api")
protected.Use(authMiddleware())
{
    protected.POST("/recipes/recommendations", handlers.GetRecommendations)
}
```

---

## 📦 Expected Response Format

Frontend ожидает такой формат:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "name": "Pizza Margherita",
      "category": "pizza",
      "country": "Italy",
      "difficulty": "medium",
      "timeMinutes": 120,
      "servings": 1,
      "imageUrl": "https://...",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": "uuid-2",
      "name": "Pasta Carbonara",
      ...
    }
  ]
}
```

**Важно**:
- ✅ `servings: 1` (базовая порция, согласно новому правилу)
- ✅ Все поля из таблицы `recipes`
- ✅ Без фильтрации по пользователю
- ✅ Без match/scoring логики
- ✅ Просто чистый каталог

---

## 🎯 Почему это важно

Сейчас:
- AI говорит: "W katalogu jest 10 przepisów"
- Страница `/recipes` показывает: **0 przepisów (пустой каталог)**

После реализации backend endpoint:
- AI говорит: "W katalogu jest 10 przepisów"
- Страница `/recipes` показывает: **10 przepisów**

✅ **Single Source of Truth работает корректно**

---

## 🧪 Тестирование

### Локально:
```bash
curl -X GET http://localhost:8080/api/recipes
```

### Production:
```bash
curl -X GET https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/recipes
```

**Expected Output**:
```json
{
  "success": true,
  "data": [
    { "id": "...", "name": "Pizza", ... },
    { "id": "...", "name": "Pasta", ... },
    ...
  ]
}
```

---

## 📝 Checklist для Backend Developer

- [ ] Создать handler `GetRecipeCatalog` в `handlers/recipes.go`
- [ ] Зарегистрировать route `GET /api/recipes`
- [ ] Убедиться что endpoint **public** (без auth middleware)
- [ ] Протестировать локально: `curl http://localhost:8080/api/recipes`
- [ ] Задеплоить на production (Koyeb)
- [ ] Проверить: `curl https://...koyeb.app/api/recipes`
- [ ] Сообщить frontend team что endpoint готов

---

## 🔄 После реализации на Backend

Frontend автоматически подхватит данные:
- [ ] Убрать fallback из `/app/api/recipes/route.ts`
- [ ] Проверить что `/recipes` показывает реальные данные
- [ ] Убедиться что числа совпадают с AI (stats)

---

## 💡 Дополнительно (опционально)

### Фильтры и пагинация (позже)

```go
// Query params
category := c.Query("category")  // ?category=pizza
limit := c.DefaultQuery("limit", "50")  // ?limit=20
offset := c.DefaultQuery("offset", "0") // ?offset=10

if category != "" {
    query = query.Where("category = ?", category)
}

query.Limit(limit).Offset(offset).Find(&recipes)
```

Но пока нужен просто **базовый каталог без фильтров**.

---

## 🚀 Приоритет: HIGH

Без этого endpoint:
- ❌ Страница `/recipes` не работает
- ❌ Пользователи не видят каталог
- ❌ Single Source of Truth сломан
- ❌ UX несоответствие (AI говорит 10, показывает 0)

**Ожидаемое время реализации: 15-30 минут** ⏱️
