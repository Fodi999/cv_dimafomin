# NavigationBurger - Современная навигация в стиле Uber Eats

## 📋 Описание

`NavigationBurger.tsx` — это современная, адаптивная навигация для проекта **Seafood Academy by Dima Fomin**, вдохновлённая интерфейсом Uber Eats.

### ✨ Особенности

- ✅ **Фиксированный sticky header** с размытым фоном и shadow
- ✅ **Burger menu** (☰) с плавной анимацией
- ✅ **Выезжающее боковое меню** с Framer Motion
- ✅ **Overlay** с затемнением фона (закрывается по клику)
- ✅ **Счётчик ChefTokens** справа в хедере
- ✅ **Полная адаптивность** под мобильные устройства
- ✅ **Dark mode** поддержка
- ✅ **Lucide icons** для всех элементов
- ✅ **Keyboard support** (Escape закрывает меню)
- ✅ **Active state** для текущей страницы

---

## 🚀 Использование

### 1. Импортирование в главный layout

**`app/layout.tsx`:**

```tsx
import NavigationBurger from "@/components/NavigationBurger";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ua">
      <body>
        <NavigationBurger />
        {children}
      </body>
    </html>
  );
}
```

### 2. Или в конкретную страницу

```tsx
import NavigationBurger from "@/components/NavigationBurger";

export default function Page() {
  return (
    <>
      <NavigationBurger />
      <main className="pt-16">
        {/* Your content here */}
      </main>
    </>
  );
}
```

---

## 🎨 Структура компонента

### Top Navigation Bar
```
┌─────────────────────────────────────────────────────┐
│ [Logo] Seafood    [Token Counter]    [☰ Burger]    │
│ Academy                                             │
└─────────────────────────────────────────────────────┘
```

### Slide-Out Menu (левая сторона)
```
┌──────────────────────────┐
│ Меню                     │
│ ─────────────────────── │
│                          │
│ 🏠 Главная              │
│ 📚 Академия             │
│ ✨ Курсы                │
│ 🛍️ Маркет              │
│ 🧠 AI-наставник         │
│ 👤 Профиль              │
│                          │
│ ─────────────────────── │
│                          │
│ 1250 ChefTokens (mobile) │
│                          │
│ Версия AI                │
│ Dima Fomin v2.0         │
│                          │
│ ✨ Powered by AI Academy │
└──────────────────────────┘
```

---

## 🔧 Свойства & Конфигурация

### Навигационные ссылки (изменяемо)

Отредактируйте массив `navLinks` внутри компонента:

```tsx
const navLinks: NavLink[] = [
  {
    label: "Главная",
    href: "/",
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: "Академия",
    href: "/academy",
    icon: <BookOpen className="w-5 h-5" />,
  },
  // ... остальные ссылки
];
```

### Баланс токенов

```tsx
const [tokenBalance] = useState(1250); // Измените значение здесь или сделайте динамическим
```

### Цветовая палитра

- **Primary**: Sky / Cyan (`from-sky-500 to-cyan-500`)
- **Accent**: Amber / Orange (для токенов)
- **Background**: White / Gray-950 (dark mode)
- **Text**: Gray-900 / White (dark mode)

---

## 🎭 Анимации

### 1. Burger Icon (Menu ↔ Close)
- Rotate: -90° ↔ 0° ↔ 90°
- Duration: 0.2s
- Smooth transition

### 2. Slide-Out Menu
- Entrance: X from -300px to 0
- Exit: X from 0 to -300px
- Spring animation with damping

### 3. Overlay Fade
- Entrance: opacity 0 → 1
- Exit: opacity 1 → 0
- Duration: 0.2s

### 4. Menu Links (Stagger)
- Each link animates with 0.05s delay
- Slide in from left (x: -20)
- Hover effect: x +8px

### 5. Active Link Indicator
- Small dot appears on the right
- Layout animation (smooth size change)

---

## 📱 Responsive Design

| Размер | Видимое | Скрыто |
|--------|---------|---------|
| Mobile | Burger menu, Logo | Token counter, Основные ссылки |
| Tablet+ | Burger menu, Token counter | - |
| Desktop | Всё | Burger menu (используйте `hidden md:flex` для основной навигации) |

### Breakpoints:
- `sm:` 640px
- `md:` 768px
- `lg:` 1024px

---

## 🌓 Dark Mode

Компонент полностью поддерживает dark mode:

```tsx
// Dark mode классы:
dark:bg-gray-900/40
dark:text-white
dark:hover:bg-gray-800/50
dark:border-gray-800
// и т.д.
```

---

## ⌨️ Keyboard Shortcuts

| Клавиша | Действие |
|---------|----------|
| `Escape` | Закрыть меню |
| `Click outside` | Закрыть меню |
| `Click link` | Закрыть меню + перейти |

---

## 🔗 Навигационные ссылки (текущие)

1. **Главная** → `/`
2. **Академия** → `/academy`
3. **Курсы** → `/academy/courses`
4. **Маркет** → `/market`
5. **AI-наставник** → `/chat/create-chat`
6. **Профиль** → `/profile`

---

## 🎯 CSS Classes

### Top Bar
```tsx
fixed top-0 left-0 w-full z-40
bg-white/60 dark:bg-gray-900/40
backdrop-blur-md
shadow-sm border-b border-white/20
```

### Slide Menu
```tsx
fixed left-0 top-16
w-80 h-[calc(100vh-4rem)]
bg-white dark:bg-gray-950
z-40 shadow-xl
border-r border-gray-200 dark:border-gray-800
```

### Overlay
```tsx
fixed inset-0
bg-black/40 backdrop-blur-sm
z-30
```

---

## 🔄 State Management

```tsx
const [isOpen, setIsOpen] = useState(false);       // Состояние меню
const [tokenBalance] = useState(1250);             // Баланс токенов
const [isMounted, setIsMounted] = useState(false); // Hydration flag
```

### `isMounted` - предотвращает ошибки hydration

---

## 🚨 Важные моменты

1. **Spacer div** внизу компонента (`h-16`) предотвращает наложение контента на fixed header
2. **Body overflow** управляется автоматически при открытии меню
3. **Escape key listener** удаляется при unmount
4. **`usePathname()`** для определения active link (Next.js App Router)

---

## 📦 Dependencies

Уже включены в проект:

- `next` (15+)
- `react` (19+)
- `framer-motion` (10+)
- `lucide-react` (300+)
- `typescript`
- `tailwindcss`

---

## 💡 Примеры кастомизации

### Изменить цвет логотипа

```tsx
// Текущий вид
className="p-1.5 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-lg"

// Вариант 1: Фиолетовый
className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg"

// Вариант 2: Зелёный
className="p-1.5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg"
```

### Добавить новую ссылку в меню

```tsx
const navLinks: NavLink[] = [
  // ... существующие ссылки
  {
    label: "Новый раздел",
    href: "/new-section",
    icon: <YourIcon className="w-5 h-5" />,
  },
];
```

### Изменить ширину меню

```tsx
// Текущий размер: 320px (w-80)
className="w-80"  // ← Измените на w-72, w-96, etc.
```

### Изменить информацию в footer

```tsx
<p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed">
  <span className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
    Ваш текст здесь  {/* ← Измените */}
  </span>
  Dima Fomin v2.0  {/* ← И здесь */}
</p>
```

---

## 🎨 Полный стиль (Uber Eats inspirated)

✨ **Минимализм**: Чистый белый фон, minimal shadows, subtle borders  
✨ **Иконки**: Все используют Lucide React  
✨ **Анимации**: Плавные, естественные, не раздражающие  
✨ **Spacing**: 8px базовая сетка  
✨ **Typography**: Четкая иерархия размеров  
✨ **Colors**: Небольшая палитра (sky, cyan, amber, gray)  

---

## 📄 Версия компонента

**NavigationBurger v2.0** — готов к production!

```
v2.0 ✓ Новый дизайн в стиле Uber Eats
v2.0 ✓ Полная адаптивность
v2.0 ✓ Dark mode
v2.0 ✓ Keyboard shortcuts
v2.0 ✓ Smooth animations
v2.0 ✓ SEO-friendly
```

---

## 🔗 Интеграция в проект

```bash
# 1. Компонент уже создан:
components/NavigationBurger.tsx

# 2. Импортируйте в app/layout.tsx или нужную страницу
import NavigationBurger from "@/components/NavigationBurger";

# 3. Используйте:
<NavigationBurger />

# 4. Добавьте pt-16 к содержимому (для spacer)
<main className="pt-16">
  {/* Your content */}
</main>
```

---

## 🎯 Финальный результат

✅ Современная навигация в стиле Uber Eats  
✅ Адаптивна на всех устройствах  
✅ Красивые анимации Framer Motion  
✅ Dark mode support  
✅ Полный TypeScript type safety  
✅ Готова к production  

**Наслаждайтесь! 🚀**
