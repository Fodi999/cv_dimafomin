/**
 * Authentication translations (EN)
 * Авторизация, регистрация, восстановление пароля
 */

export const auth = {
  // Login
  login: {
    title: "Log in",
    subtitle: "Enter your credentials to log in",
    email: "Email",
    emailPlaceholder: "your@email.com",
    password: "Password",
    passwordPlaceholder: "Enter password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    submit: "Log in",
    noAccount: "Don't have an account?",
    signUp: "Sign up",
    or: "or",
    continueWithGoogle: "Continue with Google",
    continueWithGithub: "Continue with GitHub",
  },

  // Register
  register: {
    title: "Sign up",
    subtitle: "Create a new account",
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "your@email.com",
    password: "Password",
    passwordPlaceholder: "Minimum 8 characters",
    confirmPassword: "Confirm password",
    confirmPasswordPlaceholder: "Repeat password",
    agreeToTerms: "I agree to the ",
    termsOfService: "Terms of Service",
    and: " and ",
    privacyPolicy: "Privacy Policy",
    submit: "Sign up",
    haveAccount: "Already have an account?",
    signIn: "Log in",
  },

  // Password Reset
  resetPassword: {
    title: "Reset password",
    subtitle: "Enter your email to receive a password reset link",
    email: "Email",
    emailPlaceholder: "your@email.com",
    submit: "Send link",
    backToLogin: "Back to login",
    emailSent: "Email sent!",
    checkInbox: "Check your inbox to reset your password",
  },

  // New Password
  newPassword: {
    title: "New password",
    subtitle: "Enter a new password for your account",
    password: "New password",
    passwordPlaceholder: "Minimum 8 characters",
    confirmPassword: "Confirm password",
    confirmPasswordPlaceholder: "Repeat password",
    submit: "Change password",
    passwordChanged: "Password changed!",
    canLoginNow: "You can now log in to your account",
  },

  // Validation
  validation: {
    emailRequired: "Email is required",
    emailInvalid: "Invalid email format",
    passwordRequired: "Password is required",
    passwordTooShort: "Password must be at least 8 characters",
    passwordsDoNotMatch: "Passwords don't match",
    nameRequired: "Name is required",
    nameTooShort: "Name must be at least 2 characters",
    termsRequired: "You must accept the terms of service",
  },

  // Messages
  messages: {
    loginSuccess: "Logged in successfully!",
    loginError: "Login error. Check your credentials.",
    registerSuccess: "Account created!",
    registerError: "Registration error. Try again.",
    passwordResetSuccess: "Password reset link sent",
    passwordResetError: "Error sending email. Try again.",
    passwordChangeSuccess: "Password changed",
    passwordChangeError: "Error changing password. Try again.",
    sessionExpired: "Session expired. Please log in again.",
    unauthorized: "Unauthorized. Please log in.",
  },

  // OAuth
  oauth: {
    googleLoading: "Logging in with Google...",
    githubLoading: "Logging in with GitHub...",
    oauthError: "Authorization error. Try again.",
  },

  // Logout
  logout: {
    title: "Log out",
    confirm: "Are you sure you want to log out?",
    submit: "Log out",
    cancel: "Cancel",
    success: "Logged out successfully",
  },
} as const;
