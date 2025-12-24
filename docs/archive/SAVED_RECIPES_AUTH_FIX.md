# 🔧 Saved Recipes Page Auth Fix

## Проблема
Страница `/recipes/saved` не отображалась при отсутствии авторизации — просто висел белый экран.

## Причина
После миграции на Modal-First архитектуру, когда токена нет:
1. `useEffect` вызывает `openAuthModal('login')`
2. Делает `return;` — останавливает выполнение
3. **НО** не устанавливает никакое состояние для UI
4. Компонент остаётся в `loading: true` и просто показывает спиннер навсегда

## Решение

### 1. Добавлено состояние `needsAuth`
```typescript
const [needsAuth, setNeedsAuth] = useState(false);
```

### 2. Обновлён useEffect
```typescript
useEffect(() => {
  console.log('🔍 SavedRecipesPage - checking auth, isAuthenticated:', isAuthenticated);
  
  if (typeof window !== 'undefined') {
    const hasValidToken = isTokenValid();
    
    if (!hasValidToken || !isAuthenticated) {
      console.warn('⚠️ Token invalid or not authenticated - showing auth message');
      setNeedsAuth(true);
      setLoading(false); // 🔧 Останавливаем спиннер
      
      if (!hasValidToken) {
        toast.warning('Sesja wygasła', 'Zaloguj się ponownie');
        setTimeout(() => openAuthModal('login'), 500);
      }
      return;
    }
    
    // Token is valid AND user is authenticated - load recipes
    console.log('✅ User authenticated - loading recipes');
    setNeedsAuth(false);
    loadSavedRecipes();
  }
}, [isAuthenticated]); // 🔧 Перезагружаем когда меняется isAuthenticated
```

**Ключевые изменения:**
- `setNeedsAuth(true)` — устанавливаем флаг
- `setLoading(false)` — останавливаем спиннер
- Зависимость только `[isAuthenticated]` — перезагружает рецепты после логина

### 3. Добавлен UI для `needsAuth`
```typescript
if (needsAuth) {
  return (
    <div className="min-h-screen ...">
      <motion.div ...>
        <div className="text-center space-y-6">
          <div className="p-4 bg-amber-100 ... rounded-full">
            <Star className="w-10 h-10 text-amber-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">
              Wymagana autoryzacja
            </h2>
            <p className="text-gray-600">
              Zaloguj się, aby zobaczyć swoje zapisane przepisy
            </p>
          </div>
          <button
            onClick={() => openAuthModal('login')}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500"
          >
            Zaloguj się
          </button>
        </div>
      </motion.div>
    </div>
  );
}
```

**Теперь пользователь видит:**
- Красивое сообщение "Wymagana autoryzacja"
- Иконку звезды
- Кнопку "Zaloguj się"

## Результат

### ❌ До:
- Белый экран / вечный спиннер
- Модалка открывается, но страница не обновляется
- После логина нужно перезагрузить страницу вручную

### ✅ После:
- Красивое сообщение об авторизации
- Модалка открывается автоматически
- После логина страница **автоматически загружает рецепты**
- UX плавный и понятный

## Тестирование

1. **Без логина:**
   - Перейти на `/recipes/saved`
   - Должно показаться: "Wymagana autoryzacja" + кнопка
   - Модалка должна открыться через 0.5 сек

2. **После логина:**
   - Залогиниться через модалку
   - Страница должна **автоматически загрузить** рецепты
   - Не нужно перезагружать страницу

3. **С логином:**
   - Перейти на `/recipes/saved` уже залогиненным
   - Рецепты должны загрузиться сразу

---

Дата: 22 декабря 2025
