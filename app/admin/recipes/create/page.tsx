/**
 * AI-assisted recipe creation/edit page
 * Replaced old manual form with AI-powered creation
 */

"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateRecipeWithAI } from "@/components/admin/recipes/CreateRecipeWithAI";

export default function CreateRecipePage() {
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditMode = !!editId;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/catalog/recipes-list">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Каталог рецептів
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight mt-2">
            {isEditMode ? 'Редагувати рецепт' : 'Создать рецепт с AI'}
          </h2>
          <p className="text-muted-foreground">
            {isEditMode 
              ? 'Оновіть дані рецепту — AI допоможе покращити деталі'
              : 'Минимум данных — AI создаст полный рецепт'
            }
          </p>
        </div>
      </div>

      {/* AI Form */}
      <CreateRecipeWithAI recipeId={editId || undefined} />
    </div>
  );
}
