"use client";

import { useState, useEffect } from "react";
import { Package, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
}

/**
 * 📦 Простой каталог продуктов
 * Все ингредиенты из базы данных
 */
export default function ProductsCatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // TODO: Fetch from API
    // Временные данные
    setProducts([
      { id: "1", name: "Рис для суші", category: "Крупи", unit: "г" },
      { id: "2", name: "Норі", category: "Морепродукти", unit: "шт" },
      { id: "3", name: "Лосось", category: "Риба", unit: "г" },
      { id: "4", name: "Авокадо", category: "Овочі", unit: "шт" },
      { id: "5", name: "Огірок", category: "Овочі", unit: "шт" },
      { id: "6", name: "Паста спагетті", category: "Макарони", unit: "г" },
      { id: "7", name: "Бекон", category: "М'ясо", unit: "г" },
      { id: "8", name: "Пармезан", category: "Сири", unit: "г" },
      { id: "9", name: "Яйця", category: "Яйця", unit: "шт" },
      { id: "10", name: "Буряк", category: "Овочі", unit: "г" },
    ]);
    setIsLoading(false);
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.category.toLowerCase().includes(search.toLowerCase())
  );

  // Группируем по категориям
  const productsByCategory = filteredProducts.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Каталог продуктів
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Всі доступні інгредієнти в системі
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
              placeholder="Пошук продуктів..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Products by Category */}
        {isLoading ? (
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-12 text-center text-gray-500">
            Завантаження...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-12 text-center text-gray-500">
            {search ? "Нічого не знайдено" : "Продуктів поки немає"}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(productsByCategory).map(([category, items]) => (
              <div
                key={category}
                className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden"
              >
                {/* Category Header */}
                <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="font-semibold text-gray-900 dark:text-white">
                    {category} ({items.length})
                  </h2>
                </div>

                {/* Products Table */}
                <table className="w-full">
                  <thead className="border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Назва
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Одиниця виміру
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {items.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {product.unit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {/* Count */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
            Показано: {filteredProducts.length} продуктів {search && `з ${products.length}`}
          </div>
        )}
      </div>
    </div>
  );
}
