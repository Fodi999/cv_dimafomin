/**
 * Recipes translations (RU)
 */

export const recipes = {
  list: {
    title: "Рецепты",
    subtitle: "Откройте и создавайте потрясающие блюда",
    search: "Поиск рецептов...",
    filter: "Фильтр",
    sort: "Сортировка",
    viewGrid: "Вид сетки",
    viewList: "Вид списка",
    noRecipes: "Рецепты не найдены",
    createFirst: "Создайте свой первый рецепт",
  },

  filters: {
    title: "Фильтры",
    category: "Категория",
    difficultyLabel: "Уровень сложности",
    timeLabel: "Время приготовления",
    cuisine: "Кухня",
    diet: "Диета",
    clear: "Очистить фильтры",
    apply: "Применить",
    
    categories: {
      all: "Все",
      breakfast: "Завтрак",
      lunch: "Обед",
      dinner: "Ужин",
      dessert: "Десерт",
      snack: "Перекус",
      appetizer: "Закуска",
      soup: "Суп",
      salad: "Салат",
      beverage: "Напиток",
    },

    difficultyOptions: {
      easy: "Лёгкий",
      medium: "Средний",
      hard: "Сложный",
    },

    timeOptions: {
      under15: "До 15 мин",
      under30: "До 30 мин",
      under60: "До 1 часа",
      over60: "Более 1 часа",
    },
  },

  sort: {
    newest: "Новейшие",
    oldest: "Самые старые",
    popular: "Самые популярные",
    rated: "Лучше оценённые",
    quickest: "Самые быстрые",
  },

  card: {
    new: "Новое",
    featured: "Избранное",
    premium: "Премиум",
    saved: "Сохранено",
    servings: "порций",
    time: "мин",
    difficulty: "Сложность",
    rating: "Рейтинг",
    reviews: "отзывов",
    calories: "ккал",
    viewRecipe: "Посмотреть рецепт",
    saveRecipe: "Сохранить",
    shareRecipe: "Поделиться",
    editRecipe: "Редактировать",
    deleteRecipe: "Удалить",
  },

  detail: {
    backToRecipes: "Назад к рецептам",
    overview: "Обзор",
    ingredients: "Ингредиенты",
    instructions: "Инструкции",
    nutrition: "Пищевая ценность",
    reviews: "Отзывы",
    
    info: {
      prepTime: "Время подготовки",
      cookTime: "Время приготовления",
      totalTime: "Общее время",
      servings: "Порций",
      difficulty: "Сложность",
      cuisine: "Кухня",
      category: "Категория",
      author: "Автор",
      published: "Опубликовано",
      updated: "Обновлено",
    },

    actions: {
      print: "Печать",
      save: "Сохранить",
      share: "Поделиться",
      report: "Пожаловаться",
      edit: "Редактировать",
      delete: "Удалить",
    },
  },

  ingredients: {
    title: "Ингредиенты",
    servings: "порций",
    adjust: "Изменить",
    shopingList: "Список покупок",
    addToList: "Добавить в список",
    removeFromList: "Убрать из списка",
    checkAll: "Отметить все",
    uncheckAll: "Снять все",
    
    units: {
      g: "г",
      kg: "кг",
      ml: "мл",
      l: "л",
      tsp: "ч.л.",
      tbsp: "ст.л.",
      cup: "стакан",
      piece: "шт",
      pinch: "щепотка",
      taste: "по вкусу",
    },
    
    // Recipe detail page
    inFridge: "в холодильнике",
    missing: "отсутствует",
    youHave: "у вас",
    addMissingToFridge: "Добавить недостающее в холодильник",
    addingToFridge: "Добавление в холодильник...",
    readyToCook: "Готово к приготовлению!",
    cookNow: "Приготовить",
    listEmpty: "Список ингредиентов скоро появится",
    listEmptyDesc: "Мы работаем над добавлением подробной информации о рецепте",
  },

  // Recipe Match Cards (for /recipes page)
  match: {
    source: "Рецепт из каталога",
    canCookNow: "Можно приготовить сейчас",
    missingIngredients: "Отсутствует {count} {ingredientWord}",
    ingredientSingular: "ингредиент",
    ingredientPlural: "ингредиентов",
    notInFridge: "Нет в холодильнике",
    fromFridge: "Из холодильника",
    toBuy: "Нужно купить",
    costToBuy: "Стоимость покупки",
    economy: "Экономика",
    valueFromFridge: "Стоимость из холодильника",
    totalCost: "Общая стоимость",
    wasteRiskSaved: "Спасено от потерь",
    cooking: "Готовится...",
    cook: "Приготовить",
    addToShoppingList: "Добавить в список покупок",
    missingWarning: "Отсутствует {count} ингредиентов. Купите их, чтобы приготовить этот рецепт.",
    servingSingular: "порция",
    servingPlural: "порций",
    decreaseServings: "Уменьшить порции",
    increaseServings: "Увеличить порции",
    more: "еще",
  },

  instructions: {
    title: "Инструкции",
    step: "Шаг",
    timer: "Таймер",
    startTimer: "Запустить таймер",
    stopTimer: "Остановить таймер",
    markComplete: "Отметить завершённым",
    markIncomplete: "Отметить незавершённым",
    previous: "Предыдущий",
    next: "Следующий",
    finish: "Завершить",
  },

  // Loading & Error states
  loading: {
    loadingRecipe: "Загрузка рецепта...",
    loadingError: "Ошибка загрузки",
    recipeNotFound: "Рецепт не найден",
  },

  nutrition: {
    title: "Пищевая ценность",
    perServing: "На порцию",
    calories: "Калории",
    protein: "Белки",
    carbs: "Углеводы",
    fat: "Жиры",
    fiber: "Клетчатка",
    sugar: "Сахар",
    sodium: "Натрий",
    cholesterol: "Холестерин",
    vitamins: "Витамины",
    minerals: "Минералы",
  },

  reviews: {
    title: "Отзывы",
    writeReview: "Написать отзыв",
    rating: "Оценка",
    comment: "Комментарий",
    commentPlaceholder: "Поделитесь своими мыслями об этом рецепте...",
    submit: "Отправить",
    cancel: "Отмена",
    edit: "Редактировать",
    delete: "Удалить",
    helpful: "Полезно",
    notHelpful: "Бесполезно",
    report: "Пожаловаться",
    noReviews: "Пока нет отзывов",
    beFirst: "Будьте первым, кто напишет отзыв!",
    
    filter: {
      all: "Все",
      positive: "Положительные",
      critical: "Критические",
      recent: "Недавние",
    },
  },

  form: {
    createTitle: "Создать рецепт",
    editTitle: "Редактировать рецепт",
    
    basic: {
      title: "Основная информация",
      name: "Название рецепта",
      namePlaceholder: "напр. Спагетти Карбонара",
      description: "Описание",
      descriptionPlaceholder: "Краткое описание рецепта...",
      category: "Категория",
      cuisine: "Кухня",
      difficulty: "Уровень сложности",
      servings: "Количество порций",
      prepTime: "Время подготовки (мин)",
      cookTime: "Время приготовления (мин)",
    },

    media: {
      title: "Фото и видео",
      mainImage: "Главное фото",
      additionalImages: "Дополнительные фото",
      video: "Ссылка на видео",
      upload: "Загрузить",
      remove: "Удалить",
    },

    ingredients: {
      title: "Ингредиенты",
      add: "Добавить ингредиент",
      remove: "Удалить",
      name: "Название",
      amount: "Количество",
      unit: "Единица",
      notes: "Примечания",
      group: "Группа",
      addGroup: "Добавить группу",
    },

    instructions: {
      title: "Инструкции",
      add: "Добавить шаг",
      remove: "Удалить",
      step: "Шаг",
      description: "Описание",
      image: "Изображение (опционально)",
      timer: "Таймер (опционально)",
      timerPlaceholder: "Время в минутах",
    },

    nutrition: {
      title: "Пищевая ценность (опционально)",
      calories: "Калории",
      protein: "Белки (г)",
      carbs: "Углеводы (г)",
      fat: "Жиры (г)",
      fiber: "Клетчатка (г)",
      sugar: "Сахар (г)",
      sodium: "Натрий (мг)",
    },

    tags: {
      title: "Теги",
      placeholder: "Добавьте теги через запятую",
      suggestions: "Предложенные",
    },

    visibility: {
      title: "Видимость",
      public: "Публичный",
      publicDescription: "Виден всем пользователям",
      private: "Приватный",
      privateDescription: "Виден только вам",
      unlisted: "Скрытый",
      unlistedDescription: "Доступен только по ссылке",
    },

    actions: {
      saveDraft: "Сохранить черновик",
      preview: "Предпросмотр",
      publish: "Опубликовать",
      update: "Обновить",
      cancel: "Отмена",
      delete: "Удалить рецепт",
    },
  },

  cooking: {
    title: "Готовка",
    loading: "Проверяем твой холодильник...",
    
    stats: {
      canCookNow: "Можно готовить сейчас",
      almostReady: "Почти готово",
      needShopping: "Нужны покупки",
      basedOnFridge: "На основе твоего холодильника показываем, что можно приготовить прямо сейчас",
    },
    
    sections: {
      canCook: {
        title: "Можно готовить сейчас",
        description: "Все ингредиенты есть",
      },
      almostCook: {
        title: "Почти готово",
        description: "Не хватает 1-2 ингредиентов",
      },
      needToBuy: {
        title: "Нужны покупки",
        description: "Не хватает больше ингредиентов",
      },
    },
    
    empty: {
      title: "Твой холодильник пуст",
      description: "Добавь продукты в холодильник, чтобы увидеть что можно приготовить",
      action: "Перейти к холодильнику",
    },
    
    actions: {
      cookNow: "Готовить сейчас",
      viewRecipe: "Смотреть рецепт",
      addToCart: "Добавить недостающее",
    },
  },

  messages: {
    createSuccess: "Рецепт создан",
    createError: "Ошибка создания рецепта",
    updateSuccess: "Рецепт обновлён",
    updateError: "Ошибка обновления рецепта",
    deleteSuccess: "Рецепт удалён",
    deleteError: "Ошибка удаления рецепта",
    saveSuccess: "Рецепт сохранён",
    saveError: "Ошибка сохранения рецепта",
    reviewSuccess: "Отзыв добавлен",
    reviewError: "Ошибка добавления отзыва",
  },
} as const;
