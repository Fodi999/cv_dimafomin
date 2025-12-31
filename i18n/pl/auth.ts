/**
 * Authentication translations (PL)
 * Авторизация, регистрация, восстановление пароля
 */

export const auth = {
  // Top-level keys for tabs and common elements
  loginTab: "Logowanie",
  registerTab: "Rejestracja",
  email: "Email",
  password: "Hasło",
  name: "Imię",
  confirmPassword: "Potwierdź hasło",
  rememberMe: "Zapamiętaj mnie",
  forgotPassword: "Zapomniałeś hasła?",
  noAccount: "Nie masz konta?",
  registerNow: "Zarejestruj się",
  haveAccount: "Masz już konto?",
  loginNow: "Zaloguj się",
  loading: "Ładowanie...",

  // Login
  login: {
    title: "Zaloguj się",
    subtitle: "Wpisz swoje dane, aby się zalogować",
    email: "Email",
    emailPlaceholder: "twoj@email.com",
    password: "Hasło",
    passwordPlaceholder: "Wpisz hasło",
    rememberMe: "Zapamiętaj mnie",
    forgotPassword: "Zapomniałeś hasła?",
    submit: "Zaloguj się",
    noAccount: "Nie masz konta?",
    signUp: "Zarejestruj się",
    or: "lub",
    continueWithGoogle: "Kontynuuj z Google",
    continueWithGithub: "Kontynuuj z GitHub",
  },

  // Register
  register: {
    title: "Zarejestruj się",
    subtitle: "Stwórz nowe konto",
    name: "Imię",
    namePlaceholder: "Twoje imię",
    email: "Email",
    emailPlaceholder: "twoj@email.com",
    password: "Hasło",
    passwordPlaceholder: "Minimum 8 znaków",
    confirmPassword: "Potwierdź hasło",
    confirmPasswordPlaceholder: "Powtórz hasło",
    agreeToTerms: "Zgadzam się z ",
    termsOfService: "Warunkami Użytkowania",
    and: " i ",
    privacyPolicy: "Polityką Prywatności",
    submit: "Zarejestruj się",
    haveAccount: "Masz już konto?",
    signIn: "Zaloguj się",
  },

  // Password Reset
  resetPassword: {
    title: "Zresetuj hasło",
    subtitle: "Wpisz swój email, aby otrzymać link do resetowania hasła",
    email: "Email",
    emailPlaceholder: "twoj@email.com",
    submit: "Wyślij link",
    backToLogin: "Powrót do logowania",
    emailSent: "Email został wysłany!",
    checkInbox: "Sprawdź swoją skrzynkę pocztową, aby zresetować hasło",
  },

  // New Password
  newPassword: {
    title: "Nowe hasło",
    subtitle: "Wpisz nowe hasło dla swojego konta",
    password: "Nowe hasło",
    passwordPlaceholder: "Minimum 8 znaków",
    confirmPassword: "Potwierdź hasło",
    confirmPasswordPlaceholder: "Powtórz hasło",
    submit: "Zmień hasło",
    passwordChanged: "Hasło zostało zmienione!",
    canLoginNow: "Możesz teraz zalogować się do swojego konta",
  },

  // Validation
  validation: {
    emailRequired: "Email jest wymagany",
    emailInvalid: "Nieprawidłowy format email",
    passwordRequired: "Hasło jest wymagane",
    passwordTooShort: "Hasło musi mieć minimum 8 znaków",
    passwordsDoNotMatch: "Hasła nie pasują do siebie",
    nameRequired: "Imię jest wymagane",
    nameTooShort: "Imię musi mieć minimum 2 znaki",
    termsRequired: "Musisz zaakceptować warunki użytkowania",
  },

  // Messages
  messages: {
    loginSuccess: "Zalogowano pomyślnie!",
    loginError: "Błąd logowania. Sprawdź dane.",
    registerSuccess: "Konto zostało utworzone!",
    registerError: "Błąd rejestracji. Spróbuj ponownie.",
    passwordResetSuccess: "Link do resetowania hasła został wysłany",
    passwordResetError: "Błąd wysyłania emaila. Spróbuj ponownie.",
    passwordChangeSuccess: "Hasło zostało zmienione",
    passwordChangeError: "Błąd zmiany hasła. Spróbuj ponownie.",
    sessionExpired: "Sesja wygasła. Zaloguj się ponownie.",
    unauthorized: "Brak dostępu. Zaloguj się.",
  },

  // OAuth
  oauth: {
    googleLoading: "Logowanie przez Google...",
    githubLoading: "Logowanie przez GitHub...",
    oauthError: "Błąd autoryzacji. Spróbuj ponownie.",
  },

  // Logout
  logout: {
    title: "Wyloguj się",
    confirm: "Czy na pewno chcesz się wylogować?",
    submit: "Wyloguj",
    cancel: "Anuluj",
    success: "Wylogowano pomyślnie",
  },
} as const;
