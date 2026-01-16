/**
 * Common UI translations (RU)
 * Общие элементы интерфейса
 */

export const common = {
  // Actions
  save: "Сохранить",
  cancel: "Отмена",
  delete: "Удалить",
  edit: "Редактировать",
  create: "Создать",
  update: "Обновить",
  close: "Закрыть",
  back: "Назад",
  next: "Далее",
  previous: "Предыдущий",
  submit: "Отправить",
  confirm: "Подтвердить",
  apply: "Применить",
  reset: "Сбросить",
  clear: "Очистить",
  filter: "Фильтр",
  search: "Поиск",
  sort: "Сортировка",
  view: "Просмотр",
  select: "Выбрать",
  viewAll: "Посмотреть все",
  viewMore: "Посмотреть ещё",
  learnMore: "Узнать больше",
  getStarted: "Начать",
  download: "Скачать",
  upload: "Загрузить",
  share: "Поделиться",
  copy: "Копировать",
  paste: "Вставить",
  cut: "Вырезать",
  undo: "Отменить",
  redo: "Повторить",
  refresh: "Обновить",
  reload: "Перезагрузить",
  
  // Status
  loading: "Загрузка...",
  saving: "Сохранение...",
  processing: "Обработка...",
  success: "Успешно",
  error: "Ошибка",
  warning: "Предупреждение",
  info: "Информация",
  pending: "Ожидание",
  completed: "Завершено",
  failed: "Не удалось",
  active: "Активно",
  inactive: "Неактивно",
  enabled: "Включено",
  disabled: "Отключено",
  online: "Онлайн",
  offline: "Оффлайн",
  
  // Common phrases
  yes: "Да",
  no: "Нет",
  ok: "ОК",
  or: "или",
  and: "и",
  of: "из",
  in: "в",
  at: "в",
  to: "к",
  from: "от",
  with: "с",
  by: "от",
  for: "для",
  
  // Time
  now: "Сейчас",
  today: "Сегодня",
  yesterday: "Вчера",
  tomorrow: "Завтра",
  week: "Неделя",
  month: "Месяц",
  year: "Год",
  minute: "Минута",
  hour: "Час",
  day: "День",
  
  // General
  all: "Все",
  none: "Нет",
  other: "Другое",
  more: "Больше",
  less: "Меньше",
  show: "Показать",
  hide: "Скрыть",
  required: "Обязательно",
  optional: "Опционально",
  default: "По умолчанию",
  custom: "Пользовательское",
  
  // Pagination
  page: "Страница",
  perPage: "На странице",
  total: "Всего",
  showing: "Показано",
  results: "результатов",
  noResults: "Результатов не найдено",
  loadMore: "Загрузить ещё",
  
  // Notifications
  notificationTitle: "Уведомление",
  successMessage: "Операция выполнена успешно",
  errorMessage: "Произошла ошибка",
  warningMessage: "Предупреждение",
  infoMessage: "Информация",
  
  // Development Modal
  devModal: {
    title: "Сайт в разработке",
    message: "Скоро открытие!",
    follow: "Следите за обновлениями",
  },
  
  // Notifications
  notifications: {
    title: "Уведомления",
    markAllRead: "Отметить все как прочитанные",
    viewAll: "Посмотреть все уведомления",
    empty: "Нет уведомлений",
    unread: "Непрочитано",
    
    // Types
    types: {
      ai: "ИИ",
      fridge: "Холодильник",
      order: "Заказ",
      system: "Система",
      error: "Ошибка",
    },
    
    // Time format
    time: {
      justNow: "Только что",
      minutesAgo: "{{count}} мин назад",
      hoursAgo: "{{count}} ч назад",
      daysAgo: "{{count}} дн назад",
    },
    
    // Fridge notifications
    fridge: {
      itemAdded: "Продукт добавлен",
      itemDeleted: "Продукт убран",
      itemExpiring: "Скоро истечёт",
      itemExpired: "Срок годности истёк",
      daysLeft: "{{count}} дней осталось",
      priceAtRisk: "{{price}} PLN под угрозой",
    },
  },
} as const;
