# 🔧 Быстрая проверка исправления API Base URL

## ✅ Что было исправлено

**Файл**: `lib/api/ai-recipe.ts`

**Было**:
```typescript
fetch('/api/ai-recipe/recommendation')  // ❌ localhost:3000
```

**Стало**:
```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
fetch(`${API_BASE}/ai-recipe/recommendation`)  // ✅ Koyeb backend
```

---

## 🧪 Чеклист проверки

### 1. Перезапустить dev-сервер
```bash
# Остановить текущий (Ctrl+C)
npm run dev
```

### 2. Открыть /assistant
```
http://localhost:3000/assistant
```

### 3. Открыть DevTools (F12) → Network

### 4. Проверить запрос

✅ **Правильно**:
```
Request URL: https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/ai-recipe/recommendation
Method: GET
Status: 200 OK (если backend работает)
Status: 401 Unauthorized (если нет токена - норма)
```

❌ **Неправильно**:
```
Request URL: http://localhost:3000/api/ai-recipe/recommendation
Status: 404 Not Found
```

---

## 🎯 Ожидаемое поведение

### Если всё работает:
1. ✅ Loading spinner показывается
2. ✅ Запрос идёт на Koyeb backend
3. ✅ Backend возвращает AI recommendation
4. ✅ Показывается карточка с рецептом

### Если ошибка 401:
- Это нормально - нужно залогиниться
- Кликнуть "Zaloguj się"

### Если ошибка 404:
- Backend endpoint ещё не реализован
- Нужно реализовать `/api/ai-recipe/recommendation` на Go backend

### Если ошибка CORS:
- Backend не разрешает запросы с localhost:3000
- Нужно добавить CORS headers в Go backend

---

## 📋 Быстрый дебаг

### Проверить переменную окружения:
```bash
cat .env.local | grep NEXT_PUBLIC_API_BASE
```

**Должно быть**:
```bash
NEXT_PUBLIC_API_BASE=https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api
```

### Проверить в браузере:
```javascript
// Console → вставить:
console.log(process.env.NEXT_PUBLIC_API_BASE)
// Не сработает в browser, но можно проверить в компоненте
```

### Проверить Network → Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🚀 Готово!

Если видишь запрос на правильный URL - всё исправлено корректно.

**Дата**: 17.01.2026  
**Статус**: ✅ Готово к тестированию
