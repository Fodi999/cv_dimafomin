# Unified Adaptive Design System

## 📋 Обзор

**Unified Adaptive Design System** — это архитектура для обеспечения визуальной консистентности, гибкости и масштабируемости всего приложения Seafood Academy.

### Основные принципы:
1. **Единая палитра** — Sky/Cyan как основной цвет для всей системы
2. **Адаптивность** — компоненты подстраиваются под контекст и тему
3. **Темная режим** — полная поддержка dark mode на всех уровнях
4. **Переиспользуемость** — Design Tokens вместо inline styles
5. **Консистентность** — единые правила для всех компонентов

---

## 🎨 Цветовая палитра

### Первичные цвета (Primary)
```
Sky-500 (#00a5ef) → Cyan-500 (#00b7d7)
Используется для:
- Главные кнопки и CTA
- Активные ссылки в навигации
- Значки и иконки
- Фоны выделяющихся элементов
- Границы для важных элементов

Light mode: sky-600 / cyan-600
Dark mode: sky-400 / cyan-400
```

### Вторичные цвета (Accent)
```
Amber-500 (#f99c00) → Orange-500 (#f97316)
Используется для:
- ChefTokens (валюта приложения)
- Премиум элементы
- Статистика и награды
```

### Функциональные цвета
```
Success: Emerald (зеленый) — для успешных действий
Warning: Amber (жёлтый) — для предупреждений
Error: Rose (розовый) — для ошибок
```

---

## 🧩 Design Tokens

Все токены находятся в `lib/design-tokens.ts`

### Импорт и использование

```tsx
import { colors, shadows, animations, composite } from '@/lib/design-tokens';

// Использование цветов
<div className={colors.primary.light.gradient}>Primary gradient</div>
<div className={colors.primary.dark.gradient}>Dark mode gradient</div>

// Использование готовых комбинаций
<div className={composite.buttonPrimary}>Click me</div>
<div className={composite.card.container}>Card content</div>

// Использование анимаций с Framer Motion
<motion.div
  animate={{ scale: 1.05 }}
  transition={animations.spring}
>
  Animated element
</motion.div>
```

---

## 📦 Компоненты системы

### Уровень 1: Базовые UI Компоненты
Находятся в `components/ui/`

- **Button** — переиспользуемая кнопка со всеми вариантами
- **Card** — базовая карточка с поддержкой вариантов
- **Badge** — значки для статусов и категорий
- **Input** — поле ввода с единообразным стилем
- **Modal** — модальные окна
- **Tooltip** — подсказки

### Уровень 2: Специализированные компоненты
Находятся в `components/`

- **NavigationBurger** — мобильная навигация (sky/cyan тема)
- **AuthModal** — модальное окно авторизации
- **LanguageSwitcher** — переключатель языков

### Уровень 3: Секционные компоненты
Находятся в `components/sections/`

- **AcademyAbout** — "О проекте" ✅ обновлена
- **AcademyCourses** — "AI-наставник" ✅ обновлена
- **AcademyCoursesPreview** — "Структурированные курсы" ✅ обновлена
- **AcademyChefTokens** — "ChefTokens система" ✅ обновлена

---

## 🎯 Правила использования

### 1. Выбор цветов

**DO ✅:**
```tsx
// Использовать primary gradient для главных элементов
<button className={`${colors.primary.light.gradient} ${colors.primary.dark.gradient}`}>
  Action button
</button>

// Использовать готовые комбинации из composite
<div className={composite.buttonPrimary}>Save</div>

// Использовать badge для статусов
<span className={`${colors.success.light.badge} ${colors.success.dark.badge}`}>
  Completed
</span>
```

**DON'T ❌:**
```tsx
// Не использовать жесткие hex коды
<button className="bg-[#3BC864]">Old color</button>

// Не дублировать темные классы руками
<div className="dark:bg-gray-900">Forget dark mode</div>

// Не использовать несогласованные цвета
<div className="from-green-500 to-blue-500">Random gradient</div>
```

### 2. Работа с компонентами

**DO ✅:**
```tsx
import { composite } from '@/lib/design-tokens';

// Правильное использование готовых стилей
export default function MyCard() {
  return (
    <div className={composite.card.container}>
      <p className={`text-gray-900 dark:text-white`}>Content</p>
    </div>
  );
}
```

**DON'T ❌:**
```tsx
// Не дублировать одинаковые стили в разных компонентах
export default function MyCard() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
      Content
    </div>
  );
}
```

### 3. Dark Mode

**Правило:** Каждый класс должен иметь соответствующий `dark:` вариант

```tsx
// Правильно
<div className="text-gray-900 dark:text-white bg-white dark:bg-gray-900">
  Content
</div>

// Неправильно
<div className="text-gray-900 bg-white">
  Missing dark mode support
</div>
```

### 4. Анимации

**Framer Motion параметры из системы:**
```tsx
import { animations } from '@/lib/design-tokens';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={animations.spring}
>
  Animated content
</motion.div>

// Для списков
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map((item, idx) => (
    <motion.div
      key={idx}
      variants={itemVariants}
      transition={{ delay: animations.stagger(idx) }}
    >
      {item}
    </motion.div>
  ))}
</motion.div>
```

---

## 🔄 Миграция существующих компонентов

### Шаг за шагом для каждого компонента:

1. **Удалить старые hex коды** (#3BC864, #C5E98A и т.д.)
2. **Заменить на sky/cyan токены:**
   ```
   from-[#3BC864] to-[#C5E98A] → from-sky-500 to-cyan-500
   dark:from-[#3BC864] → dark:from-sky-600
   ```
3. **Добавить dark mode поддержку** ко всем цветам
4. **Использовать composite классы** где возможно
5. **Проверить с `get_errors`** на ошибки TypeScript
6. **Протестировать** в light и dark mode

### Пример миграции:

**ДО:**
```tsx
<div className="bg-[#3BC864]/10 border border-[#3BC864]/30 p-4 rounded-lg">
  <h3 className="text-[#3BC864] font-bold">Title</h3>
  <p className="text-gray-600">Description</p>
</div>
```

**ПОСЛЕ:**
```tsx
import { composite, colors } from '@/lib/design-tokens';

<div className={`${colors.primary.light.badge} ${colors.primary.dark.badge} p-4 rounded-lg`}>
  <h3 className={`${colors.primary.light.text} ${colors.primary.dark.text} font-bold`}>
    Title
  </h3>
  <p className="text-gray-600 dark:text-gray-300">Description</p>
</div>
```

---

## 📱 Адаптивность

### Мобильная адаптивность
Использовать Tailwind брейкпоинты:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Автоматически адаптируется */}
</div>
```

### Контекстная адаптивность
Компоненты могут менять стили в зависимости от страницы:

```tsx
interface CardProps {
  variant?: 'default' | 'marketplace' | 'academy';
}

export default function AdaptiveCard({ variant = 'default' }: CardProps) {
  const variants = {
    default: colors.primary,
    marketplace: colors.accent,
    academy: colors.primary,
  };
  
  const theme = variants[variant];
  
  return (
    <div className={`bg-gradient-to-r ${theme.light.gradient} ${theme.dark.gradient}`}>
      Content
    </div>
  );
}
```

---

## 🚀 Примеры реальных компонентов

### Пример 1: Hero Section (AcademyAbout)
```tsx
import { colors, shadows, gradients, composite, animations } from '@/lib/design-tokens';
import { motion } from 'framer-motion';

export default function AcademyAbout() {
  return (
    <section className={`py-20 relative overflow-hidden ${gradients.background}`}>
      {/* Фоновые элементы */}
      <div className={`absolute inset-0 ${colors.primary.light.gradient}/5 ${colors.primary.dark.gradient}/10 pointer-events-none`} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={animations.default}
        className="max-w-6xl mx-auto px-4 relative z-10"
      >
        {/* Заголовок с градиентом текста */}
        <h2 className={`text-5xl font-bold ${gradients.text} mb-8`}>
          AI Dima Fomin
        </h2>
        
        {/* Карточки */}
        {benefits.map((benefit, idx) => (
          <motion.div
            key={idx}
            className={`${composite.card.container} ${composite.card.hover} p-6`}
          >
            {benefit.content}
          </motion.div>
        ))}
        
        {/* Кнопка */}
        <button className={composite.buttonPrimary}>
          Start Learning
        </button>
      </motion.div>
    </section>
  );
}
```

### Пример 2: Card Grid (AcademyCoursesPreview)
```tsx
export default function CourseCard() {
  return (
    <motion.div
      className={`${composite.card.container} overflow-hidden hover:shadow-xl transition-all`}
      whileHover={{ y: -8 }}
    >
      {/* Цветной заголовок */}
      <div className={`bg-gradient-to-br ${colors.primary.light.gradient} ${colors.primary.dark.gradient} p-8`}>
        <div className="text-4xl mb-4">📚</div>
        <span className={`${colors.accent.light.badge} ${colors.accent.dark.badge} px-3 py-1 rounded-full`}>
          Course
        </span>
      </div>
      
      {/* Контент */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Course Title
        </h3>
        
        {/* Прогресс бар с градиентом */}
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${colors.primary.light.gradient} ${colors.primary.dark.gradient}`}
            initial={{ width: 0 }}
            animate={{ width: '75%' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
```

---

## 📚 Документация по типам

### colors объект
```typescript
interface ColorVariant {
  light: {
    from?: string;
    to?: string;
    gradient?: string;
    badge?: string;
    text?: string;
    bg?: string;
  };
  dark: {
    from?: string;
    to?: string;
    gradient?: string;
    badge?: string;
    text?: string;
    bg?: string;
  };
}
```

### composite объект
```typescript
interface CompositeStyles {
  card: { container: string; hover: string };
  buttonPrimary: string;
  badgePrimary: string;
  sectionBg: string;
  input: string;
}
```

---

## ✅ Чек-лист для новых компонентов

При создании нового компонента:

- [ ] Импортирован `design-tokens.ts`
- [ ] Используются только `sky/cyan` цвета (или специальные для контекста)
- [ ] Все цвета имеют `dark:` варианты
- [ ] Используются готовые `composite` классы где возможно
- [ ] Анимации используют `animations` объект
- [ ] Тени используют `shadows` объект
- [ ] Проверено в `dark mode`
- [ ] Нет inline styles (только className)
- [ ] Протестировано с `npm run build`

---

## 🎓 Обучение и примеры

Обновленные компоненты для справки:
1. `components/NavigationBurger.tsx` — мобильная навигация
2. `components/sections/AcademyAbout.tsx` — hero с градиентами
3. `components/sections/AcademyCourses.tsx` — чат с адаптивностью
4. `components/sections/AcademyCoursesPreview.tsx` — grid карточек
5. `components/sections/AcademyChefTokens.tsx` — специальная секция

Копируйте паттерны из этих компонентов!

---

## 🔧 Поддержка и улучшения

Если нужно добавить новый токен:
1. Добавить в `lib/design-tokens.ts`
2. Обновить документацию
3. Применить ко всем компонентам
4. Запустить `npm run build`

Вопросы? Смотрите примеры в уже обновленных компонентах! 🚀
