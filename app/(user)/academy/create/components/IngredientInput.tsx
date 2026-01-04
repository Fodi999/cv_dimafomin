"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getNutritionInfo } from "@/lib/nutrition-data";

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
}

interface IngredientInputProps {
  ingredients: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
}

export default function IngredientInput({
  ingredients,
  onChange,
}: IngredientInputProps) {
  const [loadingNutrition, setLoadingNutrition] = useState<Set<number>>(
    new Set()
  );

  const fetchIngredientNutrition = async (
    ingredient: string,
    quantity: number
  ): Promise<{
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  }> => {
    try {
      const { aiApi } = await import("@/lib/api");
      const token = localStorage.getItem("token");
      
      try {
        const nutritionData: any = await aiApi.getIngredientNutrition(
          ingredient,
          quantity,
          token || undefined
        );
        return {
          calories: nutritionData.calories || 0,
          protein: nutritionData.protein || 0,
          fat: nutritionData.fat || 0,
          carbs: nutritionData.carbs || 0,
        };
      } catch (error) {
        console.log("Backend nutrition failed, using local database");
        const localData = getNutritionInfo(ingredient, quantity);
        
        if (localData) {
          return {
            calories: localData.calories,
            protein: localData.protein,
            fat: localData.fat,
            carbs: localData.carbs,
          };
        }
      }

      return { calories: 0, protein: 0, fat: 0, carbs: 0 };
    } catch (error) {
      console.error("❌ Nutrition fetch error:", error);
      return { calories: 0, protein: 0, fat: 0, carbs: 0 };
    }
  };

  const addIngredient = () => {
    onChange([
      ...ingredients,
      { name: "", quantity: 0, unit: "г", calories: 0 },
    ]);
  };

  const removeIngredient = (index: number) => {
    onChange(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = async (
    index: number,
    field: keyof Ingredient,
    value: string | number
  ) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };

    if (field === "name" || field === "quantity") {
      const { name, quantity } = newIngredients[index];

      if (
        name.trim().length >= 3 &&
        quantity > 0 &&
        !loadingNutrition.has(index)
      ) {
        setLoadingNutrition((prev) => new Set(prev).add(index));

        const nutrition = await fetchIngredientNutrition(name, quantity);

        newIngredients[index] = {
          ...newIngredients[index],
          calories: nutrition.calories,
          protein: nutrition.protein,
          fat: nutrition.fat,
          carbs: nutrition.carbs,
        };

        setLoadingNutrition((prev) => {
          const next = new Set(prev);
          next.delete(index);
          return next;
        });
      }
    }

    onChange(newIngredients);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Utensils className="w-4 h-4 text-purple-600" />
          Інгредієнти
        </label>
        <Button
          onClick={addIngredient}
          variant="outline"
          size="sm"
          className="text-purple-600 border-purple-600 hover:bg-purple-50"
          type="button"
        >
          <Plus className="w-4 h-4 mr-1" />
          Додати
        </Button>
      </div>

      <div className="space-y-3">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="flex flex-wrap items-start gap-2 p-4 bg-gray-50 rounded-xl border border-gray-200"
          >
            <input
              type="text"
              value={ingredient.name}
              onChange={(e) => updateIngredient(index, "name", e.target.value)}
              placeholder="Назва інгредієнта"
              className="flex-1 min-w-[200px] px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-400 focus:outline-none text-sm"
            />
            <input
              type="number"
              value={ingredient.quantity || ""}
              onChange={(e) =>
                updateIngredient(index, "quantity", Number(e.target.value))
              }
              placeholder="Кількість"
              className="w-24 px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-400 focus:outline-none text-sm"
            />
            <select
              value={ingredient.unit}
              onChange={(e) => updateIngredient(index, "unit", e.target.value)}
              className="w-24 px-3 py-2 border border-gray-200 rounded-lg focus:border-purple-400 focus:outline-none text-sm bg-white"
            >
              <option value="г">г</option>
              <option value="мл">мл</option>
              <option value="шт">шт</option>
              <option value="ч.л.">ч.л.</option>
              <option value="ст.л.">ст.л.</option>
            </select>

            {loadingNutrition.has(index) ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg text-sm text-purple-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Завантаження...</span>
              </div>
            ) : (
              ingredient.calories !== undefined &&
              ingredient.calories > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg text-xs text-green-700 font-medium">
                  <span>🔥 {ingredient.calories} ккал</span>
                  <span>💪 {ingredient.protein}г</span>
                  <span>🥑 {ingredient.fat}г</span>
                  <span>🍞 {ingredient.carbs}г</span>
                </div>
              )
            )}

            <button
              onClick={() => removeIngredient(index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              type="button"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {ingredients.length === 0 && (
        <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-sm">Додайте перший інгредієнт</p>
        </div>
      )}
    </div>
  );
}
