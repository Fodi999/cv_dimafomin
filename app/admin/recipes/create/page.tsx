"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateRecipeCard } from "@/components/admin/catalog/recipes/CreateRecipeCard";

/**
 * Professional Recipe Creation Page
 * 
 * Minimalist card-based form
 * Follows Strapi/Sanity/Notion pattern
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
          <h2 className="text-3xl font-bold tracking-tight mt-2">Новий рецепт</h2>
          <p className="text-muted-foreground">
            Створіть новий рецепт із базовою інформацією
          </p>
        </div>
      </div>

      {/* Form Card */}
      <CreateRecipeCard />
    </div>
  );
}
