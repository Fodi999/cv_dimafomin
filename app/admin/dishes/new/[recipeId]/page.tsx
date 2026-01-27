"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ChefHat } from "lucide-react";
import Link from "next/link";
import { CreateDishFromRecipe } from "@/components/admin/dishes/CreateDishFromRecipe";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{
    recipeId: string;
  }>;
}

export default function CreateDishPage({ params }: PageProps) {
  const { recipeId } = use(params);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header with Navigation */}
      <div className="sticky top-16 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/dishes/new">
              <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ChefHat className="w-6 h-6 text-orange-500" />
                Создать блюдо
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Из рецепта: <span className="font-semibold">{recipeId}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CreateDishFromRecipe recipeId={recipeId} />
        </motion.div>
      </main>
    </div>
  );
}
