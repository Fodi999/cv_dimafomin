# 🔧 Admin Panel Architecture

## 📋 Overview

Профессиональная структура админ-панели с **role-based access control (RBAC)**, **feature flags** и **multilingual support**.

---

## 🏗️ Принципы

### ✅ Admin ≠ User

**Админ-панель** — это инструмент **управления системой**, а не пользовательское приложение.

**❌ Что НЕ должно быть в admin:**
- Холодильник (user feature)
- Готовка (user feature)
- AI Assistant для пользователя (user feature)
- Мои рецепты (user feature)
- Академия как обучение (user feature)

**✅ Что ДОЛЖНО быть:**
- Управление пользователями
- Управление контентом (рецепты, ингредиенты)
- Управление AI сценариями
- Управление экономикой (токены)
- Мониторинг и аналитика
- Настройки системы

---

## 📂 Структура навигации

```
🏠 Dashboard
   └─ Панель управления (KPI, графики, последние события)

👥 Users
   ├─ All Users
   ├─ Roles & Permissions (admin/superadmin only)
   └─ Activity Log

🍽️ Content
   ├─ Recipes
   ├─ Ingredients
   ├─ Courses
   └─ Localization (admin/superadmin only)

🧠 AI & Logic
   ├─ AI Scenarios (admin/superadmin only)
   ├─ Prompt Templates (admin/superadmin only)
   └─ AI Logs (admin/superadmin only, feature flag: ai_logs)

💰 Economy
   ├─ Token Treasury
   ├─ Transactions
   └─ Rewards & Penalties

📦 Operations (feature flag: operations)
   ├─ Orders
   ├─ Payments
   └─ Subscriptions

🔌 Integrations (admin/superadmin only)
   ├─ API Keys
   ├─ Webhooks
   └─ External Services

⚙️ Settings
   ├─ General Settings
   ├─ Feature Flags (admin/superadmin only)
   └─ Security (superadmin only)
```

---

## 🔐 Role-Based Access Control (RBAC)

### Роли:
- **`superadmin`** — полный доступ ко всему
- **`admin`** — доступ к основным разделам управления
- **`moderator`** — доступ к контенту и пользователям (в будущем)
- **`support`** — доступ к Activity Log и Users (в будущем)

### Примеры ограничений:
```typescript
// Только admin и superadmin
{
  id: "roles",
  requiredRoles: ["admin", "superadmin"],
  ...
}

// Только superadmin
{
  id: "security",
  requiredRoles: ["superadmin"],
  ...
}
```

---

## 🚩 Feature Flags

Feature flags позволяют **включать/выключать разделы** без изменения кода.

### Включённые по умолчанию:
- Dashboard
- Users
- Content
- AI & Logic
- Economy
- Settings

### Опциональные (отключены):
- `operations` — Orders, Payments, Subscriptions (включить когда будет e-commerce)
- `integrations` — API Keys, Webhooks (включить когда будут интеграции)
- `ai_logs` — AI Logs (включить для дебага AI)

### Как включить:
```typescript
// components/admin/AdminSidebar.tsx
const enabledFeatures: FeatureFlag[] = [
  "operations",     // ← раскомментировать
  "integrations",   // ← раскомментировать
  "ai_logs",        // ← раскомментировать
];
```

---

## 🌍 Multilingual Support

Навигация поддерживает **EN**, **RU**, **PL**.

```typescript
{
  label: {
    en: "Dashboard",
    ru: "Панель управления",
    pl: "Panel sterowania",
  },
  ...
}
```

Язык определяется автоматически из `useLanguage()` hook.

---

## 📁 Файлы

### Core:
- **`/lib/admin/navigation-schema.ts`** — схема навигации с типами
- **`/components/admin/AdminSidebar.tsx`** — компонент sidebar
- **`/app/admin/layout.tsx`** — layout с RBAC guard

### Pages (существующие):
- `/admin/dashboard` — главная страница (обновить!)
- `/admin/users` — управление пользователями
- `/admin/recipes` — управление рецептами
- `/admin/courses` — управление курсами
- `/admin/token-bank` — управление токенами
- `/admin/activity-log` — журнал активности
- `/admin/settings` — настройки

### Pages (создать):
- `/admin/ingredients` — управление ингредиентами
- `/admin/localization` — управление переводами
- `/admin/ai/scenarios` — сценарии AI
- `/admin/ai/prompts` — промпты
- `/admin/ai/logs` — логи AI
- `/admin/transactions` — транзакции
- `/admin/rewards` — награды
- `/admin/users/roles` — роли и доступы

---

## 🚀 Следующие шаги

### 1. ✅ Dashboard (обновить)
Создать профессиональную главную страницу с:
- KPI cards (пользователи, рецепты, токены)
- Графики (активность, экономика)
- Recent Activity
- System Status

### 2. ✅ Ingredients Management
Создать страницу управления ингредиентами:
- CRUD операции
- Импорт/экспорт
- Категории
- Локализация

### 3. ✅ AI Management
Создать страницы для управления AI:
- Сценарии (recipes generation, fridge analysis)
- Промпт-шаблоны
- Логи и мониторинг

### 4. Feature Flags UI
Создать UI для управления feature flags:
- Включить/выключить фичи
- A/B testing
- Rollout controls

### 5. Roles & Permissions UI
Создать UI для управления ролями:
- Создание custom ролей
- Назначение permissions
- Role hierarchy

---

## 📊 Metrics & KPIs

Dashboard должен показывать:
- **Users**: Total, Active Today, New This Week
- **Content**: Recipes, Ingredients, Courses
- **Economy**: Total Tokens, Treasury Balance, Transactions Today
- **Activity**: API Calls, AI Requests, Errors
- **System**: Uptime, Response Time, Storage

---

## 🎯 Production-Ready Checklist

- [x] Role-based navigation
- [x] Feature flags system
- [x] Multilingual support
- [x] TypeScript interfaces
- [ ] Dashboard with KPIs
- [ ] Ingredients management
- [ ] AI management pages
- [ ] Feature flags UI
- [ ] Roles UI
- [ ] Analytics & monitoring
- [ ] Audit log
- [ ] API documentation

---

## 💡 Best Practices

1. **Админ не юзает продукт** — админ управляет системой
2. **RBAC везде** — каждый раздел проверяет роль
3. **Feature flags** — новые фичи за флагами
4. **Аудит** — логируем все действия админов
5. **Мониторинг** — видим статус системы в реальном времени

---

## 📖 Documentation

- [Navigation Schema](../lib/admin/navigation-schema.ts)
- [Admin Sidebar](../components/admin/AdminSidebar.tsx)
- [Admin Layout](../app/admin/layout.tsx)

---

*Last updated: 2026-01-04*
