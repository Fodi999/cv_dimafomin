/**
 * Error messages (RU)
 */

export const errors = {
  http: {
    400: "Неверный запрос",
    401: "Не авторизован",
    403: "Доступ запрещён",
    404: "Не найдено",
    405: "Метод не разрешён",
    408: "Время ожидания истекло",
    409: "Конфликт",
    429: "Слишком много запросов",
    500: "Внутренняя ошибка сервера",
    502: "Плохой шлюз",
    503: "Сервис недоступен",
    504: "Время ожидания шлюза истекло",
    unknown: "Неизвестная ошибка",
  },

  network: {
    offline: "Нет подключения к интернету",
    timeout: "Время ожидания запроса истекло",
    connectionError: "Ошибка подключения",
    serverError: "Ошибка сервера. Попробуйте позже.",
    unknownError: "Произошла неожиданная ошибка",
  },

  validation: {
    required: "Это поле обязательно",
    email: "Неверный формат email",
    url: "Неверный формат URL",
    phone: "Неверный номер телефона",
    minLength: "Минимум {min} символов",
    maxLength: "Максимум {max} символов",
    minValue: "Минимальное значение: {min}",
    maxValue: "Максимальное значение: {max}",
    pattern: "Неверный формат",
    passwordStrength: "Пароль должен содержать заглавные, строчные буквы, цифры и спецсимволы",
    passwordMatch: "Пароли не совпадают",
    fileSize: "Файл слишком большой. Максимальный размер: {max}",
    fileType: "Неверный тип файла. Разрешены: {types}",
    dateInvalid: "Неверная дата",
    dateInPast: "Дата должна быть в прошлом",
    dateInFuture: "Дата должна быть в будущем",
    numberInvalid: "Неверное число",
    integerRequired: "Требуется целое число",
    positiveNumber: "Число должно быть положительным",
  },

  auth: {
    invalidCredentials: "Неверный email или пароль",
    emailExists: "Этот email уже зарегистрирован",
    emailNotFound: "Аккаунт с этим email не найден",
    passwordIncorrect: "Неверный пароль",
    tokenExpired: "Токен истёк. Войдите снова.",
    tokenInvalid: "Неверный токен",
    sessionExpired: "Сессия истекла. Войдите снова.",
    unauthorized: "Нет доступа. Войдите в систему.",
    accountDisabled: "Аккаунт отключён",
    accountDeleted: "Аккаунт удалён",
    tooManyAttempts: "Слишком много попыток входа. Попробуйте позже.",
    oauthError: "Ошибка авторизации через {provider}",
    registrationDisabled: "Регистрация временно отключена",
  },

  recipe: {
    notFound: "Рецепт не найден",
    alreadyExists: "Рецепт с таким названием уже существует",
    insufficientPermissions: "Недостаточно прав для редактирования этого рецепта",
    cannotDelete: "Невозможно удалить этот рецепт",
    invalidData: "Неверные данные рецепта",
    missingIngredients: "Отсутствуют ингредиенты",
    missingInstructions: "Отсутствуют инструкции",
    imageUploadFailed: "Ошибка загрузки изображения",
    videoLinkInvalid: "Неверная ссылка на видео",
  },

  user: {
    notFound: "Пользователь не найден",
    updateFailed: "Ошибка обновления профиля",
    avatarUploadFailed: "Ошибка загрузки аватара",
    invalidHealthData: "Неверные данные о здоровье",
    cannotDeleteAccount: "Невозможно удалить аккаунт сейчас",
  },

  payment: {
    insufficientFunds: "Недостаточно токенов",
    transactionFailed: "Транзакция не удалась",
    invalidAmount: "Неверная сумма",
    paymentMethodInvalid: "Неверный способ оплаты",
    cardDeclined: "Карта отклонена",
    expiredCard: "Карта истекла",
  },

  ai: {
    requestFailed: "Ошибка запроса к AI",
    quotaExceeded: "Превышен лимит запросов к AI",
    invalidPrompt: "Неверный промпт",
    generationFailed: "Ошибка генерации ответа",
    timeout: "Время ожидания ответа AI истекло",
    serviceUnavailable: "Сервис AI временно недоступен",
  },

  file: {
    uploadFailed: "Ошибка загрузки файла",
    downloadFailed: "Ошибка скачивания файла",
    deleteFailed: "Ошибка удаления файла",
    tooLarge: "Файл слишком большой. Максимальный размер: {max}",
    invalidType: "Неверный тип файла. Разрешены: {types}",
    corruptedFile: "Файл поврежден",
    notFound: "Файл не найден",
  },

  form: {
    invalidData: "Неверные данные формы",
    missingFields: "Заполните все обязательные поля",
    submitFailed: "Ошибка отправки формы",
    validationFailed: "Проверьте ошибки валидации",
  },

  generic: {
    somethingWentWrong: "Что-то пошло не так",
    tryAgain: "Попробуйте снова",
    contactSupport: "Если проблема сохраняется, обратитесь в поддержку",
    refreshPage: "Обновите страницу",
    checkConnection: "Проверьте подключение к интернету",
  },

  actions: {
    cannotSave: "Невозможно сохранить изменения",
    cannotDelete: "Невозможно удалить элемент",
    cannotUpdate: "Невозможно обновить элемент",
    cannotCreate: "Невозможно создать элемент",
    cannotLoad: "Невозможно загрузить данные",
    operationFailed: "Операция не удалась",
  },
} as const;
