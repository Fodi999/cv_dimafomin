# 🎁 Welcome Bonus System - 100 ChefTokens

## 📋 Обзор

Каждый новый пользователь автоматически получает **100 ChefTokens** при регистрации. Это происходит на уровне бэкенда без дополнительных запросов с фронтенда.

---

## 🔄 Как это работает

### Backend Flow (Go)

```
1. POST /api/auth/register
   ↓
2. Создание пользователя в таблице users
   ↓
3. Создание TokenBank записи (balance = 0)
   ↓
4. AllocateWelcomeBonus(userID, 100)
   ├─ Treasury.balance -= 100
   ├─ Treasury.total_used += 100
   ├─ User.balance += 100
   └─ User.total_allocated += 100
   ↓
5. Запись транзакции (type: WELCOME_BONUS)
   ↓
6. Публикация WebSocket события
   ↓
7. Возврат данных пользователя с балансом 100 CT
```

---

## 🌐 API Endpoint

### Registration with Auto-Bonus

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "7ec8aba4-...",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "student",
    "chefTokens": 100,
    "level": 1,
    "xp": 0
  }
}
```

**⚠️ ВАЖНО:** Поле `chefTokens` уже содержит 100 токенов благодаря автоматическому бонусу!

---

## 💻 Frontend Implementation

### UserContext.register()

```typescript
const register = async (name: string, email: string, password: string) => {
  try {
    // API call to backend
    const response = await authApi.register(name, email, password);
    
    // Backend уже включил 100 токенов в response.user.chefTokens
    const userObj = {
      id: userId,
      name: response.user?.name || name,
      email: response.user?.email || email,
      role: userRole,
      chefTokens: response.user?.chefTokens, // 🎁 Уже содержит 100 CT
    };
    
    setUser(userObj);
    
    // 🎁 Бонус начислен автоматически на бэкенде
    console.log("🎁 Welcome bonus (100 CT) allocated automatically by backend");
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};
```

**✅ Никаких дополнительных запросов не требуется!**

---

## 📊 Transaction Details

### Transaction Record

Каждый приветственный бонус создаёт транзакцию:

```json
{
  "id": "tx-uuid",
  "from_user_id": null,
  "to_user_id": "user-uuid",
  "amount": 100,
  "type": "WELCOME_BONUS",
  "description": "Welcome bonus for new user",
  "created_at": "2025-12-11T10:30:00Z"
}
```

**Поля:**
- `from_user_id: null` - токены приходят из Treasury (казначейства)
- `to_user_id` - ID нового пользователя
- `type: WELCOME_BONUS` - специальный тип транзакции
- `amount: 100` - фиксированная сумма бонуса

---

## 🔍 Admin Monitoring

### View All Welcome Bonuses

```http
GET /api/admin/token-bank/transactions/filter?type=WELCOME_BONUS
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "tx-123",
        "from_user_id": null,
        "to_user_id": "user-456",
        "amount": 100,
        "type": "WELCOME_BONUS",
        "description": "Welcome bonus for new user",
        "created_at": "2025-12-11T08:20:00Z"
      },
      {
        "id": "tx-789",
        "from_user_id": null,
        "to_user_id": "user-101",
        "amount": 100,
        "type": "WELCOME_BONUS",
        "description": "Welcome bonus for new user",
        "created_at": "2025-12-11T09:15:00Z"
      }
    ],
    "total": 2,
    "page": 1,
    "limit": 20
  }
}
```

### Treasury Statistics

```http
GET /api/admin/token-bank/transactions/stats
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_allocated": 1200,
    "total_spent": 300,
    "unique_users": 12,
    "welcome_bonuses_issued": 12,
    "average_balance": 75
  }
}
```

**Metrics:**
- `total_allocated` - включает все WELCOME_BONUS транзакции
- `unique_users` - количество пользователей с токенами
- `welcome_bonuses_issued` - количество выданных приветственных бонусов

---

## 🎨 UI/UX Considerations

### Registration Success Screen

После успешной регистрации покажите пользователю:

```tsx
<div className="success-message">
  <h2>🎉 Ласкаво просимо!</h2>
  <p>Ваш акаунт створено успішно</p>
  
  <div className="bonus-card">
    <span className="icon">🎁</span>
    <p>Вітальний бонус:</p>
    <h3>+100 ChefTokens</h3>
  </div>
  
  <p className="hint">
    Використовуйте токени для AI помічника, завдань та покупок
  </p>
</div>
```

### User Dashboard

Покажите источник первых токенов в истории транзакций:

```tsx
<TransactionItem
  type="WELCOME_BONUS"
  amount={100}
  icon="🎁"
  description="Вітальний бонус для нового користувача"
  date="2025-12-11"
/>
```

---

## 🐛 Troubleshooting

### Problem: User registered but has 0 tokens

**Причины:**
1. Backend endpoint не вызвал `AllocateWelcomeBonus()`
2. Treasury balance недостаточен (< 100 CT)
3. Ошибка в транзакции базы данных

**Solution:**
1. Проверьте логи backend:
   ```
   grep "AllocateWelcomeBonus" /var/log/app.log
   ```

2. Проверьте Treasury balance:
   ```http
   GET /api/admin/treasury/stats
   ```

3. Вручную начислите бонус (admin only):
   ```http
   POST /api/admin/token-bank/allocate
   {
     "userId": "user-uuid",
     "amount": 100,
     "reason": "Manual welcome bonus allocation"
   }
   ```

### Problem: Welcome bonus issued twice

**Причина:** Пользователь зарегистрировался дважды с разными email

**Solution:**
- Backend должен предотвращать дублирование email
- Проверка: `SELECT * FROM users WHERE email = 'user@example.com'`

---

## ✅ Testing Checklist

### Registration Flow
- [ ] Новый пользователь регистрируется
- [ ] Backend возвращает `chefTokens: 100` в response
- [ ] Frontend корректно сохраняет баланс в state
- [ ] localStorage содержит `chefTokens: 100`
- [ ] UI показывает баланс 100 CT

### Transaction Recording
- [ ] Транзакция WELCOME_BONUS создаётся автоматически
- [ ] `from_user_id` = null (Treasury)
- [ ] `to_user_id` = новый user ID
- [ ] `amount` = 100
- [ ] Transaction visible в admin panel

### Treasury Impact
- [ ] Treasury balance уменьшается на 100
- [ ] Treasury `total_used` увеличивается на 100
- [ ] Stats endpoint показывает корректные данные

### User Experience
- [ ] Success message показывает бонус
- [ ] История транзакций отображает WELCOME_BONUS
- [ ] Баланс отображается в header/dashboard
- [ ] Пользователь может использовать токены

---

## 📈 Analytics & Metrics

### Key Metrics to Track

1. **Welcome Bonus Conversion Rate**
   - Сколько новых пользователей активировали токены?
   - Формула: (users who spent tokens) / (total registrations)

2. **Average Time to First Spend**
   - Сколько времени проходит до первой траты токенов?
   - Цель: < 24 часа

3. **Token Utilization**
   - Сколько welcome bonus токенов остаются неиспользованными?
   - Формула: (unused welcome bonuses) / (total issued)

4. **Treasury Impact**
   - Сколько токенов выделено на welcome bonuses?
   - Доля от общего Treasury: welcome_bonuses / total_allocated

---

## 🚀 Future Enhancements

### Possible Improvements

1. **Tiered Welcome Bonuses**
   ```
   - Referral registration: 150 CT
   - Social media registration: 120 CT
   - Standard registration: 100 CT
   ```

2. **Welcome Quest Chain**
   ```
   - Complete profile: +50 CT
   - First recipe: +25 CT
   - First AI chat: +25 CT
   ```

3. **Expiring Bonuses**
   ```
   - Welcome bonus expires in 30 days
   - Encourages early engagement
   ```

4. **Personalized Bonuses**
   ```
   - Based on referral source
   - Based on user location
   - Based on signup time (promotions)
   ```

---

## 📚 Related Documentation

- [Treasury Integration Guide](./TREASURY_INTEGRATION.md)
- [API Endpoints](./API_ENDPOINTS.md)
- [Transaction Types](./TRANSACTION_TYPES.md)

---

**Backend Commit:** ed92931  
**Feature Status:** ✅ Implemented & Active  
**Last Updated:** 11 декабря 2025  
**Version:** 1.0
