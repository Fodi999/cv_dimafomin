# Очистка Legacy кода

## Дата: 7 января 2026

## ✅ Удалено

### 1. Backup файлы
- `/app/(user)/recipes/page.tsx.backup` - старая версия страницы рецептов

### 2. Устаревшая документация
- `/docs/ADMIN_INGREDIENTS_SIMPLIFIED.md` - описание упрощения формы (уже реализовано)
- `/docs/BUGFIX_INGREDIENTS_API_ROUTE.md` - описание исправления бага (уже исправлено)

### 3. Неиспользуемые файлы в `/src`
- `/src/components/AuthExamples.tsx` - примеры использования аутентификации
- `/src/components/withAuth.tsx` - HOC для защиты страниц (заменен на middleware)
- `/src/contexts/AuthContext.tsx` - контекст аутентификации (есть в `/contexts/AuthContext.tsx`)
- `/src/hooks/useAuth.ts` - хук аутентификации (заменен на useUser)
- `/src/types/index.ts` - типы (перенесены в `/lib/types.ts`)
- `/src/utils/api.ts` - API утилиты (заменены на `/lib/api/base.ts`)
- `/src/utils/storage-migration.ts` - миграция localStorage (больше не нужна)
- `/src/api/client.ts` - API клиент (заменен на `/lib/api/base.ts`)

## ⚠️ Legacy код (оставлен временно)

### `/src/lib/admin-api.ts`
**Используется в:** `/app/admin/token-bank/page.tsx`

**Причина:** Содержит методы `getTokenStats()` и `revokeTokens()`, которых нет в новом `/lib/api/admin.ts`

**TODO:** 
1. Добавить эти методы в `/lib/api/admin.ts`
2. Обновить `/app/admin/token-bank/page.tsx` для использования нового API
3. Удалить всю папку `/src`

### `/src/utils/auth.ts` и `/src/utils/api-url.ts`
**Используется в:** `/src/lib/admin-api.ts`

**Причина:** Зависимости для `admin-api.ts`

**TODO:** Будут удалены вместе с `/src/lib/admin-api.ts`

## 📊 Статистика

**Удалено файлов:** 10
**Осталось legacy файлов:** 3
**Освобождено места:** ~15KB кода

## 🎯 План дальнейшей очистки

1. **Добавить в `/lib/api/admin.ts`:**
   ```typescript
   getTokenStats: async (token: string) => {
     return apiFetch("/admin/token-bank/stats", { token });
   },
   
   revokeTokens: async (userId: string, amount: number, reason: string, token: string) => {
     return apiFetch("/admin/token-bank/revoke", {
       method: "POST",
       token,
       body: JSON.stringify({ userId, amount, reason }),
     });
   },
   ```

2. **Обновить импорт в `/app/admin/token-bank/page.tsx`:**
   ```typescript
   // Старый
   import { adminApi } from "@/src/lib/admin-api";
   
   // Новый
   import { adminApi } from "@/lib/api/admin";
   ```

3. **Удалить папку `/src`:**
   ```bash
   rm -rf src/
   ```

## 📝 Примечания

- Все удаленные файлы находятся в git истории и могут быть восстановлены при необходимости
- Legacy файлы помечены комментарием `@deprecated LEGACY CODE`
- Новый API находится в `/lib/api/` и использует единый паттерн через `apiFetch()`
