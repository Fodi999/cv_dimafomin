import { useLanguage, type Locale } from "@/contexts/LanguageContext";

// Простий словник перекладів
const translations = {
  pl: {
    // Settings
    "settings.title": "Ustawienia",
    "settings.subtitle": "Proste ustawienia. Inteligentne działanie.",
    "settings.core.title": "Podstawowe ustawienia",
    "settings.core.subtitle": "Język, czas i jednostki miary",
    "settings.language": "Język interfejsu",
    "settings.timeFormat": "Format czasu",
    "settings.timeFormat.12h": "12-godzinny (3:30 PM)",
    "settings.timeFormat.24h": "24-godzinny (15:30)",
    "settings.units": "Jednostki miary",
    "settings.units.metric": "Metryczne (g, ml, °C)",
    "settings.units.imperial": "Kuchenne (łyżki, szklanki)",
    "settings.aiStyle": "Styl AI Mentora",
    "settings.ai.title": "AI & Mentor",
    "settings.ai.subtitle": "Dostosuj sposób komunikacji z asystentem AI",
    "settings.notifications.title": "Powiadomienia",
    "settings.notifications.subtitle": "Tylko ważne przypomnienia",
    "settings.notifications.important": "Ważne przypomnienia",
    "settings.notifications.desc": "Produkty psujące się + dzisiejszy plan",
    
    // Common
    "common.save": "Zapisz",
    "common.cancel": "Anuluj",
    "common.back": "Назад",
    "common.loading": "Ładowanie...",
    
    // Auth Modal
    "auth.login.title": "Zaloguj się",
    "auth.login.subtitle": "Zaloguj się do swojego konta",
    "auth.register.title": "Zarejestruj się",
    "auth.register.subtitle": "Stwórz nowe konto",
    "auth.loginTab": "Logowanie",
    "auth.registerTab": "Rejestracja",
    "auth.email": "Email",
    "auth.password": "Hasło",
    "auth.confirmPassword": "Potwierdź hasło",
    "auth.name": "Imię i nazwisko",
    "auth.loginButton": "Zaloguj się",
    "auth.registerButton": "Zarejestruj się",
    "auth.rememberMe": "Zapamiętaj mnie",
    "auth.forgotPassword": "Zapomniałeś hasła?",
    "auth.loading": "Ładowanie...",
    
    // AI Styles
    "ai.style.calm": "Spokojny",
    "ai.style.calm.desc": "Przyjazny ton, bez presji",
    "ai.style.professional": "Profesjonalny",
    "ai.style.professional.desc": "Klarownie i rzeczowo",
    "ai.style.demanding": "Wymagający",
    "ai.style.demanding.desc": "Jak szef kuchni — wysoko poprzeczka",
    
    // AI Actions (Decision Engine)
    "ai.actions.title": "Co chcesz zrobić?",
    "ai.actions.subtitle": "Wybierz scenariusz — Rules Engine podejmie decyzję na podstawie Twojej lodówki",
    "ai.actions.cook_now.label": "Co mogę ugotować TERAZ?",
    "ai.actions.cook_now.desc": "Pokazuję przepisy z Twojej lodówki — zero zakupów",
    "ai.actions.expiring_soon.label": "Co się zmarnuje w ciągu 24h?",
    "ai.actions.expiring_soon.desc": "Pilne przepisy dla produktów o krótkim terminie",
    "ai.actions.save_money.label": "Jak zaoszczędzić dziś pieniądze?",
    "ai.actions.save_money.desc": "Gotuj z tego, co masz — uniknij dodatkowych wydatków",
    "ai.actions.quick_meal.label": "Co ugotować w 30 minut?",
    "ai.actions.quick_meal.desc": "Szybkie dania bez skomplikowanych kroków",
  },
  en: {
    // Settings
    "settings.title": "Settings",
    "settings.subtitle": "Simple settings. Smart actions.",
    "settings.core.title": "Core Settings",
    "settings.core.subtitle": "Language, time and units",
    "settings.language": "Interface language",
    "settings.timeFormat": "Time format",
    "settings.timeFormat.12h": "12-hour (3:30 PM)",
    "settings.timeFormat.24h": "24-hour (15:30)",
    "settings.units": "Units of measurement",
    "settings.units.metric": "Metric (g, ml, °C)",
    "settings.units.imperial": "Kitchen (spoons, cups)",
    "settings.aiStyle": "AI Mentor style",
    "settings.ai.title": "AI & Mentor",
    "settings.ai.subtitle": "Customize AI assistant communication",
    "settings.notifications.title": "Notifications",
    "settings.notifications.subtitle": "Only important reminders",
    "settings.notifications.important": "Important reminders",
    "settings.notifications.desc": "Expiring products + today's plan",
    
    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.back": "Back",
    "common.loading": "Loading...",
    
    // Auth Modal
    "auth.login.title": "Log in",
    "auth.login.subtitle": "Log in to your account",
    "auth.register.title": "Sign up",
    "auth.register.subtitle": "Create a new account",
    "auth.loginTab": "Login",
    "auth.registerTab": "Registration",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.confirmPassword": "Confirm password",
    "auth.name": "Full name",
    "auth.loginButton": "Log in",
    "auth.registerButton": "Sign up",
    "auth.rememberMe": "Remember me",
    "auth.forgotPassword": "Forgot password?",
    "auth.loading": "Loading...",
    
    // AI Styles
    "ai.style.calm": "Calm",
    "ai.style.calm.desc": "Friendly tone, no pressure",
    "ai.style.professional": "Professional",
    "ai.style.professional.desc": "Clear and concise",
    "ai.style.demanding": "Demanding",
    "ai.style.demanding.desc": "Like a head chef — high standards",
    
    // AI Actions (Decision Engine)
    "ai.actions.title": "What do you want to do?",
    "ai.actions.subtitle": "Choose a scenario — Rules Engine will decide based on your fridge",
    "ai.actions.cook_now.label": "What can I cook NOW?",
    "ai.actions.cook_now.desc": "Recipes from your fridge — zero shopping",
    "ai.actions.expiring_soon.label": "What will spoil in 24h?",
    "ai.actions.expiring_soon.desc": "Urgent recipes for short-shelf products",
    "ai.actions.save_money.label": "How to save money today?",
    "ai.actions.save_money.desc": "Cook with what you have — avoid extra spending",
    "ai.actions.quick_meal.label": "What to cook in 30 minutes?",
    "ai.actions.quick_meal.desc": "Quick meals without complicated steps",
  },
  ru: {
    // Settings
    "settings.title": "Настройки",
    "settings.subtitle": "Простые настройки. Умные действия.",
    "settings.core.title": "Основные настройки",
    "settings.core.subtitle": "Язык, время и единицы измерения",
    "settings.language": "Язык интерфейса",
    "settings.timeFormat": "Формат времени",
    "settings.timeFormat.12h": "12-часовой (3:30 PM)",
    "settings.timeFormat.24h": "24-часовой (15:30)",
    "settings.units": "Единицы измерения",
    "settings.units.metric": "Метрические (г, мл, °C)",
    "settings.units.imperial": "Кухонные (ложки, стаканы)",
    "settings.aiStyle": "Стиль AI ментора",
    "settings.ai.title": "AI и Ментор",
    "settings.ai.subtitle": "Настройте общение с AI ассистентом",
    "settings.notifications.title": "Уведомления",
    "settings.notifications.subtitle": "Только важные напоминания",
    "settings.notifications.important": "Важные напоминания",
    "settings.notifications.desc": "Портящиеся продукты + план на сегодня",
    
    // Common
    "common.save": "Сохранить",
    "common.cancel": "Отмена",
    "common.back": "Назад",
    "common.loading": "Загрузка...",
    
    // Auth Modal
    "auth.login.title": "Войти",
    "auth.login.subtitle": "Войдите в свой аккаунт",
    "auth.register.title": "Регистрация",
    "auth.register.subtitle": "Создайте новый аккаунт",
    "auth.loginTab": "Вход",
    "auth.registerTab": "Регистрация",
    "auth.email": "Email",
    "auth.password": "Пароль",
    "auth.confirmPassword": "Подтвердите пароль",
    "auth.name": "Полное имя",
    "auth.loginButton": "Войти",
    "auth.registerButton": "Зарегистрироваться",
    "auth.rememberMe": "Запомнить меня",
    "auth.forgotPassword": "Забыли пароль?",
    "auth.loading": "Загрузка...",
    
    // AI Styles
    "ai.style.calm": "Спокойный",
    "ai.style.calm.desc": "Дружелюбный тон, без давления",
    "ai.style.professional": "Профессиональный",
    "ai.style.professional.desc": "Четко и по делу",
    "ai.style.demanding": "Требовательный",
    "ai.style.demanding.desc": "Как шеф-повар — высокие стандарты",
    
    // AI Actions (Decision Engine)
    "ai.actions.title": "Что ты хочешь сделать?",
    "ai.actions.subtitle": "Выбери сценарий — Rules Engine примет решение на основе твоего холодильника",
    "ai.actions.cook_now.label": "Что я могу приготовить СЕЙЧАС?",
    "ai.actions.cook_now.desc": "Рецепты из твоего холодильника — никаких покупок",
    "ai.actions.expiring_soon.label": "Что испортится через 24ч?",
    "ai.actions.expiring_soon.desc": "Срочные рецепты для продуктов с коротким сроком",
    "ai.actions.save_money.label": "Как сэкономить сегодня?",
    "ai.actions.save_money.desc": "Готовь из того что есть — избегай лишних трат",
    "ai.actions.quick_meal.label": "Что приготовить за 30 минут?",
    "ai.actions.quick_meal.desc": "Быстрые блюда без сложных шагов",
  },
};

type TranslationKey = keyof typeof translations.pl;

export function useTranslations() {
  const { language } = useLanguage();

  function t(key: TranslationKey): string {
    return translations[language]?.[key] || translations.pl[key] || key;
  }

  return { t, language };
}
