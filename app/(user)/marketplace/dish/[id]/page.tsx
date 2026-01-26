"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";

// Mock данные блюд (в реальности будут из API)
const mockDishes: Record<string, any> = {
  "1": {
    id: "1",
    title: "Филадельфия ролл",
    price: 32,
    category: "Rolls",
    ingredients: ["Лосось", "Сыр", "Рис", "Нори"],
    description: "Классический ролл с лососем и сливочным сыром. Идеальное сочетание нежного лосося и сливочного сыра.",
    nutritionalInfo: {
      calories: 320,
      protein: 18,
      carbs: 35,
      fat: 12,
    },
  },
  "2": {
    id: "2",
    title: "Калифорния ролл",
    price: 28,
    category: "Rolls",
    ingredients: ["Краб", "Авокадо", "Огурец", "Рис"],
    description: "Популярный ролл с крабом и авокадо. Легкий и освежающий вкус.",
  },
  "3": {
    id: "3",
    title: "Лосось терияки боул",
    price: 45,
    category: "Bowls",
    ingredients: ["Лосось", "Рис", "Овощи", "Соус терияки"],
    description: "Сытный боул с лососем в соусе терияки. Сбалансированное блюдо с овощами и рисом.",
  },
  "4": {
    id: "4",
    title: "Мисо суп",
    price: 18,
    category: "Soups",
    ingredients: ["Мисо паста", "Тофу", "Водоросли", "Лук"],
    description: "Традиционный японский суп с мисо пастой и тофу.",
  },
  "5": {
    id: "5",
    title: "Зелёный чай",
    price: 12,
    category: "Drinks",
    ingredients: ["Зелёный чай", "Лимон"],
    description: "Освежающий зелёный чай с лимоном.",
  },
  "6": {
    id: "6",
    title: "Мохито ролл",
    price: 35,
    category: "Rolls",
    ingredients: ["Тунец", "Лосось", "Авокадо", "Соус"],
    description: "Острый ролл с тунцом и лососем. Для любителей ярких вкусов.",
  },
};

/**
 * Dish Details Page
 * Route: /marketplace/dish/[id]
 * Purpose: View dish details and add to cart
 */
export default function DishDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem, items, updateQuantity } = useCart();
  
  const dishId = params.id as string;
  const dish = mockDishes[dishId];
  
  const cartItem = items.find((item) => item.id === dishId);
  const quantity = cartItem?.quantity || 0;

  if (!dish) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Блюдо не найдено
          </h2>
          <Button onClick={() => router.push("/marketplace")}>
            Вернуться в Marketplace
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: dish.id,
      title: dish.title,
      price: dish.price,
      category: dish.category,
    });
  };

  const handleQuantityChange = (delta: number) => {
    if (quantity === 0 && delta > 0) {
      handleAddToCart();
    } else {
      updateQuantity(dishId, quantity + delta);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative w-full h-96 lg:h-[500px] bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden"
          >
            {dish.image ? (
              <Image
                src={dish.image}
                alt={dish.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <ShoppingCart className="w-24 h-24" />
              </div>
            )}
            {dish.category && (
              <Badge
                variant="secondary"
                className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 text-lg px-4 py-2"
              >
                {dish.category}
              </Badge>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {dish.title}
              </h1>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-6">
                {dish.price} PLN
              </p>
            </div>

            {/* Description */}
            {dish.description && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-3">Описание</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {dish.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Ingredients */}
            {dish.ingredients && dish.ingredients.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-3">Состав</h2>
                  <div className="flex flex-wrap gap-2">
                    {dish.ingredients.map((ingredient: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-sm px-3 py-1">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Nutritional Info */}
            {dish.nutritionalInfo && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-3">Пищевая ценность</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Калории</p>
                      <p className="text-lg font-semibold">{dish.nutritionalInfo.calories} ккал</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Белки</p>
                      <p className="text-lg font-semibold">{dish.nutritionalInfo.protein} г</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Углеводы</p>
                      <p className="text-lg font-semibold">{dish.nutritionalInfo.carbs} г</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Жиры</p>
                      <p className="text-lg font-semibold">{dish.nutritionalInfo.fat} г</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Add to Cart */}
            <div className="flex items-center gap-4 pt-4">
              {quantity > 0 ? (
                <>
                  <div className="flex items-center gap-3 border rounded-lg px-4 py-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange(-1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange(1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    size="lg"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
                    onClick={() => router.push("/cart")}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    В корзине ({quantity})
                  </Button>
                </>
              ) : (
                <Button
                  size="lg"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Добавить в корзину
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
