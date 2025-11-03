# 📚 Нова структура проекту - Academy & Market

## ✅ Що додано

### 🎓 Academy (Академія)
Платформа для навчання та розвитку суші-шефів.

**Сторінки:**
- `/academy/dashboard` - Особистий кабінет користувача
- `/academy/leaderboard` - Рейтинг шефів
- `/academy/certificates` - Сертифікати користувача

**Компоненти:**
- `DashboardCard` - Картка зі статистикою
- `LeaderboardTable` - Таблиця рейтингу
- `CertificateCard` - Картка сертифікату

### 🛒 Market (Маркетплейс)
Магазин рецептів та навчальних матеріалів.

**Сторінки:**
- `/market` - Список рецептів
- `/market/[id]` - Детальна інформація про рецепт

**Компоненти:**
- `RecipeCard` - Картка рецепту
- `RecipeFilters` - Фільтри та пошук
- `PurchaseButton` - Кнопка покупки з логікою

### 👤 User Management
Система авторизації та управління користувачами.

**Файли:**
- `contexts/UserContext.tsx` - React Context для авторизації
- `lib/api.ts` - API клієнт для backend

## 📁 Повна структура

```
cv-sushi_chef/
│
├── 📂 app/                          # Next.js App Router
│   ├── 📂 academy/                  # 🎓 Академія
│   │   ├── dashboard/page.tsx       # Особистий кабінет
│   │   ├── leaderboard/page.tsx     # Рейтинг шефів
│   │   └── certificates/page.tsx    # Сертифікати
│   │
│   ├── 📂 market/                   # 🛒 Маркетплейс
│   │   ├── page.tsx                 # Список рецептів
│   │   └── [id]/page.tsx            # Детальна сторінка
│   │
│   ├── layout.tsx                   # Root layout (SEO)
│   ├── page.tsx                     # Головна (портфоліо)
│   └── sitemap.ts                   # Автоматичний sitemap
│
├── 📂 components/
│   ├── 📂 academy/                  # Компоненти академії
│   │   ├── DashboardCard.tsx
│   │   ├── LeaderboardTable.tsx
│   │   └── CertificateCard.tsx
│   │
│   ├── 📂 market/                   # Компоненти маркетплейсу
│   │   ├── RecipeCard.tsx
│   │   ├── RecipeFilters.tsx
│   │   └── PurchaseButton.tsx
│   │
│   ├── 📂 sections/                 # Секції портфоліо
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Portfolio.tsx
│   │   ├── Skills.tsx
│   │   ├── Experience.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   │
│   ├── 📂 ui/                       # shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── textarea.tsx
│   │
│   ├── DynamicMetaTags.tsx          # Динамічні SEO теги
│   ├── LanguageSwitcher.tsx         # Перемикач PL/UA
│   ├── Navigation.tsx
│   ├── ScrollProgress.tsx
│   ├── ScrollToTop.tsx
│   └── StructuredData.tsx           # Schema.org JSON-LD
│
├── 📂 contexts/
│   ├── LanguageContext.tsx          # Мовний контекст (PL/UA)
│   └── UserContext.tsx              # 🆕 Авторизація
│
├── 📂 lib/
│   ├── api.ts                       # 🆕 API клієнт
│   ├── seo.ts                       # SEO конфігурація
│   ├── translations.ts              # Переклади PL/UA
│   └── utils.ts
│
├── 📂 public/
│   ├── robots.txt
│   ├── manifest.json
│   └── *.svg (іконки)
│
└── 📄 Документація
    ├── DEPLOYMENT.md
    ├── SEO_GUIDE.md
    ├── ARCHITECTURE.md (цей файл)
    └── README.md
```

## 🔄 Флоу роботи

### Academy
1. Користувач заходить на `/academy/dashboard`
2. Бачить статистику: курси, сертифікати, рейтинг
3. Може переглянути `/academy/leaderboard` - де він у рейтингу
4. Завантажити сертифікати з `/academy/certificates`

### Market
1. Користувач заходить на `/market`
2. Використовує `RecipeFilters` для пошуку
3. Клікає на `RecipeCard` → переходить на `/market/[id]`
4. Читає деталі курсу
5. Натискає `PurchaseButton` → покупка

## 🔗 API Endpoints

Всі endpoint'и знаходяться в `lib/api.ts`:

```typescript
// Authentication
authApi.login(email, password)
authApi.register(name, email, password)
authApi.logout(token)

// Academy
academyApi.getDashboard(token)
academyApi.getCourses()
academyApi.getLeaderboard()
academyApi.getCertificates(token)

// Market
marketApi.getRecipes(filters)
marketApi.getRecipe(id)
marketApi.purchaseRecipe(recipeId, token)
```

## 🌍 Мультимовність

Всі нові секції мають переклади PL/UA:
- `t.academy.dashboard.*`
- `t.academy.leaderboard.*`
- `t.academy.certificates.*`
- `t.market.*`

## 🎨 Дизайн-система

**Кольори:**
- Primary: `#3BC864` (зелений)
- Secondary: `#C5E98A` (світло-зелений)
- Dark: `#1E1A41` (темно-фіолетовий)
- Background: `#FEF9F5` (бежевий)

**Градієнти:**
- Buttons: `from-[#3BC864] to-[#C5E98A]`
- Stats cards: Різні кольори для кожної картки

## 🚀 Наступні кроки

### Backend Integration
1. Створити API backend (Node.js + Express або Django)
2. Підключити базу даних (PostgreSQL)
3. Реалізувати автентифікацію (JWT tokens)
4. Інтегрувати платіжну систему (Stripe/PayPal)

### Features
1. Додати фільтри на маркетплейсі
2. Реалізувати систему reviews
3. Додати відео до курсів
4. Створити систему прогресу навчання

### Deployment
1. Deploy на Vercel (frontend)
2. Deploy backend на Railway/Render
3. Налаштувати domain `dima-fomin.pl`
4. Додати analytics (Google Analytics)

---

**Автор:** Dima Fomin
**Email:** fodi85999@gmail.com
**GitHub:** Fodi999/cv_dimafomin
