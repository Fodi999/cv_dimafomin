/**
 * Error messages (EN)
 * Сообщения об ошибках, валидация
 */

export const errors = {
  // HTTP Errors
  http: {
    400: "Bad request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not found",
    405: "Method not allowed",
    408: "Request timeout",
    409: "Conflict",
    429: "Too many requests",
    500: "Internal server error",
    502: "Bad gateway",
    503: "Service unavailable",
    504: "Gateway timeout",
    unknown: "Unknown error",
  },

  // Network Errors
  network: {
    offline: "No internet connection",
    timeout: "Request timeout",
    connectionError: "Connection error",
    serverError: "Server error. Please try again later.",
    unknownError: "An unexpected error occurred",
  },

  // Validation Errors
  validation: {
    required: "This field is required",
    email: "Invalid email format",
    url: "Invalid URL format",
    phone: "Invalid phone number",
    minLength: "Minimum {min} characters",
    maxLength: "Maximum {max} characters",
    minValue: "Minimum value: {min}",
    maxValue: "Maximum value: {max}",
    pattern: "Invalid format",
    passwordStrength: "Password must contain uppercase, lowercase, numbers and special characters",
    passwordMatch: "Passwords don't match",
    fileSize: "File is too large. Maximum size: {max}",
    fileType: "Invalid file type. Allowed: {types}",
    dateInvalid: "Invalid date",
    dateInPast: "Date must be in the past",
    dateInFuture: "Date must be in the future",
    numberInvalid: "Invalid number",
    integerRequired: "Integer required",
    positiveNumber: "Number must be positive",
  },

  // Auth Errors
  auth: {
    invalidCredentials: "Invalid email or password",
    emailExists: "This email is already registered",
    emailNotFound: "No account found with this email",
    passwordIncorrect: "Incorrect password",
    tokenExpired: "Token expired. Please log in again.",
    tokenInvalid: "Invalid token",
    sessionExpired: "Session expired. Please log in again.",
    unauthorized: "Unauthorized. Please log in.",
    accountDisabled: "Account has been disabled",
    accountDeleted: "Account has been deleted",
    tooManyAttempts: "Too many login attempts. Try again later.",
    oauthError: "Authorization error with {provider}",
    registrationDisabled: "Registration is temporarily disabled",
  },

  // Recipe Errors
  recipe: {
    notFound: "Recipe not found",
    alreadyExists: "A recipe with this name already exists",
    insufficientPermissions: "Insufficient permissions to edit this recipe",
    cannotDelete: "Cannot delete this recipe",
    invalidData: "Invalid recipe data",
    missingIngredients: "Missing ingredients",
    missingInstructions: "Missing instructions",
    imageUploadFailed: "Image upload failed",
    videoLinkInvalid: "Invalid video link",
  },

  // User Errors
  user: {
    notFound: "User not found",
    updateFailed: "Profile update failed",
    avatarUploadFailed: "Avatar upload failed",
    invalidHealthData: "Invalid health data",
    cannotDeleteAccount: "Cannot delete account at this time",
  },

  // Payment Errors
  payment: {
    insufficientFunds: "Insufficient tokens",
    transactionFailed: "Transaction failed",
    invalidAmount: "Invalid amount",
    paymentMethodInvalid: "Invalid payment method",
    cardDeclined: "Card declined",
    expiredCard: "Card expired",
  },

  // AI Errors
  ai: {
    requestFailed: "AI request failed",
    quotaExceeded: "AI request quota exceeded",
    invalidPrompt: "Invalid prompt",
    generationFailed: "Response generation failed",
    timeout: "AI response timeout",
    serviceUnavailable: "AI service is temporarily unavailable",
  },

  // File Errors
  file: {
    uploadFailed: "File upload failed",
    downloadFailed: "File download failed",
    deleteFailed: "File deletion failed",
    tooLarge: "File is too large. Maximum size: {max}",
    invalidType: "Invalid file type. Allowed: {types}",
    corruptedFile: "File is corrupted",
    notFound: "File not found",
  },

  // Form Errors
  form: {
    invalidData: "Invalid form data",
    missingFields: "Fill in all required fields",
    submitFailed: "Form submission failed",
    validationFailed: "Check validation errors",
  },

  // Generic Messages
  generic: {
    somethingWentWrong: "Something went wrong",
    tryAgain: "Try again",
    contactSupport: "If the problem persists, contact support",
    refreshPage: "Refresh the page",
    checkConnection: "Check your internet connection",
  },

  // Action Errors
  actions: {
    cannotSave: "Cannot save changes",
    cannotDelete: "Cannot delete item",
    cannotUpdate: "Cannot update item",
    cannotCreate: "Cannot create item",
    cannotLoad: "Cannot load data",
    operationFailed: "Operation failed",
  },
} as const;
