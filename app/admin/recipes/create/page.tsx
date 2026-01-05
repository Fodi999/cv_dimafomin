"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateRecipeCard } from "@/components/admin/catalog/recipes/CreateRecipeCard";

/**
 * 🍱 Professional Recipe Creation Page
 * 
 * Minimalist card-based form
 * Follows Strapi/Sanity/Notion pattern
 */
export default function CreateRecipePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="border-b bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/catalog">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад до каталогу
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Новий рецепт
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Базова інформація
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CreateRecipeCard />
      </div>
    </div>
  );
}
