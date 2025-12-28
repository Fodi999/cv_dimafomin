/**
 * Error messages (PL)
 * Сообщения об ошибках, валидация
 */

export const errors = {
  // HTTP Errors
  http: {
    400: "Nieprawidłowe żądanie",
    401: "Brak autoryzacji",
    403: "Brak dostępu",
    404: "Nie znaleziono",
    405: "Metoda niedozwolona",
    408: "Przekroczono limit czasu żądania",
    409: "Konflikt",
    429: "Zbyt wiele żądań",
    500: "Błąd serwera",
    502: "Zła brama",
    503: "Usługa niedostępna",
    504: "Przekroczono limit czasu bramy",
    unknown: "Nieznany błąd",
  },

  // Network Errors
  network: {
    offline: "Brak połączenia z internetem",
    timeout: "Przekroczono limit czasu żądania",
    connectionError: "Błąd połączenia",
    serverError: "Błąd serwera. Spróbuj ponownie później.",
    unknownError: "Wystąpił nieoczekiwany błąd",
  },

  // Validation Errors
  validation: {
    required: "To pole jest wymagane",
    email: "Nieprawidłowy format email",
    url: "Nieprawidłowy format URL",
    phone: "Nieprawidłowy numer telefonu",
    minLength: "Minimum {min} znaków",
    maxLength: "Maksimum {max} znaków",
    minValue: "Minimalna wartość: {min}",
    maxValue: "Maksymalna wartość: {max}",
    pattern: "Nieprawidłowy format",
    passwordStrength: "Hasło musi zawierać wielkie litery, małe litery, cyfry i znaki specjalne",
    passwordMatch: "Hasła nie pasują do siebie",
    fileSize: "Plik jest za duży. Maksymalny rozmiar: {max}",
    fileType: "Nieprawidłowy typ pliku. Dozwolone: {types}",
    dateInvalid: "Nieprawidłowa data",
    dateInPast: "Data musi być w przeszłości",
    dateInFuture: "Data musi być w przyszłości",
    numberInvalid: "Nieprawidłowa liczba",
    integerRequired: "Wymagana liczba całkowita",
    positiveNumber: "Liczba musi być dodatnia",
  },

  // Auth Errors
  auth: {
    invalidCredentials: "Nieprawidłowy email lub hasło",
    emailExists: "Ten email jest już zarejestrowany",
    emailNotFound: "Nie znaleziono konta z tym emailem",
    passwordIncorrect: "Nieprawidłowe hasło",
    tokenExpired: "Token wygasł. Zaloguj się ponownie.",
    tokenInvalid: "Nieprawidłowy token",
    sessionExpired: "Sesja wygasła. Zaloguj się ponownie.",
    unauthorized: "Brak dostępu. Zaloguj się.",
    accountDisabled: "Konto zostało wyłączone",
    accountDeleted: "Konto zostało usunięte",
    tooManyAttempts: "Zbyt wiele prób logowania. Spróbuj ponownie później.",
    oauthError: "Błąd autoryzacji przez {provider}",
    registrationDisabled: "Rejestracja jest tymczasowo wyłączona",
  },

  // Recipe Errors
  recipe: {
    notFound: "Nie znaleziono przepisu",
    alreadyExists: "Przepis o tej nazwie już istnieje",
    insufficientPermissions: "Brak uprawnień do edycji tego przepisu",
    cannotDelete: "Nie można usunąć tego przepisu",
    invalidData: "Nieprawidłowe dane przepisu",
    missingIngredients: "Brak składników",
    missingInstructions: "Brak instrukcji",
    imageUploadFailed: "Błąd przesyłania zdjęcia",
    videoLinkInvalid: "Nieprawidłowy link do wideo",
  },

  // User Errors
  user: {
    notFound: "Nie znaleziono użytkownika",
    updateFailed: "Błąd aktualizacji profilu",
    avatarUploadFailed: "Błąd przesyłania zdjęcia profilowego",
    invalidHealthData: "Nieprawidłowe dane zdrowotne",
    cannotDeleteAccount: "Nie można usunąć konta w tej chwili",
  },

  // Payment Errors
  payment: {
    insufficientFunds: "Niewystarczająca ilość tokenów",
    transactionFailed: "Transakcja nie powiodła się",
    invalidAmount: "Nieprawidłowa kwota",
    paymentMethodInvalid: "Nieprawidłowa metoda płatności",
    cardDeclined: "Karta została odrzucona",
    expiredCard: "Karta wygasła",
  },

  // AI Errors
  ai: {
    requestFailed: "Błąd żądania AI",
    quotaExceeded: "Przekroczono limit żądań AI",
    invalidPrompt: "Nieprawidłowe zapytanie",
    generationFailed: "Błąd generowania odpowiedzi",
    timeout: "Przekroczono limit czasu odpowiedzi AI",
    serviceUnavailable: "Usługa AI jest tymczasowo niedostępna",
  },

  // File Errors
  file: {
    uploadFailed: "Błąd przesyłania pliku",
    downloadFailed: "Błąd pobierania pliku",
    deleteFailed: "Błąd usuwania pliku",
    tooLarge: "Plik jest za duży. Maksymalny rozmiar: {max}",
    invalidType: "Nieprawidłowy typ pliku. Dozwolone: {types}",
    corruptedFile: "Plik jest uszkodzony",
    notFound: "Nie znaleziono pliku",
  },

  // Form Errors
  form: {
    invalidData: "Nieprawidłowe dane formularza",
    missingFields: "Wypełnij wszystkie wymagane pola",
    submitFailed: "Błąd wysyłania formularza",
    validationFailed: "Sprawdź błędy walidacji",
  },

  // Generic Messages
  generic: {
    somethingWentWrong: "Coś poszło nie tak",
    tryAgain: "Spróbuj ponownie",
    contactSupport: "Jeśli problem będzie się powtarzał, skontaktuj się z pomocą techniczną",
    refreshPage: "Odśwież stronę",
    checkConnection: "Sprawdź połączenie z internetem",
  },

  // Action Errors
  actions: {
    cannotSave: "Nie można zapisać zmian",
    cannotDelete: "Nie można usunąć elementu",
    cannotUpdate: "Nie można zaktualizować elementu",
    cannotCreate: "Nie można utworzyć elementu",
    cannotLoad: "Nie można załadować danych",
    operationFailed: "Operacja nie powiodła się",
  },
} as const;
