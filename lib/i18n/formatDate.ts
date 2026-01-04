/**
 * Date formatting utilities with i18n support
 */

/**
 * Get locale code for date formatting
 */
export function getDateLocale(language: string): string {
  switch (language) {
    case 'ru':
      return 'ru-RU';
    case 'en':
      return 'en-US';
    case 'pl':
    default:
      return 'pl-PL';
  }
}

/**
 * Format date with localization
 * @param date - Date to format
 * @param language - Current language (ru, en, pl)
 * @param options - Intl.DateTimeFormatOptions
 */
export function formatLocalizedDate(
  date: Date,
  language: string,
  options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }
): string {
  const locale = getDateLocale(language);
  return date.toLocaleDateString(locale, options);
}
