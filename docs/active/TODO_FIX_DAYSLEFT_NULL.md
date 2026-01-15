# 🎯 TODO: Исправить `daysLeft: null → 0`

**Приоритет:** P1  
**Время:** 10-15 минут  
**Статус:** ⏳ В процессе

---

## 🐛 Проблема

Продукты **без срока годности** показывают "0 дней" вместо "Без срока годности"

---

## ✅ Что УЖЕ исправлено

1. **Backend** ✅ - возвращает `daysLeft: null` правильно
2. **TypeScript types** ✅ - `daysLeft: number | null`
3. **UI component** ✅ - `getStatusConfig(status, daysLeft | null)`
4. **i18n** ✅ - добавлен `status.noExpiry` в 3 языках

---

## ⏳ Что ОСТАЛОСЬ

**Найти где `null` превращается в `0`!**

### Проверить:

1. **API Proxy** (`app/api/fridge/items/route.ts`)
   - Добавлен лог: `[API Proxy] 🔍 Items with NULL daysLeft`
   - **Действие:** Обнови страницу, проверь **серверные** логи (терминал где `npm run dev`)

2. **Fetch layer** (`lib/api/base.ts`)
   - Добавлен лог: `[API base.ts] 🔍 Items with NULL daysLeft`
   - **Действие:** Проверь **браузерную** консоль

3. **React State** (`app/(user)/fridge/page.tsx`)
   - Добавлен лог: `[FridgePage] 🔍 Items with null/undefined daysLeft`
   - **Действие:** Проверь консоль браузера

---

## 🔍 Debugging Steps

### 1. Проверь серверные логи

```bash
# В терминале где запущен npm run dev
# Обнови страницу /fridge
# Найди строку:
[API Proxy] 🔍 Items with NULL daysLeft: X
```

**Если X = 0:**
- Проблема в `NextResponse.json(data)` или раньше
- Может быть баг в Next.js 15 или настройках

**Если X = 1:**
- API Proxy работает правильно!
- Проблема ниже по цепочке

### 2. Проверь браузерную консоль

```javascript
[API base.ts] 🔍 Items with NULL daysLeft: X
```

**Если X = 0:**
- Проблема в `response.json()` или типизации
- Возможно default параметры где-то

**Если X = 1:**
- `base.ts` получает `null` правильно!
- Проблема в React state или компоненте

### 3. Проверь React state

```javascript
[FridgePage] 🔍 Items with null/undefined daysLeft: X
```

**Сейчас X = 0** → значит проблема выше!

---

## 💡 Возможные причины

### A. Next.js `JSON.stringify` баг

```typescript
// app/api/fridge/items/route.ts
return NextResponse.json(data);  ← Может превращать null в 0?
```

**Тест:**
```typescript
return new Response(JSON.stringify(data), {
  headers: { 'Content-Type': 'application/json' }
});
```

### B. TypeScript default параметры

```typescript
// Где-то может быть:
function something(daysLeft: number = 0) {}  ← ❌
```

**Найти:**
```bash
grep -r "daysLeft.*= *0" components/
```

### C. Destructuring с default

```typescript
const { daysLeft = 0 } = item;  ← ❌ Превращает null в 0!
```

---

## ✅ Как проверить что исправлено

1. **Добавь Olej roślinny через UI**
2. **Обнови страницу**
3. **Проверь консоль:**
   ```
   [FridgeItem] Olej roślinny → daysLeft: null (type: object)  ← ✅
   ```
4. **Проверь UI:**
   ```
   Bez terminu ważności  ← ✅
   ```

---

## 📝 Когда исправишь

1. Удали все DEBUG логи
2. Обнови этот документ со статусом ✅
3. Добавь commit:
   ```bash
   git add -A
   git commit -m "fix: Handle daysLeft: null correctly in frontend

   - Fixed null → 0 conversion in [FILE]
   - Products without expiry now show 'No expiry date'
   - Closes #ISSUE"
   ```

---

**Estimated time:** 10-15 минут  
**Difficulty:** Easy (just need to find one line of code)

**Good luck! 🚀**
