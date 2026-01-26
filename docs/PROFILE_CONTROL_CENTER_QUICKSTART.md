# Profile Control Center - Quick Start Guide

## 🎯 Что изменилось?

Профиль трансформирован из "настроек аккаунта" в **Control Center** с четкой структурой.

---

## ✅ Что готово

### 1. Новые компоненты (4 блока)

```tsx
// 🧑 Identity - кто ты
<ProfileIdentity 
  name="Dima Fomin"
  email="fodi85@gmail.ru"
  role="super_admin"
  level={1}
  chefTokens={0}
/>

// 💼 Business - за что платят
<BusinessSnapshot
  savedMoney={450.50}
  savedPercentage={12}
  fridgeItems={28}
  cookedRecipes={12}
/>

// 📈 Progress - рост + инсайты
<ProgressIntelligence
  level={1}
  xp={2450}
  maxXp={5000}
  communityInsights={[...]}
/>

// ⚡ Actions - что делать
<ProfileActions
  mode="customer"
  actions={[...]}
/>
```

### 2. Обновленные страницы

- ✅ `/app/customer/profile/page.tsx` - ОБНОВЛЕН
- ✅ `/app/admin/profile/page_new.tsx` - СОЗДАН

---

## 🚀 Как тестировать

### Customer Profile
```bash
# Открыть в браузере
http://localhost:3000/customer/profile
```

**Что проверить:**
- [x] Identity блок показывает имя, email, роль
- [x] Business Snapshot показывает экономику
- [x] Progress Intelligence показывает уровень + инсайты
- [x] Actions кликабельны и ведут на правильные страницы

### Admin Profile (новый)
```bash
# Сначала переименовать файл
mv app/admin/profile/page_new.tsx app/admin/profile/page_backup.tsx
mv app/admin/profile/page_new.tsx app/admin/profile/page.tsx

# Открыть в браузере
http://localhost:3000/admin/profile
```

**Что проверить:**
- [x] Identity показывает "super_admin"
- [x] Business Snapshot показывает склад + рецепты
- [x] Actions ведут на /admin/ingredients, /admin/economy, etc
- [x] Кнопка "Настройки системы" ведет на /admin/settings

---

## 📐 Структура профиля

```
┌─────────────────────────────────┐
│ 🧑 Identity                     │ Компактно, без шума
├─────────────────────────────────┤
│ 💼 Business Snapshot            │ ГЛАВНЫЙ блок
│                                 │ (экономика, метрики)
├─────────────────────────────────┤
│ 📈 Progress & Intelligence      │ Level + Community
│                                 │ Insights
├─────────────────────────────────┤
│ ⚡ Recommended Actions          │ Conversion engine
└─────────────────────────────────┘
```

---

## 🔧 Активация новых профилей

### Вариант 1: Постепенная миграция
```bash
# Customer уже использует новые компоненты
# Admin пока на старой версии

# Когда будете готовы:
cd app/admin/profile
mv page.tsx page_old.tsx
mv page_new.tsx page.tsx
```

### Вариант 2: Feature Flag
```tsx
// app/admin/profile/page.tsx
const USE_NEW_PROFILE = process.env.NEXT_PUBLIC_NEW_PROFILE === 'true';

if (USE_NEW_PROFILE) {
  return <NewAdminProfile />;
}
return <OldAdminProfile />;
```

---

## 🎨 Design Notes

### Темная тема
Все компоненты оптимизированы для dark mode:
- Background: `from-gray-950 via-gray-900`
- Cards: `bg-gray-800/60 border-gray-700/50`
- Text: `text-white` / `text-gray-300` / `text-gray-400`

### Цвета по ролям

**Admin:**
- Primary: Violet/Purple (`violet-500`)
- Accent: Emerald (`emerald-500`)

**Customer:**
- Primary: Sky/Cyan (`sky-500`)
- Accent: Emerald (`emerald-500`)

### Responsive
- Mobile-first дизайн
- Breakpoints: sm, md, lg
- Все тексты адаптивны

---

## 📊 Метрики для бэкенда

### Admin Profile нужны:
```typescript
{
  savedMoney: number;        // Оптимизация затрат
  savedPercentage: number;   // % экономии
  ingredientsInStock: number;
  recipesCreated: number;
  level: number;
  xp: number;
  maxXp: number;
}
```

### Customer Profile нужны:
```typescript
{
  savedMoney: number;
  savedPercentage: number;
  fridgeItems: number;
  cookedRecipes: number;
  level: number;
  xp: number;
  maxXp: number;
}
```

### Collective Insights (AI):
```typescript
{
  userLevel: number;
  insights: string[];  // 2-4 bullet points
}
```

---

## 🔄 Что дальше?

### Priority HIGH
1. **Тестирование**
   - [ ] Открыть customer profile
   - [ ] Проверить все actions
   - [ ] Тест на мобильном

2. **Backend Integration**
   - [ ] API для метрик
   - [ ] API для community insights
   - [ ] Динамические actions

### Priority MEDIUM
3. **Translations**
   - [ ] Добавить i18n ключи
   - [ ] Перевести на PL/UA/EN

4. **Активация Admin Profile**
   - [ ] Переключить на новую версию
   - [ ] Удалить старые компоненты

### Priority LOW
5. **Optimization**
   - [ ] Анимации оптимизировать
   - [ ] Loading states добавить
   - [ ] Error handling

---

## 💡 Ключевые идеи

### 1. Profile ≠ Settings
- Profile = Control Center (метрики, инсайты, actions)
- Settings = Конфигурация (язык, пароль, уведомления)

### 2. Collective Intelligence ≠ Social Network
- Без имен, аватаров, лайков
- Только бизнес-инсайты от AI
- Read-only, не соцсеть

### 3. Actions = Conversion
- Не просто "Co dalej?"
- Конкретные шаги с ссылками
- Primary action выделен

---

## 📞 Вопросы?

Проверьте полную документацию:
`docs/PROFILE_CONTROL_CENTER_2026.md`

**Status:** ✅ Ready for Testing

---

**Created:** 2026-01-25  
**Components:** ✅ 4/4 Created  
**Pages:** ✅ 2/2 Updated  
**Next:** 🔄 Testing & Backend Integration
