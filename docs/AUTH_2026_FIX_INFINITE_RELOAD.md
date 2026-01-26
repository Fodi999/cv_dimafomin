# Auth 2026 - Fix Infinite Reload

**Дата**: 2026-01-26  
**Проблема**: Постоянная перезагрузка страницы  
**Статус**: ✅ Исправлено

## Проблема

### Симптомы
- Страница постоянно перезагружается
- Бесконечный цикл редиректов
- Множественные вызовы useEffect

### Причина
1. **RequireAuth вызывался несколько раз**
   - useRef сбрасывался при каждом рендере
   - Не было защиты от множественных редиректов

2. **authFetch редиректил при каждом 401**
   - Даже если уже на /login
   - Вызывал полную перезагрузку страницы

3. **LoginPage редиректил без проверки**
   - useRef сбрасывался при пересоздании компонента

---

## Решение

### ✅ ШАГ 1: Исправлен RequireAuth

**Файл**: `components/auth/RequireAuth.tsx`

**Изменения**:
1. ✅ Использует глобальный `Map` для отслеживания редиректов
2. ✅ Проверяет timestamp редиректа (не редиректит если прошло меньше 500ms)
3. ✅ Автоматически очищает старые флаги (старше 2 секунд)
4. ✅ Проверяет текущий pathname перед редиректом

**Код**:
```typescript
// Глобальный флаг для предотвращения множественных редиректов
const redirectingTo = new Map<string, number>();

// Проверка перед редиректом
const isRedirecting = redirectingTo.has(targetRoute);
const redirectTimestamp = redirectingTo.get(targetRoute) || 0;
const timeSinceRedirect = Date.now() - redirectTimestamp;

if (pathname !== targetRoute && !isRedirecting && timeSinceRedirect > 500) {
  redirectingTo.set(targetRoute, Date.now());
  router.replace(targetRoute);
}
```

### ✅ ШАГ 2: Исправлен authFetch

**Файл**: `lib/api/authFetch.ts`

**Изменения**:
1. ✅ Проверяет текущий pathname перед редиректом
2. ✅ Не редиректит если уже на публичной странице
3. ✅ Не редиректит если уже на /login

**Код**:
```typescript
if (response.status === 401) {
  const currentPath = window.location.pathname;
  const isPublicRoute = ['/login', '/register', '/', '/account/status'].includes(currentPath);
  
  // Очищаем токены
  localStorage.removeItem("access_token");
  // ...
  
  // Редиректим только если не на публичной странице
  if (!isPublicRoute && currentPath !== '/login') {
    window.location.href = "/login";
  }
}
```

### ✅ ШАГ 3: Исправлен LoginPage

**Файл**: `app/login/page.tsx`

**Изменения**:
1. ✅ Использует глобальный флаг вместо useRef
2. ✅ Проверяет текущий pathname перед редиректом
3. ✅ Автоматически сбрасывает флаг через 2 секунды

**Код**:
```typescript
let loginPageRedirecting = false;

useEffect(() => {
  if (loginPageRedirecting) return;
  
  if (!loading && user) {
    const targetRoute = '/marketplace';
    if (window.location.pathname !== targetRoute) {
      loginPageRedirecting = true;
      router.replace(targetRoute);
      
      setTimeout(() => {
        loginPageRedirecting = false;
      }, 2000);
    }
  }
}, [user, loading, router]);
```

### ✅ ШАГ 4: Оптимизирован AuthContext

**Файл**: `contexts/AuthContext.tsx`

**Изменения**:
1. ✅ Мемоизированы `token` и `role` чтобы не вызывать лишние ререндеры
2. ✅ Вычисляются один раз перед созданием value

---

## Механизм защиты

### Глобальные флаги

1. **RequireAuth**: `redirectingTo` Map
   - Хранит маршрут и timestamp редиректа
   - Автоматически очищается через 2 секунды
   - Проверяет время с последнего редиректа (минимум 500ms)

2. **LoginPage**: `loginPageRedirecting` boolean
   - Глобальный флаг для предотвращения множественных редиректов
   - Сбрасывается через 2 секунды

### Проверки перед редиректом

1. Проверка текущего pathname
2. Проверка флага редиректа
3. Проверка времени с последнего редиректа
4. Проверка публичных маршрутов

---

## Проверка

### ✅ Правильное поведение

1. Неавторизованный пользователь → `/marketplace`
   - RequireAuth редиректит на `/login` (один раз)
   - Страница загружается без перезагрузок

2. Пользователь логинится
   - LoginPage редиректит на `/marketplace` (один раз)
   - Страница загружается без перезагрузок

3. 401 ошибка
   - authFetch очищает токены
   - Редиректит на `/login` только если не на публичной странице
   - Нет множественных редиректов

### ❌ Неправильное поведение (старое)

1. RequireAuth редиректит → компонент пересоздается → useRef сбрасывается → снова редирект
2. authFetch получает 401 → редиректит → запросы продолжаются → снова 401 → снова редирект
3. LoginPage редиректит → компонент пересоздается → useRef сбрасывается → снова редирект

---

## Следующие шаги

1. ✅ Бесконечная перезагрузка исправлена
2. ⏳ Тестирование на реальном backend
3. ⏳ Мониторинг логов на наличие множественных редиректов
