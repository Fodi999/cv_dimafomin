# 🔄 Modal-First Authentication Migration

## Проблема, которая была решена

### Двойное окно входа — Root Cause

**Симптом:** При попытке войти в систему появлялось **ДВА** идентичных окна с текстом "Witaj! Zaloguj się do swojego konta i kontynuuj naukę"

**Причина:** В проекте одновременно существовали **две параллельные системы авторизации**:

1. **Страницы `/login` и `/register`** (app/login/page.tsx, app/register/page.tsx)
   - Отдельные route-based страницы
   - Полноэкранные формы логина/регистрации
   
2. **AuthModal компонент** (components/auth/AuthModal.tsx)
   - Модальное окно, рендерилось через NavigationBurger
   - Появлялось поверх любой страницы

**Что происходило:**
```
Пользователь → /login (страница)
              ↓
AuthContext проверяет: !user
              ↓
NavigationBurger автоматически открывает AuthModal
              ↓
РЕЗУЛЬТАТ: Страница логина + Модалка поверх неё = 2 окна входа
```

---

## ✅ Решение: Modal-First Architecture

### Выбранный подход

**Modal-first** — вход/регистрация **только через модальное окно**:

- ❌ Удалены страницы `/login` и `/register`
- ✅ Единственный механизм: `AuthModal` компонент
- ✅ Global state управление через `AuthContext`

### Почему Modal-First для этого проекта?

1. **Modern SaaS UX** — пользователь не покидает текущую страницу
2. **App-like experience** — больше похоже на приложение, чем на сайт
3. **Нет дублирования** — один источник истины
4. **Лучше для AI/Tokens platform** — быстрая авторизация без редиректов

---

## 🔧 Что было изменено

### 1. AuthContext — Global Modal Control

**Добавлено:**
```typescript
interface AuthContextType {
  // ... existing auth fields
  
  // 🆕 Global modal control
  isAuthModalOpen: boolean;
  authModalTab: "login" | "register";
  openAuthModal: (tab?: "login" | "register") => void;
  closeAuthModal: () => void;
}
```

**Реализация:**
```typescript
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  
  // 🆕 Global modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");

  // 🆕 Modal control functions
  const openAuthModal = (tab: "login" | "register" = "login") => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const value: AuthContextType = {
    token,
    role,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    setAuthData,
    // 🆕 Modal control
    isAuthModalOpen,
    authModalTab,
    openAuthModal,
    closeAuthModal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

**Преимущества:**
- Модалкой можно управлять **из любого компонента**
- Не нужно передавать props через 5 уровней
- Single source of truth

---

### 2. NavigationBurger — Использует Global State

**До:**
```typescript
const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");

const openAuthModal = (tab: "login" | "register") => {
  setAuthModalTab(tab);
  setIsAuthModalOpen(true);
};
```

**После:**
```typescript
const { logout, isAuthModalOpen, authModalTab, openAuthModal, closeAuthModal } = useAuth();

// Всё! Локальный state удалён, используем global
```

**AuthModal рендеринг:**
```typescript
<AuthModal 
  isOpen={isAuthModalOpen} 
  onClose={closeAuthModal}
  initialTab={authModalTab}
  onSuccess={() => router.push("/assistant")}
/>
```

---

### 3. Удалены страницы `/login` и `/register`

**Удалено:**
```
app/login/
  ├── page.tsx       ❌ DELETED
  └── layout.tsx     ❌ DELETED

app/register/
  ├── page.tsx       ❌ DELETED
  └── layout.tsx     ❌ DELETED
```

**Команда:**
```bash
rm -rf app/login app/register
```

---

### 4. Обновлены все редиректы

**Найдены все места с `router.push('/login')`:**
- `app/admin/layout.tsx`
- `app/assistant/page.tsx`
- `app/fridge/page.tsx` (6 раз)
- `app/recipes/saved/page.tsx` (2 раза)

**Было:**
```typescript
if (!user) {
  router.push('/login');
}
```

**Стало:**
```typescript
const { openAuthModal } = useAuth();

if (!user) {
  openAuthModal('login');
}
```

**Массовая замена (для fridge/page.tsx):**
```bash
sed -i '' 's/router\.push("\/login")/openAuthModal("login")/g' app/fridge/page.tsx
```

---

## 📝 Примеры использования

### Базовое использование

```typescript
import { useAuth } from '@/contexts/AuthContext';

export default function MyComponent() {
  const { openAuthModal } = useAuth();

  const handleProtectedAction = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      openAuthModal('login');
      return;
    }
    // Выполнить действие
  };

  return (
    <button onClick={handleProtectedAction}>
      Защищённое действие
    </button>
  );
}
```

### Открыть на вкладке регистрации

```typescript
<button onClick={() => openAuthModal('register')}>
  Создать аккаунт
</button>
```

### В useEffect

```typescript
useEffect(() => {
  if (!isLoading && !user) {
    openAuthModal('login');
  }
}, [user, isLoading, openAuthModal]);
```

---

## 🎯 Результат

### ❌ До миграции:
- Две системы авторизации конфликтовали
- Появлялось два окна входа
- `router.push('/login')` разбросан по коду
- Невозможно открыть модалку из глубоко вложенных компонентов

### ✅ После миграции:
- **Одна** система авторизации через AuthModal
- **Одно** окно входа
- Global control через `useAuth().openAuthModal()`
- Работает **из любого компонента** без prop drilling

---

## 🔍 Как проверить, что работает

### 1. Запустить dev server
```bash
npm run dev
```

### 2. Очистить кэш браузера
- macOS: `Cmd + Shift + R`
- Windows: `Ctrl + Shift + R`
- Или: DevTools → Application → Clear storage

### 3. Закрыть все вкладки VS Code с `/login` и `/register`
Эти файлы удалены, но редактор может показывать кэш

### 4. Проверить сценарии

**✅ Должно работать:**
- Кнопка "Zaloguj się" в NavigationBurger → модалка с вкладкой Login
- Кнопка "Zarejestruj się" в NavigationBurger → модалка с вкладкой Register
- Переход на `/assistant` без логина → модалка
- Переход на `/fridge` без логина → модалка
- Переход на `/admin` без логина → модалка
- **Только ОДНО окно** авторизации

**❌ Не должно работать:**
- Переход на `/login` → 404 (страница удалена)
- Переход на `/register` → 404 (страница удалена)

---

## 🐛 Troubleshooting

### Проблема: VS Code показывает ошибку "Cannot find module '@/contexts/AuthContext'"

**Причина:** Редактор открыл кэш старого файла `/app/login/page.tsx`, который уже удалён

**Решение:**
1. Закрыть вкладку с `/app/login/page.tsx`
2. Перезапустить TypeScript Server: `Cmd+Shift+P` → "Restart TypeScript Server"
3. Если не помогло: перезапустить VS Code

### Проблема: Появляется два окна входа

**Проверить:**
1. Dev server перезапущен? `Ctrl+C` → `npm run dev`
2. Кэш браузера очищен? `Cmd+Shift+R`
3. `app/login` и `app/register` **действительно удалены**?
   ```bash
   ls -la app/ | grep login
   ls -la app/ | grep register
   ```
   Должно быть пусто

4. AuthModal импортирован только в NavigationBurger?
   ```bash
   grep -r "import AuthModal" --include="*.tsx" | grep -v node_modules
   ```
   Должна быть только одна строка: `components/NavigationBurger.tsx`

---

## 📚 Связанные документы

- `AUTH_MODAL_ARCHITECTURE_FIX.md` — Исправление initialTab и архитектуры AuthModal
- `DOUBLE_MODAL_FIX.md` — Исправление дублирования модалок из-за nested layouts
- `NEXTJS_NESTED_LAYOUTS.md` — Best practices для Next.js nested layouts

---

## ✅ Checklist миграции

- [x] Добавлен global modal control в AuthContext
- [x] NavigationBurger использует global state
- [x] Удалены страницы `/login` и `/register`
- [x] Обновлены все `router.push('/login')` → `openAuthModal('login')`
- [x] Обновлены все `router.push('/register')` → `openAuthModal('register')`
- [x] Протестировано на локальном dev server
- [x] Документация создана

---

## 🎉 Дата завершения
22 декабря 2025

**Автор:** AI Assistant
**Тип миграции:** Modal-First Architecture
**Версия:** 1.0
