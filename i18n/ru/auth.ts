/**
 * Authentication translations (RU)
 */

export const auth = {
  // Top-level keys for tabs and common elements
  loginButton: "Войти",
  loginTab: "Вход",
  registerTab: "Регистрация",
  email: "Email",
  password: "Пароль",
  name: "Имя",
  confirmPassword: "Подтвердите пароль",
  rememberMe: "Запомнить меня",
  forgotPassword: "Забыли пароль?",
  noAccount: "Нет аккаунта?",
  registerNow: "Зарегистрируйтесь",
  haveAccount: "Уже есть аккаунт?",
  loginNow: "Войдите",
  loading: "Загрузка...",

  login: {
    title: "Войти",
    subtitle: "Введите свои данные для входа",
    email: "Email",
    emailPlaceholder: "ваш@email.com",
    password: "Пароль",
    passwordPlaceholder: "Введите пароль",
    rememberMe: "Запомнить меня",
    forgotPassword: "Забыли пароль?",
    submit: "Войти",
    noAccount: "Нет аккаунта?",
    signUp: "Зарегистрироваться",
    or: "или",
    continueWithGoogle: "Продолжить с Google",
    continueWithGithub: "Продолжить с GitHub",
  },

  register: {
    title: "Регистрация",
    subtitle: "Создайте новый аккаунт",
    name: "Имя",
    namePlaceholder: "Ваше имя",
    email: "Email",
    emailPlaceholder: "ваш@email.com",
    password: "Пароль",
    passwordPlaceholder: "Минимум 8 символов",
    confirmPassword: "Подтвердите пароль",
    confirmPasswordPlaceholder: "Повторите пароль",
    agreeToTerms: "Я согласен с ",
    termsOfService: "Условиями использования",
    and: " и ",
    privacyPolicy: "Политикой конфиденциальности",
    submit: "Зарегистрироваться",
    haveAccount: "Уже есть аккаунт?",
    signIn: "Войти",
  },

  resetPassword: {
    title: "Сброс пароля",
    subtitle: "Введите email для получения ссылки на сброс пароля",
    email: "Email",
    emailPlaceholder: "ваш@email.com",
    submit: "Отправить ссылку",
    backToLogin: "Вернуться ко входу",
    emailSent: "Email отправлен!",
    checkInbox: "Проверьте почту для сброса пароля",
  },

  newPassword: {
    title: "Новый пароль",
    subtitle: "Введите новый пароль для вашего аккаунта",
    password: "Новый пароль",
    passwordPlaceholder: "Минимум 8 символов",
    confirmPassword: "Подтвердите пароль",
    confirmPasswordPlaceholder: "Повторите пароль",
    submit: "Изменить пароль",
    passwordChanged: "Пароль изменён!",
    canLoginNow: "Теперь вы можете войти в свой аккаунт",
  },

  validation: {
    emailRequired: "Email обязателен",
    emailInvalid: "Неверный формат email",
    passwordRequired: "Пароль обязателен",
    passwordTooShort: "Пароль должен содержать минимум 8 символов",
    passwordsDoNotMatch: "Пароли не совпадают",
    nameRequired: "Имя обязательно",
    nameTooShort: "Имя должно содержать минимум 2 символа",
    termsRequired: "Необходимо принять условия использования",
  },

  messages: {
    loginSuccess: "Вход выполнен успешно!",
    loginError: "Ошибка входа. Проверьте данные.",
    registerSuccess: "Аккаунт создан!",
    registerError: "Ошибка регистрации. Попробуйте снова.",
    passwordResetSuccess: "Ссылка на сброс пароля отправлена",
    passwordResetError: "Ошибка отправки email. Попробуйте снова.",
    passwordChangeSuccess: "Пароль изменён",
    passwordChangeError: "Ошибка изменения пароля. Попробуйте снова.",
    sessionExpired: "Сессия истекла. Войдите снова.",
    unauthorized: "Нет доступа. Войдите в систему.",
  },

  oauth: {
    googleLoading: "Вход через Google...",
    githubLoading: "Вход через GitHub...",
    oauthError: "Ошибка авторизации. Попробуйте снова.",
  },

  logout: {
    title: "Выйти",
    confirm: "Вы уверены, что хотите выйти?",
    submit: "Выйти",
    cancel: "Отмена",
    success: "Выход выполнен успешно",
  },
} as const;
