/**
 * AI-assisted dish creation from recipe
 * Recipe + Cost + Margin → Dish Card
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, Check, Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

type DishAIMode = 'edit' | 'preview' | 'saving';

interface DishPreview {
  id?: string;
  title: string;
  description: string;
  cost: number;
  price: number;
  margin: number;
  imageUrl?: string;
  status: 'draft' | 'approved' | 'published';
}

interface CreateDishFromRecipeProps {
  recipeId: string; // Обязательно - приходит из карточки рецепта
}

export function CreateDishFromRecipe({ recipeId }: CreateDishFromRecipeProps) {
  const router = useRouter();
  const { language } = useLanguage();

  // Modes
  const [mode, setMode] = useState<DishAIMode>('edit');
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Recipe data (читаем-only)
  const [recipeTitle, setRecipeTitle] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Dish data (редактируем)
  const [dishTitle, setDishTitle] = useState("");
  const [dishDescription, setDishDescription] = useState("");

  // Finance (главная часть)
  const [cost, setCost] = useState<number>(0);
  const [margin, setMargin] = useState<number>(30); // % (10–100)
  const [price, setPrice] = useState<number>(0);

  // Preview
  const [preview, setPreview] = useState<DishPreview | null>(null);

  // Load recipe context + calculate cost (при старте)
  useEffect(() => {
    if (!recipeId) return;

    const loadRecipeContext = async () => {
      setLoadingRecipe(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Немає токену автентифікації");
          return;
        }

        // 1️⃣ Загружаем рецепт
        console.log("📖 [Dish Create] Loading recipe:", recipeId);
        const recipeRes = await fetch(`/api/admin/recipes/${recipeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!recipeRes.ok) {
          throw new Error("Failed to load recipe");
        }

        const recipeData = await recipeRes.json();
        const recipe = recipeData.data || recipeData;

        console.log("📖 [Dish Create] Recipe loaded:", {
          title: recipe.title,
          imageUrl: recipe.imageUrl,
        });

        setRecipeTitle(recipe.title || "");
        setDishTitle(recipe.title || ""); // Initial dish title = recipe title
        setImagePreview(recipe.imageUrl || null);

        // 2️⃣ Считаем себестоимость (backend на основе холодильника)
        console.log("💰 [Dish Create] Calculating cost for recipe:", recipeId);
        const costRes = await fetch(
          `/api/admin/dishes/calculate-cost?recipeId=${recipeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!costRes.ok) {
          console.warn("⚠️ [Dish Create] Cost calculation failed, using 0");
          setCost(0);
          return;
        }

        const costData = await costRes.json();
        console.log("💰 [Dish Create] Cost calculated:", costData);

        setCost(costData.cost || 0);
      } catch (error) {
        console.error("Error loading recipe context:", error);
        toast.error("Помилка завантаження рецепту");
      } finally {
        setLoadingRecipe(false);
      }
    };

    loadRecipeContext();
  }, [recipeId]);

  // Auto-calculate price based on cost + margin
  useEffect(() => {
    if (cost > 0 && margin > 0) {
      const calculated = cost / (1 - margin / 100);
      setPrice(Number(calculated.toFixed(2)));
      console.log(`💹 [Price Calc] Cost: ${cost}, Margin: ${margin}% → Price: ${calculated.toFixed(2)}`);
    }
  }, [cost, margin]);

  // Validate form
  const validateForm = useCallback(() => {
    if (!dishTitle.trim()) {
      toast.error("Введите название блюда");
      return false;
    }

    if (cost <= 0) {
      toast.error("Себестоимость должна быть > 0");
      return false;
    }

    if (margin < 10 || margin > 100) {
      toast.error("Маржа должна быть от 10% до 100%");
      return false;
    }

    return true;
  }, [dishTitle, cost, margin]);

  // Generate dish preview with AI
  const handlePreview = useCallback(async () => {
    if (!validateForm()) return;

    setPreviewing(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Немає токену автентифікації");
        return;
      }

      console.log("🎯 [Dish Preview] Generating with AI:", {
        recipeId,
        targetMargin: margin,
        language,
      });

      const res = await fetch("/api/admin/dishes/generate-from-recipe", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipeId,
          targetMargin: margin,
          language,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to generate preview");
      }

      const data = await res.json();
      console.log("🎯 [Dish Preview] Generated:", data);

      // Set preview with calculated data
      setPreview({
        id: data.id,
        title: dishTitle,
        description: data.description || "",
        cost,
        price,
        margin,
        imageUrl: imagePreview || undefined,
        status: "draft",
      });

      setMode("preview");
      toast.success("Превью готово!");
    } catch (error: any) {
      console.error("Preview error:", error);
      toast.error(error.message || "Не удалось создать превью");
    } finally {
      setPreviewing(false);
    }
  }, [recipeId, dishTitle, cost, margin, price, imagePreview, language, validateForm]);

  // Edit (return to form)
  const handleEdit = useCallback(() => {
    setMode("edit");
    setPreview(null);
  }, []);

  // Save dish (create or update)
  const handleSave = useCallback(async () => {
    if (!preview) {
      toast.error("Сначала создайте превью с AI");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Немає токену автентифікації");
        return;
      }

      console.log("💾 [Dish Save] Saving:", {
        dishId: preview.id,
        title: preview.title,
        description: preview.description,
        price,
        margin,
      });

      // ❗ Dish уже создан на preview этапе
      // Тут мы просто редактируем / подтверждаем
      const method = preview.id ? "PATCH" : "POST";
      const url = preview.id
        ? `/api/admin/dishes/${preview.id}`
        : `/api/admin/dishes`;

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: preview.title,
          description: preview.description,
          recipeId,
          price,
          margin,
          status: "draft",
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to save dish");
      }

      const result = await res.json();
      console.log("💾 [Dish Save] Success:", result);

      toast.success(`✅ Блюдо "${result.title}" успешно создано!`);

      // Redirect
      setTimeout(() => {
        router.push("/admin/dishes?refresh=" + Date.now());
      }, 1500);
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.message || "Не удалось сохранить блюдо");
      setMode("preview");
    } finally {
      setSaving(false);
    }
  }, [preview, recipeId, price, margin, router]);

  return (
    <div className="space-y-6">
      {/* Loading state */}
      {loadingRecipe && (
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Завантаження рецепту...</p>
          </CardContent>
        </Card>
      )}

      {/* Form - visible in edit mode */}
      {!loadingRecipe && mode === 'edit' && (
        <>
          {/* Recipe Info (read-only) */}
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                📖 Основан на рецепте
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt={recipeTitle}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                )}
                <div>
                  <p className="font-medium text-sm">{recipeTitle}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ингредиенты и технология зафиксированы
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dish Title */}
          <Card>
            <CardHeader>
              <CardTitle>Создать блюдо из рецепта</CardTitle>
              <CardDescription>
                Настройте название, маржу и цену. AI создаст описание.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="dishTitle">Название блюда в меню *</Label>
                <Input
                  id="dishTitle"
                  placeholder="Grilled Salmon Plate"
                  value={dishTitle}
                  onChange={(e) => setDishTitle(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Может отличаться от названия рецепта для маркетинга
                </p>
              </div>

              {/* Finance Block (ключевая часть) */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">💰 Финансы блюда</h3>

                <div className="space-y-6">
                  {/* Cost (read-only) */}
                  <div>
                    <Label htmlFor="cost" className="text-sm text-muted-foreground">
                      Себестоимость (зафиксирована на базе холодильника)
                    </Label>
                    <div className="mt-2 flex items-center gap-2">
                      <Input
                        id="cost"
                        value={cost.toFixed(2)}
                        disabled
                        className="font-mono font-semibold"
                      />
                      <span className="text-sm font-medium text-muted-foreground">
                        PLN
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      ℹ️ Рассчитана на основе текущего состояния холодильника
                    </p>
                  </div>

                  {/* Margin Slider */}
                  <div>
                    <Label htmlFor="margin" className="text-sm font-semibold">
                      Целевая маржа: <span className="text-primary">{margin}%</span>
                    </Label>
                    <div className="mt-3 space-y-3">
                      <input
                        id="margin"
                        type="range"
                        min={10}
                        max={100}
                        step={5}
                        value={margin}
                        onChange={(e) => setMargin(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>10%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      💡 Классическая маржа в ресторане: 30-50%
                    </p>
                  </div>

                  {/* Price (calculated) */}
                  <div>
                    <Label htmlFor="price" className="text-sm text-muted-foreground">
                      Розничная цена (автоматическая)
                    </Label>
                    <div className="mt-2 flex items-center gap-2">
                      <Input
                        id="price"
                        value={price.toFixed(2)}
                        disabled
                        className="font-mono font-bold text-lg bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                      />
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        PLN
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Формула: Cost ÷ (1 - Margin ÷ 100)
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handlePreview}
                  disabled={previewing || loadingRecipe}
                  className="flex-1"
                >
                  {previewing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Генерация...
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Превью с AI
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Preview - visible in preview and saving modes */}
      {(mode === 'preview' || mode === 'saving') && preview && (
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle>Превью блюда</CardTitle>
            <CardDescription>
              AI сгенерировал описание на основе рецепта и маржи
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Image */}
            {preview.imageUrl && (
              <div className="relative aspect-video max-w-2xl mx-auto rounded-lg overflow-hidden border-2 border-blue-200 dark:border-blue-800">
                <img
                  src={preview.imageUrl}
                  alt={preview.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex items-center gap-2">
                  <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                    📷 Блюдо
                  </span>
                  {preview.status === 'draft' && (
                    <span className="px-2 py-1 bg-amber-500 text-white text-xs rounded-full">
                      DRAFT
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Title */}
            <div>
              <h3 className="font-semibold text-lg">{preview.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">На основе: {recipeTitle}</p>
            </div>

            {/* Description */}
            {preview.description && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Описание</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {preview.description}
                </p>
              </div>
            )}

            {/* Finance Summary */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div>
                <p className="text-xs text-muted-foreground">Себестоимость</p>
                <p className="font-bold text-lg text-gray-900 dark:text-white">
                  {preview.cost.toFixed(2)} PLN
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Маржа</p>
                <p className="font-bold text-lg text-primary">{preview.margin}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Цена</p>
                <p className="font-bold text-lg text-green-600 dark:text-green-400">
                  {preview.price.toFixed(2)} PLN
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                disabled={mode === 'saving'}
                className="flex-1"
              >
                ✏️ Назад к редактированию
              </Button>

              <Button
                size="sm"
                onClick={handleSave}
                disabled={mode === 'saving'}
                className="flex-1"
              >
                {mode === 'saving' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Создать блюдо (Draft)
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
