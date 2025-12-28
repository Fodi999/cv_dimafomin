/**
 * i18n Dev Warning Component
 * 
 * Отображает предупреждения о проблемах с переводами в development mode
 * Автоматически скрыт в production
 */

"use client";

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { aiTranslations, hasAIMarker } from '@/lib/i18n/ai-translations';

interface I18nWarning {
  type: 'missing' | 'ai-generated' | 'empty';
  message: string;
  path: string;
}

export function I18nDevWarning() {
  const [warnings, setWarnings] = useState<I18nWarning[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const { language, t } = useLanguage();

  useEffect(() => {
    // Только в development mode
    if (process.env.NODE_ENV !== 'development') return;

    const detectedWarnings: I18nWarning[] = [];

    // Проверить все ключи в текущем словаре
    function checkObject(obj: any, path: string = '') {
      for (const key in obj) {
        const currentPath = path ? `${path}.${key}` : key;
        const value = obj[key];

        if (typeof value === 'object' && value !== null) {
          checkObject(value, currentPath);
        } else if (typeof value === 'string') {
          // Проверка на AI-маркеры
          if (hasAIMarker(value)) {
            detectedWarnings.push({
              type: 'ai-generated',
              message: `AI-generated translation needs review`,
              path: currentPath,
            });
          }

          // Проверка на пустые значения
          if (value === '' || value === '...') {
            detectedWarnings.push({
              type: 'empty',
              message: `Empty or placeholder translation`,
              path: currentPath,
            });
          }
        }
      }
    }

    if (t) {
      checkObject(t);
    }

    setWarnings(detectedWarnings);
  }, [language, t]);

  // Не показывать в production
  if (process.env.NODE_ENV !== 'development') return null;

  // Не показывать если нет предупреждений
  if (warnings.length === 0) return null;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all"
        title="i18n warnings"
      >
        <span className="text-xl">⚠️</span>
        {warnings.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {warnings.length}
          </span>
        )}
      </button>

      {/* Warning panel */}
      {isVisible && (
        <div className="fixed bottom-20 right-4 z-50 w-96 max-h-96 overflow-auto bg-white dark:bg-gray-800 border-2 border-yellow-500 rounded-lg shadow-2xl">
          <div className="sticky top-0 bg-yellow-500 text-white px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <span className="font-bold">i18n Warnings ({language})</span>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <div className="p-4 space-y-2">
            {warnings.length === 0 ? (
              <p className="text-green-600 dark:text-green-400">
                ✓ No warnings! All translations are good.
              </p>
            ) : (
              warnings.map((warning, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${
                    warning.type === 'ai-generated'
                      ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-500'
                      : warning.type === 'empty'
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                      : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg">
                      {warning.type === 'ai-generated'
                        ? '🤖'
                        : warning.type === 'empty'
                        ? '🚫'
                        : '⚠️'}
                    </span>
                    <div className="flex-1 text-sm">
                      <div className="font-mono text-xs text-gray-600 dark:text-gray-400">
                        {warning.path}
                      </div>
                      <div className="mt-1 text-gray-800 dark:text-gray-200">
                        {warning.message}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400">
              <p>
                Run <code className="bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded">npm run check:i18n</code> to see full report
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * HOC для добавления dev warnings в любой компонент
 */
export function withI18nWarnings<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function WrappedComponent(props: P) {
    return (
      <>
        <Component {...props} />
        <I18nDevWarning />
      </>
    );
  };
}
