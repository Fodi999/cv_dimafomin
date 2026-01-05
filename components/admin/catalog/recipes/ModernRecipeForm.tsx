"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ChefHat, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { RecipeFormData, RecipeDifficulty, RecipeStatus } from "@/lib/recipes/types";

// Категории блюд
const CATEGORIES = [
  { value: "main", label: "Основное блюдо" },
  { value: "appetizer", label: "Закуска" },
  { value: "dessert", label: "Десерт" },
  { value: "soup", label: "Супы" },
  { value: "salad", label: "Салаты" },
  { value: "drink", label: "Напитки" },
  { value: "baking", label: "Выпечка" },
];

const DIFFICULTIES: { value: RecipeDifficulty; label: string }[] = [
  { value: "easy", label: "Легко" },
  { value: "medium", label: "Средне" },
  { value: "hard", label: "Сложно" },
];

export function ModernRecipeForm() {
  const router = useRouter();
  const { token } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [localName, setLocalName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("main");
  const [difficulty, setDifficulty] = useState<RecipeDifficulty>("medium");
  const [servings, setServings] = useState("4");
  const [timeMinutes, setTimeMinutes] = useState("30");

  // Ingredients & Instructions
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState("");
  const [newInstruction, setNewInstruction] = useState("");

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients([...ingredients, newIngredient]);
      setNewIngredient("");
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addInstruction = () => {
    if (newInstruction.trim()) {
      setInstructions([...instructions, newInstruction]);
      setNewInstruction("");
    }
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!localName.trim()) {
      toast.error("Введите название рецепта");
      return;
    }

    if (ingredients.length === 0) {
      toast.error("Добавьте хотя бы один ингредиент");
      return;
    }

    if (instructions.length === 0) {
      toast.error("Добавьте хотя бы один шаг приготовления");
      return;
    }

    setIsSaving(true);

    try {
      // Формируем данные для API
      const recipeData: Partial<RecipeFormData> = {
        localName: localName.trim(),
        canonicalName: localName.trim().toLowerCase().replace(/\s+/g, "_"),
        descriptionPl: description.trim(),
        categoryId: category,
        difficulty: difficulty,
        status: "draft",
        timeMinutes: parseInt(timeMinutes) || 30,
        servings: parseInt(servings) || 4,
        ingredients: ingredients.map((ing, index) => ({
          ingredientId: "", // TODO: будет привязан позже
          name: ing,
          quantity: 1,
          unit: "шт",
          sortOrder: index + 1,
        })),
        steps: instructions.map((inst, index) => ({
          stepNumber: index + 1,
          description: inst,
        })),
      };

      console.log("[ModernRecipeForm] Создание рецепта:", recipeData);

      const response = await fetch("/api/admin/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recipeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка создания рецепта");
      }

      const result = await response.json();
      console.log("[ModernRecipeForm] ✅ Рецепт создан:", result);

      toast.success("Рецепт успешно создан!");
      
      // Переход к редактированию для добавления деталей
      if (result.data?.id) {
        router.push(`/admin/catalog/recipes/${result.data.id}/edit`);
      } else {
        router.push("/admin/catalog");
      }
    } catch (error) {
      console.error("[ModernRecipeForm] ❌ Ошибка:", error);
      toast.error(error instanceof Error ? error.message : "Не удалось создать рецепт");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6 md:p-8 border-2 border-border shadow-lg">
        {/* Header Section */}
        <div className="mb-8 flex items-center gap-3 pb-6 border-b border-border">
          <div className="bg-primary text-primary-foreground p-3 rounded-lg">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Детали рецепта</h2>
            <p className="text-sm text-muted-foreground">Заполните информацию о вашем блюде</p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="space-y-6 mb-8">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-semibold">
              Название рецепта
            </Label>
            <Input
              id="title"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              placeholder="Например: Шоколадный торт"
              className="text-base"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-semibold">
              Описание
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Краткое описание вашего блюда..."
              rows={3}
              className="text-base resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-base font-semibold">
                Категория
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className="text-base">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty" className="text-base font-semibold">
                Сложность
              </Label>
              <Select value={difficulty} onValueChange={(val) => setDifficulty(val as RecipeDifficulty)}>
                <SelectTrigger id="difficulty" className="text-base">
                  <SelectValue placeholder="Выберите сложность" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((diff) => (
                    <SelectItem key={diff.value} value={diff.value}>
                      {diff.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="servings" className="text-base font-semibold">
                Порций
              </Label>
              <Input
                id="servings"
                type="number"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                min="1"
                className="text-base"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeMinutes" className="text-base font-semibold">
                Время приготовления (мин)
              </Label>
              <Input
                id="timeMinutes"
                type="number"
                value={timeMinutes}
                onChange={(e) => setTimeMinutes(e.target.value)}
                min="0"
                className="text-base"
                required
              />
            </div>
          </div>
        </div>

        {/* Ingredients Section */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-foreground">Ингредиенты</h3>
            <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {ingredients.length} {ingredients.length === 1 ? "ингредиент" : "ингредиентов"}
            </span>
          </div>

          <div className="space-y-3">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg group">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </span>
                <span className="flex-1 text-foreground">{ingredient}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeIngredient(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              placeholder="Добавить ингредиент..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addIngredient();
                }
              }}
              className="flex-1"
            />
            <Button type="button" onClick={addIngredient} className="gap-2">
              <Plus className="w-4 h-4" />
              Добавить
            </Button>
          </div>
        </div>

        {/* Instructions Section */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-foreground">Инструкции</h3>
            <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {instructions.length} {instructions.length === 1 ? "шаг" : "шагов"}
            </span>
          </div>

          <div className="space-y-3">
            {instructions.map((instruction, index) => (
              <div key={index} className="flex gap-3 p-4 bg-accent/50 rounded-lg group">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                <p className="flex-1 text-foreground leading-relaxed">{instruction}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeInstruction(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Textarea
              value={newInstruction}
              onChange={(e) => setNewInstruction(e.target.value)}
              placeholder="Добавить шаг инструкции..."
              rows={2}
              className="flex-1 resize-none"
            />
            <Button type="button" onClick={addInstruction} className="gap-2 self-end">
              <Plus className="w-4 h-4" />
              Добавить
            </Button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-border flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            className="px-8 bg-transparent"
            onClick={() => router.back()}
            disabled={isSaving}
          >
            Отмена
          </Button>
          <Button type="submit" className="px-8 gap-2" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Создание...
              </>
            ) : (
              <>
                <ChefHat className="w-4 h-4" />
                Создать рецепт
              </>
            )}
          </Button>
        </div>
      </Card>
    </form>
  );
}
