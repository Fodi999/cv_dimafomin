"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface Dish {
  id: string;
  title: string;
  recipeId: string;
  cost: number;
  price: number;
  margin: number;
  imageUrl?: string;
  status: 'draft' | 'approved' | 'published';
  createdAt: string;
}

export default function DishesPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  // Load dishes
  useEffect(() => {
    const loadDishes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("/api/admin/dishes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setDishes(data.dishes || []);
        }
      } catch (error) {
        console.error("Error loading dishes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDishes();
  }, []);

  if (selectedRecipeId) {
    // Show CreateDishFromRecipe component
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setSelectedRecipeId(null)}
        >
          ← Назад к блюдам
        </Button>
        
        {/* Lazy load component here when user selects a recipe */}
        <div className="text-center py-12 text-muted-foreground">
          Выбран рецепт: {selectedRecipeId}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="sticky top-16 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 -mx-4 -mt-4 px-4 py-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">🍽️ Блюда</h1>
            <p className="text-muted-foreground mt-1">
              Управление блюдами в меню с финансовой аналитикой
            </p>
          </div>
          <Button
            onClick={() => router.push("/admin/dishes/new")}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Создать блюдо
          </Button>
        </div>
      </div>

      {/* Dishes Grid */}
      {loading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Загрузка блюд...</p>
          </CardContent>
        </Card>
      ) : dishes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Блюд не найдено</p>
            <Button
              onClick={() => router.push("/admin/recipes")}
              variant="outline"
            >
              Создать первое блюдо из рецепта
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dishes.map((dish) => (
            <Card
              key={dish.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/admin/dishes/${dish.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{dish.title}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      ID: {dish.id.slice(0, 8)}...
                    </CardDescription>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    dish.status === 'draft' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100' :
                    dish.status === 'approved' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' :
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                  }`}>
                    {dish.status.toUpperCase()}
                  </span>
                </div>
              </CardHeader>

              {dish.imageUrl && (
                <div className="px-6">
                  <img
                    src={dish.imageUrl}
                    alt={dish.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
              )}

              <CardContent className="pt-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Себест.</p>
                    <p className="font-semibold">{dish.cost.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">PLN</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Маржа</p>
                    <p className="font-semibold text-primary">{dish.margin}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Цена</p>
                    <p className="font-bold text-green-600">{dish.price.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">PLN</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
