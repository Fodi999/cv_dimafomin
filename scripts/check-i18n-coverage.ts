#!/usr/bin/env ts-node
/**
 * i18n Coverage Checker
 * 
 * Проверяет:
 * 1. Структурную идентичность словарей (pl/en/ru)
 * 2. Отсутствующие ключи в языках
 * 3. AI-generated переводы (помечает для ревью)
 * 
 * Usage: npm run check:i18n
 */

import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';

// Типы для отчёта
interface TranslationIssue {
  type: 'missing' | 'extra' | 'ai-generated' | 'empty-value';
  language: string;
  domain: string;
  key: string;
  path: string;
}

interface CoverageReport {
  issues: TranslationIssue[];
  summary: {
    totalKeys: number;
    missingKeys: number;
    extraKeys: number;
    aiGeneratedKeys: number;
    emptyValues: number;
  };
}

// Маркеры AI-generated контента
const AI_MARKERS = [
  '[AI]',
  '[TODO]',
  '[TRANSLATE]',
  'Lorem ipsum',
  '...',
];

/**
 * Рекурсивно получить все ключи из объекта
 */
function getAllKeys(obj: any, prefix = ''): string[] {
  const keys: string[] = [];
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

/**
 * Получить значение по пути ключа
 */
function getValueByPath(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Проверить, является ли значение AI-generated
 */
function isAIGenerated(value: any): boolean {
  if (typeof value !== 'string') return false;
  return AI_MARKERS.some(marker => value.includes(marker));
}

/**
 * Загрузить домен для языка
 */
async function loadDomain(language: string, domain: string): Promise<any> {
  const filePath = path.join(process.cwd(), 'i18n', language, `${domain}.ts`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  try {
    // Динамический импорт модуля
    const module = await import(filePath);
    return module[domain];
  } catch (error) {
    console.error(chalk.red(`❌ Error loading ${filePath}:`), error);
    return null;
  }
}

/**
 * Получить список доменов
 */
function getDomains(language: string): string[] {
  const i18nDir = path.join(process.cwd(), 'i18n', language);
  
  if (!fs.existsSync(i18nDir)) {
    return [];
  }
  
  return fs.readdirSync(i18nDir)
    .filter(file => file.endsWith('.ts'))
    .map(file => file.replace('.ts', ''));
}

/**
 * Сравнить структуры доменов
 */
async function compareDomainStructure(
  domain: string,
  languages: string[]
): Promise<TranslationIssue[]> {
  const issues: TranslationIssue[] = [];
  
  // Загрузить все версии домена
  const domainData: Record<string, any> = {};
  for (const lang of languages) {
    domainData[lang] = await loadDomain(lang, domain);
  }
  
  // Получить все ключи из reference языка (pl)
  const plKeys = domainData['pl'] ? getAllKeys(domainData['pl']) : [];
  
  // Проверить каждый язык
  for (const lang of languages) {
    if (lang === 'pl') continue; // Пропускаем reference язык
    
    if (!domainData[lang]) {
      issues.push({
        type: 'missing',
        language: lang,
        domain,
        key: '*',
        path: `i18n/${lang}/${domain}.ts`
      });
      continue;
    }
    
    const langKeys = getAllKeys(domainData[lang]);
    
    // Найти отсутствующие ключи
    for (const key of plKeys) {
      if (!langKeys.includes(key)) {
        issues.push({
          type: 'missing',
          language: lang,
          domain,
          key,
          path: `i18n/${lang}/${domain}.ts`
        });
      } else {
        // Проверить на AI-generated контент
        const value = getValueByPath(domainData[lang], key);
        if (isAIGenerated(value)) {
          issues.push({
            type: 'ai-generated',
            language: lang,
            domain,
            key,
            path: `i18n/${lang}/${domain}.ts`
          });
        }
        
        // Проверить на пустые значения
        if (value === '' || value === null || value === undefined) {
          issues.push({
            type: 'empty-value',
            language: lang,
            domain,
            key,
            path: `i18n/${lang}/${domain}.ts`
          });
        }
      }
    }
    
    // Найти лишние ключи
    for (const key of langKeys) {
      if (!plKeys.includes(key)) {
        issues.push({
          type: 'extra',
          language: lang,
          domain,
          key,
          path: `i18n/${lang}/${domain}.ts`
        });
      }
    }
  }
  
  return issues;
}

/**
 * Создать отчёт о покрытии
 */
async function generateCoverageReport(languages: string[]): Promise<CoverageReport> {
  console.log(chalk.blue('🔍 Checking i18n coverage...\n'));
  
  const issues: TranslationIssue[] = [];
  const domains = getDomains('pl'); // Используем pl как reference
  
  for (const domain of domains) {
    console.log(chalk.gray(`  Checking domain: ${domain}`));
    const domainIssues = await compareDomainStructure(domain, languages);
    issues.push(...domainIssues);
  }
  
  // Подсчёт статистики
  const summary = {
    totalKeys: 0,
    missingKeys: issues.filter(i => i.type === 'missing').length,
    extraKeys: issues.filter(i => i.type === 'extra').length,
    aiGeneratedKeys: issues.filter(i => i.type === 'ai-generated').length,
    emptyValues: issues.filter(i => i.type === 'empty-value').length,
  };
  
  // Подсчитать общее количество ключей
  for (const domain of domains) {
    const plDomain = await loadDomain('pl', domain);
    if (plDomain) {
      summary.totalKeys += getAllKeys(plDomain).length;
    }
  }
  
  return { issues, summary };
}

/**
 * Вывести отчёт
 */
function printReport(report: CoverageReport) {
  console.log('\n' + chalk.bold('📊 Coverage Report:'));
  console.log(chalk.gray('─'.repeat(60)));
  
  console.log(`Total keys: ${chalk.cyan(report.summary.totalKeys)}`);
  console.log(`Missing keys: ${report.summary.missingKeys > 0 ? chalk.red(report.summary.missingKeys) : chalk.green(report.summary.missingKeys)}`);
  console.log(`Extra keys: ${report.summary.extraKeys > 0 ? chalk.yellow(report.summary.extraKeys) : chalk.green(report.summary.extraKeys)}`);
  console.log(`AI-generated: ${report.summary.aiGeneratedKeys > 0 ? chalk.magenta(report.summary.aiGeneratedKeys) : chalk.green(report.summary.aiGeneratedKeys)}`);
  console.log(`Empty values: ${report.summary.emptyValues > 0 ? chalk.red(report.summary.emptyValues) : chalk.green(report.summary.emptyValues)}`);
  
  // Группировать issues по типу
  const groupedIssues: Record<string, TranslationIssue[]> = {
    missing: [],
    extra: [],
    'ai-generated': [],
    'empty-value': []
  };
  
  report.issues.forEach(issue => {
    groupedIssues[issue.type].push(issue);
  });
  
  // Вывести детали по каждому типу
  if (groupedIssues.missing.length > 0) {
    console.log('\n' + chalk.red.bold('❌ Missing Keys:'));
    groupedIssues.missing.forEach(issue => {
      console.log(chalk.red(`  ${issue.language}/${issue.domain}: ${issue.key}`));
    });
  }
  
  if (groupedIssues.extra.length > 0) {
    console.log('\n' + chalk.yellow.bold('⚠️  Extra Keys:'));
    groupedIssues.extra.forEach(issue => {
      console.log(chalk.yellow(`  ${issue.language}/${issue.domain}: ${issue.key}`));
    });
  }
  
  if (groupedIssues['ai-generated'].length > 0) {
    console.log('\n' + chalk.magenta.bold('🤖 AI-Generated (needs review):'));
    groupedIssues['ai-generated'].forEach(issue => {
      console.log(chalk.magenta(`  ${issue.language}/${issue.domain}: ${issue.key}`));
    });
  }
  
  if (groupedIssues['empty-value'].length > 0) {
    console.log('\n' + chalk.red.bold('🚫 Empty Values:'));
    groupedIssues['empty-value'].forEach(issue => {
      console.log(chalk.red(`  ${issue.language}/${issue.domain}: ${issue.key}`));
    });
  }
  
  // Итоговый статус
  console.log('\n' + chalk.gray('─'.repeat(60)));
  
  const hasErrors = report.summary.missingKeys > 0 || report.summary.emptyValues > 0;
  const hasWarnings = report.summary.extraKeys > 0 || report.summary.aiGeneratedKeys > 0;
  
  if (hasErrors) {
    console.log(chalk.red.bold('❌ Coverage check failed! Fix errors above.'));
    process.exit(1);
  } else if (hasWarnings) {
    console.log(chalk.yellow.bold('⚠️  Coverage check passed with warnings.'));
    process.exit(0);
  } else {
    console.log(chalk.green.bold('✅ Perfect coverage! All translations are in sync.'));
    process.exit(0);
  }
}

/**
 * Main
 */
async function main() {
  const languages = ['pl', 'en', 'ru'];
  
  console.log(chalk.cyan.bold('🌍 i18n Coverage Checker\n'));
  console.log(`Languages: ${languages.join(', ')}\n`);
  
  const report = await generateCoverageReport(languages);
  printReport(report);
}

// Запуск
main().catch(error => {
  console.error(chalk.red('Fatal error:'), error);
  process.exit(1);
});
