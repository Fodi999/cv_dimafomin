# 🔧 Debug - Проверка API Backend

## Проблема

```
❌ API Error 401: {
  endpoint: '/auth/login', 
  method: 'POST', 
  status: 401, 
  message: 'Invalid credentials'
}
```

## Возможные причины

1. **Неверные учетные данные**
   - Email/пароль не существуют в базе
   - Пользователь не зарегистрирован

2. **Формат отправки данных**
   - Backend ожидает другой формат JSON
   - Нужны дополнительные поля

3. **CORS/Authorization**
   - Проблема с заголовками
   - Неверный Bearer token формат

## Решение

### Шаг 1: Проверить существование пользователя

Попробуйте сначала **зарегистрироваться**:

```bash
curl -X POST https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Шаг 2: Проверить логин после регистрации

```bash
curl -X POST https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Шаг 3: Проверить возвращаемый формат

Backend должен вернуть:

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user-id",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

или

```json
{
  "userId": "user-id",
  "token": "jwt_token_here"
}
```

## Дополнительная диагностика

Включите детальное логирование в `/lib/api.ts`:

```typescript
console.log("📤 Request body:", JSON.stringify({ email, password }));
console.log("📥 Full response:", await response.text());
```

Это поможет увидеть точный формат ответа backend.
