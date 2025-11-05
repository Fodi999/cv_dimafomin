# Сторінка заробітку токенів (Earn Tokens Page)

## 📄 Огляд

Інформаційна сторінка `/academy/earn-tokens`, яка описує всі способи заробітку ChefTokens безкоштовно. Використовується як посадкова сторінка для мотивації користувачів до активної участі в навчанні.

## 🎯 Призначення

- Навігація з модального вікна гаманця (кнопка "🎓 Як отримати безкоштовно?")
- Демонстрація можливостей заробітку без покупки
- Мотивація користувачів до виконання навчальних активностей
- SEO-оптимізована сторінка для залучення нових студентів

## 🗂️ Файлова структура

```
app/academy/earn-tokens/
└── page.tsx                 # Основний компонент сторінки

lib/
└── translations.ts          # Переклади (PL/UA)
```

## 📦 Компоненти

### EarnTokensPage Component

**Розташування:** `/app/academy/earn-tokens/page.tsx`

**Опис:** Основний компонент сторінки з 6 методами заробітку токенів

**Структура:**
```tsx
export default function EarnTokensPage() {
  const { t } = useLanguage();
  const earnTokens = (t.academy as any)?.earnTokens;

  const earnMethods = [
    // 6 методів заробітку
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      {/* Info Card (Bonus) */}
      {/* Earn Methods Grid */}
      {/* CTA Section */}
    </div>
  );
}
```

## 💰 Методи заробітку токенів

### 1. Завершуйте уроки
- **Винагорода:** 10-50 CT
- **Іконка:** BookOpen
- **Колір:** `from-blue-500 to-cyan-500`
- **Опис:** Отримуйте токени за кожен завершений урок

### 2. Завершуйте курси
- **Винагорода:** 100+ CT
- **Іконка:** GraduationCap
- **Колір:** `from-purple-500 to-pink-500`
- **Опис:** Великий бонус за завершення повного курсу

### 3. Здобувайте досягнення
- **Винагорода:** 25-100 CT
- **Іконка:** Trophy
- **Колір:** `from-amber-500 to-orange-500`
- **Опис:** Виконуйте спеціальні завдання

### 4. Щоденний бонус
- **Винагорода:** 10 CT/день
- **Іконка:** Calendar
- **Колір:** `from-green-500 to-emerald-500`
- **Опис:** Заходьте щодня для безкоштовних токенів

### 5. Запрошуйте друзів
- **Винагорода:** 50 CT/друг
- **Іконка:** Users
- **Колір:** `from-rose-500 to-red-500`
- **Опис:** Реферальна програма

### 6. Спеціальні пропозиції
- **Винагорода:** До 500 CT
- **Іконка:** Gift
- **Колір:** `from-indigo-500 to-blue-500`
- **Опис:** Акції та конкурси

## 🎨 Секції сторінки

### 1. Header Section
```tsx
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
  <h1>Як заробити ChefTokens безкоштовно?</h1>
  <p>Навчайтеся, виконуйте завдання та заробляйте токени...</p>
</motion.div>
```

**Анімація:** Fade + Slide вгору

### 2. Info Card (Bonus)
```tsx
<motion.div className="bg-gradient-to-r from-[#3BC864]/10 to-[#C5E98A]/10">
  <CheckCircle /> {/* Іконка успіху */}
  <h3>🎁 Бонус для нових студентів!</h3>
  <p>Зареєструйтеся зараз і отримайте 100 ChefTokens на старт...</p>
</motion.div>
```

**Стилі:**
- Градієнтний фон (зелений)
- Border: `border-2 border-[#3BC864]/30`
- Іконка: CheckCircle в зеленому квадраті

### 3. Earn Methods Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {earnMethods.map((method, index) => (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-white rounded-2xl p-6"
    >
      {/* Градієнтна іконка */}
      {/* Заголовок та опис */}
      {/* Винагорода */}
    </motion.div>
  ))}
</div>
```

**Анімація:** 
- Поява: Delay 0.1s × index
- Hover: Scale 1.05 + переміщення вгору на 5px
- Border hover: `hover:border-[#3BC864]`

### 4. CTA Section
```tsx
<motion.div className="bg-gradient-to-r from-[#3BC864] to-[#C5E98A]">
  <h2>Готові почати заробляти?</h2>
  <p>Розпочніть своє навчання прямо зараз...</p>
  
  <div className="flex gap-4">
    <Link href="/market">Переглянути курси</Link>
    <Link href="/academy/dashboard">Перейти до Dashboard</Link>
  </div>
</motion.div>
```

**Кнопки:**
1. **Переглянути курси** → `/market` (білий фон, зелений текст)
2. **Перейти до Dashboard** → `/academy/dashboard` (прозорий, білий outline)

## 🌍 Інтернаціоналізація

### Структура перекладів

```typescript
// lib/translations.ts
academy: {
  earnTokens: {
    title: string;
    subtitle: string;
    completeLessons: string;
    completeLessonsDesc: string;
    completeCourses: string;
    completeCoursesDesc: string;
    achievements: string;
    achievementsDesc: string;
    dailyBonus: string;
    dailyBonusDesc: string;
    referrals: string;
    referralsDesc: string;
    specialOffers: string;
    specialOffersDesc: string;
    bonusTitle: string;
    bonusDesc: string;
    ctaTitle: string;
    ctaDesc: string;
    browseCourses: string;
    goToDashboard: string;
  }
}
```

### Приклад використання

```tsx
const earnTokens = (t.academy as any)?.earnTokens;

<h1>{earnTokens?.title || "Як заробити ChefTokens безкоштовно?"}</h1>
```

**Примітка:** Використовується `as any` для TypeScript через кеш типів.

## 🎭 Анімації

### Framer Motion конфігурація

```tsx
// Header
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}

// Info Card
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ delay: 0.2 }}

// Earn Methods Cards
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.1 * index }}
whileHover={{ scale: 1.05, y: -5 }}

// CTA Section
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.8 }}
```

## 🎨 Дизайн система

### Кольори

```css
/* Primary Green */
--green: #3BC864
--green-light: #C5E98A

/* Gradients for methods */
- Blue: from-blue-500 to-cyan-500
- Purple: from-purple-500 to-pink-500
- Amber: from-amber-500 to-orange-500
- Green: from-green-500 to-emerald-500
- Rose: from-rose-500 to-red-500
- Indigo: from-indigo-500 to-blue-500

/* CTA Gradient */
background: linear-gradient(to right, #3BC864, #C5E98A)
```

### Типографія

```css
/* H1 */
font-size: 2.5rem (md: 3rem)
font-weight: bold
color: #1E1A41

/* H2 */
font-size: 1.875rem
font-weight: bold

/* H3 */
font-size: 1.25rem
font-weight: bold

/* Body */
font-size: 1.125rem (lg)
color: #1E1A41/70
```

### Spacing

```css
/* Container */
max-width: 1152px (6xl)
padding: responsive

/* Section gaps */
margin-bottom: 3rem (12)

/* Grid gap */
gap: 1.5rem (6)

/* Card padding */
padding: 1.5rem (6)
```

## 🔗 Навігація

### Вхідні точки

1. **WalletModal** → `earnButton` (🎓 Як отримати безкоштовно?)
2. **Dashboard** → Прямий лінк (якщо додано)
3. **Direct URL** → `/academy/earn-tokens`

### Вихідні точки

1. **Browse Courses Button** → `/market`
2. **Go to Dashboard Button** → `/academy/dashboard`

## 🚀 Інтеграція з WalletModal

### Кнопка в модалці

```tsx
// components/academy/WalletModal.tsx
<button onClick={() => router.push('/academy/earn-tokens')}>
  <GraduationCap className="w-5 h-5" />
  {t.academy.wallet.modal.earnButton}
</button>
```

### Навігація з useRouter

```tsx
import { useRouter } from "next/navigation";

const router = useRouter();
router.push('/academy/earn-tokens');
```

## 📱 Респонсивність

### Breakpoints

```css
/* Mobile (default) */
grid-cols-1
text-4xl

/* Tablet (md: 768px) */
grid-cols-2
text-5xl

/* Desktop (lg: 1024px) */
grid-cols-3
```

### CTA Buttons

```tsx
/* Mobile */
flex-col

/* Desktop (sm: 640px) */
sm:flex-row
```

## 🎯 SEO Оптимізація

### Meta Теги (рекомендовано додати)

```tsx
export const metadata = {
  title: 'Як заробити ChefTokens безкоштовно | Culinary Academy',
  description: 'Навчайтеся, виконуйте завдання та заробляйте токени для доступу до преміум контенту. 6 способів отримати ChefTokens безкоштовно.',
  keywords: 'ChefTokens, безкоштовні токени, кулінарна освіта, онлайн курси суші',
};
```

### Структурований маркап (рекомендовано)

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Як заробити ChefTokens безкоштовно",
  "description": "6 способів отримати ChefTokens для доступу до кулінарних курсів",
  "url": "https://yourdomain.com/academy/earn-tokens"
}
```

## 🧪 Тестування

### Сценарії тестування

1. **Навігація з WalletModal**
   - Відкрити Dashboard
   - Клік на Maximize2 в WalletCard
   - Клік "🎓 Як отримати безкоштовно?"
   - Перевірка переходу на /academy/earn-tokens

2. **Респонсивність**
   - Mobile: 1 колонка карток
   - Tablet: 2 колонки
   - Desktop: 3 колонки

3. **Анімації**
   - Перевірка fade-in ефектів
   - Hover ефекти на картках
   - Плавні переходи

4. **Кнопки CTA**
   - "Переглянути курси" → /market
   - "Перейти до панелі" → /academy/dashboard

## 🔮 Майбутні покращення

### Backend інтеграція

1. **Динамічні дані винагород**
```tsx
const { data: rewards } = await fetch('/api/tokens/rewards');
```

2. **Прогрес користувача**
```tsx
<EarnMethodCard 
  method={method}
  userProgress={userProgress[method.id]}
/>
```

3. **Реалізовані методи**
- ✅ Завершено
- 🔒 Недоступно
- 🎯 В прогресі

### Gamification

```tsx
<motion.div 
  className="absolute top-2 right-2"
  animate={{ scale: [1, 1.2, 1] }}
  transition={{ repeat: Infinity, duration: 2 }}
>
  {method.isNew && <span className="badge">NEW</span>}
</motion.div>
```

### Персоналізація

```tsx
{userHasZeroTokens ? (
  <InfoCard variant="empty" />
) : (
  <InfoCard variant="motivational" />
)}
```

## 📊 Аналітика

### Рекомендовані події

```typescript
// Google Analytics
gtag('event', 'view_earn_tokens_page', {
  source: 'wallet_modal' | 'direct' | 'dashboard'
});

gtag('event', 'click_browse_courses', {
  from_page: 'earn_tokens'
});

gtag('event', 'click_go_to_dashboard', {
  from_page: 'earn_tokens'
});
```

## 🐛 Відомі проблеми

### TypeScript кеш
**Проблема:** `earnTokens` типізація не оновлюється автоматично  
**Рішення:** Використано `(t.academy as any)?.earnTokens`  
**TODO:** Оновити `lib/types.ts` з правильними типами для academy.earnTokens

### Fallback переклади
**Примітка:** Всі тексти мають українські fallback значення  
**Рішення:** При додаванні нових мов потрібно додати переклади

## 📄 Приклад повного компонента

```tsx
"use client";

import { motion } from "framer-motion";
import { GraduationCap, Trophy, Users, Gift, Calendar, BookOpen, CheckCircle, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EarnTokensPage() {
  const { t } = useLanguage();
  const earnTokens = (t.academy as any)?.earnTokens;

  // ... earnMethods array ...

  return (
    <div className="max-w-6xl mx-auto">
      {/* Sections as described above */}
    </div>
  );
}
```

## 📚 Додаткові ресурси

- [WalletModal Documentation](./WALLET_FEATURE.md)
- [Translation System](./lib/translations.ts)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Next.js Routing](https://nextjs.org/docs/app/building-your-application/routing)

---

**Статус:** ✅ Реалізовано та готово до використання  
**Версія:** 1.0  
**Останнє оновлення:** 2024  
**Автор:** ChefTokens Team
