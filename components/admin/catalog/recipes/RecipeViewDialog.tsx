"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Users, ChefHat, Eye, MapPin, Flame, Weight } from "lucide-react";
import { Recipe } from "@/hooks/useAdminRecipes";

interface RecipeViewDialogProps {
  recipe: Recipe | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const difficultyColors = {
  easy: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  hard: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const difficultyLabels = {
  easy: "Легкий",
  medium: "Середній",
  hard: "Складний",
};

const statusColors = {
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  published: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  archived: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
};

const statusLabels = {
  draft: "Чернетка",
  published: "Опубліковано",
  archived: "Архів",
};

// ============= UI Components =============

/** KPI Stat Card */
function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 text-center bg-white dark:bg-gray-800">
      <div className="flex items-center justify-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}

/** Section wrapper */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
      {children}
    </div>
  );
}

/** Metadata row */
function MetaRow({ label, value }: { label: string; value: string | number | undefined }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}

// ============= Main Component =============

export function RecipeViewDialog({ recipe, open, onOpenChange }: RecipeViewDialogProps) {
  if (!recipe) return null;

  const title = recipe.localName || recipe.canonicalName || recipe.title || 'Без назви';
  const description = recipe.descriptionPl || recipe.descriptionEn || recipe.description || '';

  // Translations (title)
  const titleTranslations = [
    { lang: 'pl', label: '🇵🇱 Польська', value: recipe.namePl },
    { lang: 'en', label: '🇬🇧 Англійська', value: recipe.nameEn },
    { lang: 'uk', label: '🇺🇦 Українська', value: recipe.nameUk },
    { lang: 'ru', label: '🇷🇺 Російська', value: recipe.nameRu },
  ].filter(t => t.value);

  // Translations (description)
  const descTranslations = [
    { lang: 'pl', label: '🇵🇱 Польська', value: recipe.descriptionPl },
    { lang: 'en', label: '🇬🇧 Англійська', value: recipe.descriptionEn },
    { lang: 'ru', label: '🇷🇺 Російська', value: recipe.descriptionRu },
  ].filter(t => t.value);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]" aria-describedby="recipe-description">
        
        {/* ========== HEADER (компактный) ========== */}
        <DialogHeader className="space-y-2 pb-2">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
            {title}
          </DialogTitle>
          <DialogDescription id="recipe-description" className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </DialogDescription>
          
          {/* Badges (компактно в одну строку) */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <Badge className={`${difficultyColors[recipe.difficulty]} text-xs`}>
              {difficultyLabels[recipe.difficulty]}
            </Badge>
            <Badge className={`${statusColors[recipe.status]} text-xs`}>
              {statusLabels[recipe.status]}
            </Badge>
            <Badge variant="outline" className="capitalize text-xs">
              🍽️ {recipe.cuisine || recipe.category}
            </Badge>
          </div>
        </DialogHeader>

        {/* ========== KPI METRICS ========== */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 my-4">
          <StatCard 
            icon={Clock} 
            label="Час" 
            value={`${recipe.timeMinutes || recipe.cooking_time} хв`} 
          />
          <StatCard 
            icon={Users} 
            label="Порції" 
            value={recipe.servings} 
          />
          <StatCard 
            icon={Weight} 
            label="Вага" 
            value={recipe.portionWeightGrams ? `${recipe.portionWeightGrams} г` : '—'} 
          />
          <StatCard 
            icon={ChefHat} 
            label="Інгредієнтів" 
            value={recipe.ingredients?.length || 0} 
          />
          <StatCard 
            icon={Eye} 
            label="Перегляди" 
            value={recipe.views || 0} 
          />
        </div>

        {/* ========== TABS ========== */}
        <Tabs defaultValue="overview" className="flex-1">
          <TabsList className="grid w-full grid-cols-5 h-9 p-0.5 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-semibold py-1.5"
            >
              Огляд
            </TabsTrigger>
            <TabsTrigger 
              value="translations"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-semibold py-1.5"
            >
              Переклади
            </TabsTrigger>
            <TabsTrigger 
              value="nutrition"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-semibold py-1.5"
            >
              Харчова
            </TabsTrigger>
            <TabsTrigger 
              value="steps"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-semibold py-1.5"
            >
              Кроки
            </TabsTrigger>
            <TabsTrigger 
              value="tech"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:font-semibold py-1.5"
            >
              Технічне
            </TabsTrigger>
          </TabsList>

          {/* Scrollable Content */}
          <div className="max-h-[calc(90vh-360px)] overflow-y-auto pr-2 mt-4">
            
            {/* ========== TAB: Overview ========== */}
            <TabsContent value="overview" className="space-y-4 m-0">
              
              {/* Ingredients - ПРИОРИТЕТ #1 (всегда показываем) */}
              <Section title="🧺 Інгредієнти">
                {recipe.ingredients && recipe.ingredients.length > 0 ? (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="text-left py-2.5 px-4 font-semibold text-gray-900 dark:text-white">
                            Інгредієнт
                          </th>
                          <th className="text-right py-2.5 px-4 font-semibold text-gray-900 dark:text-white">
                            Кількість
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {recipe.ingredients.map((ingredient, index) => (
                          <tr 
                            key={index}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <td className="py-2.5 px-4 text-gray-900 dark:text-white">
                              {ingredient.name || ingredient.ingredientName || 'Без назви'}
                            </td>
                            <td className="py-2.5 px-4 text-right font-medium text-primary">
                              {ingredient.quantity || ingredient.amount || ''} {ingredient.unit || ''}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                    <ChefHat className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Інгредієнти ще не додані</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      Додайте інгредієнти через редагування рецепта
                    </p>
                  </div>
                )}
              </Section>

              {/* Origin */}
              {(recipe.country || recipe.region) && (
                <Section title="📍 Походження">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-2">
                    {recipe.country && <MetaRow label="Країна" value={recipe.country} />}
                    {recipe.region && <MetaRow label="Регіон" value={recipe.region} />}
                  </div>
                </Section>
              )}
            </TabsContent>

            {/* ========== TAB: Translations ========== */}
            <TabsContent value="translations" className="space-y-4 m-0">
              
              {/* Title Translations */}
              {titleTranslations.length > 0 && (
                <Section title="Назва">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-2">
                    {titleTranslations.map((t) => (
                      <MetaRow key={t.lang} label={t.label} value={t.value} />
                    ))}
                  </div>
                </Section>
              )}

              {/* Description Translations */}
              {descTranslations.length > 0 && (
                <Section title="Опис">
                  <div className="space-y-3">
                    {descTranslations.map((t) => (
                      <div key={t.lang} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-l-4 border-primary">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                          {t.label}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {t.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Empty State */}
              {!titleTranslations.length && !descTranslations.length && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>🌐 Переклади відсутні</p>
                </div>
              )}
            </TabsContent>

            {/* ========== TAB: Nutrition ========== */}
            <TabsContent value="nutrition" className="space-y-4 m-0">
              {recipe.nutritionProfile ? (
                <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    {recipe.nutritionProfile.type && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Тип</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                          {recipe.nutritionProfile.type}
                        </p>
                      </div>
                    )}
                    {recipe.nutritionProfile.calories && (
                      <div className="text-right">
                        <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                        <p className="text-3xl font-bold text-primary">
                          {recipe.nutritionProfile.calories}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">ккал</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>🍎 Харчова цінність не вказана</p>
                </div>
              )}
            </TabsContent>

            {/* ========== TAB: Steps ========== */}
            <TabsContent value="steps" className="space-y-4 m-0">
              {recipe.steps && recipe.steps.length > 0 ? (
                <ol className="space-y-3">
                  {recipe.steps.map((step, index) => {
                    const stepText = step.description || step.text || step.instruction || '';
                    return (
                      <li key={index} className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <span className="flex-shrink-0 w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                          {step.stepNumber || index + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {stepText}
                          </p>
                          {step.duration && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              ⏱ {step.duration} хв
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p>📋 Кроки приготування відсутні</p>
                </div>
              )}
            </TabsContent>

            {/* ========== TAB: Technical ========== */}
            <TabsContent value="tech" className="space-y-4 m-0">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <dl className="grid grid-cols-2 gap-3 text-sm font-mono">
                  <div>
                    <dt className="text-xs text-gray-500 dark:text-gray-400 mb-1">ID</dt>
                    <dd className="text-gray-900 dark:text-white">{recipe.id}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500 dark:text-gray-400 mb-1">Canonical Name</dt>
                    <dd className="text-gray-900 dark:text-white">{recipe.canonicalName}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500 dark:text-gray-400 mb-1">Category</dt>
                    <dd className="text-gray-900 dark:text-white">{recipe.category}</dd>
                  </div>
                  {recipe.source && (
                    <>
                      <div>
                        <dt className="text-xs text-gray-500 dark:text-gray-400 mb-1">Source Type</dt>
                        <dd className="text-gray-900 dark:text-white">{recipe.source.type}</dd>
                      </div>
                      {recipe.source.reference && (
                        <div className="col-span-2">
                          <dt className="text-xs text-gray-500 dark:text-gray-400 mb-1">Reference</dt>
                          <dd className="text-gray-900 dark:text-white break-all">{recipe.source.reference}</dd>
                        </div>
                      )}
                    </>
                  )}
                  {recipe.createdAt && (
                    <div>
                      <dt className="text-xs text-gray-500 dark:text-gray-400 mb-1">Created</dt>
                      <dd className="text-gray-900 dark:text-white text-xs">
                        {new Date(recipe.createdAt).toLocaleString('uk-UA')}
                      </dd>
                    </div>
                  )}
                  {recipe.updatedAt && (
                    <div>
                      <dt className="text-xs text-gray-500 dark:text-gray-400 mb-1">Updated</dt>
                      <dd className="text-gray-900 dark:text-white text-xs">
                        {new Date(recipe.updatedAt).toLocaleString('uk-UA')}
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
