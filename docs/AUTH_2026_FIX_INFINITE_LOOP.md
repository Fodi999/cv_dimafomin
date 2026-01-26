# Auth 2026 - Fix Infinite Loop

**Дата**: 2026-01-26  
**Проблема**: Бесконечная цикличность редиректов  
**Статус**: ✅ Исправлено

## Проблема

### Симптомы
- Бесконечные редиректы между `/login` и защищенными маршрутами
- RequireAuth редиректит на `/login` → LoginPage редиректит на `/marketplace` → RequireAuth снова редиректит на `/login`

### Причина
1. **RequireAuth редиректил даже на публичных маршрутах**
   - `/login` не был в списке публичных маршрутов
   - RequireAuth проверял авторизацию даже на `/login`

2. **Множественные редиректы**
   - useEffect вызывался каждый раз при изменении user/loading
   - Не было защиты от повторных редиректов

3. **LoginPage редиректил без проверки**
   - Редиректил на `/marketplace` каждый раз когда user менялся
   - Не проверял, не произошел ли уже редирект

---

## Решение

### ✅ ШАГ 1: Исправлен RequireAuth

**Файл**: `components/auth/RequireAuth.tsx`

**Изменения**:
1. ✅ Добавлен список публичных маршрутов (`/login`, `/register`, `/`, `/account/status`)
2. ✅ Публичные маршруты пропускаются без проверки авторизации
3. ✅ Используется `useRef` для предотвращения множественных редиректов
4. ✅ Проверяется текущий `pathname` перед редиректом (не редиректим если уже на нужной странице)

**Код**:
```typescript
const publicRoutes = ['/login', '/register', '/', '/account/status'];
const isPublicRoute = pathname && publicRoutes.includes(pathname);
const hasRedirectedRef = useRef(false);

// Если это публичный маршрут, не проверяем авторизацию
if (isPublicRoute) {
  return <>{children}</>;
}

// Предотвращаем множественные редиректы
if (hasRedirectedRef.current) {
  return;
}

// Проверяем pathname перед редиректом
if (!user && pathname !== '/login') {
  hasRedirectedRef.current = true;
  router.replace("/login");
}
```

### ✅ ШАГ 2: Исправлен LoginPage

**Файл**: `app/login/page.tsx`

**Изменения**:
1. ✅ Используется `useRef` для предотвращения множественных редиректов
2. ✅ Редирект происходит только один раз

**Код**:
```typescript
const hasRedirectedRef = useRef(false);

useEffect(() => {
  // Предотвращаем множественные редиректы
  if (hasRedirectedRef.current) {
    return;
  }

  if (!loading && user) {
    hasRedirectedRef.current = true;
    router.replace("/marketplace");
  }
}, [user, loading, router]);
```

---

## Логика работы

### Публичные маршруты
- `/login` - страница входа
- `/register` - страница регистрации
- `/` - главная страница
- `/account/status` - страница статуса аккаунта

Эти маршруты **НЕ** защищены RequireAuth и доступны без авторизации.

### Защищенные маршруты
- Все маршруты в `app/(user)/*` - защищены RequireAuth
- Все маршруты в `app/admin/*` - защищены RequireAuth с `allowRoles={["admin", "super_admin"]}`

### Flow

1. **Неавторизованный пользователь заходит на защищенный маршрут**
   - RequireAuth видит что нет user
   - Редирект на `/login` (один раз)
   - `/login` не защищен, показывается форма входа

2. **Пользователь логинится**
   - AuthContext загружает user
   - LoginPage видит user и редиректит на `/marketplace` (один раз)
   - `/marketplace` защищен RequireAuth, но user есть → доступ разрешен

3. **Пользователь заходит на `/login` будучи залогиненным**
   - LoginPage видит user и редиректит на `/marketplace` (один раз)
   - Нет бесконечного цикла

---

## Проверка

### ✅ Правильное поведение

1. Неавторизованный пользователь → `/marketplace`
   - RequireAuth редиректит на `/login` (один раз)
   - Показывается форма входа

2. Пользователь логинится на `/login`
   - LoginPage редиректит на `/marketplace` (один раз)
   - Показывается `/marketplace`

3. Авторизованный пользователь → `/login`
   - LoginPage редиректит на `/marketplace` (один раз)
   - Нет бесконечного цикла

### ❌ Неправильное поведение (старое)

1. Неавторизованный пользователь → `/marketplace`
   - RequireAuth редиректит на `/login`
   - LoginPage видит что нет user (loading = true)
   - RequireAuth снова редиректит на `/login`
   - **Бесконечный цикл**

---

## Ключевые изменения

1. ✅ Публичные маршруты пропускаются в RequireAuth
2. ✅ Используется `useRef` для предотвращения множественных редиректов
3. ✅ Проверяется текущий `pathname` перед редиректом
4. ✅ LoginPage защищен от множественных редиректов

---

## Следующие шаги

1. ✅ Бесконечный цикл исправлен
2. ⏳ Тестирование на реальном backend
3. ⏳ Проверка всех сценариев редиректов
