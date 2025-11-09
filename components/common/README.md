# Common Components

Бібліотека допоміжних компонентів для використання по всьому проекту.

## Компоненти

### Avatar
Компонент для відображення аватара користувача з фолбеком.

```tsx
import { Avatar } from "@/components/common";

// З фото
<Avatar src="/avatar.jpg" alt="User" size="md" />

// З ініціалами
<Avatar fallbackText="Дмитро Фомін" size="lg" />

// З іконкою (фолбек за замовчуванням)
<Avatar size="sm" onClick={() => console.log("clicked")} />
```

**Props:**
- `src?: string | null` - URL зображення
- `alt?: string` - Alt текст
- `size?: "xs" | "sm" | "md" | "lg" | "xl"` - Розмір (за замовчуванням: "md")
- `fallbackText?: string` - Текст для ініціалів
- `className?: string` - Додаткові класи
- `onClick?: () => void` - Обробник кліку

---

### Badge
Компонент для відображення бейджів/тегів.

```tsx
import { Badge } from "@/components/common";
import { Star } from "lucide-react";

<Badge variant="success" icon={Star}>Новинка</Badge>
<Badge variant="error" size="sm">Продано</Badge>
```

**Props:**
- `children: React.ReactNode` - Контент
- `variant?: "default" | "success" | "warning" | "error" | "info"` - Варіант (за замовчуванням: "default")
- `size?: "sm" | "md" | "lg"` - Розмір (за замовчуванням: "md")
- `icon?: LucideIcon` - Іконка
- `className?: string` - Додаткові класи

---

### EmptyState
Компонент для відображення порожнього стану.

```tsx
import { EmptyState } from "@/components/common";
import { Inbox } from "lucide-react";

<EmptyState
  icon={Inbox}
  title="Немає повідомлень"
  description="Почніть спілкування з AI шефом"
  actionLabel="Новий чат"
  onAction={() => router.push("/chat")}
/>

// Або з емодзі
<EmptyState
  emoji="📭"
  title="Поки що пусто"
  description="Створіть ваш перший рецепт"
/>
```

**Props:**
- `icon?: LucideIcon` - Іконка Lucide
- `emoji?: string` - Емодзі (альтернатива іконці)
- `title: string` - Заголовок
- `description?: string` - Опис
- `actionLabel?: string` - Текст кнопки
- `onAction?: () => void` - Обробник кліку на кнопку
- `className?: string` - Додаткові класи

---

### ErrorMessage
Компонент для відображення помилок.

```tsx
import { ErrorMessage } from "@/components/common";

<ErrorMessage
  title="Не вдалося завантажити дані"
  message="Перевірте підключення до інтернету"
  onRetry={() => refetch()}
  onDismiss={() => setError(null)}
/>
```

**Props:**
- `title?: string` - Заголовок (за замовчуванням: "Помилка")
- `message: string` - Текст помилки
- `onRetry?: () => void` - Обробник повторної спроби
- `onDismiss?: () => void` - Обробник закриття
- `className?: string` - Додаткові класи

---

### LoadingSpinner
Компонент для відображення завантаження.

```tsx
import { LoadingSpinner } from "@/components/common";

<LoadingSpinner size="lg" text="Завантаження рецептів..." />
<LoadingSpinner size="sm" />
```

**Props:**
- `size?: "sm" | "md" | "lg"` - Розмір (за замовчуванням: "md")
- `text?: string` - Текст під спінером
- `className?: string` - Додаткові класи

---

### Modal
Універсальний компонент модального вікна.

```tsx
import { Modal } from "@/components/common";

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Налаштування"
  size="lg"
>
  <div className="p-6">
    Контент модалки
  </div>
</Modal>
```

**Props:**
- `isOpen: boolean` - Стан відкриття
- `onClose: () => void` - Обробник закриття
- `title?: string` - Заголовок
- `children: React.ReactNode` - Контент
- `size?: "sm" | "md" | "lg" | "xl"` - Розмір (за замовчуванням: "md")
- `showCloseButton?: boolean` - Показувати кнопку закриття (за замовчуванням: true)
- `closeOnBackdropClick?: boolean` - Закривати при кліку поза модалкою (за замовчуванням: true)
- `className?: string` - Додаткові класи

**Особливості:**
- Автоматичне блокування скролу body
- Закриття по ESC
- Анімації входу/виходу
- Backdrop з blur ефектом

---

### Tooltip
Компонент для відображення підказок при наведенні.

```tsx
import { Tooltip } from "@/components/common";

<Tooltip content="Це підказка" position="top">
  <button>Наведіть на мене</button>
</Tooltip>
```

**Props:**
- `children: React.ReactNode` - Елемент з підказкою
- `content: string` - Текст підказки
- `position?: "top" | "bottom" | "left" | "right"` - Позиція (за замовчуванням: "top")
- `delay?: number` - Затримка перед показом в мс (за замовчуванням: 200)
- `className?: string` - Додаткові класи

---

## Імпорт

Всі компоненти можна імпортувати разом:

```tsx
import {
  Avatar,
  Badge,
  EmptyState,
  ErrorMessage,
  LoadingSpinner,
  Modal,
  Tooltip
} from "@/components/common";
```

Або окремо:

```tsx
import { Avatar } from "@/components/common/Avatar";
```

---

## Стилізація

Всі компоненти підтримують додаткові класи через prop `className` для кастомізації під конкретні потреби.

Використовують Tailwind CSS та Framer Motion для анімацій.
