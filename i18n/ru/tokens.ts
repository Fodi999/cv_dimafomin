/**
 * ChefTokens translations (RU)
 */

export const tokens = {
  wallet: {
    title: "Кошелёк ChefTokens",
    balance: "Баланс",
    available: "Доступно",
    locked: "Заблокировано",
    pending: "В ожидании",
    total: "Всего",
    actions: {
      send: "Отправить",
      receive: "Получить",
      exchange: "Обменять",
      history: "История",
    },
  },

  transactions: {
    title: "История транзакций",
    recent: "Последние транзакции",
    all: "Все транзакции",
    sent: "Отправлено",
    received: "Получено",
    pending: "В ожидании",
    completed: "Завершено",
    failed: "Не удалось",
    
    type: {
      earn: "Заработано",
      spend: "Потрачено",
      transfer: "Перевод",
      reward: "Награда",
      purchase: "Покупка",
      refund: "Возврат",
    },
    
    details: {
      transactionId: "ID транзакции",
      date: "Дата",
      amount: "Сумма",
      status: "Статус",
      from: "От",
      to: "Кому",
      description: "Описание",
      fee: "Комиссия",
    },
    
    noTransactions: "Нет транзакций",
    loadMore: "Загрузить ещё",
  },

  earning: {
    title: "Зарабатывайте токены",
    subtitle: "Получайте токены за активность на платформе",
    
    methods: {
      recipe: {
        title: "Создавайте рецепты",
        description: "Получайте токены за каждый опубликованный рецепт",
        reward: "+10 токенов",
      },
      share: {
        title: "Делитесь",
        description: "Получайте токены, когда другие используют ваши рецепты",
        reward: "+5 токенов за использование",
      },
      review: {
        title: "Рецензируйте",
        description: "Пишите ценные отзывы и получайте токены",
        reward: "+2 токена за отзыв",
      },
      course: {
        title: "Завершайте курсы",
        description: "Зарабатывайте токены за завершённые модули курсов",
        reward: "+50 токенов за курс",
      },
      daily: {
        title: "Ежедневный вход",
        description: "Входите каждый день и получайте бонус",
        reward: "+1 токен в день",
      },
      referral: {
        title: "Приглашайте друзей",
        description: "Получите токены за каждого приглашённого пользователя",
        reward: "+100 токенов за приглашение",
      },
    },
  },

  spending: {
    title: "Тратьте токены",
    subtitle: "Используйте токены для продвинутых функций",
    
    options: {
      ai: {
        title: "AI-Ментор",
        description: "Используйте продвинутые функции AI-ментора",
        cost: "1 токен за запрос",
      },
      premium: {
        title: "Премиум рецепты",
        description: "Разблокируйте эксклюзивные рецепты",
        cost: "10-50 токенов",
      },
      courses: {
        title: "Премиум курсы",
        description: "Доступ к продвинутым курсам",
        cost: "100-500 токенов",
      },
      consultations: {
        title: "Консультации",
        description: "Запишитесь на индивидуальную консультацию",
        cost: "200 токенов за час",
      },
      features: {
        title: "Дополнительные функции",
        description: "Разблокируйте новые возможности платформы",
        cost: "Различные цены",
      },
    },
  },

  exchange: {
    title: "Обменять токены",
    subtitle: "Обменивайте токены на награды",
    
    from: "От",
    to: "К",
    amount: "Количество",
    amountPlaceholder: "Введите количество",
    rate: "Курс обмена",
    fee: "Комиссия",
    youGet: "Вы получите",
    exchange: "Обменять",
    cancel: "Отмена",
    
    rewards: {
      title: "Доступные награды",
      discount: {
        title: "Скидка 10%",
        description: "Скидка на премиум курсы",
        cost: "50 токенов",
      },
      recipe: {
        title: "Эксклюзивный рецепт",
        description: "Доступ к премиум рецепту",
        cost: "100 токенов",
      },
      consultation: {
        title: "Консультация",
        description: "1 час с экспертом",
        cost: "500 токенов",
      },
      merchandise: {
        title: "Мерч",
        description: "Мерч бренда Fodi",
        cost: "1000 токенов",
      },
    },
  },

  treasury: {
    title: "Token Treasury",
    subtitle: "Банк ChefTokens",
    totalSupply: "Общее предложение",
    inCirculation: "В обращении",
    locked: "Заблокировано",
    burned: "Сожжено",
    updated: "Обновлено",
    loading: "Загрузка казначейства...",
    error: "Ошибка загрузки данных казначейства",
    description: "ChefTokens — это внутренняя валюта платформы, которая помогает принимать осознанные решения: планируйте запросы к AI, открывайте рецепты и учитесь использовать знания без излишков и хаоса.",
  },

  messages: {
    sendSuccess: "Токены отправлены",
    sendError: "Ошибка отправки токенов",
    receiveSuccess: "Токены получены",
    exchangeSuccess: "Обмен выполнен успешно",
    exchangeError: "Ошибка обмена",
    insufficientBalance: "Недостаточно средств",
    transactionPending: "Транзакция в процессе...",
    transactionFailed: "Транзакция не удалась",
  },
} as const;
