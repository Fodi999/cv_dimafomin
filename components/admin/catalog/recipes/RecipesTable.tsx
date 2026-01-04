import { Pencil, Trash2, Eye, Clock, Users, Weight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Recipe } from "@/hooks/useAdminRecipes";

interface RecipesTableProps {
  recipes: Recipe[];
  isLoading: boolean;
  onView: (recipe: Recipe) => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
}

const difficultyColors = {
  easy: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  hard: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const difficultyLabels = {
  easy: "Легкий",
  medium: "Середній",
  hard: "Складний",
};

const statusColors = {
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  published: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  archived: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
};

const statusLabels = {
  draft: "Чернетка",
  published: "Опубліковано",
  archived: "Архів",
};

export function RecipesTable({ recipes, isLoading, onView, onEdit, onDelete }: RecipesTableProps) {
  // Safety check: ensure recipes is always an array
  const safeRecipes = Array.isArray(recipes) ? recipes : [];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (safeRecipes.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">
          🍳 Рецептів не знайдено
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Додайте перший рецепт, щоб почати
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Назва
            </th>
            <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Кухня
            </th>
            <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Складність
            </th>
            <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Статус
            </th>
            <th className="text-center p-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Clock className="w-4 h-4 inline" />
            </th>
            <th className="text-center p-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Users className="w-4 h-4 inline" />
            </th>
            <th className="text-center p-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Weight className="w-4 h-4 inline" />
            </th>
            <th className="text-center p-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Інгредієнти
            </th>
            <th className="text-center p-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Eye className="w-4 h-4 inline" />
            </th>
            <th className="text-right p-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Дії
            </th>
          </tr>
        </thead>
        <tbody>
          {safeRecipes.map((recipe) => (
            <tr
              key={recipe.id}
              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
            >
              <td className="p-3">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {recipe.title}
                  </p>
                  {recipe.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                      {recipe.description}
                    </p>
                  )}
                </div>
              </td>
              <td className="p-3">
                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                  {recipe.cuisine}
                </span>
              </td>
              <td className="p-3">
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[recipe.difficulty]}`}>
                  {difficultyLabels[recipe.difficulty]}
                </span>
              </td>
              <td className="p-3">
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[recipe.status]}`}>
                  {statusLabels[recipe.status]}
                </span>
              </td>
              <td className="p-3 text-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {recipe.cooking_time} хв
                </span>
              </td>
              <td className="p-3 text-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {recipe.servings}
                </span>
              </td>
              <td className="p-3 text-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {recipe.portionWeightGrams ? `${recipe.portionWeightGrams}г` : '—'}
                </span>
              </td>
              <td className="p-3 text-center">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {recipe.ingredients?.length || 0}
                </span>
              </td>
              <td className="p-3 text-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {recipe.views || 0}
                </span>
              </td>
              <td className="p-3">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(recipe)}
                    className="h-8 w-8 p-0"
                    title="Переглянути рецепт"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(recipe)}
                    className="h-8 w-8 p-0"
                    title="Редагувати"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(recipe)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Видалити"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
