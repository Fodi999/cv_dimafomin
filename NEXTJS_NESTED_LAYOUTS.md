# 🚨 ВАЖНО: Nested Layouts в Next.js

## Правило №1: Не дублируйте глобальные компоненты!

### ✅ ПРАВИЛЬНО:
```tsx
// app/layout.tsx (root)
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NavigationBurger />  ← ТОЛЬКО ЗДЕСЬ!
        <Footer />             ← ТОЛЬКО ЗДЕСЬ!
        <ToastContainer />     ← ТОЛЬКО ЗДЕСЬ!
        {children}
      </body>
    </html>
  );
}

// app/admin/layout.tsx (nested)
export default function AdminLayout({ children }) {
  return (
    <div>
      <AdminSidebar />  ← Специфичный контент для admin
      {children}
    </div>
  );
}
```

### ❌ НЕПРАВИЛЬНО:
```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NavigationBurger />  ← Instance #1
        {children}
      </body>
    </html>
  );
}

// app/admin/layout.tsx
export default function AdminLayout({ children }) {
  return (
    <div>
      <NavigationBurger />  ← Instance #2 = ДУБЛИКАТ! ❌
      {children}
    </div>
  );
}
```

## Как работают Nested Layouts

```
URL: /admin/dashboard

Рендерятся оба layout одновременно:

app/layout.tsx (root)
  └─ app/admin/layout.tsx (nested)
       └─ app/admin/dashboard/page.tsx

Если NavigationBurger в обоих layout:
= 2 NavigationBurger
= 2 AuthModal
= 2 модальных окна! 😵
```

## Что рендерить где?

### Root Layout (`app/layout.tsx`):
- ✅ Навигация (Navigation, Header)
- ✅ Футер (Footer)
- ✅ Глобальные модалки (Auth, Notifications)
- ✅ Toast контейнеры
- ✅ Theme providers
- ✅ Context providers

### Nested Layouts (`app/*/layout.tsx`):
- ✅ Специфичные сайдбары
- ✅ Breadcrumbs для раздела
- ✅ Layout для конкретного раздела
- ❌ НЕ дублируйте глобальные компоненты!

## Checklist при создании Nested Layout:

- [ ] Компонент используется только в этом разделе? → ✅ OK
- [ ] Компонент уже в root layout? → ❌ НЕ добавляй!
- [ ] Компонент может открыть модалку? → ❌ НЕ дублируй!
- [ ] Компонент управляет глобальным state? → ❌ Только в root!

---

## 🎯 Запомни:

> **One Layout, One Component**
> 
> Глобальные UI компоненты должны быть **только в root layout**!

---

Made with ❤️ by Dima Fomin
