# 🍽️ Поток: Как рецепты попадают в Kitchen Dashboard

**Дата:** 22 января 2026  
**Status:** ✅ Реализовано

---

## 📋 Архитектура потока

```
┌─────────────────────────────────────────────────────────────────┐
│ /assistant (AIRecommendationCardCompact)                        │
│                                                                 │
│  ❤️ "В меню" (onSave callback)                                 │
│         ↓                                                       │
│  handleSaveRecipe()                                             │
│         ↓                                                       │
│  POST /api/user/recipes/save { recipeId }                       │
│         ↓                                                       │
│  Backend создаёт MenuItem с:                                    │
│  - status: "menu"                                               │
│  - recipe_id: {recipeId}                                        │
│  - servings: default (2-4)                                      │
│         ↓                                                       │
│  window.dispatchEvent(new Event('recipe-saved'))               │
│         ↓                                                       │
│  Toast: "✅ Рецепт добавлен в раздел Готовка!"                │
└─────────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│ /recipes (RecipesPage)                                          │
│                                                                 │
│  useEffect - слушает 'recipe-saved'                            │
│         ↓                                                       │
│  loadTodayMenu()                                                │
│         ↓                                                       │
│  GET /api/menu/today                                            │
│         ↓                                                       │
│  Backend возвращает MenuItem[] включая новый рецепт            │
│  { status: "menu", recipe: {...} }                              │
│         ↓                                                       │
│  setMenu(items)                                                 │
│         ↓                                                       │
│  Фильтрация: const menuItems = menu.filter(i.status === "menu") │
│         ↓                                                       │
│  <MenuRecipeCard status="menu" />                               │
│     ├─ Показывает image, title, cook_time                      │
│     ├─ Показывает select для порций                            │
│     └─ Кнопка "🍳 Готовить"                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Полный цикл

### Шаг 1️⃣ - Ассистент: Сохранение рецепта

**Файл:** `/app/(user)/assistant/page.tsx`  
**Функция:** `handleSaveRecipe(recipeId: string)`

```typescript
const handleSaveRecipe = async (recipeId: string) => {
  // POST /api/user/recipes/save
  const response = await fetch('/api/user/recipes/save', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ recipeId }),
  });

  const data = await response.json();
  
  if (data.success) {
    // 🔥 Триггер эвента
    window.dispatchEvent(new Event('recipe-saved'));
    toast.success('✅ Рецепт добавлен в раздел "Готовка"!');
  }
};
```

**UI:**  
Компонент `AIRecommendationCardCompact` показывает кнопку ❤️ (Heart) с `onSave={handleSaveRecipe}`

---

### Шаг 2️⃣ - Kitchen Dashboard: Слушание эвента

**Файл:** `/app/(user)/recipes/page.tsx`

```typescript
// 👂 Listen for recipe-saved event from assistant page
useEffect(() => {
  const handleRecipeSaved = () => {
    console.log("📢 [page] recipe-saved event received");
    loadTodayMenu();
  };

  window.addEventListener('recipe-saved', handleRecipeSaved);
  return () => window.removeEventListener('recipe-saved', handleRecipeSaved);
}, [token]);
```

**Что происходит:**
1. `recipe-saved` event диспетчится на ассистенте
2. Kitchen Dashboard слушает этот event
3. При получении → вызывает `loadTodayMenu()`
4. Страница автоматически обновляется и показывает новый рецепт

---

### Шаг 3️⃣ - Отображение в UI

**Файл:** `/app/(user)/recipes/page.tsx`

```typescript
// Filter by status
const menuItems = menu.filter(i => i.status === "menu");

// Show in 📋 МЕНЮ tab
{activeTab === 'menu' && (
  <motion.div>
    <h2>Сегодняшнее меню</h2>
    {menu.filter(i => i.status === "menu").map((item) => (
      <MenuRecipeCard
        item={item}
        status="menu"
        onStartCooking={() => handleStartCooking(item.id)}
        onUpdateServings={(servings) => handleUpdateServings(item.id, servings)}
      />
    ))}
  </motion.div>
)}
```

---

## 📊 Backend Требования

При вызове `POST /api/user/recipes/save`:

**Request:**
```json
{
  "recipeId": "uuid-of-recipe"
}
```

**Response:**
```json
{
  "success": true,
  "menuItem": {
    "id": "menu-item-uuid",
    "recipe_id": "recipe-uuid",
    "status": "menu",
    "servings": 2,
    "planned_for": "2026-01-22",
    "created_at": "2026-01-22T15:30:00Z"
  }
}
```

**Важно:**
- ✅ status ДОЛЖЕН быть `"menu"` (не `"planned"`, не `"completed"`)
- ✅ planned_for ДОЛЖЕН быть TODAY (не в прошлом, не в будущем)
- ✅ servings ДОЛЖЕН быть по умолчанию (2-4)

---

## 🎯 Сценарий Тестирования

### Быстрый тест (5 минут)

1. **Откройте /assistant**
   ```
   URL: /assistant
   ✅ Видны рекомендации рецептов
   ```

2. **Найдите рецепт и нажмите ❤️**
   ```
   Нажмите кнопку ❤️ на карточке
   ✅ Toast: "✅ Рецепт добавлен в раздел "Готовка"!"
   ✅ Console: "⭐ Saving recipe to cooking list"
   ✅ Console: "📢 recipe-saved event received" (может быть на другом табе)
   ```

3. **Откройте /recipes**
   ```
   URL: /recipes
   ✅ Новый рецепт появляется в табе "📋 В меню"
   ✅ Console: "📢 [page] recipe-saved event received"
   ✅ Console: "📊 [page] Menu items after filtering: menu: 1, cooking: 0, history: 0"
   ```

4. **Проверьте карточку**
   ```
   ✅ Показывает image
   ✅ Показывает title
   ✅ Показывает cook_time
   ✅ Показывает select для порций
   ✅ Есть кнопка "🍳 Готовить"
   ```

---

## 🔍 Отладка

### Рецепт не появляется в меню

**Проверить:**

1. **Console на ассистенте:**
   ```javascript
   // Должны быть логи:
   ✅ "⭐ Saving recipe to cooking list: {recipeId}"
   ✅ "📥 Save recipe response status: 200"
   ✅ "✅ Recipe saved successfully"
   ```

2. **Console на /recipes:**
   ```javascript
   // Должны быть логи:
   ✅ "📢 [page] recipe-saved event received"
   ✅ "📊 [page] Menu items after filtering: menu: X"
   ```

3. **Network tab:**
   ```
   POST /api/user/recipes/save → 200 OK
   GET /api/menu/today → 200 OK (с новым рецептом)
   ```

4. **Backend response:**
   ```json
   {
     "success": true,
     "menuItem": {
       "status": "menu"  // ← КРИТИЧНО! Должен быть "menu", не что-то другое
     }
   }
   ```

### Событие не срабатывает

**Проверить:**

1. Оба таба открыты? (ассистент и /recipes)
2. Консоль на обоих табах для логов?
3. Попробуйте обновить страницу /recipes (Ctrl+R) - рецепт должен остаться?

---

## 📝 Файлы

| Файл | Назначение |
|------|-----------|
| `/app/(user)/assistant/page.tsx` | Триггер события `recipe-saved` |
| `/app/(user)/recipes/page.tsx` | Слушатель события + отображение |
| `/components/assistant/AIRecommendationCardCompact.tsx` | Кнопка ❤️ с `onSave` |
| `/components/recipes/MenuRecipeCard.tsx` | UI карточки в "меню" статусе |
| `/lib/api/menu.ts` | API клиент для GET /api/menu/today |

---

## ✅ Готовность

- [x] handleSaveRecipe вызывает window.dispatchEvent('recipe-saved')
- [x] RecipesPage слушает 'recipe-saved' event
- [x] loadTodayMenu() вызывается при событии
- [x] Рецепты фильтруются по статусу "menu"
- [x] MenuRecipeCard отображает статус "menu" правильно
- [x] Toast уведомления работают
- [x] Логирование достаточно для отладки
- [ ] Backend создаёт MenuItem с status: "menu" ← ⏳ НУЖНО ПРОВЕРИТЬ

---

## 🚀 Следующие шаги

1. **Развернуть** на продакшене после проверки backend'а
2. **Тестировать** весь цикл (assistant → recipes → cooking → history)
3. **Мониторить** логи для ошибок
4. **Собрать** фидбэк от пользователей

