import { TodayMenuItem, MenuItemStatus } from '@/lib/api/menu';
import { Clock, Users } from 'lucide-react';
import Image from 'next/image';

interface MenuRecipeCardProps {
  item: TodayMenuItem;
  status: MenuItemStatus;
  onStartCooking: () => void;
  onComplete: () => void;
  onUpdateServings?: (servings: number) => void;
  isLoading?: boolean;
}

export function MenuRecipeCard({
  item,
  status,
  onStartCooking,
  onComplete,
  onUpdateServings,
  isLoading = false,
}: MenuRecipeCardProps) {
  const recipe = item.recipe;
  const isMenu = status === 'menu';
  const isCooking = status === 'cooking';
  const isHistory = status === 'history';

  const formatTime = (date?: string) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'menu':
        return (
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-medium">
            <div className="w-2 h-2 rounded-full bg-yellow-600 dark:bg-yellow-400" />
            В меню
          </div>
        );
      case 'cooking':
        return (
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
            <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
            Готовится
          </div>
        );
      case 'history':
        return (
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
            <div className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400" />
            Готово
          </div>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Recipe Image */}
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
        <Image
          src={recipe.image_url || 'https://i.postimg.cc/B63F53xY/DSCF4622.jpg'}
          alt={recipe.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 right-3">
          {getStatusBadge()}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
          {recipe.title}
        </h3>

        {/* Recipe Info */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.cook_time} мин</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{item.servings} порц</span>
          </div>
        </div>

        {/* Timestamps */}
        {isMenu && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Добавлено: {formatTime(item.created_at)}
          </div>
        )}

        {isCooking && item.started_cooking_at && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Начало: {formatTime(item.started_cooking_at)}
          </div>
        )}

        {isHistory && item.completed_at && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Завершено: {formatTime(item.completed_at)}
          </div>
        )}

        {/* Servings Control (only for menu) */}
        {isMenu && onUpdateServings && (
          <div className="mb-4 flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Порции:
            </label>
            <select
              value={item.servings}
              onChange={(e) => onUpdateServings(parseInt(e.target.value))}
              disabled={isLoading}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm font-medium text-gray-900 dark:text-white disabled:opacity-50"
            >
              {[1, 2, 3, 4, 5, 6, 8].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {isMenu && (
            <button
              onClick={onStartCooking}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Загрузка...' : '🍳 Готовить'}
            </button>
          )}

          {isCooking && (
            <button
              onClick={onComplete}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Загрузка...' : '✅ Готово!'}
            </button>
          )}

          {isHistory && (
            <div className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg font-medium text-sm text-center">
              ✅ Завершено
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
