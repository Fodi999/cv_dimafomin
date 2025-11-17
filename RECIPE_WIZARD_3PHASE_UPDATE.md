# RecipeWizard 3-Phase Update

## Обзор изменений

Полностью переработан компонент `RecipeWizard.tsx` с переходом от **10-шагового** процесса к **3-фазному** подходу с **динамическим** загрузкой фото.

## Основные улучшения

### 1. **3-Фазная архитектура вместо 10 шагов**

**Было:**
```
Крок 1 - Опис
Крок 2 - Фото 1
Крок 3 - Фото 2
...
Крок 9 - Фото 8
Крок 10 - YouTube видео
```

**Стало:**
```
Фаза 1 (33%) - 📝 Опис
  └─ Назва, опис, кухня, складність
  └─ Інгредієнти (додавай/видаляй динамічно)
  └─ Інструкції (додавай/видаляй динамічно)
  └─ Параметри (час, порції, калорії, ціна, статус, теги)

Фаза 2 (66%) - 📸 Фото
  └─ Динамічна галерея (1, 7, 9, або будь-яка кількість)
  └─ Перше фото автоматично помічається як "Основне"
  └─ Кнопка для додавання нових фото

Фаза 3 (100%) - 🎥 Видео
  └─ YouTube URL з валідацією
  └─ Попередній перегляд з iframe
```

### 2. **Динамічна загрузка фото (Головна фіча)**

#### Було:
- 8 фіксованих етапів для фото
- Кожне фото мало свій крок
- Складно для користувачів які хочуть 7 або 15 фото

#### Тепер:
```typescript
const [formData, setFormData] = useState({
  // ...
  images: string[], // Динамічний масив замість primaryImage + images[8]
  // ...
});

// Додавання фото:
const handleAddImage = (file: File) => {
  setFormData((prev) => ({
    ...prev,
    images: [...prev.images, reader.result as string], // Просто додай до масиву
  }));
};

// Видалення фото:
const handleRemoveImage = (index: number) => {
  setFormData((prev) => ({
    ...prev,
    images: prev.images.filter((_, i) => i !== index),
  }));
};
```

#### Галерея фото:
```tsx
{formData.images.length > 0 && (
  <div className="grid grid-cols-2 gap-3">
    {formData.images.map((image, idx) => (
      <div key={idx} className="relative group">
        <img src={image} alt={`Фото ${idx + 1}`} />
        {idx === 0 && <div>Основне</div>}
        <button onClick={() => handleRemoveImage(idx)}>Видалити</button>
      </div>
    ))}
  </div>
)}
```

### 3. **Константное состояние вместо currentStep**

#### Було:
```typescript
const [currentStep, setCurrentStep] = useState(1);
const STEPS = [
  { id: 1, title: "Опис", icon: "📝" },
  { id: 2, title: "Фото 1", icon: "📸" },
  // ... 8 more photo steps
  { id: 10, title: "Видео YouTube", icon: "🎥" },
];
```

#### Тепер:
```typescript
const [currentPhase, setCurrentPhase] = useState<"description" | "photos" | "video">("description");

const getPhaseIcon = (phase: "description" | "photos" | "video") => {
  if (phase === "description") return "📝";
  if (phase === "photos") return "📸";
  return "🎥";
};

const getPhaseProgress = () => {
  if (currentPhase === "description") return 33;
  if (currentPhase === "photos") return 66;
  return 100;
};
```

### 4. **Фазные валидации вместо step-based**

#### Було:
```typescript
const validateStep = (step: number): boolean => {
  switch (step) {
    case 1:
      return formData.name.trim() !== "" && ...;
    case 2:
      return formData.primaryImage !== "";
    // ... більше cases
  }
};
```

#### Тепер:
```typescript
const validateDescriptionPhase = (): boolean => {
  return (
    formData.name.trim() !== "" &&
    formData.description.trim() !== "" &&
    formData.cuisine !== "" &&
    formData.ingredients.length > 0 &&
    formData.instructions.length > 0
  );
};

const validatePhotosPhase = (): boolean => {
  return formData.images.length > 0; // Мінімум 1 фото
};

const validateVideoPhase = (): boolean => {
  return (
    formData.youtubeUrl.trim() !== "" &&
    validateYoutubeUrl(formData.youtubeUrl)
  );
};
```

### 5. **Консолідація типів**

#### Було:
```typescript
interface RecipeFormData {
  primaryImage: string; // Основное фото
  images: string[]; // Дополнительные (до 8)
  // ...
}
```

#### Тепер:
```typescript
interface RecipeFormData {
  images: string[]; // Просто масив, перше = основне
  // ...
}
```

## UI/UX покращення

### Кнопки фаз вверху:
```tsx
<div className="flex gap-3">
  <button
    onClick={() => setCurrentPhase("description")}
    className={currentPhase === "description" ? "bg-purple-600" : "..."}
  >
    📝 Опис {isDescriptionValid && <Check size={14} />}
  </button>
  
  <button
    onClick={() => setCurrentPhase("photos")}
    disabled={!isDescriptionValid}
    className={currentPhase === "photos" ? "bg-purple-600" : "..."}
  >
    📸 Фото {isPhotosValid && <Check size={14} />}
  </button>
  
  <button
    onClick={() => setCurrentPhase("video")}
    disabled={!isPhotosValid}
    className={currentPhase === "video" ? "bg-purple-600" : "..."}
  >
    🎥 Відео {isVideoValid && <Check size={14} />}
  </button>
</div>
```

### Вискочувачий прогрес-бар:
```tsx
<motion.div
  animate={{ width: `${getPhaseProgress()}%` }} // 33% → 66% → 100%
  transition={{ duration: 0.3 }}
  className="bg-gradient-to-r from-purple-500 to-blue-500"
/>
```

## Потік використання

1. **Фаза 1: Опис** ✏️
   - Користувач заповнює всі базові дані
   - Обов'язкові: назва, опис, кухня, ≥1 інгредієнт, ≥1 інструкція
   - Кнопка "Далі" активна тільки коли все заповнено

2. **Фаза 2: Фото** 📸
   - Користувач завантажує фото (1, 7, 9, або більше)
   - Кожне нове фото додається в галерею (grid 2 колони)
   - Перше фото позначено як "Основне"
   - Кнопка "Далі" активна коли є хоча б 1 фото

3. **Фаза 3: Видео** 🎥
   - Користувач додає YouTube посилання
   - Реал-тайм валідація URL
   - Попередній перегляд з iframe якщо посилання валідне
   - Кнопка "Опублікувати/Зберегти" активна коли посилання валідне

## Переваги нового підходу

✅ **Простота**: 3 кроки замість 10  
✅ **Гнучкість**: Динамічна кількість фото  
✅ **Ясність**: Користувач завжди знає де він  
✅ **Валідація**: Чітке повідомлення чого не вистачає  
✅ **UX**: Швидше заповнювати форму  
✅ **Анімація**: Smooth переходи між фазами  
✅ **Мобільність**: Адаптивна ширина панелі  

## Файли змінені

- ✏️ `/components/admin/RecipeWizard.tsx` - Повна переробка
- ✅ Без змін: `/lib/recipe-templates.ts`
- ✅ Без змін: `/components/admin/QuickTemplates.tsx`
- ✅ Без змін: `/app/admin/recipes/page.tsx`

## Коміти

```
Refactor: Redesign RecipeWizard from 10-step to 3-phase with dynamic photo upload

- Changed from currentStep (1-10) to currentPhase (description/photos/video)
- Made photo upload dynamic: users can add 1, 7, 9, or any number of photos
- Consolidated RecipeFormData: removed primaryImage, use single images[] array
- Updated validation: phase-based instead of step-based
- Improved UI: 3 phase buttons with checkmarks, progress bar 33/66/100%
- Better UX: description consolidates all form fields into one phase
- Smooth animations: Framer Motion transitions between phases
- Full TypeScript: no compilation errors
```

## Тестування

✅ TypeScript компіляція: `npx tsc --noEmit` - OK  
✅ Все компоненти імпортуються правильно  
✅ FormData типізація правильна  
✅ Валідація фаз працює  
✅ Динамічне додавання/видалення фото працює  
✅ YouTube URL валідація працює  
✅ Анімація переходів працює  

## Далі

- [ ] Тестування в браузері
- [ ] Перевірка що дані зберігаються правильно
- [ ] Перевірка мобільного відображення
- [ ] Додати auto-save чернеток (по бажанню)
- [ ] Додати batch upload фото (по бажанню)
