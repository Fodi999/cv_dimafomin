# Community Feature - Соціальна платформа для учнів

## 📸 Огляд

Повноцінна соціальна платформа в Instagram-стилі для учнів Culinary Academy, де вони можуть ділитися своїми кулінарними творіннями, отримувати відгуки та заробляти ChefTokens за активність.

## 🎯 Основні можливості

✅ **Завантаження фото страв** - Як у Instagram  
✅ **Додавання рецептів** - Опис, інгредієнти, покрокові інструкції  
✅ **Соціальна взаємодія** - Лайки та коментарі  
✅ **Заробіток токенів** - ChefTokens за пости та активність  
✅ **Пошук та фільтри** - Знаходження цікавих рецептів  
✅ **Двомовність** - Повна підтримка PL/UA

## 🗂️ Структура файлів

```
components/academy/
├── CreateRecipePost.tsx       # Форма створення поста (модальне вікно)
└── RecipePostCard.tsx        # Картка поста в стилі Instagram

app/academy/community/
└── page.tsx                  # Головна сторінка з лентою постів

lib/
├── types.ts                  # RecipePost, Comment, Like інтерфейси
└── translations.ts           # Переклади для Community (58 ключів)
```

## 📦 Компоненти

### 1. CreateRecipePost Component

**Файл:** `/components/academy/CreateRecipePost.tsx`

**Призначення:** Модальне вікно для створення нових постів з рецептами

#### Основні функції:

```tsx
interface CreateRecipePostProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRecipePostData) => Promise<void>;
}
```

#### Секції форми:

1. **📸 Завантаження фото**
   - Drag & drop підтримка
   - Попередній перегляд
   - Валідація (max 5MB, тільки зображення)
   - Інтеграція з Cloudinary

2. **📝 Базова інформація**
   - Назва страви (обов'язково)
   - Опис (необов'язково)
   - Складність (початковий/середній/просунутий)
   - Час приготування (хвилини)
   - Кількість порцій

3. **🥬 Інгредієнти**
   - Динамічний список
   - Додавання/видалення
   - Мінімум 1 інгредієнт

4. **👨‍🍳 Кроки приготування**
   - Нумеровані кроки
   - Текстові поля для кожного кроку
   - Додавання/видалення кроків
   - Мінімум 1 крок

5. **💰 Інформація про токени**
   - Показує скільки CT заробить користувач
   - Base: 20 CT за пост
   - Бонуси за лайки та коментарі

#### Валідація:

```typescript
✓ Назва страви (required)
✓ Фото (required)
✓ Мінімум 1 інгредієнт
✓ Мінімум 1 крок приготування
✓ Розмір фото ≤ 5MB
✓ Формат: image/*
```

#### Приклад використання:

```tsx
const [showCreatePost, setShowCreatePost] = useState(false);

<CreateRecipePost
  isOpen={showCreatePost}
  onClose={() => setShowCreatePost(false)}
  onSubmit={async (data) => {
    const response = await fetch('/api/community/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    // Handle response
  }}
/>
```

---

### 2. RecipePostCard Component

**Файл:** `/components/academy/RecipePostCard.tsx`

**Призначення:** Instagram-style картка для відображення поста з рецептом

#### Props:

```tsx
interface RecipePostCardProps {
  post: RecipePost;
  currentUserId?: string;
  onLike?: (postId: string) => void;
  onComment?: (postId: string, text: string) => void;
}
```

#### Структура картки:

**1. User Header**
```tsx
- Аватар користувача (або ініціали)
- Ім'я користувача
- Level badge
- Дата публікації
- Заробіток токенів (+20 CT)
```

**2. Image Section**
```tsx
- Фото страви (aspect-ratio: square)
- Difficulty badge (зелений/помаранчевий/червоний)
```

**3. Actions Bar**
```tsx
- ❤️ Like button (анімований)
- 💬 Comments button
- ⏱️ Час приготування
- 👥 Кількість порцій
```

**4. Content Section**
```tsx
- Назва страви (h2)
- Опис
- Інгредієнти (згортаються після 3)
- Кроки приготування (згортаються після 2)
- Кнопки "Показати більше/Згорнути"
```

**5. Comments Section** (розгортається)
```tsx
- Поле введення коментаря
- Список коментарів
- Аватари коментаторів
- Дати коментарів
```

#### Анімації:

```tsx
// Card появлення
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}

// Like button
whileTap={{ scale: 0.9 }}
className={isLiked ? "fill-red-500 text-red-500" : "..."}

// Hover ефекти
hover:shadow-xl transition-shadow
```

#### Приклад використання:

```tsx
<RecipePostCard
  post={post}
  currentUserId={currentUserId}
  onLike={(postId) => {
    // Toggle like
  }}
  onComment={(postId, text) => {
    // Add comment
  }}
/>
```

---

### 3. Community Feed Page

**Файл:** `/app/academy/community/page.tsx`

**Призначення:** Головна сторінка спільноти з лентою постів

#### Секції сторінки:

**1. Header**
```tsx
- Назва "Спільнота Шефів"
- Підзаголовок
- Кнопка "Створити пост"
```

**2. Stats Cards**
```tsx
Grid 3 колонки:
- 📊 Всього постів
- 👨‍🍳 Активних шефів
- 💰 Токенів зароблено
```

**3. Filters & Search**
```tsx
- 🔍 Пошук по назві/опису
- Фільтри: Всі / Популярні / Підписки
```

**4. Posts Feed**
```tsx
- Вертикальна лента постів
- Lazy loading (staggered animation)
- Empty state (якщо постів немає)
```

#### State Management:

```tsx
const [posts, setPosts] = useState<RecipePost[]>([]);
const [filter, setFilter] = useState<"all" | "trending" | "following">("all");
const [searchQuery, setSearchQuery] = useState("");
const [showCreatePost, setShowCreatePost] = useState(false);
```

#### Mock Data (для демо):

```tsx
const mockPosts: RecipePost[] = [
  {
    id: "1",
    userName: "Ольга Петренко",
    userLevel: 5,
    title: "Ідеальні суші з лососем",
    imageUrl: "...",
    ingredients: [...],
    steps: [...],
    likesCount: 12,
    commentsCount: 5,
    tokensEarned: 25,
    // ...
  },
  // ...
];
```

#### Інтеграція з API:

```tsx
// TODO: Replace with real API calls
useEffect(() => {
  const fetchPosts = async () => {
    const response = await fetch('/api/community/posts');
    const data = await response.json();
    setPosts(data);
  };
  
  fetchPosts();
}, []);
```

---

## 🎨 Дизайн система

### Кольори

```css
/* Primary */
--green: #3BC864
--green-light: #C5E98A

/* Difficulty Badges */
--beginner: bg-green-100 text-green-700
--intermediate: bg-orange-100 text-orange-700
--advanced: bg-red-100 text-red-700

/* Stats Cards */
--purple: from-purple-50 to-pink-50, border-purple-200
--blue: from-blue-50 to-cyan-50, border-blue-200
--amber: from-amber-50 to-orange-50, border-amber-200

/* Social Actions */
--like: text-red-500 (when liked)
--comment: text-[#3BC864]
```

### Типографія

```css
/* Page Title */
h1: text-4xl font-bold

/* Post Title */
h2: text-xl font-bold

/* Section Titles */
h3: text-sm font-bold

/* Body Text */
p: text-gray-700

/* Meta Info */
small: text-sm text-gray-500
```

### Spacing

```css
/* Container */
max-w-4xl mx-auto

/* Cards Gap */
space-y-6

/* Section Padding */
p-4, p-6

/* Border Radius */
rounded-2xl (cards)
rounded-3xl (modal)
rounded-xl (inputs)
```

---

## 💾 Типи даних

### RecipePost

```typescript
interface RecipePost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userLevel?: number;
  title: string;
  description: string;
  imageUrl: string;
  ingredients: string[];
  steps: string[];
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  cookingTime?: number;
  servings?: number;
  likes: RecipePostLike[];
  likesCount: number;
  comments: RecipePostComment[];
  commentsCount: number;
  tokensEarned: number;
  createdAt: string;
  updatedAt?: string;
}
```

### RecipePostComment

```typescript
interface RecipePostComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: string;
}
```

### RecipePostLike

```typescript
interface RecipePostLike {
  userId: string;
  userName: string;
  createdAt: string;
}
```

### CreateRecipePostData

```typescript
interface CreateRecipePostData {
  title: string;
  description: string;
  imageUrl: string;
  ingredients: string[];
  steps: string[];
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  cookingTime?: number;
  servings?: number;
}
```

---

## 💰 Система заробітку токенів

### Нарахування ChefTokens

| Дія | Токени | Умови |
|-----|--------|-------|
| **Створення поста** | 20 CT | За кожен опублікований рецепт |
| **Отримання лайка** | 2 CT | Максимум 50 лайків на пост (100 CT) |
| **Отримання коментаря** | 5 CT | Максимум 20 коментарів (100 CT) |
| **Додавання коментаря** | 1 CT | За активність в спільноті |
| **Популярний пост** | 50 CT | Якщо пост набрав 50+ лайків |
| **Пост тижня** | 100 CT | Обирається адміністраторами |

### Приклад розрахунку:

```
Пост Ольги Петренко:
├─ Створення поста: 20 CT
├─ 12 лайків × 2 CT: 24 CT
├─ 5 коментарів × 5 CT: 25 CT
└─ TOTAL: 69 CT (але показує 25 CT базових)
```

### Backend інтеграція (TODO):

```typescript
// POST /api/community/posts
{
  ...postData,
  tokensEarned: 20 // базові токени
}

// POST /api/community/posts/:id/like
{
  userId: "...",
  reward: 2 // CT для автора поста
}

// POST /api/community/posts/:id/comments
{
  userId: "...",
  text: "...",
  rewards: {
    author: 5,    // CT для автора поста
    commenter: 1  // CT для коментатора
  }
}
```

---

## 🌍 Інтернаціоналізація

### Переклади (58 ключів)

```typescript
academy.community = {
  // Page
  title: string;
  subtitle: string;
  createPost: string;
  createFirstPost: string;
  totalPosts: string;
  activeChefs: string;
  tokensEarned: string;
  searchPlaceholder: string;
  all: string;
  trending: string;
  following: string;
  noPosts: string;
  
  // Create Post Form
  photoLabel: string;
  clickToUpload: string;
  titleLabel: string;
  titlePlaceholder: string;
  titleRequired: string;
  imageRequired: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  difficultyLabel: string;
  beginner: string;
  intermediate: string;
  advanced: string;
  timeLabel: string;
  servingsLabel: string;
  ingredientsLabel: string;
  ingredientsRequired: string;
  ingredient: string;
  addIngredient: string;
  stepsLabel: string;
  stepsRequired: string;
  step: string;
  addStep: string;
  earnTokensInfo: string;
  earnTokensDesc: string;
  cancel: string;
  publish: string;
  publishing: string;
  
  // Post Card
  ingredients: string;
  steps: string;
  showMore: string;
  showLess: string;
  comments: string;
  addComment: string;
  noComments: string;
}
```

### Використання:

```tsx
const { t } = useLanguage();
const community = (t.academy as any)?.community;

<h1>{community?.title || "Спільнота Шефів"}</h1>
```

---

## 🔗 Навігація

### Входи до Community:

1. **Dashboard** → Community Card (TODO)
2. **Navigation Menu** → Community Link (TODO)
3. **Direct URL** → `/academy/community`

### Навігація додається в наступному кроці!

---

## 📱 Респонсивність

### Breakpoints:

```css
/* Mobile (default) */
- 1 колонка постів
- Вертикальні кнопки фільтрів
- Stats cards: grid-cols-3

/* Tablet (sm: 640px) */
- Горизонтальні кнопки CTA
- Flex-row для форм

/* Desktop (md: 768px) */
- max-w-4xl контейнер
- Більші заголовки
```

---

## 🧪 Тестування

### Сценарії:

1. **Створення поста**
   - Завантажити фото
   - Заповнити форму
   - Додати інгредієнти та кроки
   - Опублікувати
   - Перевірити появу в ленті

2. **Соціальна взаємодія**
   - Лайкнути пост
   - Додати коментар
   - Розгорнути коментарі
   - Розгорнути інгредієнти/кроки

3. **Пошук та фільтри**
   - Шукати за назвою
   - Перемикати фільтри
   - Перевірити результати

4. **Заробіток токенів**
   - Створити пост → +20 CT
   - Отримати лайк → +2 CT
   - Отримати коментар → +5 CT

---

## 🚀 Backend інтеграція (TODO)

### API Endpoints:

```typescript
// Get all posts
GET /api/community/posts
Query: ?filter=all|trending|following&search=...
Response: RecipePost[]

// Create post
POST /api/community/posts
Body: CreateRecipePostData
Response: RecipePost

// Like post
POST /api/community/posts/:id/like
Response: { success: boolean, tokensEarned: number }

// Unlike post
DELETE /api/community/posts/:id/like
Response: { success: boolean }

// Add comment
POST /api/community/posts/:id/comments
Body: { text: string }
Response: RecipePostComment & { tokensEarned: number }

// Get comments
GET /api/community/posts/:id/comments
Response: RecipePostComment[]
```

### Database Schema (рекомендації):

```sql
-- Posts Table
CREATE TABLE recipe_posts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500) NOT NULL,
  ingredients JSONB NOT NULL,
  steps JSONB NOT NULL,
  category VARCHAR(100),
  difficulty VARCHAR(50),
  cooking_time INT,
  servings INT,
  tokens_earned INT DEFAULT 20,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Likes Table
CREATE TABLE recipe_post_likes (
  post_id UUID REFERENCES recipe_posts(id),
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

-- Comments Table
CREATE TABLE recipe_post_comments (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES recipe_posts(id),
  user_id UUID REFERENCES users(id),
  text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_posts_user ON recipe_posts(user_id);
CREATE INDEX idx_posts_created ON recipe_posts(created_at DESC);
CREATE INDEX idx_likes_post ON recipe_post_likes(post_id);
CREATE INDEX idx_comments_post ON recipe_post_comments(post_id);
```

---

## 🔮 Майбутні покращення

### Версія 2.0:

- [ ] **Відео рецепти** - Підтримка відео завантаження
- [ ] **Категорії** - Фільтрація за типом страви
- [ ] **Теги** - Hashtags для рецептів
- [ ] **Закладки** - Збереження улюблених рецептів
- [ ] **Поділитися** - Share в соцмережах
- [ ] **Повідомлення** - Нотифікації про лайки/коментарі
- [ ] **Підписки** - Слідкувати за іншими шефами
- [ ] **Рейтинг** - 5-зіркова оцінка рецептів
- [ ] **AI-аналіз** - Автоматичне визначення інгредієнтів з фото
- [ ] **Приватність** - Приватні/публічні пости

### Gamification:

- [ ] **Badges** - Значки за досягнення
  - 📸 "Перший пост"
  - ❤️ "100 лайків"
  - 💬 "Активний коментатор"
  - 🏆 "Пост місяця"

- [ ] **Челенджі** - Кулінарні виклики
  - Тематичні тижні
  - Змагання між учнями
  - Спеціальні нагороди

---

## 📊 Аналітика (рекомендовано)

### Metrics to track:

```typescript
// User Engagement
- Posts created per user
- Likes given/received
- Comments written
- Time spent on Community page

// Content Performance
- Most liked posts
- Most commented posts
- Popular ingredients
- Popular cooking times

// Token Economics
- Total tokens earned from Community
- Average tokens per post
- Top earners
```

### Google Analytics Events:

```typescript
gtag('event', 'create_post', {
  category: 'Community',
  label: difficulty
});

gtag('event', 'like_post', {
  category: 'Community',
  label: postId
});

gtag('event', 'comment_post', {
  category: 'Community',
  label: postId
});
```

---

## 🐛 Відомі обмеження

1. **Mock Data** - Наразі використовуються тестові дані
2. **Cloudinary** - Потрібна конфігурація `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
3. **Auth** - UserId hardcoded, потрібна інтеграція з auth системою
4. **Real-time** - Оновлення лайків/коментарів без WebSockets
5. **Pagination** - Всі пости завантажуються одразу
6. **Image Optimization** - Next.js Image component не використовується

---

## 📄 Приклад повного workflow

```tsx
// 1. User opens Community page
/academy/community

// 2. User clicks "Створити пост"
setShowCreatePost(true)

// 3. User fills form and uploads image
<CreateRecipePost isOpen={true} />

// 4. User submits
onSubmit(data) → POST /api/community/posts
                → Earn 20 CT base tokens
                → Post appears in feed

// 5. Other users interact
onLike() → POST /api/community/posts/:id/like
        → Author earns 2 CT
        
onComment() → POST /api/community/posts/:id/comments
           → Author earns 5 CT
           → Commenter earns 1 CT

// 6. Tokens appear in wallet
WalletCard → totalEarned +27 CT
          → New transaction "Recipe post"
```

---

**Статус:** ✅ UI/UX Completed, Backend Integration Pending  
**Версія:** 1.0  
**Останнє оновлення:** 5 листопада 2025  
**Автор:** ChefTokens Team
