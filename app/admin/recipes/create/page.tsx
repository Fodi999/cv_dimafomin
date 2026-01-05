"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecipeForm } from "@/components/admin/catalog/recipes/RecipeForm";
import { EMPTY_RECIPE } from "@/lib/recipes/types";

/**
 * Modern Recipe Creation Page
 * 
 * Beautiful card-based form with shadcn components
 * Современный дизайн с пошаговым вводом данных
 */
export default function CreateRecipePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <Link href="/admin/catalog">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Каталог
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight mt-2">Новый рецепт</h2>
          <p className="text-muted-foreground">
            Создайте новый рецепт с подробными инструкциями
          </p>
        </div>
      </div>

      {/* Modern Form Card */}
      <RecipeForm mode="create" initialData={EMPTY_RECIPE} />
    </div>
  );
}
