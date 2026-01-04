# 🎨 Recipe View Dialog Architecture

## Цель
Превратить dump данных в **структурированную карточку рецепта уровня SaaS / Admin Panel**.

---

## 📐 Правильная структура (иерархия восприятия)

```
┌─────────────────────────────────────────┐
│          HEADER                         │  ← Название, описание, badges
├─────────────────────────────────────────┤
│          KPI METRICS                    │  ← Grid 4 колонки (не текст!)
├─────────────────────────────────────────┤
│          TABS                           │  ← Смысловые зоны
│  ┌─────────────────────────────────┐   │
│  │  Overview | Translations |      │   │
│  │  Nutrition | Steps | Tech       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [Tab Content - scrollable]            │
│                                         │
└─────────────────────────────────────────┘
```

---

## ✅ Что исправлено

### ❌ До (неправильно)
- Один длинный вертикальный поток
- Всё одинаково "громкое"
- Нет визуальной иерархии
- Переводы смешаны с описаниями
- Technical info в общем потоке

### ✅ После (правильно)
```
[ HEADER ]          ← Название + Описание + Badges
[ KPI GRID ]        ← 4 метрики в сетке
[ TABS ]            ← Разделение контента
  ├─ Overview       ← Походження + Інгредієнти
  ├─ Translations   ← Назва + Опис (4 мови)
  ├─ Nutrition      ← Харчова цінність (акцент)
  ├─ Steps          ← Покрокова інструкція
  └─ Tech           ← Технічна інфа (скрыта)
```

---

## 🧩 Компоненты

### 1️⃣ Header
```tsx
<DialogHeader>
  <DialogTitle>Pierogi ruskie</DialogTitle>
  <DialogDescription>
    Pierogi z ziemniakami i serem.
  </DialogDescription>
  <div className="flex gap-2 mt-2">
    <Badge>Середній</Badge>
    <Badge>Опубліковано</Badge>
    <Badge>🍽️ main</Badge>
  </div>
</DialogHeader>
```

**Важно**: `DialogDescription` — обязателен (accessibility).

---

### 2️⃣ KPI Metrics
```tsx
<div className="grid grid-cols-4 gap-3 my-4">
  <StatCard icon={Clock} label="Час" value="90 хв" />
  <StatCard icon={Users} label="Порції" value="4" />
  <StatCard icon={ChefHat} label="Інгредієнтів" value="0" />
  <StatCard icon={Eye} label="Перегляди" value="0" />
</div>
```

**Компонент StatCard**:
```tsx
function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border p-3 text-center">
      <div className="flex items-center justify-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
```

---

### 3️⃣ Tabs (сердце UI)

**Почему tabs обязательны**:
- ✅ Снимают информационную перегрузку
- ✅ Упорядочивают данные по смыслу
- ✅ Масштабируются (AI, видео, аналитику добавишь потом)

```tsx
<Tabs defaultValue="overview">
  <TabsList className="grid w-full grid-cols-5">
    <TabsTrigger value="overview">Огляд</TabsTrigger>
    <TabsTrigger value="translations">Переклади</TabsTrigger>
    <TabsTrigger value="nutrition">Харчова</TabsTrigger>
    <TabsTrigger value="steps">Кроки</TabsTrigger>
    <TabsTrigger value="tech">Технічне</TabsTrigger>
  </TabsList>

  <TabsContent value="overview">...</TabsContent>
  <TabsContent value="translations">...</TabsContent>
  <TabsContent value="nutrition">...</TabsContent>
  <TabsContent value="steps">...</TabsContent>
  <TabsContent value="tech">...</TabsContent>
</Tabs>
```

---

## 📑 Структура табов

### Tab: Overview
- **Походження** (Origin): Країна, Регіон
- **Інгредієнти**: Grid 2 колонки

```tsx
<Section title="Походження">
  <MetaRow label="Країна" value="Poland" />
  <MetaRow label="Регіон" value="Małopolska" />
</Section>
```

---

### Tab: Translations
- **Назва**: PL / EN / UK / RU (MetaRow)
- **Опис**: 3 мови (block format с border-left accent)

```tsx
<Section title="Назва">
  {titleTranslations.map(t => (
    <MetaRow key={t.lang} label={t.label} value={t.value} />
  ))}
</Section>

<Section title="Опис">
  {descTranslations.map(t => (
    <div className="border-l-4 border-primary p-4">
      <p className="text-xs">{t.label}</p>
      <p className="text-sm">{t.value}</p>
    </div>
  ))}
</Section>
```

**Принцип**: data-driven, без хардкода.

---

### Tab: Nutrition
- **Gradient background** (green → blue)
- **Тип**: balanced / high-protein / etc
- **Калорії**: большой шрифт + иконка огня 🔥

```tsx
<div className="p-6 bg-gradient-to-r from-green-50 to-blue-50">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-xs">Тип</p>
      <p className="text-lg font-semibold">balanced</p>
    </div>
    <div className="text-right">
      <Flame className="w-8 h-8 text-orange-500" />
      <p className="text-3xl font-bold">420</p>
      <p className="text-xs">ккал</p>
    </div>
  </div>
</div>
```

---

### Tab: Steps
- **Ordered list** (не кастомные div!)
- Кружочки с номерами
- Hover effect

```tsx
<ol className="space-y-3">
  {steps.map((step, i) => (
    <li key={i} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
      <span className="w-7 h-7 bg-primary text-primary-foreground rounded-full">
        {i + 1}
      </span>
      <p>{step.description}</p>
    </li>
  ))}
</ol>
```

---

### Tab: Tech
- **Grid 2 колонки**
- **Font mono** (технические данные)
- ID, Canonical Name, Category, Source, Created, Updated

```tsx
<dl className="grid grid-cols-2 gap-3 text-sm font-mono">
  <div>
    <dt className="text-xs text-gray-500">ID</dt>
    <dd className="text-gray-900">{recipe.id}</dd>
  </div>
  <div>
    <dt className="text-xs text-gray-500">Canonical Name</dt>
    <dd className="text-gray-900">{recipe.canonicalName}</dd>
  </div>
  ...
</dl>
```

**Принцип**: Скрыть от глаз, но оставить доступным.

---

## 🎯 Ключевые принципы

### 1. Иерархия восприятия
```
Header (H1)     ← Самое важное
  ↓
KPI Metrics     ← Быстрые цифры
  ↓
Tabs            ← Детализация
```

### 2. Data-driven подход
❌ **Нельзя**:
```tsx
<p>🇵🇱 Польська: Pierogi ruskie</p>
<p>🇬🇧 Англійська: Pierogi Ruskie</p>
```

✅ **Нужно**:
```tsx
{translations.map(t => (
  <MetaRow key={t.lang} label={t.label} value={t.value} />
))}
```

### 3. Повторяемые паттерны
- `StatCard` — метрики
- `Section` — обёртка с заголовком
- `MetaRow` — строка label: value

### 4. Empty States
Всегда показывай пустые состояния:
```tsx
{!recipe.steps?.length && (
  <div className="text-center py-8 text-gray-500">
    <p>📋 Кроки приготування відсутні</p>
  </div>
)}
```

---

## 🚀 Результат

### До
- 1 файл, 321 строка
- Вертикальный поток dump данных
- Нет структуры
- Warning: Missing DialogDescription

### После
- 1 файл, ~320 строк (оптимизировано)
- Header → KPI → Tabs
- Accessibility ✅
- Масштабируемость ✅
- SaaS-уровень UX ✅

---

## 📊 Метрики качества

| Критерий | До | После |
|----------|----|----|
| Визуальная иерархия | ❌ | ✅ |
| Accessibility | ⚠️ Warning | ✅ |
| Масштабируемость | ❌ | ✅ |
| Data-driven | ❌ | ✅ |
| Empty states | ❌ | ✅ |
| Повторяемые паттерны | ❌ | ✅ |

---

## 🎓 Выводы

### Проблема
> Ты рендеришь данные, а не интерфейс

### Решение
1. **Header** — контекст + badges
2. **KPI Grid** — быстрые цифры (не текст!)
3. **Tabs** — смысловое разделение
4. **Data-driven** — без хардкода
5. **Empty states** — всегда

### Правильный путь
```
Проектируй структуру восприятия
              ↓
Подключаешь API
              ↓
Profit! 🚀
```

---

## 📝 Использование

```tsx
import { RecipeViewDialog } from "@/components/admin/catalog/recipes/RecipeViewDialog";

<RecipeViewDialog 
  recipe={selectedRecipe} 
  open={isOpen} 
  onOpenChange={setIsOpen} 
/>
```

**Минимальные данные для отображения**:
- `title` / `localName` / `canonicalName`
- `description` / `descriptionPl`
- `difficulty`, `status`, `cuisine`
- `timeMinutes`, `servings`

**Опциональные данные**:
- `ingredients[]`
- `steps[]`
- Переводы (namePl/En/Ru, descriptionPl/En/Ru)
- `country`, `region`
- `nutritionProfile`
- Technical info (id, createdAt, updatedAt)

---

**Дата**: 4 січня 2026 р.  
**Статус**: ✅ Production Ready  
**Версия**: 2.0 (SaaS Architecture)
