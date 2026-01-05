"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecipeForm } from "@/components/admin/catalog/recipes/RecipeForm";
import { EMPTY_RECIPE } from "@/lib/recipes/types";

/**
 * 🍱 Professional Recipe Creation Page
 * 
 * Uses universal RecipeForm component in 'create' mode
 */
export default function CreateRecipePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-gray-50 dark:bg-gray-950 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/catalog/recipes">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад до каталогу
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Створити рецепт
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Universal Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RecipeForm mode="create" initialData={EMPTY_RECIPE} />
      </div>
    </div>
  );
}
