"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChefHat, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Recipe {
  id: string;
  title: string;
  cuisine: string;
  status: string;
  createdAt: string;
}

/**
 * 📖 Простой каталог рецептов
 * Все рецепты из базы данных
 */
export default function RecipesCatalogPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // TODO: Fetch from API
    // Временные данные
    setRecipes([
      {
        id: "1",
        title: "Суші Райнбоу",
        cuisine: "Японська",
        status: "Опубліковано",
        createdAt: "2024-01-15",
      },
      {
        id: "2",
        title: "Паста Карбонара",
        cuisine: "Італійська",
        status: "Опубліковано",
        createdAt: "2024-01-10",
      },
      {
        id: "3",
        title: "Борщ класичний",
        cuisine: "Українська",
        status: "Чернетка",
        createdAt: "2024-01-05",
      },
    ]);
    setIsLoading(false);
  }, []);

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <ChefHat className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Каталог рецептів
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Всі доступні рецепти в системі
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Пошук рецептів..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-gray-500">Завантаження...</div>
          ) : filteredRecipes.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              {search ? "Нічого не знайдено" : "Рецептів поки немає"}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Назва
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Кухня
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Дата створення
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRecipes.map((recipe) => (
                  <tr
                    key={recipe.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/catalog/recipes/${recipe.id}`}
                        className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {recipe.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {recipe.cuisine}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          recipe.status === "Опубліковано"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {recipe.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(recipe.createdAt).toLocaleDateString("uk-UA")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Count */}
        {!isLoading && filteredRecipes.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
            Показано: {filteredRecipes.length} {search && `з ${recipes.length}`}
          </div>
        )}
      </div>
    </div>
  );
}
