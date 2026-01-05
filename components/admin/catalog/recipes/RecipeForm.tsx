"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  GripVertical,
  FileText,
  Settings,
  ShoppingBasket,
  ListOrdered,
  Timer,
  Users,
  Scale,
  Flame,
  Globe,
  Tag,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { RecipeFormData, RecipeMode, RecipeFormIngredient, RecipeFormStep } from "@/lib/recipes/types";
import { mapFormToApi } from "@/lib/recipes/types";

const CATEGORIES = [
  { value: "pasta", label: "Паста", icon: "🍝" },
  { value: "soup", label: "Суп", icon: "🍲" },
  { value: "salad", label: "Салат", icon: "🥗" },
  { value: "dessert", label: "Десерт", icon: "🍰" },
  { value: "main", label: "Основное блюдо", icon: "🍖" },
  { value: "appetizer", label: "Закуска", icon: "🥙" },
];

const CUISINES = [
  { value: "italian", label: "Итальянская", flag: "🇮🇹" },
  { value: "french", label: "Французская", flag: "🇫🇷" },
  { value: "japanese", label: "Японская", flag: "🇯🇵" },
  { value: "mexican", label: "Мексиканская", flag: "🇲🇽" },
  { value: "chinese", label: "Китайская", flag: "🇨🇳" },
  { value: "russian", label: "Русская", flag: "🇷🇺" },
  { value: "polish", label: "Польская", flag: "🇵🇱" },
];

const UNITS = [
  { value: "g", label: "г" },
  { value: "kg", label: "кг" },
  { value: "ml", label: "мл" },
  { value: "l", label: "л" },
  { value: "pcs", label: "шт" },
  { value: "tbsp", label: "ст.л." },
  { value: "tsp", label: "ч.л." },
];

const DIFFICULTY_LEVELS = [
  { value: "easy", label: "Легко", color: "bg-green-500" },
  { value: "medium", label: "Средне", color: "bg-yellow-500" },
  { value: "hard", label: "Сложно", color: "bg-red-500" },
];

const STATUS_OPTIONS = [
  { value: "draft", label: "Черновик" },
  { value: "published", label: "Опубликован" },
  { value: "archived", label: "Архив" },
];

interface RecipeFormProps {
  mode: RecipeMode;
  initialData: RecipeFormData;
  recipeId?: string;
}

export function RecipeForm({ mode, initialData, recipeId }: RecipeFormProps) {
  const router = useRouter();
  const { token } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<RecipeFormData>(initialData);

  const [newIngredient, setNewIngredient] = useState({
    name: "",
    quantity: "",
    unit: "g",
  });

  const [newStep, setNewStep] = useState({
    description: "",
    duration: "",
  });

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const isFormValid = () => {
    return formData.localName && formData.ingredients.length > 0 && formData.steps.length > 0;
  };

  const addIngredient = () => {
    if (newIngredient.name && newIngredient.quantity) {
      const ingredient: RecipeFormIngredient = {
        ingredientId: "",
        name: newIngredient.name,
        quantity: Number(newIngredient.quantity),
        unit: newIngredient.unit,
        sortOrder: formData.ingredients.length + 1,
      };
      setFormData({
        ...formData,
        ingredients: [...formData.ingredients, ingredient],
      });
      setNewIngredient({ name: "", quantity: "", unit: "g" });
    }
  };

  const removeIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index),
    });
  };

  const addStep = () => {
    if (newStep.description) {
      const step: RecipeFormStep = {
        stepNumber: formData.steps.length + 1,
        description: newStep.description,
        duration: newStep.duration ? Number(newStep.duration) : undefined,
      };
      setFormData({
        ...formData,
        steps: [...formData.steps, step],
      });
      setNewStep({ description: "", duration: "" });
    }
  };

  const removeStep = (index: number) => {
    const newSteps = formData.steps.filter((_, i) => i !== index);
    const renumberedSteps = newSteps.map((step, i) => ({
      ...step,
      stepNumber: i + 1,
    }));
    setFormData({
      ...formData,
      steps: renumberedSteps,
    });
  };

  const moveStep = (index: number, direction: "up" | "down") => {
    const newSteps = [...formData.steps];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < newSteps.length) {
      [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
      const renumberedSteps = newSteps.map((step, i) => ({
        ...step,
        stepNumber: i + 1,
      }));
      setFormData({
        ...formData,
        steps: renumberedSteps,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    setIsSaving(true);

    try {
      const apiData = mapFormToApi(formData);
      const url = mode === "edit" && recipeId ? `/api/admin/recipes/${recipeId}` : "/api/admin/recipes";
      const method = mode === "edit" ? "PUT" : "POST";

      console.log(`[RecipeForm] ${method} ${url}`, apiData);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка сохранения рецепта");
      }

      const result = await response.json();
      console.log("[RecipeForm] ✅ Успешно сохранено:", result);

      toast.success(mode === "edit" ? "Рецепт обновлён!" : "Рецепт создан!");
      router.push("/admin/catalog");
    } catch (error) {
      console.error("[RecipeForm] ❌ Ошибка:", error);
      toast.error(error instanceof Error ? error.message : "Не удалось сохранить рецепт");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Основная информация
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Название рецепта</Label>
              <Input
                id="title"
                value={formData.localName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    localName: e.target.value,
                    canonicalName: e.target.value.toLowerCase().replace(/\s+/g, "_"),
                  })
                }
                placeholder="Например: Шоколадный торт"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" value={formData.canonicalName} readOnly className="bg-muted" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Краткое описание</Label>
              <Textarea
                id="description"
                value={formData.descriptionPl || ""}
                onChange={(e) => setFormData({ ...formData, descriptionPl: e.target.value })}
                placeholder="2-3 строки о вашем блюде"
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cuisine" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Кухня
              </Label>
              <Select
                value={formData.cuisineId || ""}
                onValueChange={(value) => setFormData({ ...formData, cuisineId: value })}
              >
                <SelectTrigger id="cuisine">
                  <SelectValue placeholder="Выберите кухню" />
                </SelectTrigger>
                <SelectContent>
                  {CUISINES.map((cuisine) => (
                    <SelectItem key={cuisine.value} value={cuisine.value}>
                      {cuisine.flag} {cuisine.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Категория
              </Label>
              <Select
                value={formData.categoryId || ""}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Параметры приготовления
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cookingTime" className="flex items-center gap-1 text-sm">
                <Timer className="w-3 h-3" />
                Время (мин)
              </Label>
              <Input
                id="cookingTime"
                type="number"
                value={formData.timeMinutes}
                onChange={(e) => setFormData({ ...formData, timeMinutes: Number(e.target.value) })}
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="servings" className="flex items-center gap-1 text-sm">
                <Users className="w-3 h-3" />
                Порции
              </Label>
              <Input
                id="servings"
                type="number"
                value={formData.servings}
                onChange={(e) => setFormData({ ...formData, servings: Number(e.target.value) })}
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="portionWeight" className="flex items-center gap-1 text-sm">
                <Scale className="w-3 h-3" />
                Вес (г)
              </Label>
              <Input
                id="portionWeight"
                type="number"
                value={formData.portionWeightGrams || ""}
                onChange={(e) => setFormData({ ...formData, portionWeightGrams: Number(e.target.value) || undefined })}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty" className="flex items-center gap-1 text-sm">
                <Flame className="w-3 h-3" />
                Сложность
              </Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value: any) => setFormData({ ...formData, difficulty: value })}
              >
                <SelectTrigger id="difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${level.color}`} />
                        {level.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm">
                Статус
              </Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      <Badge variant={status.value === "published" ? "default" : "secondary"}>{status.label}</Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBasket className="w-5 h-5" />
              Ингредиенты
            </div>
            <Badge variant="secondary">{formData.ingredients.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.ingredients.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted px-4 py-2 grid grid-cols-[1fr_100px_80px_50px] gap-4 text-sm font-medium">
                <div>Ингредиент</div>
                <div>Количество</div>
                <div>Ед. изм.</div>
                <div></div>
              </div>
              {formData.ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="px-4 py-3 grid grid-cols-[1fr_100px_80px_50px] gap-4 items-center border-t hover:bg-accent/50 transition-colors"
                >
                  <div className="font-medium">{ingredient.name}</div>
                  <div className="text-muted-foreground">{ingredient.quantity}</div>
                  <div className="text-muted-foreground">{ingredient.unit}</div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeIngredient(index)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-[1fr_100px_80px_auto] gap-3 items-end">
            <div className="space-y-2">
              <Label htmlFor="ingredientName" className="text-sm">
                Название
              </Label>
              <Input
                id="ingredientName"
                value={newIngredient.name}
                onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                placeholder="Например: Мука"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addIngredient();
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ingredientAmount" className="text-sm">
                Кол-во
              </Label>
              <Input
                id="ingredientAmount"
                type="number"
                value={newIngredient.quantity}
                onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })}
                placeholder="100"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ingredientUnit" className="text-sm">
                Ед.
              </Label>
              <Select
                value={newIngredient.unit}
                onValueChange={(value) => setNewIngredient({ ...newIngredient, unit: value })}
              >
                <SelectTrigger id="ingredientUnit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="button" onClick={addIngredient} className="gap-2">
              <Plus className="w-4 h-4" />
              Добавить
            </Button>
          </div>

          {formData.ingredients.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm border border-dashed rounded-lg">
              Добавьте хотя бы один ингредиент
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListOrdered className="w-5 h-5" />
              Шаги приготовления
            </div>
            <Badge variant="secondary">{formData.steps.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.steps.length > 0 && (
            <div className="space-y-3">
              {formData.steps.map((step, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center gap-1 pt-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => moveStep(index, "up")}
                          disabled={index === 0}
                          className="h-6 w-6 p-0"
                        >
                          <GripVertical className="w-4 h-4" />
                        </Button>
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => moveStep(index, "down")}
                          disabled={index === formData.steps.length - 1}
                          className="h-6 w-6 p-0"
                        >
                          <GripVertical className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="font-semibold text-sm text-muted-foreground">Шаг {index + 1}</div>
                        <p className="text-foreground leading-relaxed">{step.description}</p>
                        {step.duration && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Timer className="w-3 h-3" />
                            {step.duration} мин
                          </div>
                        )}
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStep(index)}
                        className="self-start"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="space-y-3 border rounded-lg p-4 bg-accent/30">
            <div className="space-y-2">
              <Label htmlFor="stepDescription">Описание шага</Label>
              <Textarea
                id="stepDescription"
                value={newStep.description}
                onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                placeholder="Опишите действие подробно..."
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="flex gap-3">
              <div className="space-y-2 w-40">
                <Label htmlFor="stepTime" className="text-sm">
                  Время (мин, опционально)
                </Label>
                <Input
                  id="stepTime"
                  type="number"
                  value={newStep.duration}
                  onChange={(e) => setNewStep({ ...newStep, duration: e.target.value })}
                  placeholder="10"
                  min="0"
                />
              </div>

              <div className="flex-1 flex items-end">
                <Button type="button" onClick={addStep} className="gap-2 w-full">
                  <Plus className="w-4 h-4" />
                  Добавить шаг
                </Button>
              </div>
            </div>
          </div>

          {formData.steps.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm border border-dashed rounded-lg">
              Добавьте хотя бы один шаг приготовления
            </div>
          )}
        </CardContent>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border py-4 px-4 md:px-8 z-10">
        <div className="mx-auto max-w-5xl flex justify-between items-center gap-4">
          <Button type="button" variant="outline" size="lg" onClick={() => router.back()} disabled={isSaving}>
            Отмена
          </Button>
          <Button type="submit" size="lg" disabled={!isFormValid() || isSaving} className="gap-2">
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                {mode === "edit" ? "Сохранить изменения" : "Создать рецепт"}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
