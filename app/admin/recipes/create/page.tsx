"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IngredientSelector } from "@/components/admin/catalog/recipes/IngredientSelector";

interface RecipeIngredient {
  ingredient_id: string;
  name: string;
  amount: number;
  unit: string;
}

interface RecipeFormData {
  title: string;
  description: string;
  cuisine_id: string;
  status: "draft" | "published";
  ingredients: RecipeIngredient[];
}

const CUISINES = [
  { id: "japanese", name: "Японська кухня" },
  { id: "italian", name: "Італійська кухня" },
  { id: "ukrainian", name: "Українська кухня" },
  { id: "french", name: "Французька кухня" },
  { id: "chinese", name: "Китайська кухня" },
  { id: "american", name: "Американська кухня" },
  { id: "thai", name: "Тайська кухня" },
  { id: "mexican", name: "Мексиканська кухня" },
];

/**
 * 🍱 Professional Recipe Creation Form
 * 
 * Основні можливості:
 * - Basic info: title, description, cuisine, status
 * - Ingredient autocomplete from /admin/ingredients catalog
 * - Validation: required title, min 1 ingredient, no duplicates
 * - Save options: draft or publish
 * - Single source of truth for ingredients (no free text)
 */
export default function RecipeCreatePage() {
  const [formData, setFormData] = useState<RecipeFormData>({
    title: "",
    description: "",
    cuisine_id: "",
    status: "draft",
    ingredients: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddIngredient = (ingredient: RecipeIngredient) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ingredient],
    }));
    setErrors((prev) => ({ ...prev, ingredients: "" }));
  };

  const handleRemoveIngredient = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((i) => i.ingredient_id !== id),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Назва обов'язкова";
    }

    if (!formData.cuisine_id) {
      newErrors.cuisine_id = "Оберіть кухню";
    }

    if (formData.ingredients.length === 0) {
      newErrors.ingredients = "Додайте хоча б один інгредієнт";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status: "draft" | "published") => {
    setFormData((prev) => ({ ...prev, status }));

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: API Integration
      // const response = await fetch("/api/admin/recipes", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     ...formData,
      //     status,
      //   }),
      // });
      //
      // if (!response.ok) throw new Error("Failed to create recipe");
      //
      // const data = await response.json();
      // router.push(`/admin/recipes/${data.id}`);

      console.log("Creating recipe:", { ...formData, status });
      
      alert(
        status === "draft"
          ? "Рецепт збережено як чернетку"
          : "Рецепт опубліковано"
      );
    } catch (error) {
      console.error("Error creating recipe:", error);
      alert("Помилка створення рецепту");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/catalog">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Новий рецепт
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Створіть професійний рецепт з інгредієнтами з каталогу
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handleSubmit("draft")}
                disabled={isSubmitting}
              >
                <Save className="w-4 h-4 mr-2" />
                Зберегти чернетку
              </Button>
              <Button
                onClick={() => handleSubmit("published")}
                disabled={isSubmitting}
              >
                <Send className="w-4 h-4 mr-2" />
                Опублікувати
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Basic Information Section */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Основна інформація
            </h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <Label htmlFor="title">
                  Назва рецепту <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Наприклад: Суші Райнбоу"
                  className="mt-1"
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Опис</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Короткий опис рецепту..."
                  rows={4}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Cuisine */}
              <div>
                <Label htmlFor="cuisine">
                  Кухня <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.cuisine_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, cuisine_id: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Оберіть кухню" />
                  </SelectTrigger>
                  <SelectContent>
                    {CUISINES.map((cuisine) => (
                      <SelectItem key={cuisine.id} value={cuisine.id}>
                        {cuisine.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.cuisine_id && (
                  <p className="text-sm text-red-500 mt-1">{errors.cuisine_id}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <Label>Статус</Label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={formData.status === "draft"}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value as "draft",
                        }))
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Чернетка
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="published"
                      checked={formData.status === "published"}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value as "published",
                        }))
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Опубліковано
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Інгредієнти <span className="text-red-500">*</span>
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Інгредієнти беруться з єдиного каталогу. Якщо інгредієнта немає — спочатку додайте його у каталог.
                </p>
              </div>
              <Link href="/admin/catalog" target="_blank">
                <Button variant="outline" size="sm" className="flex-shrink-0">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Відкрити каталог інгредієнтів
                </Button>
              </Link>
            </div>

            <IngredientSelector
              selectedIngredients={formData.ingredients}
              onAdd={handleAddIngredient}
              onRemove={handleRemoveIngredient}
            />

            {errors.ingredients && (
              <p className="text-sm text-red-500 mt-2">{errors.ingredients}</p>
            )}
          </div>

          {/* Summary */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold mt-0.5">
                ℹ
              </div>
              <div className="text-sm text-blue-900 dark:text-blue-100">
                <p className="font-medium mb-1">Підсумок:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    Назва:{" "}
                    {formData.title || (
                      <span className="text-blue-600 dark:text-blue-400">не вказано</span>
                    )}
                  </li>
                  <li>
                    Кухня:{" "}
                    {formData.cuisine_id
                      ? CUISINES.find((c) => c.id === formData.cuisine_id)?.name
                      : (
                        <span className="text-blue-600 dark:text-blue-400">не обрано</span>
                      )}
                  </li>
                  <li>
                    Інгредієнтів додано: {formData.ingredients.length}
                  </li>
                  <li>
                    Статус:{" "}
                    {formData.status === "draft" ? "Чернетка" : "Опубліковано"}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
