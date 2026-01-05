"use client";

// Recipe Edit Form - Professional form with react-hook-form & zod validation

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Recipe } from "@/hooks/useAdminRecipes";
import { Save, X } from "lucide-react";

// Zod Schema
const recipeSchema = z.object({
  localName: z.string().min(1, "Назва обов'язкова"),
  canonicalName: z.string().min(1, "Canonical name обов'язкова"),
  descriptionPl: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionRu: z.string().optional(),
  cuisine: z.string().min(1, "Кухня обов'язкова"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  status: z.enum(["draft", "published", "archived"]),
  timeMinutes: z.number().min(1, "Час приготування обов'язковий"),
  servings: z.number().min(1, "Кількість порцій обов'язкова"),
  portionWeightGrams: z.number().optional(),
  namePl: z.string().optional(),
  nameEn: z.string().optional(),
  nameUk: z.string().optional(),
  nameRu: z.string().optional(),
  country: z.string().optional(),
  region: z.string().optional(),
});

type RecipeFormData = z.infer<typeof recipeSchema>;

interface EditRecipeFormProps {
  recipe: Recipe;
  onCancel: () => void;
}

export function EditRecipeForm({ recipe, onCancel }: EditRecipeFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      localName: recipe.localName || "",
      canonicalName: recipe.canonicalName || "",
      descriptionPl: recipe.descriptionPl || "",
      descriptionEn: recipe.descriptionEn || "",
      descriptionRu: recipe.descriptionRu || "",
      cuisine: recipe.cuisine || "",
      difficulty: recipe.difficulty || "medium",
      status: recipe.status || "draft",
      timeMinutes: recipe.timeMinutes || 30,
      servings: recipe.servings || 1,
      portionWeightGrams: recipe.portionWeightGrams || undefined,
      namePl: recipe.namePl || "",
      nameEn: recipe.nameEn || "",
      nameUk: recipe.nameUk || "",
      nameRu: recipe.nameRu || "",
      country: recipe.country || "",
      region: recipe.region || "",
    },
  });

  const difficultyValue = watch("difficulty");
  const statusValue = watch("status");

  const onSubmit = async (data: RecipeFormData) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/recipes/${recipe.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update recipe");
      }

      toast.success("Рецепт успішно оновлено");
      router.push("/admin/catalog");
    } catch (error) {
      console.error("Error updating recipe:", error);
      toast.error("Помилка при оновленні рецепта");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm(
        "У вас є незбережені зміни. Ви впевнені, що хочете вийти?"
      );
      if (!confirmed) return;
    }
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="text-sm">
          {isDirty && (
            <span className="text-orange-600 dark:text-orange-400 font-medium">
              • Незбережені зміни
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
          >
            <X className="w-4 h-4 mr-2" />
            Скасувати
          </Button>
          <Button type="submit" disabled={isSaving || !isDirty}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Збереження..." : "Зберегти"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 h-9 p-0.5 bg-gray-100 dark:bg-gray-800">
          <TabsTrigger value="basic" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-1.5">
            Основне
          </TabsTrigger>
          <TabsTrigger value="ingredients" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-1.5">
            Інгредієнти
          </TabsTrigger>
          <TabsTrigger value="steps" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-1.5">
            Кроки
          </TabsTrigger>
          <TabsTrigger value="translations" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-1.5">
            Переклади
          </TabsTrigger>
          <TabsTrigger value="technical" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-1.5">
            Технічне
          </TabsTrigger>
        </TabsList>

        {/* Tab: Основне */}
        <TabsContent value="basic" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Local Name */}
            <div className="space-y-2">
              <Label htmlFor="localName">Назва *</Label>
              <Input
                id="localName"
                {...register("localName")}
                placeholder="Pierogi ruskie"
              />
              {errors.localName && (
                <p className="text-sm text-red-500">{errors.localName.message}</p>
              )}
            </div>

            {/* Canonical Name */}
            <div className="space-y-2">
              <Label htmlFor="canonicalName">Canonical Name *</Label>
              <Input
                id="canonicalName"
                {...register("canonicalName")}
                placeholder="pierogi-ruskie"
              />
              {errors.canonicalName && (
                <p className="text-sm text-red-500">{errors.canonicalName.message}</p>
              )}
            </div>

            {/* Cuisine */}
            <div className="space-y-2">
              <Label htmlFor="cuisine">Кухня *</Label>
              <Input
                id="cuisine"
                {...register("cuisine")}
                placeholder="Польська"
              />
              {errors.cuisine && (
                <p className="text-sm text-red-500">{errors.cuisine.message}</p>
              )}
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <Label htmlFor="difficulty">Складність *</Label>
              <Select
                value={difficultyValue}
                onValueChange={(value) => setValue("difficulty", value as "easy" | "medium" | "hard", { shouldDirty: true })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Легкий</SelectItem>
                  <SelectItem value="medium">Середній</SelectItem>
                  <SelectItem value="hard">Складний</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Статус *</Label>
              <Select
                value={statusValue}
                onValueChange={(value) => setValue("status", value as "draft" | "published" | "archived", { shouldDirty: true })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Чернетка</SelectItem>
                  <SelectItem value="published">Опубліковано</SelectItem>
                  <SelectItem value="archived">Архів</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label htmlFor="timeMinutes">Час (хвилини) *</Label>
              <Input
                id="timeMinutes"
                type="number"
                {...register("timeMinutes", { valueAsNumber: true })}
                placeholder="30"
              />
              {errors.timeMinutes && (
                <p className="text-sm text-red-500">{errors.timeMinutes.message}</p>
              )}
            </div>

            {/* Servings */}
            <div className="space-y-2">
              <Label htmlFor="servings">Порції *</Label>
              <Input
                id="servings"
                type="number"
                {...register("servings", { valueAsNumber: true })}
                placeholder="4"
              />
              {errors.servings && (
                <p className="text-sm text-red-500">{errors.servings.message}</p>
              )}
            </div>

            {/* Portion Weight */}
            <div className="space-y-2">
              <Label htmlFor="portionWeightGrams">Вага порції (грами)</Label>
              <Input
                id="portionWeightGrams"
                type="number"
                {...register("portionWeightGrams", { valueAsNumber: true })}
                placeholder="200"
              />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country">Країна</Label>
              <Input
                id="country"
                {...register("country")}
                placeholder="Польща"
              />
            </div>

            {/* Region */}
            <div className="space-y-2">
              <Label htmlFor="region">Регіон</Label>
              <Input
                id="region"
                {...register("region")}
                placeholder="Західна Україна"
              />
            </div>
          </div>

          {/* Description PL */}
          <div className="space-y-2">
            <Label htmlFor="descriptionPl">Опис (Польська)</Label>
            <Textarea
              id="descriptionPl"
              {...register("descriptionPl")}
              placeholder="Короткий опис рецепта..."
              rows={3}
            />
          </div>

          {/* Description EN */}
          <div className="space-y-2">
            <Label htmlFor="descriptionEn">Опис (Англійська)</Label>
            <Textarea
              id="descriptionEn"
              {...register("descriptionEn")}
              placeholder="Short recipe description..."
              rows={3}
            />
          </div>

          {/* Description RU */}
          <div className="space-y-2">
            <Label htmlFor="descriptionRu">Опис (Російська)</Label>
            <Textarea
              id="descriptionRu"
              {...register("descriptionRu")}
              placeholder="Краткое описание рецепта..."
              rows={3}
            />
          </div>
        </TabsContent>

        {/* Tab: Інгредієнти */}
        <TabsContent value="ingredients" className="space-y-4">
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>🚧 Редагування інгредієнтів буде додано в наступній версії</p>
            <p className="text-sm mt-2">Зараз тільки перегляд</p>
          </div>
        </TabsContent>

        {/* Tab: Кроки */}
        <TabsContent value="steps" className="space-y-4">
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>🚧 Редагування кроків буде додано в наступній версії</p>
            <p className="text-sm mt-2">Зараз тільки перегляд</p>
          </div>
        </TabsContent>

        {/* Tab: Переклади */}
        <TabsContent value="translations" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Name PL */}
            <div className="space-y-2">
              <Label htmlFor="namePl">🇵🇱 Назва (Польська)</Label>
              <Input
                id="namePl"
                {...register("namePl")}
                placeholder="Pierogi ruskie"
              />
            </div>

            {/* Name EN */}
            <div className="space-y-2">
              <Label htmlFor="nameEn">🇬🇧 Назва (Англійська)</Label>
              <Input
                id="nameEn"
                {...register("nameEn")}
                placeholder="Rustic Dumplings"
              />
            </div>

            {/* Name UK */}
            <div className="space-y-2">
              <Label htmlFor="nameUk">🇺🇦 Назва (Українська)</Label>
              <Input
                id="nameUk"
                {...register("nameUk")}
                placeholder="Вареники з картоплею"
              />
            </div>

            {/* Name RU */}
            <div className="space-y-2">
              <Label htmlFor="nameRu">🇷🇺 Назва (Російська)</Label>
              <Input
                id="nameRu"
                {...register("nameRu")}
                placeholder="Вареники с картофелем"
              />
            </div>
          </div>
        </TabsContent>

        {/* Tab: Технічне */}
        <TabsContent value="technical" className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
            <dl className="grid grid-cols-2 gap-4 text-sm font-mono">
              <div>
                <dt className="text-gray-500 dark:text-gray-400 mb-1">ID</dt>
                <dd className="text-gray-900 dark:text-white">{recipe.id}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400 mb-1">Canonical Name</dt>
                <dd className="text-gray-900 dark:text-white">{recipe.canonicalName}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400 mb-1">Category</dt>
                <dd className="text-gray-900 dark:text-white">{recipe.category || "—"}</dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400 mb-1">Views</dt>
                <dd className="text-gray-900 dark:text-white">{recipe.views || 0}</dd>
              </div>
              {recipe.createdAt && (
                <div>
                  <dt className="text-gray-500 dark:text-gray-400 mb-1">Created</dt>
                  <dd className="text-gray-900 dark:text-white text-xs">
                    {new Date(recipe.createdAt).toLocaleString("uk-UA")}
                  </dd>
                </div>
              )}
              {recipe.updatedAt && (
                <div>
                  <dt className="text-gray-500 dark:text-gray-400 mb-1">Updated</dt>
                  <dd className="text-gray-900 dark:text-white text-xs">
                    {new Date(recipe.updatedAt).toLocaleString("uk-UA")}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  );
}
