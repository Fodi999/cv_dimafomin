

# 🎨 DESIGN SYSTEM - Modern Food Academy

**Дата создания:** 25 декабря 2025  
**Статус:** ✅ ACTIVE - Источник истины для всех визуальных решений  
**Эталон:** `/app/page.tsx` (главная страница)

---

## 🎯 Философия

### Главная страница = REFERENCE

**Все страницы должны выглядеть как части ОДНОГО продукта.**

```
✅ Главная страница → эталон стиля
✅ Другие страницы → используют те же токены
❌ Каждая страница → свои стили
```

### Правила

#### ✅ РАЗРЕШЕНО:
- Использовать **только** токены из `/lib/design-system.ts`
- Использовать **только** компоненты из `/components/layout/Containers.tsx`
- Использовать Tailwind классы, **если они соответствуют токенам**
- Комбинировать готовые компоненты с разными пропсами

#### ❌ ЗАПРЕЩЕНО:
- `style={{ color: '#123456' }}` — inline styles
- `className="bg-[#abcdef]"` — кастомные цвета
- `className="rounded-[18px]"` — кастомные радиусы
- `className="w-[234px]"` — кастомные размеры
- `className="shadow-[0_4px_12px...]"` — кастомные тени
- Создавать компоненты-дубликаты с "почти такими же" стилями

### Если нужен новый стиль

1. **Добавь в Design System СНАЧАЛА** (`/lib/design-system.ts`)
2. Документируй в этом файле
3. Используй везде

---

## 📦 Структура системы

### 1. Design Tokens
**Файл:** `/lib/design-system.ts`

**Содержит:**
- ✅ Цветовая палитра (colors)
- ✅ Отступы (spacing)
- ✅ Радиусы (radius)
- ✅ Тени и эффекты (shadows, glass)
- ✅ Типографика (typography)
- ✅ Анимации (animations)
- ✅ Переходы (transitions)
- ✅ Лейауты (layout)
- ✅ Градиенты (gradients)

### 2. Layout Containers
**Файл:** `/components/layout/Containers.tsx`

**Компоненты:**
- `Container` — max-width wrapper
- `Section` — full-width section
- `Card` — content card
- `Grid` — responsive grid
- `Flex` — flexbox utility
- `AnimatedContainer` — entrance animations

### 3. Page Layout
**Файл:** `/components/layout/PageLayout.tsx`

**Компоненты:**
- `PageLayout` — universal page wrapper
- `PageHeader` — page heading
- `PageSection` — content section
- `PageCard` — page card
- `PageGrid` — page grid

---

## 🎨 Цветовая палитра

### Primary (Green - Irradiated Toad)
```tsx
colors.primary.DEFAULT    // rgb(59 200 100) - #3BC864
colors.primary.light      // rgb(197 233 138) - #C5E98A
colors.primary.dark       // rgb(45 160 80)
colors.primary.foreground // rgb(254 249 245) - Hot White
```

**Использование:**
- Главные кнопки (CTA)
- Акценты успеха
- Primary actions

**Tailwind:**
```tsx
className="bg-primary text-primary-foreground"
className="text-primary border-primary"
```

### Secondary (Blue - Waterberry)
```tsx
colors.secondary.DEFAULT    // rgb(43 106 121) - #2B6A79
colors.secondary.light      // rgb(80 180 200)
colors.secondary.dark       // rgb(30 80 95)
colors.secondary.foreground // rgb(254 249 245)
```

**Использование:**
- Второстепенные кнопки
- Линки
- Secondary actions

### Accent Colors (from main page)
```tsx
// Sky (Главная страница Hero)
colors.accent.sky.DEFAULT  // rgb(14 165 233)
colors.accent.sky.light    // rgb(56 189 248)
colors.accent.sky.dark     // rgb(3 105 161)

// Cyan (Главная страница gradient)
colors.accent.cyan.DEFAULT // rgb(6 182 212)
colors.accent.cyan.light   // rgb(34 211 238)
colors.accent.cyan.dark    // rgb(8 145 178)

// Purple (AI features)
colors.accent.purple.DEFAULT // rgb(168 85 247)
colors.accent.purple.light   // rgb(192 132 252)
colors.accent.purple.dark    // rgb(126 34 206)

// Pink (AI accents)
colors.accent.pink.DEFAULT // rgb(236 72 153)
colors.accent.pink.light   // rgb(244 114 182)
colors.accent.pink.dark    // rgb(219 39 119)

// Emerald (Success, Money)
colors.accent.emerald.DEFAULT // rgb(16 185 129)
colors.accent.emerald.light   // rgb(52 211 153)
colors.accent.emerald.dark    // rgb(5 150 105)
```

### Background Colors
```tsx
// Light mode
colors.background.DEFAULT // rgb(254 249 245) - Hot White
colors.background.card    // rgb(255 255 255) - White
colors.background.muted   // rgb(224 216 208) - Border gray

// Dark mode
colors.background.dark     // rgb(15 15 20) - Very dark
colors.background.cardDark // rgb(26 26 37) - Card dark
```

### Text Colors
```tsx
// Light mode
colors.text.primary   // rgb(36 15 36) - Mystic Void
colors.text.secondary // rgb(30 26 65) - Sea by Night

// Dark mode
colors.text.primaryDark   // rgb(250 250 255) - Almost white
colors.text.secondaryDark // rgb(200 200 210) - Light gray

// Muted (both modes)
colors.text.muted // rgb(120 120 140)
```

### Semantic Colors
```tsx
colors.semantic.success  // rgb(59 200 100) - Green
colors.semantic.warning  // rgb(251 191 36) - Amber
colors.semantic.error    // rgb(239 68 68) - Red
colors.semantic.info     // rgb(59 130 246) - Blue
```

---

## 📏 Spacing Scale (8px base)

```tsx
spacing.xs   // 0.25rem (4px)  - Micro spacing
spacing.sm   // 0.5rem (8px)   - Tight spacing
spacing.md   // 0.75rem (12px) - Compact spacing
spacing.lg   // 1rem (16px)    - Normal spacing
spacing.xl   // 1.5rem (24px)  - Relaxed spacing
spacing.2xl  // 2rem (32px)    - Loose spacing
spacing.3xl  // 3rem (48px)    - Section spacing
spacing.4xl  // 4rem (64px)    - Large section
spacing.5xl  // 6rem (96px)    - Hero spacing
spacing.6xl  // 8rem (128px)   - Extra large
```

### Container Padding (from main page)
```tsx
spacing.container.padding   // 1rem (px-4)
spacing.container.paddingSm // 1.5rem (sm:px-6)
spacing.container.paddingLg // 2rem (lg:px-8)
```

**Использование:**
```tsx
<div className="px-4 sm:px-6 lg:px-8">
  {/* Main page container pattern */}
</div>
```

### Section Spacing (from Hero, About)
```tsx
spacing.section.paddingY   // 4rem (py-16)
spacing.section.paddingYSm // 6rem (sm:py-24)
spacing.section.paddingYLg // 8rem (lg:py-32)
```

**Использование:**
```tsx
<section className="py-16 sm:py-24 lg:py-32">
  {/* Main page section pattern */}
</section>
```

---

## 🔲 Border Radius

```tsx
radius.none  // 0
radius.xs    // 0.25rem (4px)
radius.sm    // 0.5rem (8px)   - Buttons
radius.md    // 0.75rem (12px) - Small cards
radius.lg    // 1rem (16px)    - Cards
radius.xl    // 1.25rem (20px) - Large cards (main page)
radius.2xl   // 1.5rem (24px)
radius.3xl   // 2rem (32px)
radius.full  // 9999px - Circles, pills
```

**Паттерны с главной:**
```tsx
// Hero badge
className="rounded-full"

// Cards (AcademyAbout, CoursesPreview)
className="rounded-xl"

// Buttons
className="rounded-lg"
```

---

## 🌫️ Shadows & Effects

### Standard Shadows
```tsx
shadows.xs   // 0 1px 2px rgba(0,0,0,0.04)
shadows.sm   // 0 2px 4px rgba(0,0,0,0.08)
shadows.md   // 0 4px 12px rgba(0,0,0,0.12)
shadows.lg   // 0 8px 24px rgba(0,0,0,0.16)  - Cards
shadows.xl   // 0 12px 32px rgba(0,0,0,0.20) - Elevated cards
shadows.2xl  // 0 16px 48px rgba(0,0,0,0.24) - Modals
```

### Colored Shadows (accent cards)
```tsx
shadows.sky     // 0 8px 24px rgba(14,165,233,0.3)
shadows.cyan    // 0 8px 24px rgba(6,182,212,0.3)
shadows.purple  // 0 8px 24px rgba(168,85,247,0.3)
shadows.pink    // 0 8px 24px rgba(236,72,153,0.3)
shadows.emerald // 0 8px 24px rgba(16,185,129,0.3)
```

**Использование:**
```tsx
// Card hover (main page)
className="hover:shadow-xl transition-shadow"

// Accent card
className="shadow-sky"
```

### Glass Effect (from main page cards)
```tsx
glass.background     // rgba(255,255,255,0.06)
glass.backgroundDark // rgba(0,0,0,0.2)
glass.border         // rgba(255,255,255,0.1)
glass.blur           // 16px
```

**Паттерн:**
```tsx
className="bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20"
```

---

## 📝 Typography

### Font Families
```tsx
typography.fontFamily.sans // Geist Sans (или system fonts)
typography.fontFamily.mono // Geist Mono (или monospace)
```

**CSS Variables:**
```css
font-family: var(--font-geist-sans);
font-family: var(--font-geist-mono);
```

### Font Sizes (from main page)
```tsx
// Hero heading (7xl)
className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"

// Section heading (4xl - 5xl)
className="text-4xl sm:text-5xl"

// Card heading (2xl - 3xl)
className="text-2xl sm:text-3xl"

// Body text (base - lg)
className="text-base sm:text-lg"

// Small text (sm - base)
className="text-sm sm:text-base"

// Badge, label (xs - sm)
className="text-xs sm:text-sm"
```

### Font Weights
```tsx
className="font-normal"    // 400
className="font-medium"    // 500
className="font-semibold"  // 600
className="font-bold"      // 700 - Headings (main page)
className="font-extrabold" // 800
```

### Line Heights
```tsx
className="leading-none"    // 1
className="leading-tight"   // 1.25 - Headings (main page)
className="leading-snug"    // 1.375
className="leading-normal"  // 1.5 - Body text
className="leading-relaxed" // 1.625 - Badge text (main page)
className="leading-loose"   // 2
```

---

## ⚡ Анимации (Framer Motion)

### Entrance Animations

#### fadeUp (Hero elements)
```tsx
import { animations } from "@/lib/design-system";

<motion.div
  initial="hidden"
  animate="visible"
  variants={animations.fadeUp}
>
  {content}
</motion.div>
```

**Эффект:** Появление снизу с fade (y: 20 → 0)

#### fadeDown (Top elements)
```tsx
variants={animations.fadeDown}
```

**Эффект:** Появление сверху (y: -20 → 0)

#### fadeIn (Simple)
```tsx
variants={animations.fadeIn}
```

**Эффект:** Простое появление (opacity: 0 → 1)

#### scaleUp (Cards, Modals)
```tsx
variants={animations.scaleUp}
```

**Эффект:** Увеличение с fade (scale: 0.95 → 1)

### Stagger Animations (Lists)

**Паттерн с главной:**
```tsx
<motion.div
  variants={animations.staggerContainer}
  initial="hidden"
  animate="visible"
>
  {items.map(item => (
    <motion.div key={item.id} variants={animations.staggerItem}>
      <Card />
    </motion.div>
  ))}
</motion.div>
```

**Эффект:** Карточки появляются по очереди (delay: 0.1s)

### Hover Effects

#### Scale (Buttons, Cards)
```tsx
import { transitions } from "@/lib/design-system";

<motion.button
  {...transitions.hover.scale}
>
  Click me
</motion.button>
```

**Эффект:** 
- `whileHover`: scale 1.05
- `whileTap`: scale 0.95

#### Scale Small (Subtle)
```tsx
{...transitions.hover.scaleSmall}
```

**Эффект:** scale 1.02 / 0.98

#### Lift (Cards)
```tsx
{...transitions.hover.lift}
```

**Эффект:** y: -4px на hover

#### Glow (Accent cards)
```tsx
{...transitions.hover.glow}
```

**Эффект:** boxShadow: xl на hover

---

## 🎨 Градиенты (from main page)

### Background Gradients

#### Hero Gradient
```tsx
// Light & Dark
className="bg-gradient-to-br from-gray-950 via-sky-950 to-cyan-950"
className="dark:from-gray-950 dark:via-sky-950 dark:to-cyan-950"
```

**Использование:** Hero section, full-screen backgrounds

### Text Gradients

#### Sky Gradient (Hero heading)
```tsx
className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-300 to-sky-400"
```

**Использование:** Главные заголовки

#### Cyan Gradient
```tsx
className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-cyan-400"
```

#### Purple Gradient (AI)
```tsx
className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500"
```

**Использование:** AI features, magic elements

#### Emerald Gradient (Success)
```tsx
className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-500"
```

**Использование:** Money savings, success metrics

### Button Gradients

#### Primary Button (Sky → Cyan)
```tsx
className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600"
```

**Использование:** Main CTA buttons (Hero, sections)

#### Secondary Button (Purple → Pink)
```tsx
className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
```

**Использование:** AI actions, secondary CTAs

### Card Gradients (Glass)

```tsx
// Glass card
className="bg-white/10 dark:bg-black/20"

// Glass border
className="border border-white/20 dark:border-white/10"
```

### Badge Gradients

#### Sky Badge (Hero)
```tsx
className="bg-sky-500/20 border border-sky-400/50 dark:bg-sky-500/20 dark:border-sky-600/50"
```

#### Purple Badge
```tsx
className="bg-purple-500/20 border border-purple-400/50"
```

#### Emerald Badge
```tsx
className="bg-emerald-500/20 border border-emerald-400/50"
```

---

## 📦 Layout Containers

### Container (Max-width wrapper)

```tsx
import { Container } from "@/components/layout/Containers";

<Container size="7xl" padding="md">
  {content}
</Container>
```

**Props:**
- `size`: sm | md | lg | xl | 2xl | 3xl | 4xl | 5xl | 6xl | **7xl** | full
- `padding`: none | sm | **md** | lg

**Main page default:** `size="7xl"` (1280px), `padding="md"` (px-4 sm:px-6 lg:px-8)

### Section (Full-width section)

```tsx
import { Section } from "@/components/layout/Containers";

<Section
  id="about"
  background="white"
  spacing="lg"
  contained={true}
>
  {content}
</Section>
```

**Props:**
- `background`: transparent | white | gray | dark | gradient-sky | gradient-cyan | gradient-purple
- `spacing`: none | sm | md | **lg** | xl
- `contained`: boolean (wrap in Container)

**Main page pattern:** `spacing="lg"` (py-16 sm:py-24), `contained={true}`

### Card (Content card)

```tsx
import { Card } from "@/components/layout/Containers";

<Card
  variant="default"
  padding="lg"
  rounded="xl"
  hover={true}
>
  {content}
</Card>
```

**Props:**
- `variant`: **default** | glass | bordered | elevated | gradient
- `padding`: none | sm | md | **lg** | xl
- `rounded`: none | sm | md | lg | **xl** | 2xl
- `hover`: boolean (lift on hover)

**Main page:** `variant="default"`, `padding="lg"`, `rounded="xl"`, `hover={true}`

### Grid (Responsive grid)

```tsx
import { Grid } from "@/components/layout/Containers";

<Grid cols={3} gap="lg" responsive={true}>
  {items.map(item => <Card key={item.id} />)}
</Grid>
```

**Props:**
- `cols`: 1 | 2 | **3** | 4 | 5 | 6
- `gap`: none | xs | sm | md | **lg** | xl
- `responsive`: boolean (adaptive columns)

**Main page:** `cols={3}`, `gap="lg"`, `responsive={true}`

### AnimatedContainer (Entrance animations)

```tsx
import { AnimatedContainer } from "@/components/layout/Containers";

<AnimatedContainer variant="fadeUp" delay={0.2}>
  {content}
</AnimatedContainer>
```

**Props:**
- `variant`: **fadeUp** | fadeDown | fadeIn | scaleUp | slideInLeft | slideInRight
- `delay`: number (seconds)

**Main page:** `variant="fadeUp"`, delays: 0, 0.1, 0.2, 0.3...

---

## 🏗️ Паттерны с главной страницы

### Hero Section

```tsx
<Section
  id="hero"
  background="dark"
  spacing="xl"
  contained={false}
  className="min-h-screen flex items-center justify-center"
>
  <Container size="6xl">
    <AnimatedContainer variant="fadeDown">
      <Badge />
    </AnimatedContainer>
    
    <AnimatedContainer variant="fadeUp" delay={0.1}>
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-300 to-sky-400">
          Heading
        </span>
      </h1>
    </AnimatedContainer>
    
    <AnimatedContainer variant="fadeUp" delay={0.2}>
      <Button />
    </AnimatedContainer>
  </Container>
</Section>
```

### Content Section (About, Courses)

```tsx
<Section id="about" background="white" spacing="lg">
  <AnimatedContainer variant="fadeUp">
    <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12">
      Section Title
    </h2>
  </AnimatedContainer>
  
  <Grid cols={3} gap="lg">
    {items.map((item, i) => (
      <AnimatedContainer key={item.id} variant="fadeUp" delay={i * 0.1}>
        <Card variant="default" hover={true}>
          {item.content}
        </Card>
      </AnimatedContainer>
    ))}
  </Grid>
</Section>
```

### Glass Card (Hero elements)

```tsx
<Card
  variant="glass"
  padding="lg"
  rounded="xl"
  className="backdrop-blur-md"
>
  <h3 className="text-xl font-semibold text-white mb-2">
    Card Title
  </h3>
  <p className="text-gray-300">
    Card description
  </p>
</Card>
```

### Button Pattern

```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="px-8 py-4 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold transition-all"
>
  Button Text
</motion.button>
```

---

## ✅ Checklist для новой страницы

Перед публикацией ЛЮБОЙ страницы проверь:

- [ ] **Использует PageLayout** (`/components/layout/PageLayout.tsx`)
- [ ] **Использует Container/Section/Card** (`/components/layout/Containers.tsx`)
- [ ] **Нет inline styles** (`style={{}}`)
- [ ] **Нет кастомных цветов** (`bg-[#123456]`)
- [ ] **Нет кастомных радиусов** (`rounded-[18px]`)
- [ ] **Нет кастомных размеров** (`w-[234px]`)
- [ ] **Все компоненты из shared** (не дубликаты)
- [ ] **Анимации из design-system.ts** (не кастом)
- [ ] **Spacing соответствует токенам** (8px base)
- [ ] **Typography соответствует главной** (размеры, веса)
- [ ] **Hover effects consistent** (scale, lift, glow)
- [ ] **Responsive как на главной** (mobile-first)
- [ ] **Dark mode работает** (цвета адаптируются)

**Если хотя бы один пункт НЕТ — страница не соответствует Design System!**

---

## 🚫 Антипаттерны (НИКОГДА НЕ ДЕЛАЙ)

### ❌ Inline Styles
```tsx
// ПЛОХО
<div style={{ color: '#3BC864', padding: '24px' }}>

// ХОРОШО
<div className="text-primary p-6">
```

### ❌ Кастомные цвета
```tsx
// ПЛОХО
<div className="bg-[#3BC864]">

// ХОРОШО
<div className="bg-primary">
```

### ❌ Кастомные радиусы
```tsx
// ПЛОХО
<div className="rounded-[18px]">

// ХОРОШО
<div className="rounded-xl">
```

### ❌ Дублирование компонентов
```tsx
// ПЛОХО
function MyCard() {
  return (
    <div className="p-6 rounded-xl bg-white shadow-lg">
      {/* почти как Card, но чуть-чуть по-другому */}
    </div>
  );
}

// ХОРОШО
<Card variant="default" padding="lg" rounded="xl" hover={true}>
  {content}
</Card>
```

### ❌ Разные анимации
```tsx
// ПЛОХО (кастомная анимация)
<motion.div
  initial={{ opacity: 0, y: 30 }} // Почему 30? Почему не 20?
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7 }} // Почему 0.7? Почему не 0.6?
>

// ХОРОШО (из design-system)
<motion.div
  variants={animations.fadeUp} // Везде одинаково
>
```

### ❌ Разные max-width
```tsx
// ПЛОХО (каждая страница своя ширина)
<div className="max-w-[1240px]"> // Откуда 1240?
<div className="max-w-6xl">      // А тут 6xl?
<div className="max-w-7xl">      // А тут 7xl?

// ХОРОШО (консистентно)
<Container size="7xl"> // Везде одинаково (1280px)
```

---

## 📚 Дополнительные файлы

### CSS Variables (`/app/globals.css`)
Полный список CSS переменных для темизации:
- `:root` — light mode variables
- `.dark` — dark mode overrides

### Tailwind Config (`/tailwind.config.ts`)
Расширение Tailwind с кастомными классами на базе design tokens.

### Components
- `/components/layout/PageLayout.tsx` — Page wrapper
- `/components/layout/Containers.tsx` — Layout containers
- `/components/sections/*` — Section components (Hero, About, etc.)
- `/components/ui/*` — Shadcn UI components

---

## 🎉 Результат

После внедрения Design System:

✅ **Сайт выглядит как единый продукт**  
✅ **Страницы ощущаются как части одной системы**  
✅ **Ускоряется разработка** (меньше решений "на лету")  
✅ **Упрощается масштабирование** (добавить страницу = 10 минут)  
✅ **Консистентный UX** (пользователь узнаёт паттерны)  
✅ **Легко поддерживать** (один файл токенов)  

---

## 🔄 Обновления

**v1.0** (25 дек 2025) — Initial Design System  
- Создан `/lib/design-system.ts`
- Создан `/components/layout/Containers.tsx`
- Задокументированы все токены с главной страницы

**Next:** Миграция всех страниц на новую систему (Profile, Market, Academy)

---

**Автор:** GitHub Copilot  
**Эталон:** `/app/page.tsx` (Modern Food Academy Main Page)  
**Принцип:** "Main page style = REFERENCE for ALL pages"
