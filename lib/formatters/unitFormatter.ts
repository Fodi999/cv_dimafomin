/**
 * Форматирование единиц измерения для лучшей читаемости
 * 
 * Примеры:
 * - 12200 g → 12.2 kg
 * - 1500 ml → 1.5 l
 * - 250 g → 250 g
 * - 5 pcs → 5 шт
 */

export interface FormattedUnit {
  value: string;      // "12.2" или "1 500"
  unit: string;       // "kg" или "г"
  raw: number;        // 12200
  rawUnit: string;    // "g"
}

/**
 * Форматирует количество с автоматическим выбором подходящей единицы
 */
export function formatQuantity(quantity: number, unit: string, language: string = 'ru'): FormattedUnit {
  const raw = quantity;
  const rawUnit = unit;
  
  // Конверсия граммов в килограммы
  if (unit === 'g' && quantity >= 1000) {
    const kg = quantity / 1000;
    return {
      value: formatNumber(kg, language),
      unit: language === 'ru' ? 'кг' : 'kg',
      raw,
      rawUnit
    };
  }
  
  // Конверсия миллилитров в литры
  if (unit === 'ml' && quantity >= 1000) {
    const liters = quantity / 1000;
    return {
      value: formatNumber(liters, language),
      unit: language === 'ru' ? 'л' : 'l',
      raw,
      rawUnit
    };
  }
  
  // Штуки - переводим
  if (unit === 'pcs') {
    return {
      value: formatNumber(quantity, language, 0), // без дробной части
      unit: getUnitTranslation(unit, language),
      raw,
      rawUnit
    };
  }
  
  // Остальные единицы - переводим и форматируем
  return {
    value: formatNumber(quantity, language),
    unit: getUnitTranslation(unit, language),
    raw,
    rawUnit
  };
}

/**
 * Форматирует число с учётом локали
 * - Русский: 1 500.5
 * - Английский: 1,500.5
 */
function formatNumber(num: number, language: string, maxDecimals: number = 1): string {
  // Округляем до maxDecimals знаков
  const rounded = Math.round(num * Math.pow(10, maxDecimals)) / Math.pow(10, maxDecimals);
  
  if (language === 'ru') {
    // Русский формат: пробелы между тысячами, точка для дробной части
    const parts = rounded.toFixed(maxDecimals).split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' '); // 12200 → 12 200
    const decimalPart = parts[1];
    
    // Если дробная часть = 0, не показываем её
    if (parseFloat(`0.${decimalPart}`) === 0) {
      return integerPart;
    }
    
    return `${integerPart}.${decimalPart}`;
  }
  
  // Английский формат: запятые между тысячами, точка для дробной части
  return rounded.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals
  });
}

/**
 * Переводит единицу измерения
 */
function getUnitTranslation(unit: string, language: string): string {
  const translations: Record<string, Record<string, string>> = {
    g: { ru: 'г', en: 'g', pl: 'g' },
    kg: { ru: 'кг', en: 'kg', pl: 'kg' },
    ml: { ru: 'мл', en: 'ml', pl: 'ml' },
    l: { ru: 'л', en: 'l', pl: 'l' },
    pcs: { ru: 'шт', en: 'pcs', pl: 'szt' },
  };
  
  return translations[unit]?.[language] || unit;
}

/**
 * Форматирует диапазон (например, для "Осталось X/Y")
 */
export function formatQuantityRange(
  remaining: number,
  total: number,
  unit: string,
  language: string = 'ru'
): string {
  const formattedRemaining = formatQuantity(remaining, unit, language);
  const formattedTotal = formatQuantity(total, unit, language);
  
  // Если единицы совпадают, показываем один раз
  if (formattedRemaining.unit === formattedTotal.unit) {
    return `${formattedRemaining.value}/${formattedTotal.value} ${formattedRemaining.unit}`;
  }
  
  // Если единицы разные (например, 500 g / 1.5 kg), показываем обе
  return `${formattedRemaining.value} ${formattedRemaining.unit} / ${formattedTotal.value} ${formattedTotal.unit}`;
}

/**
 * Форматирует прогресс использования в процентах
 */
export function formatUsagePercent(usagePercent: number, language: string = 'ru'): string {
  const percent = Math.round(usagePercent);
  return `${percent}%`;
}
