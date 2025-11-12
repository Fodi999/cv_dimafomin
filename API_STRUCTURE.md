# 🌐 Полная структура API

## 📍 Base URL
```
https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api
```

Конфигурируется через переменную `NEXT_PUBLIC_API_URL`

---

## 🏗️ Архитектура

```
lib/api.ts (887 строк)
├── apiFetch()          → Generic fetch wrapper с error handling
├── authApi             → Аутентификация
├── academyApi          → Курсы и обучение
├── marketplaceApi      → Рецепты и покупки
├── aiApi               → AI помощники
├── uploadApi           → Загрузка файлов
├── walletApi           → Платежи
├── fridgeApi           → Холодильник
├── contactApi          → Контакты
├── healthApi           → Здоровье
├── userApi             → Профиль и настройки ✨ НОВЫЙ
└── adminApi            → Администрирование
```

---

## 🔐 AUTH API (`authApi`)

### Endpoints

| Метод | URL | Функция | Описание |
|-------|-----|---------|---------|
| POST | `/auth/login` | `login(email, password)` | Вход пользователя |
| POST | `/auth/register` | `register(name, email, password)` | Регистрация |

### Примеры

```typescript
// Вход
const result = await authApi.login('user@example.com', 'password');
// Возвращает: { token: 'jwt...', user: {...} }

// Регистрация
const result = await authApi.register('John', 'john@example.com', 'password');
// Возвращает: { token: 'jwt...', user: {...} }
```

---

## 📚 ACADEMY API (`academyApi`)

### Endpoints

| Метод | URL | Функция | Параметры |
|-------|-----|---------|-----------|
| GET | `/academy/courses` | `getCourses()` | - |
| GET | `/academy/courses/:id` | `getCourse(id)` | courseId |
| GET | `/academy/dashboard` | `getDashboard(token)` | token (JWT) |
| POST | `/academy/courses/:id/enroll` | `enrollCourse(id, token)` | courseId, token |
| GET | `/academy/courses/:id/lessons` | `getCourseLessons(id)` | courseId |
| POST | `/academy/lessons/:id/complete` | `completeLesson(id, token)` | lessonId, token |
| GET | `/academy/leaderboard` | `getLeaderboard()` | - |

### Примеры

```typescript
// Получить все курсы
const courses = await academyApi.getCourses();

// Получить один курс
const course = await academyApi.getCourse('course-123');

// Получить dashboard текущего пользователя
const dashboard = await academyApi.getDashboard(token);

// Записаться на курс
await academyApi.enrollCourse('course-123', token);

// Получить уроки курса
const lessons = await academyApi.getCourseLessons('course-123');

// Завершить урок
await academyApi.completeLesson('lesson-456', token);

// Получить таблицу лидеров
const leaderboard = await academyApi.getLeaderboard();
```

---

## 🛒 MARKETPLACE API (`marketplaceApi`)

### Endpoints

| Метод | URL | Функция | Параметры |
|-------|-----|---------|-----------|
| GET | `/marketplace/recipes` | `getRecipes()` | - |
| GET | `/marketplace/recipes/:id` | `getRecipe(id)` | recipeId |
| POST | `/marketplace/recipes` | `publishRecipe(data, token)` | data, token |
| GET | `/marketplace/my-recipes` | `getMyRecipes(token)` | token |
| PUT | `/marketplace/recipes/:id` | `updateRecipe(id, data, token)` | recipeId, data, token |
| DELETE | `/marketplace/recipes/:id` | `deleteRecipe(id, token)` | recipeId, token |
| POST | `/marketplace/recipes/:id/purchase` | `purchaseRecipe(id, token)` | recipeId, token |
| GET | `/marketplace/my-purchases` | `getMyPurchases(token)` | token |
| POST | `/marketplace/recipes/:id/rate` | `rateRecipe(id, rating, token)` | recipeId, rating, token |

### Примеры

```typescript
// Получить все рецепты
const recipes = await marketplaceApi.getRecipes();

// Получить один рецепт
const recipe = await marketplaceApi.getRecipe('recipe-123');

// Опубликовать рецепт
const newRecipe = await marketplaceApi.publishRecipe({
  title: 'Суши',
  description: '...',
  image: 'url...',
  price: 100,
}, token);

// Мои рецепты
const myRecipes = await marketplaceApi.getMyRecipes(token);

// Обновить рецепт
await marketplaceApi.updateRecipe('recipe-123', { title: 'Новое имя' }, token);

// Удалить рецепт
await marketplaceApi.deleteRecipe('recipe-123', token);

// Купить рецепт
await marketplaceApi.purchaseRecipe('recipe-123', token);

// Мои покупки
const purchases = await marketplaceApi.getMyPurchases(token);

// Оценить рецепт
await marketplaceApi.rateRecipe('recipe-123', 5, token);
```

---

## 🤖 AI API (`aiApi`)

### Endpoints

| Метод | URL | Функция | Параметры |
|-------|-----|---------|-----------|
| POST | `/ai/culinary/analyze` | `analyzeRecipe(recipe, token)` | recipe, token |
| POST | `/ai/chef-mentor` | `chatWithMentor(message, token)` | message, token |
| POST | `/ai/recipe-generator` | `generateRecipe(params, token)` | params, token |

### Примеры

```typescript
// Анализировать рецепт
const analysis = await aiApi.analyzeRecipe({
  name: 'Суши',
  ingredients: [...],
  steps: [...]
}, token);

// Чат с AI chef mentor
const response = await aiApi.chatWithMentor('Как приготовить суши?', token);

// Сгенерировать рецепт
const recipe = await aiApi.generateRecipe({
  style: 'japanese',
  difficulty: 'medium',
  prepTime: 30
}, token);
```

---

## 📤 UPLOAD API (`uploadApi`)

### Endpoints

| Метод | URL | Функция | Параметры |
|-------|-----|---------|-----------|
| POST | `/upload/image` | `uploadImage(file, token)` | file, token |
| POST | `/upload/video` | `uploadVideo(file, token)` | file, token |
| POST | `/upload/document` | `uploadDocument(file, token)` | file, token |

### Примеры

```typescript
// Загрузить изображение
const result = await uploadApi.uploadImage(fileObject, token);
// Возвращает: { url: 'https://...' }

// Загрузить видео
const result = await uploadApi.uploadVideo(videoFile, token);

// Загрузить документ
const result = await uploadApi.uploadDocument(docFile, token);
```

---

## 💳 WALLET API (`walletApi`)

### Endpoints

| Метод | URL | Функция | Параметры |
|-------|-----|---------|-----------|
| GET | `/wallet/balance` | `getBalance(token)` | token |
| POST | `/wallet/topup` | `topUpBalance(amount, method, token)` | amount, method, token |
| GET | `/wallet/transactions` | `getTransactions(token)` | token |
| POST | `/wallet/transfer` | `transferTokens(toUserId, amount, token)` | toUserId, amount, token |

### Примеры

```typescript
// Получить баланс
const balance = await walletApi.getBalance(token);

// Пополнить баланс
const result = await walletApi.topUpBalance(1000, 'card', token);

// История транзакций
const transactions = await walletApi.getTransactions(token);

// Отправить токены
await walletApi.transferTokens('user-456', 100, token);
```

---

## 🍳 FRIDGE API (`fridgeApi`)

### Endpoints

| Метод | URL | Функция | Параметры |
|-------|-----|---------|-----------|
| GET | `/fridge/items` | `getItems(token)` | token |
| POST | `/fridge/items` | `addItem(name, quantity, token)` | name, quantity, token |
| PUT | `/fridge/items/:id` | `updateItem(id, data, token)` | id, data, token |
| DELETE | `/fridge/items/:id` | `removeItem(id, token)` | id, token |
| GET | `/fridge/recipes` | `getSuggestedRecipes(token)` | token |

### Примеры

```typescript
// Мои продукты
const items = await fridgeApi.getItems(token);

// Добавить продукт
await fridgeApi.addItem('помидоры', 5, token);

// Обновить продукт
await fridgeApi.updateItem('item-123', { quantity: 3 }, token);

// Удалить продукт
await fridgeApi.removeItem('item-123', token);

// Рецепты из имеющихся продуктов
const recipes = await fridgeApi.getSuggestedRecipes(token);
```

---

## 👥 CONTACT API (`contactApi`)

### Endpoints

| Метод | URL | Функция | Параметры |
|-------|-----|---------|-----------|
| GET | `/contacts` | `getContacts(token)` | token |
| POST | `/contacts` | `addContact(name, email, token)` | name, email, token |
| PUT | `/contacts/:id` | `updateContact(id, data, token)` | id, data, token |
| DELETE | `/contacts/:id` | `removeContact(id, token)` | id, token |

### Примеры

```typescript
// Мои контакты
const contacts = await contactApi.getContacts(token);

// Добавить контакт
await contactApi.addContact('John', 'john@example.com', token);

// Обновить контакт
await contactApi.updateContact('contact-123', { phone: '555-1234' }, token);

// Удалить контакт
await contactApi.removeContact('contact-123', token);
```

---

## 💪 HEALTH API (`healthApi`)

### Endpoints

| Метод | URL | Функция | Параметры |
|-------|-----|---------|-----------|
| GET | `/health/user-stats` | `getUserStats(token)` | token |
| POST | `/health/log-meal` | `logMeal(data, token)` | data, token |
| GET | `/health/nutrition` | `getNutritionInfo(token)` | token |
| POST | `/health/goals` | `setGoals(goals, token)` | goals, token |

### Примеры

```typescript
// Личная статистика
const stats = await healthApi.getUserStats(token);

// Записать прием пищи
await healthApi.logMeal({
  name: 'Обед',
  calories: 500,
  timestamp: new Date()
}, token);

// Информация о питании
const nutrition = await healthApi.getNutritionInfo(token);

// Установить цели
await healthApi.setGoals({
  dailyCalories: 2000,
  protein: 150,
  carbs: 200,
  fat: 70
}, token);
```

---

## 👤 USER API (`userApi`) ✨ НОВЫЙ

### Endpoints

| Метод | URL | Функция | Описание |
|-------|-----|---------|---------|
| GET | `/user/profile` | `getProfile(token)` | Получить профиль |
| PUT | `/user/profile` | `updateProfile(data, token)` | Обновить профиль |
| POST | `/user/avatar` | `uploadAvatar(file, token)` | Загрузить аватар |
| GET | `/user/settings` | `getSettings(token)` | Получить настройки |
| PUT | `/user/settings` | `updateSettings(data, token)` | Обновить настройки |
| GET | `/user/courses` | `getCourses(token, filters)` | Список курсов |
| GET | `/user/progress` | `getProgress(token)` | Прогресс обучения |
| GET | `/user/stats` | `getStats(token)` | Статистика |
| GET | `/user/tokens` | `getTokens(token, filters)` | Информация о токенах |
| GET | `/user/wallet` | `getWallet(token, options)` | Информация о кошельке |

### Примеры

```typescript
// === ПРОФИЛЬ ===

// Получить профиль
const profile = await userApi.getProfile(token);
// Возвращает: { id, name, email, avatar, bio, location, ... }

// Обновить профиль
const updated = await userApi.updateProfile({
  name: 'Новое имя',
  bio: 'Новая биография',
  location: 'Киев',
  phone: '380501234567',
  instagram: '@myname',
  language: 'uk'
}, token);

// === АВАТАР ===

// Загрузить аватар
const result = await userApi.uploadAvatar(fileObject, token);
// Возвращает: { url: 'https://res.cloudinary.com/...', uploadedAt, size }

// === НАСТРОЙКИ ===

// Получить настройки
const settings = await userApi.getSettings(token);
// Возвращает: { language: 'uk', theme: 'dark', notifications: {...} }

// Обновить настройки
await userApi.updateSettings({
  language: 'en',
  theme: 'light',
  notifications: { email: true, push: false }
}, token);

// === КУРСЫ ===

// Получить курсы
const courses = await userApi.getCourses(token, {
  status: 'active',
  category: 'cooking',
  sort: 'progress',
  limit: 10,
  offset: 0
});
// Возвращает: { courses: [...], total: 5, page: 1 }

// === ПРОГРЕСС ===

// Получить прогресс обучения
const progress = await userApi.getProgress(token);
// Возвращает: { currentLevel, currentXp, coursesCompleted, ... }

// === СТАТИСТИКА ===

// Получить статистику
const stats = await userApi.getStats(token);
// Возвращает: { posts, followers, engagement, recipes, ... }

// === ТОКЕНЫ ===

// Получить информацию о токенах
const tokens = await userApi.getTokens(token, {
  type: 'earned',
  limit: 20,
  offset: 0
});
// Возвращает: { balance, earned, spent, transactions: [...] }

// === КОШЕЛЕК ===

// Получить информацию о кошельке
const wallet = await userApi.getWallet(token, {
  include_purchases: true,
  include_subscriptions: true,
  limit: 50
});
// Возвращает: { chefTokens, paymentMethods, purchases, ... }
```

---

## 👨‍💼 ADMIN API (`adminApi`)

### Users Endpoints

| Метод | URL | Функция | Описание |
|-------|-----|---------|---------|
| GET | `/admin/users` | `getUsers(token)` | Получить всех пользователей |
| PUT | `/admin/users/:id` | `updateUser(id, data, token)` | Обновить пользователя |
| DELETE | `/admin/users/:id` | `deleteUser(id, token)` | Удалить пользователя |
| PATCH | `/admin/users/update-role` | `updateUserRole(userId, role, token)` | Изменить роль |

### Orders Endpoints

| Метод | URL | Функция | Описание |
|-------|-----|---------|---------|
| GET | `/admin/orders` | `getOrders(token)` | Получить все заказы |
| GET | `/admin/orders/recent` | `getRecentOrders(token)` | Последние 10 заказов |
| PUT | `/admin/orders/:id/status` | `updateOrderStatus(id, status, token)` | Изменить статус |

### Stats Endpoint

| Метод | URL | Функция | Описание |
|-------|-----|---------|---------|
| GET | `/admin/stats` | `getStats(token)` | Получить статистику |

### Примеры

```typescript
// === USERS ===

// Получить всех пользователей
const users = await adminApi.getUsers(token);

// Обновить пользователя
await adminApi.updateUser('user-123', { 
  name: 'New Name',
  email: 'new@example.com'
}, token);

// Удалить пользователя
await adminApi.deleteUser('user-123', token);

// Изменить роль
await adminApi.updateUserRole('user-123', 'moderator', token);

// === ORDERS ===

// Получить все заказы
const orders = await adminApi.getOrders(token);

// Последние 10 заказов
const recentOrders = await adminApi.getRecentOrders(token);

// Изменить статус заказа
await adminApi.updateOrderStatus('order-123', 'delivered', token);

// === STATS ===

// Получить статистику
const stats = await adminApi.getStats(token);
```

---

## 🔗 Использование в компонентах

### Вариант 1: Прямое использование в useEffect

```typescript
import { userApi } from '@/lib/api';
import { useEffect, useState } from 'react';

export function ProfileComponent() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    userApi.getProfile(token)
      .then(setProfile)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{profile?.name}</div>;
}
```

### Вариант 2: С обработкой ошибок

```typescript
import { userApi } from '@/lib/api';

async function handleUpdateProfile(formData) {
  const token = localStorage.getItem('token');
  
  try {
    const updated = await userApi.updateProfile(formData, token);
    console.log('✅ Profile updated:', updated);
    // Обновить UI
  } catch (error) {
    console.error('❌ Error:', error.message);
    // Показать пользователю ошибку
  }
}
```

### Вариант 3: С контекстом

```typescript
import { useUser } from '@/contexts/UserContext';

export function ProfileComponent() {
  const { user, updateProfile } = useUser();

  async function handleSave(formData) {
    try {
      await updateProfile(formData);
      // Success
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    // JSX
  );
}
```

---

## 📊 Структура ответов

### Success Response
```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "John",
    ...
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Something went wrong",
  "message": "Invalid credentials"
}
```

---

## 🔑 Аутентификация

Все endpoints (кроме `login` и `register`) требуют JWT токен:

```typescript
const token = localStorage.getItem('token');

// Использование в apiFetch
const data = await apiFetch('/user/profile', { token });

// Или в fetch напрямую
fetch('/api/user/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## ⚙️ Конфигурация

### Переменные окружения

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api
```

Если не установлена, используется значение по умолчанию из `lib/api.ts`.

---

## 🚀 Импорт в компонентах

```typescript
// Все API
import api from '@/lib/api';

// Или конкретный API
import { userApi, authApi, marketplaceApi } from '@/lib/api';

// Использование
const profile = await userApi.getProfile(token);
const recipes = await marketplaceApi.getRecipes();
const courses = await academyApi.getCourses();
```

---

## 📝 Типы данных

Типы определены в `lib/types.ts`:

```typescript
export interface ProfileData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  followers: number;
  following: number;
  postsCount: number;
  createdAt: string;
  // ... другие поля
}

export interface CourseData {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  progress?: number;
  // ... другие поля
}

export interface RecipeData {
  id: string;
  title: string;
  description: string;
  image: string;
  ingredients: Ingredient[];
  steps: Step[];
  // ... другие поля
}
```

---

## 📞 Поддержка ошибок

API может возвращать следующие HTTP коды:

```
200 OK              ✅ Успешный запрос
201 Created         ✅ Ресурс создан
400 Bad Request     ❌ Неверные данные
401 Unauthorized    ❌ Не авторизован (токен отсутствует/истек)
403 Forbidden       ❌ Доступ запрещен
404 Not Found       ❌ Ресурс не найден
409 Conflict        ❌ Конфликт (например, дублирование)
413 Payload Too Large ❌ Файл слишком большой
415 Unsupported Media Type ❌ Неподдерживаемый тип
422 Unprocessable Entity ❌ Невозможно обработать
500 Server Error    ❌ Ошибка сервера
```

---

**Версия**: 2.0  
**Обновлено**: 12 ноября 2025  
**Статус**: ✅ Production Ready
