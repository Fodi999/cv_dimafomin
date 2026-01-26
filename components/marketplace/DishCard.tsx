"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Eye, Plus } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";

interface DishCardProps {
  id: string;
  title: string;
  image?: string;
  price: number;
  category?: string;
  ingredientsPreview?: string[];
  description?: string;
}

export function DishCard({
  id,
  title,
  image,
  price,
  category,
  ingredientsPreview,
  description,
}: DishCardProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id,
      title,
      image,
      price,
      category,
    });
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/marketplace/dish/${id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        {/* Image */}
        <div
          className="relative w-full h-48 bg-gray-200 dark:bg-gray-800 overflow-hidden"
          onClick={handleViewDetails}
        >
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ShoppingCart className="w-12 h-12" />
            </div>
          )}
          {category && (
            <Badge
              variant="secondary"
              className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90"
            >
              {category}
            </Badge>
          )}
        </div>

        <CardContent className="flex-1 p-4 flex flex-col">
          {/* Title */}
          <h3
            className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors"
            onClick={handleViewDetails}
          >
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {description}
            </p>
          )}

          {/* Ingredients Preview */}
          {ingredientsPreview && ingredientsPreview.length > 0 && (
            <div className="mt-auto mb-3">
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                Состав:
              </p>
              <div className="flex flex-wrap gap-1">
                {ingredientsPreview.slice(0, 3).map((ingredient, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="text-xs px-2 py-0.5"
                  >
                    {ingredient}
                  </Badge>
                ))}
                {ingredientsPreview.length > 3 && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    +{ingredientsPreview.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Price */}
          <div className="mt-auto">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {price} PLN
            </p>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleViewDetails}
          >
            <Eye className="w-4 h-4 mr-2" />
            Детали
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            В корзину
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
