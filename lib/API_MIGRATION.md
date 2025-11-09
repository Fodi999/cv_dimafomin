# API Endpoints Migration Guide

## Зміни в API ендпоінтах (9 листопада 2025)

### ✅ Виконані зміни:

#### 1. **Marketplace (замість Market)**
```typescript
// ❌ Старі endpoints
/market/recipes
/market/purchase
/market/stats/{userId}
/user/{userId}/purchases

// ✅ Нові endpoints
/marketplace/recipes
/marketplace/purchase
/marketplace/stats/{userId}
/marketplace/my-purchases
```

**Використання:**
```typescript
import { marketplaceApi } from "@/lib/api";

// Отримати рецепти
const recipes = await marketplaceApi.getRecipes({ category: "sushi" });

// Мої покупки (userId більше не потрібен в URL)
const purchases = await marketplaceApi.getPurchasedRecipes(userId, token);
```

**Backward compatibility:**
```typescript
import api from "@/lib/api";

// Обидва варіанти працюють
api.marketplace.getRecipes();
api.market.getRecipes(); // Alias для сумісності
```

---

#### 2. **AI Culinary Analysis**
```typescript
// ❌ Старий endpoint
POST /ai/analyze

// ✅ Новий endpoint
POST /ai/culinary/analyze
```

**Використання:**
```typescript
import { aiApi } from "@/lib/api";

const analysis = await aiApi.analyzeRecipe({
  title: "Паста Карбонара",
  ingredients: ["яйця", "бекон", "сир пармезан"],
  steps: ["Відварити пасту", "Змішати з соусом"],
  language: "ua"
}, token);
```

---

#### 3. **AI Chef Mentor Chat**
```typescript
// ❌ Старий endpoint
POST /mentor/chat

// ✅ Новий endpoint
POST /ai/chef-mentor
```

**Використання:**
```typescript
import { aiApi } from "@/lib/api";

const response = await aiApi.mentorChat(
  userId,
  "Як приготувати ідеальні суші?",
  "ua",
  token
);
```

---

#### 4. **Auth Endpoints (тимчасово відключені)**
```typescript
// ⚠️ Тимчасово заглушені (повертають mock дані)
POST /auth/logout
GET /auth/me
```

**Поточна реалізація:**
```typescript
// Logout - повертає успіх без запиту
await authApi.logout(token); // Promise.resolve({ success: true })

// GetMe - повертає null
await authApi.getMe(token); // Promise.resolve(null)
```

**TODO:** Реалізувати ці endpoints на бекенді

---

### 📝 Повний список API модулів:

```typescript
import api from "@/lib/api";

api.auth           // Авторизація (login, register, logout*, getMe*)
api.academy        // Академія (курси, профіль, leaderboard)
api.marketplace    // Маркетплейс рецептів
api.market         // Alias для marketplace (backward compatibility)
api.ai             // AI функції (аналіз, critique, chef-mentor)
api.upload         // Завантаження зображень
api.wallet         // Гаманець та токени
api.contact        // Контактна форма
api.health         // Health check
```

---

### 🔄 Міграція існуючого коду:

#### Знайти та замінити:
```bash
# Пошук старих використань
grep -r "marketApi" --include="*.ts" --include="*.tsx"
grep -r "/market/" --include="*.ts" --include="*.tsx"
grep -r "mentor/chat" --include="*.ts" --include="*.tsx"
grep -r "ai/analyze" --include="*.ts" --include="*.tsx"
```

#### Заміни:
```typescript
// 1. Import statements
- import { marketApi } from "@/lib/api";
+ import { marketplaceApi } from "@/lib/api";

// 2. API calls
- marketApi.getRecipes()
+ marketplaceApi.getRecipes()

// 3. URLs в fetch
- fetch("/api/market/recipes")
+ fetch("/api/marketplace/recipes")
```

---

### 🧪 Тестування:

```typescript
// Тест marketplace API
const testMarketplace = async () => {
  const recipes = await marketplaceApi.getRecipes();
  console.log("✅ Marketplace recipes:", recipes);
  
  const recipe = await marketplaceApi.getRecipe("123");
  console.log("✅ Single recipe:", recipe);
  
  const purchases = await marketplaceApi.getPurchasedRecipes(userId, token);
  console.log("✅ My purchases:", purchases);
};

// Тест AI API
const testAI = async () => {
  const analysis = await aiApi.analyzeRecipe({
    title: "Test Recipe",
    ingredients: ["test"],
    steps: ["step 1"],
  });
  console.log("✅ AI analysis:", analysis);
  
  const chat = await aiApi.mentorChat(userId, "Hello chef!", "ua");
  console.log("✅ Chef mentor:", chat);
};
```

---

### ⚠️ Breaking Changes:

1. **`marketApi` → `marketplaceApi`**
   - Всі імпорти потрібно оновити
   - URL endpoints змінилися

2. **`/user/{userId}/purchases` → `/marketplace/my-purchases`**
   - userId більше не в URL, визначається по токену
   - Потрібен authentication token

3. **`/mentor/chat` → `/ai/chef-mentor`**
   - URL змінився
   - Логіка без змін

---

### 📦 Експорти:

```typescript
// Named exports (рекомендовано)
export { authApi } from "@/lib/api";
export { academyApi } from "@/lib/api";
export { marketplaceApi } from "@/lib/api";
export { aiApi } from "@/lib/api";
export { uploadApi } from "@/lib/api";
export { walletApi } from "@/lib/api";

// Default export (містить всі API)
import api from "@/lib/api";
```

---

### 🚀 Наступні кроки:

- [ ] Перевірити всі використання `marketApi` в проекті
- [ ] Оновити компоненти які використовують `/market/` endpoints
- [ ] Реалізувати `/auth/logout` на бекенді
- [ ] Реалізувати `/auth/me` на бекенді
- [ ] Оновити документацію API
- [ ] Додати тести для нових endpoints
