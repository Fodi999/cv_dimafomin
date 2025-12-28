# 🔌 Структура Backend Integration

## 📊 Общая Архитектура

```
┌─────────────────────────────────────────────────────────────┐
│                      ФРОНТЕНД (Next.js)                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │              REACT COMPONENTS                       │     │
│  │  • components/profile/                              │     │
│  │  • components/fridge/                               │     │
│  │  • components/recipes/                              │     │
│  │  • components/market/                               │     │
│  └─────────────────┬──────────────────────────────────┘     │
│                    │                                          │
│                    ↓                                          │
│  ┌────────────────────────────────────────────────────┐     │
│  │              REACT CONTEXTS                         │     │
│  │  • AuthContext     - Авторизация                   │     │
│  │  • UserContext     - Данные пользователя           │     │
│  │  • SettingsContext - Настройки (LEGACY)            │     │
│  │  • LanguageContext - Язык (NEW: cookie-based)      │     │
│  │  • CartContext     - Корзина                        │     │
│  │  • RecipeContext   - Рецепты                        │     │
│  └─────────────────┬──────────────────────────────────┘     │
│                    │                                          │
│                    ↓                                          │
│  ┌────────────────────────────────────────────────────┐     │
│  │           API CLIENT LAYER (lib/api/)               │     │
│  │                                                      │     │
│  │  📦 Модульная структура:                            │     │
│  │  ├─ base.ts           - apiFetch() wrapper          │     │
│  │  ├─ auth.ts           - login, register, logout     │     │
│  │  ├─ user.ts           - profile, settings           │     │
│  │  ├─ settings.ts       - getSettings, updateSettings │     │
│  │  ├─ fridge.ts         - холодильник                 │     │
│  │  ├─ marketplace.ts    - маркетплейс рецептов        │     │
│  │  ├─ academy.ts        - курсы, лидерборд            │     │
│  │  ├─ ai.ts             - AI функции                  │     │
│  │  ├─ wallet.ts         - ChefTokens                  │     │
│  │  ├─ tasks.ts          - задания                     │     │
│  │  └─ recipe-matching.ts - подбор рецептов            │     │
│  │                                                      │     │
│  │  🔧 Особенности:                                     │     │
│  │  • Автоматический Bearer token из localStorage      │     │
│  │  • Accept-Language header из cookie                 │     │
│  │  • credentials: 'include' для cookies               │     │
│  │  • Централизованная обработка ошибок                │     │
│  │  • TypeScript типизация                             │     │
│  └─────────────────┬──────────────────────────────────┘     │
│                    │                                          │
│                    ↓                                          │
│  ┌────────────────────────────────────────────────────┐     │
│  │      NEXT.JS API ROUTES (app/api/)                  │     │
│  │                                                      │     │
│  │  🔀 Роль: Proxy + Server-side Logic                 │     │
│  │                                                      │     │
│  │  📁 Структура:                                       │     │
│  │  ├─ /api/settings/route.ts                          │     │
│  │  ├─ /api/auth/login/route.ts                        │     │
│  │  ├─ /api/auth/register/route.ts                     │     │
│  │  ├─ /api/user/profile/route.ts                      │     │
│  │  ├─ /api/fridge/items/route.ts                      │     │
│  │  ├─ /api/market/recipes/route.ts                    │     │
│  │  ├─ /api/recipes/match/route.ts                     │     │
│  │  ├─ /api/tasks/route.ts                             │     │
│  │  └─ ...                                              │     │
│  │                                                      │     │
│  │  🎯 Функции:                                         │     │
│  │  • Проксирование запросов на Koyeb backend          │     │
│  │  • Валидация токенов                                │     │
│  │  • Трансформация данных                             │     │
│  │  • Кэширование (опционально)                        │     │
│  │  • SSR support                                       │     │
│  └─────────────────┬──────────────────────────────────┘     │
│                    │                                          │
└────────────────────┼──────────────────────────────────────────┘
                     │
                     │ HTTPS Request
                     │ Authorization: Bearer <token>
                     │ Accept-Language: pl/en/ru
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              БЕКЕНД (Koyeb - Python)                         │
│  https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  🐍 Python FastAPI/Django                                    │
│  📊 PostgreSQL Database                                      │
│  🔐 JWT Authentication                                       │
│  🤖 AI Integration (OpenAI/Anthropic)                        │
│                                                               │
│  📡 API Endpoints:                                           │
│  ├─ /api/auth/login                                          │
│  ├─ /api/auth/register                                       │
│  ├─ /api/user/profile                                        │
│  ├─ /api/fridge/                                             │
│  ├─ /api/recipes/                                            │
│  ├─ /api/marketplace/                                        │
│  ├─ /api/academy/                                            │
│  └─ ...                                                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Детальная Структура Файлов

### **1️⃣ API Client Layer** (`lib/api/`)

```
lib/api/
├── base.ts                    # 🔧 Базовая инфраструктура
│   ├─ apiFetch<T>()           # Generic fetch wrapper
│   ├─ API_BASE_URL            # "/api" - все через Next.js proxy
│   ├─ getAuthToken()          # localStorage.getItem("token")
│   ├─ getCurrentLanguage()    # localStorage fallback
│   └─ ApiOptions, ApiResponse # TypeScript types
│
├── auth.ts                    # 🔐 Авторизация (50 строк)
│   ├─ login(email, password)  → POST /api/auth/login
│   ├─ register(data)          → POST /api/auth/register
│   ├─ logout()                → POST /api/auth/logout
│   └─ getCurrentUser()        → GET /api/auth/me
│
├── user.ts                    # 👤 Профиль (250 строк)
│   ├─ getUserProfile(id)      → GET /api/user/profile
│   ├─ updateProfile(data)     → PUT /api/user/profile
│   ├─ getUserStats()          → GET /api/user/stats
│   ├─ getSavedRecipes()       → GET /api/user/recipes/saved
│   └─ saveRecipe(id)          → POST /api/user/recipes/save
│
├── settings.ts                # ⚙️ Настройки (80 строк)
│   ├─ getSettings()           → GET /api/settings
│   └─ updateSettings(partial) → PATCH /api/settings
│   
│   ⚠️ NOTE: Settings API содержит поле "language"
│   Это КОНФЛИКТ с новым cookie-based LanguageContext!
│   
│   🔨 TODO: Убрать language из Settings API
│   Язык теперь хранится в cookie "lang", не в backend settings
│
├── fridge.ts                  # 🥗 Холодильник (300 строк)
│   ├─ getItems()              → GET /api/fridge/items
│   ├─ addItem(item)           → POST /api/fridge/items
│   ├─ updateItem(id, data)    → PUT /api/fridge/items/{id}
│   ├─ deleteItem(id)          → DELETE /api/fridge/items/{id}
│   └─ addMissing(items)       → POST /api/fridge/add-missing
│
├── marketplace.ts             # 🛒 Маркетплейс (60 строк)
│   ├─ getRecipes()            → GET /api/market/recipes
│   ├─ purchaseRecipe(id)      → POST /api/market/purchase
│   └─ getMyPurchases()        → GET /api/marketplace/my-purchases
│
├── recipe-matching.ts         # 🍳 Подбор рецептов (220 строк)
│   ├─ matchRecipes(params)    → POST /api/recipes/match
│   ├─ getRecommendations()    → GET /api/recipes/recommendations
│   └─ cookRecipe(params)      → POST /api/recipes/cook
│
├── academy.ts                 # 🎓 Академия (90 строк)
│   ├─ getCourses()            → GET /api/academy/courses
│   ├─ enrollCourse(id)        → POST /api/academy/enroll
│   ├─ getProgress(courseId)   → GET /api/academy/progress
│   └─ getLeaderboard()        → GET /api/academy/leaderboard
│
├── ai.ts                      # 🤖 AI функции (80 строк)
│   ├─ analyzeDish(image)      → POST /ai/culinary/analyze
│   ├─ chatWithMentor(msg)     → POST /ai/chef-mentor
│   └─ generateRecipe(data)    → POST /api/generate-recipe
│
├── wallet.ts                  # 💰 ChefTokens (100 строк)
│   ├─ getBalance()            → GET /api/token-bank/me
│   ├─ transferTokens(data)    → POST /api/wallet/transfer
│   └─ getTransactions()       → GET /api/wallet/transactions
│
├── tasks.ts                   # ✅ Задания (80 строк)
│   ├─ getTasks()              → GET /api/tasks
│   ├─ completeTask(id)        → POST /api/tasks/complete
│   └─ claimReward(id)         → POST /api/tasks/claim
│
├── admin.ts                   # 👑 Админ (180 строк)
│   ├─ getTreasuryStats()      → GET /api/admin/treasury/stats
│   ├─ getUserStats()          → GET /api/admin/users/stats
│   └─ moderateContent(data)   → POST /api/admin/moderate
│
├── contact.ts                 # 📧 Контакты (40 строк)
│   └─ sendMessage(data)       → POST /api/contact
│
├── upload.ts                  # 📷 Загрузка (60 строк)
│   └─ uploadImage(file)       → POST /api/upload
│
├── health.ts                  # 💓 Healthcheck (30 строк)
│   └─ checkHealth()           → GET /api/health
│
└── README.md                  # 📖 Документация
```

### **2️⃣ Next.js API Routes** (`app/api/`)

```
app/api/
├── settings/
│   └── route.ts               # GET/PATCH /api/settings
│       ├─ GET: Возвращает UserSettings (пока DEFAULT_SETTINGS)
│       ├─ PATCH: Обновляет settings (partial update)
│       └─ TODO: Проксировать на Koyeb /api/user/profile
│
├── auth/
│   ├── login/route.ts         # POST /api/auth/login
│   ├── register/route.ts      # POST /api/auth/register
│   ├── logout/route.ts        # POST /api/auth/logout
│   └── me/route.ts            # GET /api/auth/me
│
├── user/
│   ├── profile/route.ts       # GET/PUT /api/user/profile
│   ├── language/route.ts      # POST /api/user/language (LEGACY)
│   └── recipes/
│       ├── saved/route.ts     # GET /api/user/recipes/saved
│       └── save/route.ts      # POST /api/user/recipes/save
│
├── fridge/
│   ├── items/route.ts         # GET/POST /api/fridge/items
│   └── add-missing/route.ts   # POST /api/fridge/add-missing
│
├── market/
│   └── recipes/route.ts       # GET /api/market/recipes
│
├── recipes/
│   ├── match/route.ts         # POST /api/recipes/match
│   └── recommendations/route.ts # GET /api/recipes/recommendations
│
├── academy/
│   └── ai/mentor/route.ts     # POST /api/academy/ai/mentor
│
├── tasks/
│   └── route.ts               # GET /api/tasks
│
├── token-bank/
│   └── me/route.ts            # GET /api/token-bank/me
│
├── admin/
│   └── treasury/
│       └── stats/route.ts     # GET /api/admin/treasury/stats
│
└── generate-recipe/
    └── route.ts               # POST /api/generate-recipe
```

### **3️⃣ React Contexts** (`contexts/`)

```
contexts/
├── AuthContext.tsx            # 🔐 Авторизация
│   ├─ State: user, token, isAuthenticated
│   ├─ Actions: login(), register(), logout()
│   └─ Storage: localStorage.setItem("token")
│
├── UserContext.tsx            # 👤 Данные пользователя
│   ├─ State: profile, stats, loading
│   ├─ Actions: updateProfile(), refreshStats()
│   └─ API: userApi.getUserProfile()
│
├── SettingsContext.tsx        # ⚙️ Настройки (LEGACY)
│   ├─ State: settings (language, theme, timeFormat, units)
│   ├─ Actions: updateSettings({ language })
│   └─ API: settingsApi.updateSettings()
│   
│   ⚠️ КОНФЛИКТ:
│   • Использует Settings API для языка
│   • Вызывает PATCH /api/settings с { language: "ru" }
│   • Конфликтует с новым cookie-based LanguageContext
│   
│   🔧 РЕШЕНИЕ:
│   • Убрать language из SettingsContext
│   • Оставить только theme, timeFormat, units
│   • Использовать LanguageContext для языка
│
├── LanguageContext.tsx        # 🌐 Язык (NEW: cookie-based)
│   ├─ State: language, dictionary, isLoading
│   ├─ Actions: setLanguage(lang)
│   ├─ Storage: Cookie "lang" + localStorage fallback
│   └─ SSR: Получает initialLanguage из cookies()
│   
│   ✅ НОВАЯ АРХИТЕКТУРА:
│   • Источник истины: Cookie "lang"
│   • Middleware валидирует/устанавливает cookie
│   • Server layout читает cookie и загружает словарь
│   • Provider получает initialLanguage + dictionary
│   • setLanguage() → cookie + reload для SSR consistency
│
├── CartContext.tsx            # 🛒 Корзина
│   └─ State: items, total, isOpen
│
└── RecipeContext.tsx          # 📖 Рецепты
    └─ State: recipes, filters, loading
```

---

## 🔄 Потоки Данных

### **1. Авторизация (Login Flow)**

```
┌─────────────────────────────────────────────────────────────┐
│ ПОЛЬЗОВАТЕЛЬ вводит email + password                         │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────┐
│ AuthForm.tsx                                                 │
│ const { login } = useAuth()                                  │
│ login(email, password)                                       │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────┐
│ AuthContext.tsx                                              │
│ const response = await authApi.login(email, password)       │
│ localStorage.setItem("token", response.token)               │
│ setUser(response.user)                                       │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────┐
│ lib/api/auth.ts                                              │
│ apiFetch("/api/auth/login", {                                │
│   method: "POST",                                            │
│   body: JSON.stringify({ email, password })                 │
│ })                                                           │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────┐
│ app/api/auth/login/route.ts (Next.js API Route)             │
│ Проксирует на Koyeb backend                                 │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────┐
│ KOYEB BACKEND                                                │
│ POST /api/auth/login                                         │
│ • Проверяет credentials                                      │
│ • Генерирует JWT token                                       │
│ • Возвращает { user, token }                                 │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
                ОТВЕТ идёт обратно через всю цепочку
```

### **2. Смена Языка (OLD vs NEW)**

#### ❌ **СТАРЫЙ подход** (конфликтующий):

```
CoreSettingsSection.tsx
  ↓ handleLanguageChange("ru")
  ↓
SettingsContext.updateSettings({ language: "ru" })
  ↓
settingsApi.updateSettings({ language: "ru" })
  ↓
PATCH /api/settings
  ↓
Koyeb backend обновляет user.settings.language = "ru"
  ↓
❌ НО страница не перезагружается!
❌ Словарь не обновляется!
❌ SSR рендерит старый язык!
```

#### ✅ **НОВЫЙ подход** (cookie-based):

```
CoreSettingsSection.tsx
  ↓ handleLanguageChange("ru")
  ↓
LanguageContext.setLanguage("ru")
  ↓
document.cookie = "lang=ru; path=/; max-age=31536000"
localStorage.setItem("lang", "ru")
window.location.reload()
  ↓
Middleware валидирует cookie "lang=ru" ✅
  ↓
Server Layout читает cookies()
const language = cookieStore.get("lang")?.value // "ru"
const dictionary = await getDictionary("ru")
  ↓
LanguageProvider получает:
  initialLanguage="ru"
  dictionary={profile: {...}, common: {...}, ...}
  ↓
✅ Весь app рендерится на русском языке!
✅ SSR работает корректно!
✅ Нет hydration mismatch!
```

### **3. Загрузка Данных Профиля**

```
ProfilePage.tsx
  ↓ useEffect()
  ↓
UserContext.loadProfile()
  ↓
userApi.getUserProfile()
  ↓
apiFetch("/api/user/profile", {
  headers: { Authorization: "Bearer <token>" }
})
  ↓
app/api/user/profile/route.ts
  ↓
GET https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/user/profile
  ↓
Koyeb backend возвращает:
{
  id: 123,
  name: "Dmitrij",
  email: "...",
  avatar: "...",
  stats: { ... },
  settings: { ... }  // ⚠️ Включает language (но не используем!)
}
  ↓
UserContext.setProfile(data)
  ↓
ProfilePage отображает данные
```

---

## 🚨 Конфликты и Решения

### **Проблема 1: Dual Language System**

**Симптомы:**
- Кнопки смены языка не работают
- В консоли: `⚙️ Updating settings: {language: 'ru'}`
- API вызов: `PATCH /api/settings`
- Страница не перезагружается

**Причина:**
Два конкурирующих подхода к управлению языком:
1. **Settings API** (старый) - хранит язык в backend
2. **Cookie-based** (новый) - хранит язык в cookie

**Решение:**
- ✅ `CoreSettingsSection.tsx` - обновлён для использования `useLanguage()`
- ✅ `LanguageSwitcher.tsx` - использует `useLanguage()`
- ⏳ `SettingsContext.tsx` - убрать поле `language`
- ⏳ `lib/types/settings.ts` - убрать `language` из `UserSettings`
- ⏳ `app/api/settings/route.ts` - не принимать `language` в PATCH

### **Проблема 2: Settings API включает language**

**Текущий Settings API:**
```typescript
interface UserSettings {
  language: Language;     // ❌ КОНФЛИКТ с cookie
  theme: Theme;
  timeFormat: TimeFormat;
  units: Units;
  notifications: { ... };
  privacy: { ... };
}
```

**Решение:**
```typescript
interface UserSettings {
  // language УДАЛЁН - теперь в cookie "lang"
  theme: Theme;
  timeFormat: TimeFormat;
  units: Units;
  notifications: { ... };
  privacy: { ... };
}
```

### **Проблема 3: Legacy useTranslations() hook**

**Старый код:**
```tsx
const { t } = useTranslations();
<h1>{t("profile.title")}</h1>  // ❌ t() - функция
```

**Новый код:**
```tsx
const { t } = useLanguage();
<h1>{t?.profile?.title}</h1>   // ✅ t - Dictionary объект
```

**Миграция:**
- ⏳ Обновить все компоненты с `useTranslations()` на `useLanguage()`
- ⏳ Изменить паттерн доступа: `t("key")` → `t?.domain?.key`

---

## 📋 TODO: Завершение Миграции

### **Высокий приоритет:**
- [ ] Убрать `language` из `lib/types/settings.ts`
- [ ] Обновить `SettingsContext.tsx` - удалить логику языка
- [ ] Обновить `app/api/settings/route.ts` - не обрабатывать `language`
- [ ] Удалить `app/api/user/language/route.ts` (устаревший endpoint)

### **Средний приоритет:**
- [ ] Мигрировать `hooks/useTranslations.ts` на `useLanguage()`
- [ ] Мигрировать `hooks/useProfileTranslations.ts` на `useLanguage()`
- [ ] Обновить все компоненты с `t("key")` на `t?.domain?.key`

### **Низкий приоритет:**
- [ ] Синхронизировать cookie → backend (для аналитики)
- [ ] Добавить READ-ONLY поле `language` в backend профиль
- [ ] Написать тесты для cookie-based language system

---

## 🎯 Best Practices

### **1. API Calls:**
```typescript
// ✅ ХОРОШО: Используем модульный импорт
import { userApi } from '@/lib/api';
const profile = await userApi.getUserProfile();

// ✅ ХОРОШО: Используем default import
import api from '@/lib/api';
const profile = await api.user.getUserProfile();

// ❌ ПЛОХО: Прямой fetch
const response = await fetch('/api/user/profile');
```

### **2. Authentication:**
```typescript
// ✅ ХОРОШО: Токен добавляется автоматически
const data = await userApi.getUserProfile();

// ✅ ХОРОШО: Явный токен (если нужно)
const data = await userApi.getUserProfile({ token: customToken });

// ❌ ПЛОХО: Ручное добавление headers
fetch('/api/user/profile', {
  headers: { Authorization: `Bearer ${token}` }
});
```

### **3. Language:**
```typescript
// ✅ ХОРОШО: Cookie-based через LanguageContext
const { language, setLanguage } = useLanguage();
setLanguage('ru'); // Cookie + reload

// ❌ ПЛОХО: Settings API
const { updateSettings } = useSettings();
updateSettings({ language: 'ru' }); // Конфликт!
```

### **4. Error Handling:**
```typescript
// ✅ ХОРОШО: Try-catch с типизацией
try {
  const data = await userApi.getUserProfile();
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
  }
}

// ❌ ПЛОХО: Игнорирование ошибок
const data = await userApi.getUserProfile();
// Что если 401? 500? Network error?
```

---

## 📊 Статистика

**API Client Layer:**
- 16 модулей
- ~1500 строк кода
- ~90 API endpoints
- 100% TypeScript типизация

**Next.js API Routes:**
- ~30 route handlers
- Proxy для всех запросов на Koyeb
- SSR support
- Cookie validation

**React Contexts:**
- 7 контекстов
- 5 активно используют API
- 2 используют localStorage
- 1 использует cookies (LanguageContext)

---

## 🔗 Связанная Документация

- `docs/I18N_SSR_IMPLEMENTATION.md` - Cookie-based language system
- `lib/api/README.md` - API Client architecture
- `lib/types/settings.ts` - Settings types
- `docs/SETTINGS_SYSTEM.md` - Settings architecture

---

**Последнее обновление:** 28 декабря 2025 г.
