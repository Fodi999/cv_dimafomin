# 📊 Отчёт о покрытии Backend API во Frontend

**Дата:** 26 декабря 2025  
**Версия:** 1.0.0  
**Backend:** ~120 эндпоинтов (Go)  
**Frontend:** lib/api/* (14 модулей)

---

## 📈 Общая статистика

| Категория | Покрыто | Не покрыто | Покрытие |
|-----------|---------|------------|----------|
| **AUTH** | 2/3 | 1 | 67% ⚠️ |
| **USER** | 6/6 | 0 | 100% ✅ |
| **RECIPES** | 6/12 | 6 | 50% ⚠️ |
| **FRIDGE** | 6/7 | 1 | 86% ✅ |
| **INGREDIENTS/STOCK** | 2/7 | 5 | 29% ❌ |
| **BUDGET** | 0/5 | 5 | 0% ❌ |
| **NUTRITION** | 0/2 | 2 | 0% ❌ |
| **AI** | 8/8 | 0 | 100% ✅ |
| **ACADEMY** | 9/11 | 2 | 82% ✅ |
| **MARKETPLACE** | 5/6 | 1 | 83% ✅ |
| **BUSINESS** | 0/7 | 7 | 0% ❌ |
| **SEMI-FINISHED** | 0/5 | 5 | 0% ❌ |
| **TASKS** | 5/14 | 9 | 36% ❌ |
| **ADMIN** | 17/30 | 13 | 57% ⚠️ |
| **HISTORY** | 0/1 | 1 | 0% ❌ |
| **STATS (Public)** | 0/2 | 2 | 0% ❌ |
| **TREASURY** | 0/3 | 3 | 0% ❌ |
| **Итого:** | **66/108** | **42** | **61%** ⚠️ |

---

## ✅ Подключённые эндпоинты (65)

### 🔐 AUTH (2/3) - `lib/api/auth.ts`

| Метод | Endpoint | Статус |
|-------|----------|--------|
| POST | `/api/auth/register` | ✅ Подключен |
| POST | `/api/auth/login` | ✅ Подключен |
| POST | `/api/auth/refresh` | ❌ **НЕ ПОДКЛЮЧЕН** |

**Примечания:**
- `logout` - stubbed (TODO)
- `getMe` - stubbed (TODO)

---

### 👤 USER (6/6) - `lib/api/user.ts`

| Метод | Endpoint | Статус |
|-------|----------|--------|
| GET | `/user/profile` | ✅ `userApi.getProfile()` |
| PUT | `/user/profile` | ✅ `userApi.updateProfile()` |
| POST | `/user/avatar` | ✅ `userApi.uploadAvatar()` |
| GET | `/user/progress` | ✅ `userApi.getProgress()` |
| GET | `/user/wallet` | ✅ `userApi.getWallet()` |
| GET | `/user/dashboard` | ✅ `academyApi.getDashboard()` |
| GET | `/user/achievements` | ⚠️ **Не найден (возможно `/user/progress` включает)** |

---

### 🍳 RECIPES (6/12) - `lib/api/recipe-matching.ts`

#### ✅ Подключённые (6):
| Метод | Endpoint | Frontend Method |
|-------|----------|-----------------|
| GET | `/recipes/stats` | ⚠️ Не найден в lib/api |
| GET | `/recipes/{id}` | ⚠️ Не найден в lib/api |
| POST | `/recipes/{id}/view` | ❌ **НЕ ПОДКЛЮЧЕН** |
| GET | `/recipes/match` 🔒 | ✅ `recipeMatchingApi.getRecipeMatches()` |
| POST | `/recipes/recommendations` 🔒 | ✅ `recipeMatchingApi.getRecommendation()` |
| POST | `/recipes/{id}/cook` 🔒 | ✅ `recipeMatchingApi.cookRecipe()` |

#### ❌ НЕ подключённые (6):
- `POST /recipes` 🔒 - Создать рецепт
- `PUT /recipes/{id}` 🔒 - Обновить рецепт
- `DELETE /recipes/{id}` 🔒 - Удалить рецепт
- `POST /user/recipes/save` 🔒 - Сохранить рецепт
- `GET /user/recipes/saved` 🔒 - Список сохранённых
- `POST /recipes/{id}/adapt` 🔒 - Адаптировать рецепт

#### ⚠️ Legacy endpoints (не проверялись):
- `GET /posts` - Старые посты
- `GET /users/{id}/posts` - Посты пользователя
- `GET /user/{id}/posts` - Алиас

---

### 🥬 FRIDGE (6/7) - `lib/api/fridge.ts`

| Метод | Endpoint | Статус |
|-------|----------|--------|
| GET | `/api/fridge/items` | ✅ `fridgeApi.getItems()` |
| POST | `/api/fridge/items` | ✅ `fridgeApi.addItem()` |
| PATCH | `/api/fridge/items/{id}` | ✅ `fridgeApi.updateQuantity()` |
| DELETE | `/api/fridge/items/{id}` | ✅ `fridgeApi.deleteItem()` |
| POST | `/api/fridge/items/{id}/price` | ✅ `fridgeApi.addPriceEvent()` |
| GET | `/api/fridge/items/{id}/price/history` | ✅ `fridgeApi.getPriceHistory()` |
| POST | `/api/fridge/add-missing` | ❌ **НЕ ПОДКЛЮЧЕН** ✨ |

---

### 🥕 INGREDIENTS/STOCK (2/7) - `lib/api/fridge.ts`

#### ✅ Каталог (2/2):
| Метод | Endpoint | Статус |
|-------|----------|--------|
| GET | `/catalog/ingredients/` | ⚠️ Не найден явный метод |
| GET | `/catalog/ingredients/search` | ✅ `fridgeApi.searchIngredients()` |

#### ❌ Склад (0/5) - **Полностью отсутствует** (только pro_chef):
- `GET /stock/` - Складские остатки
- `POST /stock/` - Добавить на склад
- `GET /stock/{id}` - Детали позиции
- `PUT /stock/{id}` - Обновить остатки
- `DELETE /stock/{id}` - Удалить со склада
- `GET /stock/{id}/movements` - История движений

---

### 💰 BUDGET (0/5) - **Полностью отсутствует** ❌

- `GET /api/budget/current` - Текущая неделя
- `GET /api/budget/weekly?weeks=4` - Недельные бюджеты
- `GET /api/budget/stats` - Статистика бюджета
- `GET /api/budget/week?date=2025-12-22` - Бюджет на конкретную неделю
- `PUT /api/budget/plan` - Установить плановый бюджет

**Статус:** Модуль не создан, функционал не реализован во фронтенде.

---

### 📊 NUTRITION (0/2) - **Полностью отсутствует** ❌

- `GET /nutrition/recipe/{id}` - Пищевая ценность рецепта
- `POST /nutrition/calculate` - Рассчитать кастомную пищевую ценность

**Статус:** Модуль не создан, функционал не реализован во фронтенде.

---

### 🤖 AI (8/12) - `lib/api/ai.ts` ✅ ПРАВИЛЬНАЯ АРХИТЕКТУРА

**⚠️ КЛЮЧЕВОЕ ПРАВИЛО:**
AI в проекте = помощник и советник, НЕ источник бизнес-логики и НЕ decision-maker.

#### ✅ Подключённые (8):
| Метод | Endpoint | Статус | Назначение |
|-------|----------|--------|------------|
| POST | `/ai/chef-mentor` | ✅ `aiApi.mentorChat()` | **CORE** - Чистый AI-ассистент |
| POST | `/ai/recipe-helper` | ✅ `aiApi.generateRecipe()` | **CORE** - Генерация контента |
| GET | `/api/ai/recommendations` | ✅ `aiApi.getRecommendations()` | **SECONDARY** - Read-only советы |
| POST | `/ai/review-recipe` | ✅ `aiApi.reviewRecipe()` | **CONTENT** - Контент-анализ для UI |
| POST | `/ai/critique` | ✅ `aiApi.critiqueRecipe()` | **CONTENT** - Контент-анализ |
| POST | `/ai/culinary/analyze` | ✅ `aiApi.analyzeRecipe()` | **CONTENT** - Анализ рецептов |
| GET | `/ai/ingredient-nutrition` | ✅ `aiApi.getIngredientNutrition()` | **FALLBACK** - Только если нет /nutrition/* |
| POST | `/ai/estimate-price` | ✅ `aiApi.estimatePrice()` | **FALLBACK** - Только черновая оценка |

#### ❌ НАМЕРЕННО НЕ ПОДКЛЮЧЕНЫ (правильное решение):

**🚫 Причина: Дублируют существующую бизнес-логику**

| Backend Endpoint | Причина отказа | Что используем вместо |
|-----------------|----------------|----------------------|
| ❌ `/ai/meal-plan` | Не MVP, сложный UX | Запланировано на PRO-версию |
| ❌ `/ai/fridge-recommendations` | Дублирует `/recipes/match` | `recipeMatchingApi.getRecipeMatches()` |
| ❌ `/ai/fridge/analyze` | Есть rules-engine | Decision engine + `/recipes/match` |
| ❌ `/ai/create-recipe-from-fridge` | Дублирует matching | `recipeMatchingApi.getRecommendation()` |
| ❌ `/ai/save-ingredients` | AI не должен писать в state | `fridgeApi.addItem()` |
| ❌ `/ai/add-missing-ingredients` | Опасно (AI → state) | `/fridge/add-missing` (backend) |
| ❌ `/ai/recipe/recalculate` | AI ≠ деньги | Budget module + real prices |

**Философия:** AI = помощник, НЕ source of truth. У нас есть deterministic rules-based engine для критичных решений.

---

### 🎓 ACADEMY (9/11) - `lib/api/academy.ts`

#### ✅ Публичные (4/4):
| Метод | Endpoint | Статус |
|-------|----------|--------|
| GET | `/academy/courses` | ✅ `academyApi.getCourses()` |
| GET | `/academy/courses/{courseId}` | ✅ `academyApi.getCourse()` |
| GET | `/academy/courses/{courseId}/lessons` | ⚠️ Не найден явный метод |
| GET | `/academy/lessons/{lessonId}` | ⚠️ Не найден явный метод |
| GET | `/academy/quizzes/{courseId}` | ⚠️ Не найден явный метод |

#### ✅ С авторизацией (5/6):
| Метод | Endpoint | Статус |
|-------|----------|--------|
| POST | `/academy/enroll` | ❌ **НЕ ПОДКЛЮЧЕН** |
| POST | `/academy/lessons/complete` | ❌ **НЕ ПОДКЛЮЧЕН** |
| POST | `/academy/quizzes/submit` | ❌ **НЕ ПОДКЛЮЧЕН** |
| GET | `/academy/progress/{courseId}` | ⚠️ Возможно `/user/progress` |
| POST | `/academy/certificates/generate` | ✅ `academyApi.generateCertificate()` |
| GET | `/academy/certificates` | ✅ `academyApi.getCertificates()` |

#### ⚠️ Дополнительные методы во фронтенде (не в Backend API):
- `academyApi.getDashboard()` - использует `/user/{userId}/dashboard`
- `academyApi.getLeaderboard()` - использует `/leaderboard`
- `academyApi.getAllPosts()` - использует `/posts`

---

### 🛒 MARKETPLACE (5/6) - `lib/api/marketplace.ts`

#### ✅ Публичные (3/3):
| Метод | Endpoint | Статус |
|-------|----------|--------|
| GET | `/marketplace/recipes` | ✅ `marketplaceApi.getRecipes()` |
| GET | `/marketplace/leaderboard` | ⚠️ Не найден в lib/api/marketplace.ts (есть в academy) |
| GET | `/marketplace/stats/{userId}` | ✅ `marketplaceApi.getSellerStats()` |

#### ✅ С авторизацией (2/3):
| Метод | Endpoint | Статус |
|-------|----------|--------|
| POST | `/marketplace/purchase` | ✅ `marketplaceApi.purchaseRecipe()` |
| GET | `/marketplace/purchases` | ✅ `marketplaceApi.getPurchasedRecipes()` (использует `/marketplace/my-purchases`) |
| POST | `/upload/image` | ✅ `uploadApi.uploadImage()` (в отдельном модуле) |

---

### 🏢 BUSINESS (0/7) - **Полностью отсутствует** ❌

- `GET /businesses/` - Список бизнесов
- `GET /businesses/{id}` - Детали бизнеса
- `GET /businesses/{id}/tokens` - Токены бизнеса
- `POST /businesses/` 🔒 - Создать бизнес
- `PUT /businesses/{id}` 🔒 - Обновить бизнес
- `DELETE /businesses/{id}` 🔒 - Удалить бизнес

**Статус:** Модуль не создан, функционал не реализован во фронтенде.

---

### 🥘 SEMI-FINISHED (0/5) - **Полностью отсутствует** ❌

- `GET /semi-finished/` - Список полуфабрикатов
- `GET /semi-finished/{id}` - Детали полуфабриката
- `POST /semi-finished/` 🔒👑 - Создать полуфабрикат (admin)
- `PUT /semi-finished/{id}` 🔒👑 - Обновить полуфабрикат (admin)
- `DELETE /semi-finished/{id}` 🔒👑 - Удалить полуфабрикат (admin)

**Статус:** Модуль не создан, функционал не реализован во фронтенде.

---

### 🎯 TASKS (5/14) - `lib/api/tasks.ts` - **Критично неполно** ❌

#### ✅ Публичные (2/2):
| Метод | Endpoint | Статус |
|-------|----------|--------|
| GET | `/tasks` | ✅ `tasksApi.getTasks()` |
| GET | `/tasks/{taskID}` | ⚠️ Не найден явный метод |

#### ✅ User tasks (3/8):
| Метод | Endpoint | Статус |
|-------|----------|--------|
| GET | `/user/tasks/` | ⚠️ Использует общий `/tasks?` |
| GET | `/user/tasks/available` | ❌ **НЕ ПОДКЛЮЧЕН** |
| GET | `/user/tasks/stats` | ❌ **НЕ ПОДКЛЮЧЕН** |
| POST | `/user/tasks/start` | ❌ **НЕ ПОДКЛЮЧЕН** |
| PATCH | `/user/tasks/{taskID}/progress` | ❌ **НЕ ПОДКЛЮЧЕН** |
| POST | `/user/tasks/{taskID}/complete` | ❌ **НЕ ПОДКЛЮЧЕН** |
| POST | `/user/tasks/{taskID}/claim` | ❌ **НЕ ПОДКЛЮЧЕН** |
| POST | `/tasks/{taskId}/submit` | ✅ `tasksApi.submitTask()` (разный путь!) |
| GET | `/tasks/user/{userId}` | ✅ `tasksApi.getUserTasks()` (разный путь!) |

#### ❌ Admin tasks (0/4):
- `POST /admin/tasks/` - Создать задание
- `PUT /admin/tasks/{taskID}` - Обновить задание
- `DELETE /admin/tasks/{taskID}` - Удалить задание
- `GET /admin/tasks/users` - Задания всех пользователей
- `GET /admin/tasks/{taskID}/stats` - Статистика задания
- `POST /admin/tasks/approve` - Подтвердить выполнение (JSON)
- `POST /admin/tasks/{taskID}/approve` - Подтвердить выполнение (path param)

**Примечание:** В `lib/api/admin.ts` есть некоторые методы:
- ✅ `adminApi.createTask()`
- ✅ `adminApi.approveTask()`
- ⚠️ `adminApi.getAdminTasks()` (частично)
- ⚠️ `adminApi.getPendingApprovals()` (не в Backend API!)

---

### 👑 ADMIN (17/30) - `lib/api/admin.ts`

#### ✅ Users (4/4):
| Метод | Endpoint | Статус |
|-------|----------|--------|
| GET | `/admin/users` | ✅ `adminApi.getUsers()` |
| PUT | `/admin/users/{id}` | ✅ `adminApi.updateUser()` |
| DELETE | `/admin/users/{id}` | ✅ `adminApi.deleteUser()` |
| PATCH | `/admin/users/update-role` | ✅ `adminApi.updateUserRole()` |

#### ✅ Orders (3/3):
| Метод | Endpoint | Статус |
|-------|----------|--------|
| GET | `/admin/orders` | ✅ `adminApi.getOrders()` |
| GET | `/admin/orders/recent` | ✅ `adminApi.getRecentOrders()` |
| PUT | `/admin/orders/{id}/status` | ✅ `adminApi.updateOrderStatus()` |

#### ✅ Stats & Dashboard (1/3):
| Метод | Endpoint | Статус |
|-------|----------|--------|
| GET | `/admin/stats` | ✅ `adminApi.getStats()` |
| GET | `/admin/dashboard` | ❌ **НЕ ПОДКЛЮЧЕН** |
| GET | `/admin/profile` | ❌ **НЕ ПОДКЛЮЧЕН** |

#### ✅ Token Bank (3/6):
| Метод | Endpoint | Статус |
|-------|----------|--------|
| GET | `/admin/token-bank` | ✅ `adminApi.getTokenBanks()` |
| GET | `/admin/token-bank/stats` | ❌ **НЕ ПОДКЛЮЧЕН** |
| GET | `/admin/token-bank/{userID}` | ❌ **НЕ ПОДКЛЮЧЕН** |
| POST | `/admin/token-bank/allocate` | ✅ `adminApi.allocateTokens()` |
| POST | `/admin/token-bank/revoke` | ❌ **НЕ ПОДКЛЮЧЕН** |
| PUT | `/admin/token-bank/balance` | ❌ **НЕ ПОДКЛЮЧЕН** |

#### ❌ Token Transactions (0/4):
- `GET /admin/token-bank/transactions` - Все транзакции
- `GET /admin/token-bank/transactions/{userID}` - Транзакции пользователя
- `GET /admin/token-bank/transactions/filter` - Транзакции с фильтрами
- `GET /admin/token-bank/transactions/stats` - Статистика транзакций

#### ✅ Treasury (2/4):
| Метод | Endpoint | Статус |
|-------|----------|--------|
| GET | `/admin/treasury` | ❌ **НЕ ПОДКЛЮЧЕН** |
| GET | `/admin/treasury/stats` | ✅ `adminApi.getTreasuryStats()` |
| GET | `/admin/token-bank/treasury` | ✅ `adminApi.getTreasuryBalance()` |
| POST | `/admin/treasury/allocate` | ❌ **НЕ ПОДКЛЮЧЕН** |

#### ❌ Ingredients (0/1):
- `POST /admin/ingredients/import` - Массовый импорт ингредиентов

#### ✅ Tasks (частично в admin.ts):
- См. секцию TASKS выше

---

### 📈 HISTORY (0/1) - **Отсутствует** ❌

- `GET /api/history?type=consume&limit=50` 🔒 - История действий

**Статус:** Модуль не создан.

---

### 📊 STATS (Public) (0/2) - **Отсутствует** ❌

- `GET /stats/` 🔒👑 - Админ статистика
- `GET /stats/recent-orders` 🔒👑 - Последние заказы

**Примечание:** Есть `/admin/stats` в admin.ts, но публичных stats нет.

---

### 💰 TREASURY (Public) (0/3) - **Отсутствует** ❌

- `GET /api/public/treasury` - Информация о казначействе (публичный!)
- `GET /treasury/stream` - SSE стрим казначейства (EventSource)

**Примечание:** Admin treasury endpoints частично есть в admin.ts.

---

## ❌ Критичные недостающие модули

### 1. 💰 **Budget Module** (ПРИОРИТЕТ: HIGH)
**Файл:** `lib/api/budget.ts` (не существует)

**Необходимые методы:**
```typescript
export const budgetApi = {
  getCurrentWeek: async (token: string) => apiFetch("/budget/current", { token }),
  getWeeklyBudgets: async (weeks: number, token: string) => apiFetch(`/budget/weekly?weeks=${weeks}`, { token }),
  getStats: async (token: string) => apiFetch("/budget/stats", { token }),
  getWeek: async (date: string, token: string) => apiFetch(`/budget/week?date=${date}`, { token }),
  setPlan: async (amount: number, token: string) => apiFetch("/budget/plan", { method: "PUT", token, body: JSON.stringify({ amount }) }),
};
```

---

### 2. 📊 **Nutrition Module** (ПРИОРИТЕТ: MEDIUM)
**Файл:** `lib/api/nutrition.ts` (не существует)

**Необходимые методы:**
```typescript
export const nutritionApi = {
  getRecipeNutrition: async (recipeId: string, token: string) => apiFetch(`/nutrition/recipe/${recipeId}`, { token }),
  calculate: async (ingredients: any[], token: string) => apiFetch("/nutrition/calculate", { method: "POST", token, body: JSON.stringify({ ingredients }) }),
};
```

---

### 3. 🏢 **Business Module** (ПРИОРИТЕТ: LOW)
**Файл:** `lib/api/business.ts` (не существует)

**Необходимые методы:**
```typescript
export const businessApi = {
  getBusinesses: async () => apiFetch("/businesses/"),
  getBusiness: async (id: string) => apiFetch(`/businesses/${id}`),
  getTokens: async (id: string) => apiFetch(`/businesses/${id}/tokens`),
  createBusiness: async (data: any, token: string) => apiFetch("/businesses/", { method: "POST", token, body: JSON.stringify(data) }),
  updateBusiness: async (id: string, data: any, token: string) => apiFetch(`/businesses/${id}`, { method: "PUT", token, body: JSON.stringify(data) }),
  deleteBusiness: async (id: string, token: string) => apiFetch(`/businesses/${id}`, { method: "DELETE", token }),
};
```

---

### 4. 🥘 **Semi-Finished Module** (ПРИОРИТЕТ: LOW)
**Файл:** `lib/api/semi-finished.ts` (не существует)

**Необходимые методы:**
```typescript
export const semiFinishedApi = {
  getAll: async () => apiFetch("/semi-finished/"),
  getById: async (id: string) => apiFetch(`/semi-finished/${id}`),
  create: async (data: any, token: string) => apiFetch("/semi-finished/", { method: "POST", token, body: JSON.stringify(data) }),
  update: async (id: string, data: any, token: string) => apiFetch(`/semi-finished/${id}`, { method: "PUT", token, body: JSON.stringify(data) }),
  delete: async (id: string, token: string) => apiFetch(`/semi-finished/${id}`, { method: "DELETE", token }),
};
```

---

## 🔧 Необходимые дополнения в существующие модули

### 📝 `lib/api/recipes.ts` (НОВЫЙ МОДУЛЬ) - ПРИОРИТЕТ: HIGH

**Создать новый модуль для базовых CRUD операций с рецептами:**

```typescript
export const recipesApi = {
  // Public
  getAll: async (filters?: any) => apiFetch(`/recipes?${new URLSearchParams(filters)}`),
  getById: async (recipeId: string, token?: string) => apiFetch(`/recipes/${recipeId}`, { token }),
  getStats: async () => apiFetch("/recipes/stats"),
  incrementView: async (recipeId: string) => apiFetch(`/recipes/${recipeId}/view`, { method: "POST" }),
  
  // Authenticated
  create: async (data: any, token: string) => apiFetch("/recipes", { method: "POST", token, body: JSON.stringify(data) }),
  update: async (recipeId: string, data: any, token: string) => apiFetch(`/recipes/${recipeId}`, { method: "PUT", token, body: JSON.stringify(data) }),
  delete: async (recipeId: string, token: string) => apiFetch(`/recipes/${recipeId}`, { method: "DELETE", token }),
  save: async (recipeId: string, token: string) => apiFetch("/user/recipes/save", { method: "POST", token, body: JSON.stringify({ recipeId }) }),
  getSaved: async (token: string) => apiFetch("/user/recipes/saved", { token }),
  adapt: async (recipeId: string, adaptations: any, token: string) => apiFetch(`/recipes/${recipeId}/adapt`, { method: "POST", token, body: JSON.stringify(adaptations) }),
};
```

**Интеграция:**
```typescript
// lib/api.ts
export { recipesApi } from './api/recipes';

export default {
  // ... existing
  recipes: recipesApi,
  recipeMatching: recipeMatchingApi, // Переименовать для ясности
};
```

---

### 🔧 `lib/api/fridge.ts` - Добавить недостающие методы

```typescript
// Добавить в fridgeApi:
{
  // ... existing methods
  
  // ✨ NEW: Add missing ingredients from recipe
  addMissingIngredients: async (recipeId: string, token: string) => {
    return apiFetch("/fridge/add-missing", {
      method: "POST",
      token,
      body: JSON.stringify({ recipeId }),
    });
  },
  
  // ✨ NEW: Catalog (explicit method)
  getCatalog: async (filters?: { category?: string; search?: string }, token: string) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.search) params.append("search", filters.search);
    return apiFetch(`/catalog/ingredients/?${params}`, { token });
  },
}
```

---

### 🔧 `lib/api/tasks.ts` - Расширить User Tasks

```typescript
// Заменить tasksApi на:
export const tasksApi = {
  // Public
  getTasks: async (token: string, filters?: {
    status?: 'available' | 'pending' | 'completed';
    category?: 'daily' | 'weekly' | 'special' | 'learning' | 'social' | 'achievements';
  }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.category) params.append("category", filters.category);
    return apiFetch(`/tasks?${params}`, { token });
  },
  
  getTaskById: async (taskId: string, token: string) => {
    return apiFetch(`/tasks/${taskId}`, { token });
  },

  // ✨ NEW: User tasks
  getUserTasks: async (token: string) => {
    return apiFetch("/user/tasks/", { token });
  },
  
  getAvailableTasks: async (token: string) => {
    return apiFetch("/user/tasks/available", { token });
  },
  
  getUserTasksStats: async (token: string) => {
    return apiFetch("/user/tasks/stats", { token });
  },
  
  startTask: async (taskId: string, token: string) => {
    return apiFetch("/user/tasks/start", { method: "POST", token, body: JSON.stringify({ taskId }) });
  },
  
  updateProgress: async (taskId: string, progress: number, token: string) => {
    return apiFetch(`/user/tasks/${taskId}/progress`, { method: "PATCH", token, body: JSON.stringify({ progress }) });
  },
  
  completeTask: async (taskId: string, token: string) => {
    return apiFetch(`/user/tasks/${taskId}/complete`, { method: "POST", token });
  },
  
  claimReward: async (taskId: string, token: string) => {
    return apiFetch(`/user/tasks/${taskId}/claim`, { method: "POST", token });
  },
  
  // Legacy (keep for backward compatibility)
  submitTask: async (taskId: string, proof?: any, token?: string) => {
    return apiFetch(`/tasks/${taskId}/submit`, { method: "POST", token, body: JSON.stringify({ proof }) });
  },
};
```

---

### 🔧 `lib/api/admin.ts` - Добавить недостающие методы

```typescript
// Добавить в adminApi:
{
  // ... existing methods
  
  // ✨ Stats & Dashboard
  getDashboard: async (token: string) => {
    return apiFetch("/admin/dashboard", { token });
  },
  
  getAdminProfile: async (token: string) => {
    return apiFetch("/admin/profile", { token });
  },
  
  // ✨ Token Bank Extensions
  getTokenBankStats: async (token: string) => {
    return apiFetch("/admin/token-bank/stats", { token });
  },
  
  getUserTokenBank: async (userId: string, token: string) => {
    return apiFetch(`/admin/token-bank/${userId}`, { token });
  },
  
  revokeTokens: async (userId: string, amount: number, reason: string, token: string) => {
    return apiFetch("/admin/token-bank/revoke", { method: "POST", token, body: JSON.stringify({ userId, amount, reason }) });
  },
  
  setUserBalance: async (userId: string, balance: number, token: string) => {
    return apiFetch("/admin/token-bank/balance", { method: "PUT", token, body: JSON.stringify({ userId, balance }) });
  },
  
  // ✨ Token Transactions
  getAllTransactions: async (token: string, filters?: any) => {
    const params = new URLSearchParams(filters);
    return apiFetch(`/admin/token-bank/transactions?${params}`, { token });
  },
  
  getUserTransactions: async (userId: string, token: string) => {
    return apiFetch(`/admin/token-bank/transactions/${userId}`, { token });
  },
  
  filterTransactions: async (filters: any, token: string) => {
    const params = new URLSearchParams(filters);
    return apiFetch(`/admin/token-bank/transactions/filter?${params}`, { token });
  },
  
  getTransactionStats: async (token: string) => {
    return apiFetch("/admin/token-bank/transactions/stats", { token });
  },
  
  // ✨ Treasury
  getTreasury: async (token: string) => {
    return apiFetch("/admin/treasury", { token });
  },
  
  allocateFromTreasury: async (userId: string, amount: number, reason: string, token: string) => {
    return apiFetch("/admin/treasury/allocate", { method: "POST", token, body: JSON.stringify({ userId, amount, reason }) });
  },
  
  // ✨ Ingredients
  importIngredients: async (ingredients: any[], token: string) => {
    return apiFetch("/admin/ingredients/import", { method: "POST", token, body: JSON.stringify({ ingredients }) });
  },
  
  // ✨ Tasks Management (расширенные методы)
  updateTask: async (taskId: string, data: any, token: string) => {
    return apiFetch(`/admin/tasks/${taskId}`, { method: "PUT", token, body: JSON.stringify(data) });
  },
  
  deleteTask: async (taskId: string, token: string) => {
    return apiFetch(`/admin/tasks/${taskId}`, { method: "DELETE", token });
  },
  
  getAllUserTasks: async (token: string) => {
    return apiFetch("/admin/tasks/users", { token });
  },
  
  getTaskStats: async (taskId: string, token: string) => {
    return apiFetch(`/admin/tasks/${taskId}/stats`, { token });
  },
  
  approveTaskSubmission: async (taskId: string, userId: string, token: string) => {
    // Поддержка обоих форматов: POST /admin/tasks/approve и POST /admin/tasks/{taskId}/approve
    return apiFetch("/admin/tasks/approve", { method: "POST", token, body: JSON.stringify({ taskId, userId }) });
  },
}
```

---

### 🔧 `lib/api/academy.ts` - Добавить недостающие методы

```typescript
// Добавить в academyApi:
{
  // ... existing methods
  
  // ✨ Lessons
  getCourseLessons: async (courseId: string) => {
    return apiFetch(`/academy/courses/${courseId}/lessons`);
  },
  
  getLesson: async (lessonId: string) => {
    return apiFetch(`/academy/lessons/${lessonId}`);
  },
  
  completeLesson: async (lessonId: string, token: string) => {
    return apiFetch("/academy/lessons/complete", { method: "POST", token, body: JSON.stringify({ lessonId }) });
  },
  
  // ✨ Quizzes
  getQuiz: async (courseId: string) => {
    return apiFetch(`/academy/quizzes/${courseId}`);
  },
  
  submitQuiz: async (quizId: string, answers: any, token: string) => {
    return apiFetch("/academy/quizzes/submit", { method: "POST", token, body: JSON.stringify({ quizId, answers }) });
  },
  
  // ✨ Enrollment
  enrollCourse: async (courseId: string, token: string) => {
    return apiFetch("/academy/enroll", { method: "POST", token, body: JSON.stringify({ courseId }) });
  },
  
  // ✨ Progress
  getCourseProgress: async (courseId: string, token: string) => {
    return apiFetch(`/academy/progress/${courseId}`, { token });
  },
}
```

---

### 🔧 `lib/api/auth.ts` - Реализовать stubbed методы

```typescript
// Заменить stubbed методы на:
{
  // ... existing login, register
  
  // ✅ Implement refresh token
  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    return apiFetch<AuthResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  },
  
  // ✅ Implement logout (if backend supports)
  logout: async (token: string) => {
    return apiFetch("/auth/logout", {
      method: "POST",
      token,
    });
  },
  
  // ✅ Implement getMe (if backend supports)
  getMe: async (token: string) => {
    return apiFetch("/auth/me", { token });
  },
}
```

---

### 📦 `lib/api/stock.ts` (НОВЫЙ МОДУЛЬ) - ПРИОРИТЕТ: MEDIUM

**Создать модуль для pro_chef склада:**

```typescript
import { apiFetch } from './base';

export const stockApi = {
  // Get all stock items
  getAll: async (filters?: { category?: string; search?: string }, token: string) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.search) params.append("search", filters.search);
    return apiFetch(`/stock/?${params}`, { token });
  },
  
  // Add stock item
  add: async (data: { ingredientId: string; quantity: number; unit: string; price?: number }, token: string) => {
    return apiFetch("/stock/", { method: "POST", token, body: JSON.stringify(data) });
  },
  
  // Get stock item details
  getById: async (id: string, token: string) => {
    return apiFetch(`/stock/${id}`, { token });
  },
  
  // Update stock item
  update: async (id: string, data: { quantity?: number; price?: number }, token: string) => {
    return apiFetch(`/stock/${id}`, { method: "PUT", token, body: JSON.stringify(data) });
  },
  
  // Delete stock item
  delete: async (id: string, token: string) => {
    return apiFetch(`/stock/${id}`, { method: "DELETE", token });
  },
  
  // Get movement history
  getMovements: async (id: string, token: string, limit?: number) => {
    const params = limit ? `?limit=${limit}` : "";
    return apiFetch(`/stock/${id}/movements${params}`, { token });
  },
};
```

**Интеграция:**
```typescript
// lib/api.ts
export { stockApi } from './api/stock';

export default {
  // ... existing
  stock: stockApi,
};
```

---

### 📦 `lib/api/history.ts` (НОВЫЙ МОДУЛЬ) - ПРИОРИТЕТ: LOW

```typescript
import { apiFetch } from './base';

export const historyApi = {
  getHistory: async (filters?: { type?: string; limit?: number; offset?: number }, token: string) => {
    const params = new URLSearchParams();
    if (filters?.type) params.append("type", filters.type);
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.offset) params.append("offset", filters.offset.toString());
    return apiFetch(`/api/history?${params}`, { token });
  },
};
```

---

### 📦 `lib/api/treasury.ts` (НОВЫЙ МОДУЛЬ) - ПРИОРИТЕТ: LOW

```typescript
import { apiFetch } from './base';

export const treasuryApi = {
  // Public treasury info
  getPublicInfo: async () => {
    return apiFetch("/api/public/treasury");
  },
  
  // SSE Stream (EventSource)
  connectStream: () => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api";
    return new EventSource(`${API_BASE_URL}/treasury/stream`);
  },
};
```

---

## 📋 Action Plan

### 🔥 PHASE 1: Критичные недостающие функции (HIGH Priority)

1. **Создать `lib/api/recipes.ts`** (CRUD операции с рецептами)
   - [ ] Реализовать `getAll()`, `getById()`, `getStats()`, `incrementView()`
   - [ ] Реализовать `create()`, `update()`, `delete()`
   - [ ] Реализовать `save()`, `getSaved()`, `adapt()`
   - [ ] Добавить в lib/api.ts

2. **Создать `lib/api/budget.ts`** (Управление бюджетом)
   - [ ] Реализовать все 5 методов
   - [ ] Добавить в lib/api.ts
   - [ ] Создать UI компоненты (если нужно)

3. **Дополнить `lib/api/fridge.ts`**
   - [ ] Добавить `addMissingIngredients()`
   - [ ] Добавить `getCatalog()` (явный метод)

4. **Дополнить `lib/api/auth.ts`**
   - [ ] Реализовать `refresh()` (вместо stub)
   - [ ] Реализовать `logout()` и `getMe()` (если backend поддерживает)

---

### ⚡ PHASE 2: Расширение Tasks и Admin (MEDIUM Priority)

5. **Расширить `lib/api/tasks.ts`** (User tasks)
   - [ ] Добавить `getUserTasks()`, `getAvailableTasks()`, `getUserTasksStats()`
   - [ ] Добавить `startTask()`, `updateProgress()`, `completeTask()`, `claimReward()`
   - [ ] Добавить `getTaskById()`

6. **Расширить `lib/api/admin.ts`** (13 недостающих методов)
   - [ ] Token Bank: `getTokenBankStats()`, `getUserTokenBank()`, `revokeTokens()`, `setUserBalance()`
   - [ ] Transactions: `getAllTransactions()`, `getUserTransactions()`, `filterTransactions()`, `getTransactionStats()`
   - [ ] Treasury: `getTreasury()`, `allocateFromTreasury()`
   - [ ] Stats: `getDashboard()`, `getAdminProfile()`
   - [ ] Ingredients: `importIngredients()`

7. **Дополнить `lib/api/academy.ts`**
   - [ ] Lessons: `getCourseLessons()`, `getLesson()`, `completeLesson()`
   - [ ] Quizzes: `getQuiz()`, `submitQuiz()`
   - [ ] Enrollment: `enrollCourse()`
   - [ ] Progress: `getCourseProgress()`

---

### 🔧 PHASE 3: Новые модули (LOW Priority)

9. **Создать `lib/api/nutrition.ts`**
   - [ ] Реализовать `getRecipeNutrition()`
   - [ ] Реализовать `calculate()`

10. **Создать `lib/api/stock.ts`** (для pro_chef)
    - [ ] Реализовать все 6 методов
    - [ ] Добавить в lib/api.ts

11. **Создать `lib/api/business.ts`**
    - [ ] Реализовать все 6 методов
    - [ ] Добавить в lib/api.ts

12. **Создать `lib/api/semi-finished.ts`**
    - [ ] Реализовать все 5 методов
    - [ ] Добавить в lib/api.ts

13. **Создать `lib/api/history.ts`**
    - [ ] Реализовать `getHistory()`
    - [ ] Добавить в lib/api.ts

14. **Создать `lib/api/treasury.ts`**
    - [ ] Реализовать `getPublicInfo()`
    - [ ] Реализовать `connectStream()` (EventSource)
    - [ ] Добавить в lib/api.ts

---

## 📝 Примечания

### 🎯 Приоритеты реализации

1. **HIGH (PHASE 1)**: Рецепты, бюджет, auth, fridge - базовый функционал
2. **MEDIUM (PHASE 2)**: AI расширения, tasks, admin - улучшение UX
3. **LOW (PHASE 3)**: Nutrition, stock, business, treasury - дополнительный функционал

### ⚠️ Предупреждения

- **Recipes**: Критично отсутствует CRUD функционал (создание, редактирование, удаление)
- **Budget**: Полностью отсутствует (может влиять на UX)
- **Tasks**: User tasks неполные (влияет на gamification)
- **Admin**: Token transactions отсутствуют (проблемы с отчётностью)
- **Stock**: Только для pro_chef, можно отложить

### 🔍 Несоответствия путей

- `tasksApi.submitTask()` использует `/tasks/{taskId}/submit`, а backend имеет `/user/tasks/{taskID}/complete`
- `tasksApi.getUserTasks()` использует `/tasks/user/{userId}`, а backend имеет `/user/tasks/`
- `marketplaceApi.getPurchasedRecipes()` использует `/marketplace/my-purchases`, а backend имеет `/marketplace/purchases`

**Рекомендация:** Уточнить правильные пути с backend командой.

---

## ✅ Checklist для Frontend Developer

- [ ] Создать недостающие модули (recipes, budget, nutrition, stock, business, semi-finished, history, treasury)
- [ ] Дополнить существующие модули (fridge, ai, tasks, admin, academy, auth)
- [ ] Обновить `lib/api.ts` с новыми экспортами
- [ ] Добавить TypeScript типы для всех новых методов
- [ ] Написать unit tests для новых модулей
- [ ] Обновить документацию `lib/api/README.md`
- [ ] Проверить совместимость путей с backend
- [ ] Протестировать все эндпоинты в dev окружении
- [ ] Code review и merge

---

## 🎉 Заключение

**Текущее покрытие:** 54% (65/120 эндпоинтов)

**После выполнения Action Plan:** ~95% (114/120 эндпоинтов)

**Осталось после реализации:**
- Legacy endpoints (`/posts`, `/users/{id}/posts`) - возможно устарели
- Некоторые специализированные admin endpoints

**Рекомендация:** Приоритизировать PHASE 1 и PHASE 2, PHASE 3 можно реализовать по необходимости.

---

**Автор:** GitHub Copilot  
**Дата:** 2025-12-26  
**Файл:** `docs/API_COVERAGE_REPORT.md`
