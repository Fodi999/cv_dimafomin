# Auth 2026 - Fix Login 404

**Дата**: 2026-01-26  
**Проблема**: `GET /login 404`  
**Статус**: ✅ Исправлено

## Проблема

### Симптомы
- ❌ `GET http://localhost:3000/login 404`
- ❌ Два auth-механизма работают параллельно (TokenValidator + AuthContext)
- ❌ Они не синхронизированы

### Причина
1. **Страница `/login` не существовала**
   - Next.js App Router требует `app/login/page.tsx`
   - Без файла → 404

2. **Конфликт auth-механизмов**
   - `TokenValidator` читает JWT из cookies/localStorage
   - `AuthContext` читает `access_token`
   - Они не синхронизированы
   - Один считает пользователя залогиненным, второй — нет

---

## Решение

### ✅ ШАГ 1: Создана страница `/login`

**Файл**: `app/login/page.tsx`

```tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

export default function LoginPage() {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace("/marketplace");
    } else {
      openAuthModal("login");
    }
  }, [user, router, openAuthModal]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthModal
        isOpen={true}
        onClose={() => router.push("/")}
        initialTab="login"
      />
    </div>
  );
}
```

**Функциональность**:
- Если пользователь уже залогинен → редирект на `/marketplace`
- Если нет → открывает модалку входа

---

### ✅ ШАГ 2: Убран TokenValidator

**Было** (`app/layout.tsx`):
```tsx
<TokenValidator />
<AuthGate>
  {children}
</AuthGate>
```

**Стало**:
```tsx
{/* ✅ 2026: Auth protection через RequireAuth в layouts */}
{/* ❌ TokenValidator удален - конфликтовал с AuthContext */}
{/* ❌ AuthGate удален - заменен на RequireAuth */}
<div className="min-h-screen">
  {children}
</div>
```

**Почему убрали**:
- TokenValidator читал старый `token` из localStorage
- AuthContext читает новый `access_token`
- Они конфликтовали друг с другом
- В 2026 архитектуре только AuthContext — единственный источник истины

---

### ✅ ШАГ 3: Убран AuthGate

**Было**:
```tsx
<AuthGate>
  {children}
</AuthGate>
```

**Стало**:
```tsx
<div className="min-h-screen">
  {children}
</div>
```

**Почему убрали**:
- AuthGate использовал старую логику проверки
- RequireAuth в layouts заменяет его функциональность
- Два guard'а одновременно = конфликт

---

### ✅ ШАГ 4: Исправлен редирект в RequireAuth

**Было** (`components/auth/RequireAuth.tsx`):
```tsx
if (!user) {
  router.replace("/"); // ❌ Редирект на главную
  return;
}
```

**Стало**:
```tsx
if (!user) {
  router.replace("/login"); // ✅ Редирект на /login
  return;
}
```

**Почему исправили**:
- Теперь `/login` существует
- Редирект на `/login` более явный и понятный

---

## Архитектура 2026 (после исправлений)

### ✅ Единый auth-механизм

```
AuthContext (единственный источник истины)
    ↓
RequireAuth (защита маршрутов)
    ↓
Layouts (admin, user)
```

### ❌ Убрано

- TokenValidator (конфликтовал с AuthContext)
- AuthGate (заменен на RequireAuth)
- Старые проверки токенов

### ✅ Осталось

- AuthContext — загрузка пользователя через `/api/auth/me`
- RequireAuth — защита маршрутов по роли/статусу
- `/login` — страница входа

---

## Проверка

### ✅ Контрольный чеклист

- [x] `GET /login` открывается (не 404)
- [x] TokenValidator не используется
- [x] AuthGate не используется
- [x] AuthContext единственный auth
- [x] При отсутствии токена → редирект на `/login`
- [x] При login → `routeByRole()`

---

## Важно

### ❌ НЕ делать

- Не использовать TokenValidator вместе с AuthContext
- Не использовать AuthGate вместе с RequireAuth
- Не создавать несколько источников истины для auth

### ✅ Делать

- Использовать только AuthContext для auth
- Использовать RequireAuth для защиты маршрутов
- Все редиректы идут через `routeByRole()` и `routeByStatus()`

---

## Следующие шаги

1. ✅ Страница `/login` создана
2. ✅ TokenValidator убран
3. ✅ AuthGate убран
4. ✅ Редирект исправлен
5. ⏳ Тестирование на реальном backend
6. ⏳ Проверка, что `hasRole` исчез из JWT (после пересборки backend)
