"use client";

import { motion } from "framer-motion";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { useLanguage } from "@/contexts/LanguageContext";

const MOCK_RECIPES = [
  {
    id: "1",
    title: "Signature Sushi Roll",
    imageUrl: "https://i.postimg.cc/B63F53xY/DSCF4622.jpg",
    author: { name: "Dima Fomin", avatar: "https://i.postimg.cc/k4SPVGzv/avatar.jpg" },
    difficulty: "intermediate" as const,
    likes: 1250,
    comments: 45,
    cookingTime: 25,
    category: "Sushi",
  },
  {
    id: "2",
    title: "Fresh Nigiri Assortment",
    imageUrl: "https://i.postimg.cc/ZKbct8yq/DSCF4592_Original.jpg",
    author: { name: "Dima Fomin", avatar: "https://i.postimg.cc/k4SPVGzv/avatar.jpg" },
    difficulty: "beginner" as const,
    likes: 2100,
    comments: 78,
    cookingTime: 20,
    category: "Sushi",
  },
  {
    id: "3",
    title: "Artistic Presentation",
    imageUrl: "https://i.postimg.cc/bvJWyXDb/DSCF4649.jpg",
    author: { name: "Dima Fomin", avatar: "https://i.postimg.cc/k4SPVGzv/avatar.jpg" },
    difficulty: "advanced" as const,
    likes: 890,
    comments: 34,
    cookingTime: 45,
    category: "Plating",
  },
  {
    id: "4",
    title: "Chef's Special",
    imageUrl: "https://i.postimg.cc/fW695wWv/IMG-3193.jpg",
    author: { name: "Dima Fomin", avatar: "https://i.postimg.cc/k4SPVGzv/avatar.jpg" },
    difficulty: "intermediate" as const,
    likes: 1540,
    comments: 56,
    cookingTime: 30,
    category: "Sushi",
  },
  {
    id: "5",
    title: "Gourmet Creation",
    imageUrl: "https://i.postimg.cc/pLB52zfr/IMG-3272.jpg",
    author: { name: "Dima Fomin", avatar: "https://i.postimg.cc/k4SPVGzv/avatar.jpg" },
    difficulty: "advanced" as const,
    likes: 1920,
    comments: 62,
    cookingTime: 40,
    category: "Modern",
  },
  {
    id: "6",
    title: "Deluxe Platter",
    imageUrl: "https://i.postimg.cc/xdxkmQFz/IMG-3532.jpg",
    author: { name: "Dima Fomin", avatar: "https://i.postimg.cc/k4SPVGzv/avatar.jpg" },
    difficulty: "beginner" as const,
    likes: 2340,
    comments: 89,
    cookingTime: 35,
    category: "Sets",
  },
];

export default function RecipesPage() {
  const { t } = useLanguage();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            🍱 Przepisy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Odkryj kolekcję autorskich przepisów od Dimy Fomin. Kliknij na przepis, aby zobaczyć pełne detale, składniki i kroki przygotowania.
          </p>
        </motion.div>

        {/* Recipes Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {MOCK_RECIPES.map((recipe) => (
            <motion.div key={recipe.id} variants={item}>
              <RecipeCard {...recipe} />
            </motion.div>
          ))}
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Chcesz nauczyć się więcej? Dołącz do Modern Food Academy
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold rounded-lg transition-all"
          >
            Przejdź do Akademii
          </motion.button>
        </motion.div>
      </div>
    </main>
  );
}
