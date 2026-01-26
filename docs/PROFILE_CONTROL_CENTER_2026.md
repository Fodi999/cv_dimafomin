# Profile Control Center Architecture 2026

## 🎯 Концепция

**Профиль больше не "настройки аккаунта".**  
**Профиль = Control Center пользователя.**

В зависимости от роли:
- **Admin profile** → центр управления бизнесом и экономикой
- **Customer profile** → история, ценность, лояльность

---

## 📐 Архитектура профиля

### 4 логических блока

```
┌─────────────────────────────────────┐
│  🧑 IDENTITY                        │ → Кто ты в системе
├─────────────────────────────────────┤
│  💼 BUSINESS SNAPSHOT               │ → За что платят
├─────────────────────────────────────┤
│  📈 PROGRESS & INTELLIGENCE         │ → Рост + Инсайты
├─────────────────────────────────────┤
│  ⚡ RECOMMENDED ACTIONS             │ → Что делать дальше
└─────────────────────────────────────┘
```

---

## 1️⃣ 🧑 Identity Block

**Компактная идентификация без шума**

### Содержит:
- ✅ Имя
- ✅ Email
- ✅ Роль (super_admin / customer)
- ✅ Уровень
- ✅ ChefTokens

### БЕЗ:
- ❌ Bio
- ❌ Location
- ❌ Followers/Following
- ❌ Social metrics

### Компонент:
```tsx
<ProfileIdentity
  name="Dima Fomin"
  email="fodi85@gmail.ru"
  role="super_admin"
  level={1}
  chefTokens={0}
/>
```

**Файл:** `components/profile/ProfileIdentity.tsx`

---

## 2️⃣ 💼 Business Snapshot

**Dashboard-lite в профиле. Самый важный блок.**

### Admin Version:
```
💼 Центр управления бизнесом

💰 Оптимизация затрат: +18%
3,420.75 PLN • этот месяц

📦 Ингредиенты: 156
🍽 Рецепты: 48
```

### Customer Version:
```
💼 Центр управления кухней

💰 Сэкономлено: +12%
450.50 PLN • этот месяц

📦 Продукты: 28
🍽 Приготовлено: 12
```

### Компонент:
```tsx
<BusinessSnapshot
  savedMoney={450.50}
  savedPercentage={12}
  fridgeItems={28}
  cookedRecipes={12}
/>
```

**Файл:** `components/profile/BusinessSnapshot.tsx`

---

## 3️⃣ 📈 Progress & Intelligence

**Два ключевых подблока:**

### 3.1 Level + XP
```
Уровень 1
2450 / 5000 XP
49% до следующего уровня
```

✅ Геймификация  
✅ Retention  
✅ Мотивация

### 3.2 Collective Intelligence
```
🧠 Наблюдения сообщества (уровень 1)

• Большинство пользователей сейчас оптимизируют холодильник
• Часто упрощают техники для снижения затрат
• Лучшее время начать контроль себестоимости
```

**Правила:**
- ❌ НЕТ usernames
- ❌ НЕТ avatars
- ❌ НЕТ likes/comments
- ✅ Read-only
- ✅ 2-4 bullet insights max
- ✅ Бизнес-инсайт, не социалка

### Компонент:
```tsx
<ProgressIntelligence
  level={1}
  xp={2450}
  maxXp={5000}
  communityInsights={[...]}
/>
```

**Файл:** `components/profile/ProgressIntelligence.tsx`

---

## 4️⃣ ⚡ Recommended Actions

**Conversion engine. Что делать дальше.**

### Admin Actions:
```
⚡ Рекомендуемые действия

📦 Проверить склад
   Обновить цены на 12 ингредиентах

💰 Проанализировать экономику
   Посмотреть отчет по себестоимости

🍽 Создать новый рецепт
   Расширить меню с оптимальной маржой
```

### Customer Actions:
```
⚡ Рекомендуемые действия

📦 Проверить холодильник
   Добавить 2 продукта для оптимизации

🛒 Посмотреть заказы
   У вас 1 активный заказ

📖 Изучить рецепты с низкой себестоимостью
   Сэкономьте больше на следующей неделе
```

### Компонент:
```tsx
<ProfileActions
  mode="admin" // or "customer"
  actions={[
    {
      id: '1',
      icon: <Package />,
      title: 'Проверить склад',
      description: 'Обновить цены на 12 ингредиентах',
      href: '/admin/ingredients',
      variant: 'primary'
    },
    // ...
  ]}
/>
```

**Файл:** `components/profile/ProfileActions.tsx`

---

## 📂 Структура файлов

```
components/profile/
├── ProfileIdentity.tsx           # 🧑 Identity
├── BusinessSnapshot.tsx          # 💼 Business metrics
├── ProgressIntelligence.tsx      # 📈 Level + Insights
└── ProfileActions.tsx            # ⚡ Actionable recommendations

app/
├── admin/profile/
│   └── page_new.tsx              # Admin Control Center
└── customer/profile/
    └── page.tsx                   # Customer Control Center
```

---

## 🎨 Design System

### Colors by Role

**Admin (super_admin):**
- Primary: Violet/Purple gradient
- Accent: Emerald (savings)
- Background: Gray-950 → Gray-900

**Customer:**
- Primary: Sky/Cyan gradient
- Accent: Emerald (savings)
- Background: Gray-950 → Gray-900

### Typography
- Headers: `text-sm font-bold text-white`
- Metrics: `text-2xl-3xl font-bold text-white`
- Descriptions: `text-[10px] text-gray-400`

---

## 🔄 Migration Path

### Phase 1: Create New Components ✅
- [x] ProfileIdentity
- [x] BusinessSnapshot
- [x] ProgressIntelligence
- [x] ProfileActions

### Phase 2: Update Pages
- [x] `/customer/profile/page.tsx` - новая структура
- [x] `/admin/profile/page_new.tsx` - новая структура

### Phase 3: Testing
- [ ] Test admin profile
- [ ] Test customer profile
- [ ] Test actions navigation
- [ ] Verify dark mode

### Phase 4: Deploy
- [ ] Replace old components
- [ ] Update translations
- [ ] Deploy to production

---

## 📊 Key Metrics to Track

**Admin Profile:**
- Cost optimization %
- Ingredients in stock
- Recipes created
- Weekly savings

**Customer Profile:**
- Money saved
- Fridge items
- Recipes cooked
- Weekly budget usage

---

## 🎯 UX Goals

### Admin должен чувствовать:
✅ "Я контролирую бизнес"  
✅ "Я вижу экономику в реальном времени"  
✅ "Я знаю, что делать дальше"

### Customer должен чувствовать:
✅ "Я экономлю деньги"  
✅ "Я расту как повар"  
✅ "Я не один - есть сообщество"

---

## 🚀 Next Steps

1. **Test new profile pages**
   - Check all links work
   - Verify data displays correctly
   - Test on mobile

2. **Replace old components**
   - Deprecate SimpleProfileHeader
   - Deprecate HeroKPI
   - Deprecate ProgressControl
   - Deprecate CollectiveInsight

3. **Add backend integration**
   - Connect to real metrics API
   - Dynamic community insights
   - Personalized actions

4. **Translations**
   - Add i18n keys for new components
   - Polish/English/Ukrainian

---

## 📝 Notes

- **Profile ≠ Settings**: Settings остаются отдельно (`/admin/settings`, `/customer/profile/settings`)
- **No Social Feed**: Collective Intelligence - это инсайты, НЕ социальная сеть
- **Mobile-First**: Все компоненты адаптивны
- **Dark Mode Only**: Дизайн оптимизирован для темной темы

---

**Created:** 2026-01-25  
**Author:** GitHub Copilot  
**Status:** ✅ Components Ready, 🔄 Pages In Progress
