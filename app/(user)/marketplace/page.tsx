"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChefHat, ShoppingCart, Bell } from "lucide-react";
import { DishCard } from "@/components/marketplace/DishCard";
import { MarketplaceFilters } from "@/components/marketplace/MarketplaceFilters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";

// Mock данные блюд
const mockDishes = [
  {
    id: "1",
    title: "Филадельфия ролл",
    price: 32,
    category: "Rolls",
    ingredients: ["Лосось", "Сыр", "Рис", "Нори"],
    description: "Классический ролл с лососем и сливочным сыром",
  },
  {
    id: "2",
    title: "Калифорния ролл",
    price: 28,
    category: "Rolls",
    ingredients: ["Краб", "Авокадо", "Огурец", "Рис"],
    description: "Популярный ролл с крабом и авокадо",
  },
  {
    id: "3",
    title: "Лосось терияки боул",
    price: 45,
    category: "Bowls",
    ingredients: ["Лосось", "Рис", "Овощи", "Соус терияки"],
    description: "Сытный боул с лососем в соусе терияки",
  },
  {
    id: "4",
    title: "Мисо суп",
    price: 18,
    category: "Soups",
    ingredients: ["Мисо паста", "Тофу", "Водоросли", "Лук"],
    description: "Традиционный японский суп",
  },
  {
    id: "5",
    title: "Зелёный чай",
    price: 12,
    category: "Drinks",
    ingredients: ["Зелёный чай", "Лимон"],
    description: "Освежающий зелёный чай",
  },
  {
    id: "6",
    title: "Мохито ролл",
    price: 35,
    category: "Rolls",
    ingredients: ["Тунец", "Лосось", "Авокадо", "Соус"],
    description: "Острый ролл с тунцом и лососем",
  },
];

/**
 * Marketplace Page
 * Route: /marketplace
 * Purpose: Browse dishes and place orders
 */
export default function MarketplacePage() {
  const router = useRouter();
  const { itemCount } = useCart();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  // Фильтрация и сортировка блюд
  const filteredDishes = useMemo(() => {
    let filtered = [...mockDishes];

    // Поиск по названию
    if (searchQuery) {
      filtered = filtered.filter((dish) =>
        dish.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Фильтр по категории
    if (category !== "all") {
      filtered = filtered.filter((dish) => dish.category === category);
    }

    // Фильтр по цене
    if (priceMin) {
      filtered = filtered.filter((dish) => dish.price >= Number(priceMin));
    }
    if (priceMax) {
      filtered = filtered.filter((dish) => dish.price <= Number(priceMax));
    }

    // Сортировка
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        // Для mock данных просто переворачиваем порядок
        filtered.reverse();
        break;
      case "popular":
      default:
        // Оставляем исходный порядок
        break;
    }

    return filtered;
  }, [searchQuery, category, sortBy, priceMin, priceMax]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ChefHat className="w-8 h-8 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Marketplace
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Browse dishes and place orders
            </p>
          </div>

          {/* Right side: Cart & Notifications */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/cart")}
              className="relative"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Корзина
              {itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>
            {/* Notifications - опционально позже */}
          </div>
        </motion.div>

        {/* Filters */}
        <MarketplaceFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          category={category}
          onCategoryChange={setCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          priceMin={priceMin}
          onPriceMinChange={setPriceMin}
          priceMax={priceMax}
          onPriceMaxChange={setPriceMax}
        />

        {/* Dishes Grid */}
        {filteredDishes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDishes.map((dish) => (
              <DishCard
                key={dish.id}
                id={dish.id}
                title={dish.title}
                price={dish.price}
                category={dish.category}
                ingredientsPreview={dish.ingredients}
                description={dish.description}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Пока нет доступных блюд
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Скоро здесь появится меню
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
