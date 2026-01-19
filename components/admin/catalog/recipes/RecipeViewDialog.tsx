"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Clock, Users, ChefHat, MapPin, Flame, Sparkles, Database, X } from "lucide-react";
import { Recipe } from "@/hooks/useAdminRecipes";

interface RecipeViewDialogProps {
  recipe: Recipe | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
}

const difficultyLabels = {
  easy: "Легкий",
  medium: "Середній",
  hard: "Складний",
};

const categoryIcons: Record<string, string> = {
  main: "🍽️",
  soup: "🍲", 
  salad: "🥗",
  dessert: "🍰",
  breakfast: "🍳",
  snack: "🍿",
  drink: "🥤",
};

/** Metric strip component (2025 style) */
function Metric({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
  return (
    <div className="flex-1 p-4 text-center">
      <Icon className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      {children}
    </div>
  );
}

export function RecipeViewDialog({ recipe, open, onOpenChange, isLoading = false }: RecipeViewDialogProps) {
  const router = useRouter();
  
  if (!recipe) return null;

  const title = recipe.title || recipe.localName || recipe.canonicalName || 'Без назви';
  const description = recipe.descriptionRu || recipe.descriptionPl || recipe.descriptionEn || recipe.description || '';

  // Loading skeleton
  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[95vh] p-0 gap-0 overflow-hidden">
          <VisuallyHidden>
            <DialogTitle>Завантаження рецепта...</DialogTitle>
          </VisuallyHidden>
          <div className="h-80 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 animate-pulse" />
          <div className="p-6 space-y-4">
            <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const getSteps = () => {
    const stepsData = recipe.stepsRu || recipe.stepsPl || recipe.stepsEn || recipe.steps;
    if (Array.isArray(stepsData) && stepsData.length > 0) {
      return stepsData.map((step: any, index: number) => ({
        stepNumber: step.order || index + 1,
        text: step.text || step.description || '',
        duration: step.time || step.duration,
      }));
    }
    return [];
  };

  const steps = getSteps();
  const isAIGenerated = recipe.source?.type === 'professional' || recipe.source?.generator;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] p-0 gap-0 overflow-hidden [&>button]:hidden" aria-describedby="recipe-description">
        
        {/* Hidden title for accessibility */}
        <VisuallyHidden>
          <DialogTitle>{title}</DialogTitle>
        </VisuallyHidden>

        {/* ========== HERO BLOCK (2025 style) ========== */}
        {recipe.imageUrl ? (
          <div className="relative h-80 overflow-hidden">
            <img
              src={recipe.imageUrl}
              alt={title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Close button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 backdrop-blur-sm transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Content overlay */}
            <div className="relative z-10 p-8 flex flex-col justify-end h-full">
              <h1 id="recipe-description" className="text-4xl font-bold text-white leading-tight mb-3">
                {title}
              </h1>

              {description && (
                <p className="text-white/90 max-w-2xl text-base mb-4 leading-relaxed">
                  {description}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {recipe.difficulty && (
                  <Badge className="bg-white/95 text-black hover:bg-white text-sm px-3 py-1">
                    {difficultyLabels[recipe.difficulty]}
                  </Badge>
                )}
                {recipe.category && (
                  <Badge className="bg-white/95 text-black hover:bg-white text-sm px-3 py-1">
                    {categoryIcons[recipe.category]} {recipe.category}
                  </Badge>
                )}
                {recipe.country && (
                  <Badge className="bg-white/95 text-black hover:bg-white text-sm px-3 py-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {recipe.country.toUpperCase()}
                  </Badge>
                )}
                {isAIGenerated && (
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 text-sm px-3 py-1">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Generated
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Fallback if no image
          <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-8 flex flex-col justify-end">
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            {description && <p className="text-muted-foreground max-w-2xl">{description}</p>}
          </div>
        )}

        {/* ========== METRIC STRIP (2025 style) ========== */}
        <div className="flex divide-x border-y bg-white dark:bg-gray-950">
          <Metric icon={Clock} label="Час" value={`${recipe.timeMinutes || 0} хв`} />
          <Metric icon={Users} label="Порції" value={recipe.servings || 1} />
          <Metric icon={ChefHat} label="Інгредієнти" value={recipe.ingredients?.length || 0} />
        </div>

        {/* ========== TABS (sticky + icons) ========== */}
        <Tabs defaultValue="overview" className="flex-1">
          <TabsList className="sticky top-0 z-20 w-full grid grid-cols-3 h-11 p-1 bg-background/95 backdrop-blur-md border-b shadow-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2">
              🧺 Огляд
            </TabsTrigger>
            <TabsTrigger value="steps" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2">
              👣 Кроки
            </TabsTrigger>
            <TabsTrigger value="tech" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2">
              ⚙️ Дані
            </TabsTrigger>
          </TabsList>

          <div className="max-h-[calc(95vh-520px)] overflow-y-auto px-6 py-4">
            <TabsContent value="overview" className="space-y-6 m-0">
              
              {/* ========== Ingredients (cards 2025) ========== */}
              <Section title="🧺 Інгредієнти">
                {recipe.ingredients && recipe.ingredients.length > 0 ? (
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient: any, index: number) => (
                      <li
                        key={ingredient.id || index}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <span className="font-medium text-gray-900 dark:text-white">
                          {ingredient.ingredient?.nameRu || ingredient.ingredient?.namePl || ingredient.ingredient?.nameEn || ingredient.name || 'Без назви'}
                        </span>
                        <span className="text-sm text-muted-foreground font-mono">
                          {ingredient.quantity || ingredient.amount || ''} {ingredient.unit || ''}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/30 dark:to-gray-900/30 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                    <ChefHat className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <p className="text-gray-500 dark:text-gray-400 font-semibold mb-2">Інгредієнти ще не додані</p>
                    {isAIGenerated && (
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        Цей рецепт згенерований AI. Використовуйте кнопку редагування в таблиці для додавання інгредієнтів.
                      </p>
                    )}
                  </div>
                )}
              </Section>

              {/* Nutrition Profile (premium cards) */}
              {recipe.nutritionProfile && recipe.nutritionProfile.calories && (
                <Section title="🍎 Харчова цінність">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-xl text-center border border-orange-200/50 dark:border-orange-800/30">
                      <Flame className="w-7 h-7 text-orange-500 mx-auto mb-2" />
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{recipe.nutritionProfile.calories}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">ккал</p>
                    </div>
                    {recipe.nutritionProfile.protein !== undefined && recipe.nutritionProfile.protein > 0 && (
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl text-center border border-blue-200/50 dark:border-blue-800/30">
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{recipe.nutritionProfile.protein}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">г білка</p>
                      </div>
                    )}
                    {recipe.nutritionProfile.fat !== undefined && recipe.nutritionProfile.fat > 0 && (
                      <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 rounded-xl text-center border border-yellow-200/50 dark:border-yellow-800/30">
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{recipe.nutritionProfile.fat}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">г жирів</p>
                      </div>
                    )}
                    {recipe.nutritionProfile.carbohydrate !== undefined && recipe.nutritionProfile.carbohydrate > 0 && (
                      <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl text-center border border-green-200/50 dark:border-green-800/30">
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{recipe.nutritionProfile.carbohydrate}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">г вуглев.</p>
                      </div>
                    )}
                  </div>
                </Section>
              )}
            </TabsContent>

            {/* ========== TAB: Steps (timeline 2025) ========== */}
            <TabsContent value="steps" className="space-y-4 m-0">
              {steps && steps.length > 0 ? (
                <ol className="relative border-l-2 border-gray-200 dark:border-gray-800 ml-4 space-y-8 py-2">
                  {steps.map((step: any, index: number) => (
                    <li key={index} className="ml-6">
                      <span className="absolute -left-4 flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary to-purple-600 text-white rounded-full text-sm font-bold shadow-lg">
                        {step.stepNumber || index + 1}
                      </span>
                      <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                        <p className="text-sm leading-relaxed text-gray-900 dark:text-white">{step.text}</p>
                        {step.duration && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{step.duration} хв</span>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="text-center py-16 text-gray-500">
                  <p className="text-xl font-semibold mb-2">📋 Кроки приготування відсутні</p>
                  <p className="text-sm text-muted-foreground">Використовуйте кнопку редагування в таблиці для додавання кроків</p>
                </div>
              )}
            </TabsContent>

            {/* ========== TAB: Technical (premium design) ========== */}
            <TabsContent value="tech" className="space-y-4 m-0">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Database className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold">Технічні дані</h4>
                </div>
                
                <dl className="space-y-4 text-sm">
                  <div className="p-3 bg-white dark:bg-gray-950 rounded-lg">
                    <dt className="text-xs font-medium text-muted-foreground mb-2">ID рецепта</dt>
                    <dd className="font-mono text-xs text-gray-900 dark:text-white break-all bg-gray-100 dark:bg-gray-900 p-2 rounded">
                      {recipe.id}
                    </dd>
                  </div>
                  
                  {recipe.source && (
                    <div className="p-3 bg-white dark:bg-gray-950 rounded-lg">
                      <dt className="text-xs font-medium text-muted-foreground mb-2">Джерело</dt>
                      <dd className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs font-mono">
                          {recipe.source.type}
                        </Badge>
                        {recipe.source.generator && (
                          <Badge className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            <Sparkles className="w-3 h-3 mr-1" />
                            {recipe.source.generator}
                          </Badge>
                        )}
                      </dd>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3">
                    {recipe.createdAt && (
                      <div className="p-3 bg-white dark:bg-gray-950 rounded-lg">
                        <dt className="text-xs font-medium text-muted-foreground mb-2">Створено</dt>
                        <dd className="text-xs text-gray-900 dark:text-white">
                          {new Date(recipe.createdAt).toLocaleString('uk-UA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </dd>
                      </div>
                    )}
                    
                    {recipe.updatedAt && (
                      <div className="p-3 bg-white dark:bg-gray-950 rounded-lg">
                        <dt className="text-xs font-medium text-muted-foreground mb-2">Оновлено</dt>
                        <dd className="text-xs text-gray-900 dark:text-white">
                          {new Date(recipe.updatedAt).toLocaleString('uk-UA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </dd>
                      </div>
                    )}
                  </div>
                  
                  {recipe.imagePublicId && (
                    <div className="p-3 bg-white dark:bg-gray-950 rounded-lg">
                      <dt className="text-xs font-medium text-muted-foreground mb-2">Image Public ID (Cloudinary)</dt>
                      <dd className="font-mono text-xs text-gray-900 dark:text-white break-all bg-gray-100 dark:bg-gray-900 p-2 rounded">
                        {recipe.imagePublicId}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
