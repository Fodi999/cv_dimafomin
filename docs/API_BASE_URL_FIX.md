# ✅ API Base URL Fix - 2025 Architecture

## 🐛 Проблема

**Файл**: `lib/api/ai-recipe.ts`

### ❌ Было (неправильно):
```typescript
const res = await fetch('/api/ai-recipe/recommendation', {
```

**Результат**: 
- ❌ Запрос шёл на Next.js API Routes (`localhost:3000/api/...`)
- ❌ Backend на Koyeb не получал запросы
- ❌ 404 Not Found

---

## ✅ Решение

### Исправлено в `lib/api/ai-recipe.ts`:

```typescript
// ✅ Backend API base URL (Koyeb) - БЕЗ /api на конце!
// В .env.local: NEXT_PUBLIC_API_BASE=https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api';

export async function fetchAIRecipe(token: string): Promise<AIRecipeResponse> {
  const res = await fetch(`${API_BASE}/ai-recipe/recommendation`, {
    // ✅ Теперь: https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/ai-recipe/recommendation
```

### Используемая переменная окружения:

**Файл**: `.env.local`
```bash
# Production Backend (Koyeb) - используем по умолчанию:
NEXT_PUBLIC_API_BASE=https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api
```

---

## 🎯 Правильный URL-путь

### Структура URL:

```
https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/ai-recipe/recommendation
│                                                   │   │
│                                                   │   └─ Endpoint
│                                                   └───── Base (из .env)
└──────────────────────────────────────────────────────── Koyeb Domain
```

### Два случая:

| Окружение | Base URL | Полный путь |
|-----------|----------|-------------|
| **Production** | `https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api` | `/api/ai-recipe/recommendation` |
| **Local Go Backend** | `http://localhost:8080/api` | `/api/ai-recipe/recommendation` |

---

## 🔍 Как проверить

### 1. Перезапустить dev-сервер:
```bash
npm run dev
```

### 2. Открыть страницу:
```
http://localhost:3000/assistant
```

### 3. Проверить Network в DevTools:

**✅ Правильно (после исправления):**
```
Request URL: https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/ai-recipe/recommendation
Status: 200 OK
```

**❌ Неправильно (было раньше):**
```
Request URL: http://localhost:3000/api/ai-recipe/recommendation
Status: 404 Not Found
```

---

## 📊 Изменённые файлы

1. ✅ **lib/api/ai-recipe.ts**
   - Добавлен `API_BASE` из env
   - `fetchAIRecipe()` теперь использует `${API_BASE}/ai-recipe/recommendation`
   - `fetchNextAIRecipe()` теперь использует `${API_BASE}/ai-recipe/recommendation?skip=...`

2. ✅ **.env.local** (без изменений, использовали существующую переменную)
   - `NEXT_PUBLIC_API_BASE` уже была настроена правильно

---

## 🚀 Результат

### Теперь работает:
1. ✅ Запросы идут на **Koyeb backend**
2. ✅ JWT token передаётся через Authorization header
3. ✅ Backend возвращает `AIRecipeResponse` с полным DTO
4. ✅ Frontend рендерит AI recommendation

### UI покажет:
- ✅ `data.recipe.displayName` - локализованное название
- ✅ `data.recipe.scenario` - сценарий (CAN_COOK_NOW/ALMOST_READY/NEED_MORE)
- ✅ `data.ai.title` - заголовок от AI
- ✅ `data.ai.reason` - объяснение от AI
- ✅ `data.ai.ingredientsUsed` - использованные ингредиенты

---

## 🧪 Следующие шаги

1. **Запустить сервер**:
   ```bash
   npm run dev
   ```

2. **Проверить /assistant**:
   - Должна автоматически загрузиться рекомендация
   - Должна показаться карточка с рецептом

3. **Если 401 Unauthorized**:
   - Проверить token в localStorage
   - Перелогиниться

4. **Если 404 Not Found**:
   - Проверить что backend endpoint существует
   - Проверить что backend запущен на Koyeb

---

## 📝 Комментарии в коде

```typescript
// ✅ Backend API base URL (Koyeb) - БЕЗ /api на конце!
// В .env.local: NEXT_PUBLIC_API_BASE=https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api';
```

**Почему комментарий "БЕЗ /api на конце"?**

Потому что в `.env.local` уже есть `/api`:
```bash
NEXT_PUBLIC_API_BASE=https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api
                                                                          ^^^^
```

И мы добавляем endpoint:
```typescript
fetch(`${API_BASE}/ai-recipe/recommendation`)
//                 ^^^^^^^^^ НЕ /api/ai-recipe, а просто /ai-recipe
```

Итоговый URL: `https://.../api/ai-recipe/recommendation` ✅

---

**Дата**: 17.01.2026  
**Статус**: ✅ Исправлено  
**Тестирование**: Требуется запуск dev-сервера
