/**
 * Admin translations (RU)
 */

export const admin = {
  dashboard: {
    title: "Панель администратора",
    subtitle: "Управление платформой",
    overview: "Обзор",
    analytics: "Аналитика",
    
    stats: {
      totalUsers: "Всего пользователей",
      activeUsers: "Активных пользователей",
      totalRecipes: "Всего рецептов",
      totalCourses: "Всего курсов",
      tokensInCirculation: "Токенов в обращении",
      revenue: "Доход",
    },
    
    quickActions: {
      title: "Быстрые действия",
      createUser: "Добавить пользователя",
      createRecipe: "Добавить рецепт",
      createCourse: "Добавить курс",
      sendNotification: "Отправить уведомление",
      viewReports: "Посмотреть отчёты",
    },
  },

  users: {
    title: "Пользователи",
    subtitle: "Управление аккаунтами пользователей",
    search: "Поиск пользователей...",
    filter: "Фильтр",
    sort: "Сортировка",
    
    table: {
      id: "ID",
      name: "Имя",
      email: "Email",
      role: "Роль",
      status: "Статус",
      registered: "Зарегистрирован",
      lastActive: "Последняя активность",
      actions: "Действия",
    },
    
    roles: {
      admin: "Администратор",
      moderator: "Модератор",
      chef: "Шеф-повар",
      user: "Пользователь",
      guest: "Гость",
    },
    
    status: {
      active: "Активен",
      inactive: "Неактивен",
      suspended: "Приостановлен",
      banned: "Заблокирован",
    },
    
    actions: {
      view: "Посмотреть",
      edit: "Редактировать",
      suspend: "Приостановить",
      ban: "Заблокировать",
      delete: "Удалить",
      sendEmail: "Отправить email",
      resetPassword: "Сбросить пароль",
      viewActivity: "Посмотреть активность",
    },
  },

  recipes: {
    title: "Рецепты",
    subtitle: "Управление рецептами",
    pending: "Ожидают",
    approved: "Одобрены",
    rejected: "Отклонены",
    reported: "Жалобы",
    
    actions: {
      approve: "Одобрить",
      reject: "Отклонить",
      feature: "Выделить",
      unfeature: "Убрать выделение",
      delete: "Удалить",
      viewReports: "Посмотреть жалобы",
    },
  },

  courses: {
    title: "Курсы",
    subtitle: "Управление курсами",
    draft: "Черновики",
    published: "Опубликованы",
    archived: "Архивированы",
    
    actions: {
      publish: "Опубликовать",
      unpublish: "Снять с публикации",
      archive: "Архивировать",
      delete: "Удалить",
      edit: "Редактировать",
      viewStudents: "Посмотреть студентов",
    },
  },

  moderation: {
    title: "Модерация",
    subtitle: "Проверка жалоб на контент",
    reports: "Жалобы",
    pending: "Ожидают",
    resolved: "Решены",
    
    reportTypes: {
      spam: "Спам",
      inappropriate: "Неподходящий контент",
      copyright: "Нарушение авторских прав",
      misinformation: "Дезинформация",
      other: "Другое",
    },
    
    actions: {
      review: "Проверить",
      approve: "Одобрить",
      remove: "Удалить",
      warn: "Предупредить",
      ban: "Заблокировать",
      dismiss: "Отклонить жалобу",
    },
  },

  analytics: {
    title: "Аналитика",
    subtitle: "Статистика и отчёты",
    
    metrics: {
      pageViews: "Просмотры страниц",
      uniqueVisitors: "Уникальные посетители",
      bounceRate: "Показатель отказов",
      avgSessionDuration: "Средняя длительность сессии",
      conversion: "Конверсия",
      retention: "Удержание",
    },
    
    charts: {
      userGrowth: "Рост пользователей",
      recipeCreation: "Создание рецептов",
      courseCompletion: "Завершение курсов",
      tokenUsage: "Использование токенов",
      revenue: "Доход",
    },
    
    periods: {
      today: "Сегодня",
      week: "Эта неделя",
      month: "Этот месяц",
      year: "Этот год",
      custom: "Свой период",
    },
  },

  settings: {
    title: "Системные настройки",
    subtitle: "Настройка платформы",
    
    general: {
      title: "Общие",
      siteName: "Название сайта",
      siteDescription: "Описание сайта",
      language: "Язык по умолчанию",
      timezone: "Часовой пояс",
      maintenance: "Режим обслуживания",
    },
    
    features: {
      title: "Функции",
      registration: "Регистрация",
      comments: "Комментарии",
      reviews: "Отзывы",
      aiMentor: "AI-Ментор",
      tokens: "ChefTokens",
    },
    
    limits: {
      title: "Лимиты",
      maxRecipesPerUser: "Макс. рецептов на пользователя",
      maxFileSize: "Макс. размер файла",
      maxAIRequests: "Макс. запросов к AI в день",
      rateLimit: "Лимит запросов",
    },
    
    notifications: {
      title: "Уведомления",
      emailNotifications: "Email уведомления",
      pushNotifications: "Push уведомления",
      adminAlerts: "Алерты администратора",
    },
  },

  messages: {
    userUpdated: "Пользователь обновлён",
    userDeleted: "Пользователь удалён",
    recipeApproved: "Рецепт одобрен",
    recipeRejected: "Рецепт отклонён",
    coursePublished: "Курс опубликован",
    reportResolved: "Жалоба решена",
    settingsSaved: "Настройки сохранены",
    actionFailed: "Действие не удалось",
    confirmAction: "Вы уверены, что хотите выполнить это действие?",
  },
} as const;
