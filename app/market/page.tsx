"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import RecipeCard from "@/components/market/RecipeCard";
import RecipeFilters from "@/components/market/RecipeFilters";
import { useUser } from "@/contexts/UserContext";
import { useLanguage } from "@/contexts/LanguageContext";

const mockRecipes = [
  {
    id: "1",
    title: "Професійне нігірі: від А до Я",
    description: "Повний курс приготування нігірі суші з секретами японських майстрів",
    price: 149,
    rating: 4.9,
    studentsCount: 234,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
    author: "Dima Fomin",
    difficulty: "advanced" as const,
  },
  {
    id: "2",
    title: "Макі та уромакі для початківців",
    description: "Навчіться готувати популярні ролли всього за 2 години",
    price: 99,
    rating: 4.7,
    studentsCount: 567,
    image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400",
    author: "Anna Kowalska",
    difficulty: "beginner" as const,
  },
  {
    id: "3",
    title: "Fusion суші: сучасний підхід",
    description: "Створюйте унікальні авторські суші з європейськими інгредієнтами",
    price: 199,
    rating: 4.8,
    studentsCount: 189,
    image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400",
    author: "Dima Fomin",
    difficulty: "intermediate" as const,
  },
];

export default function MarketPage() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [sort, setSort] = useState("popular");
  const { isAuthenticated } = useUser();
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto relative">
      {/* Back to Profile Button */}
      {isAuthenticated && (
        <Link
          href="/create-chat"
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 text-[#1E1A41] hover:text-[#3BC864] transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">{t.academy?.dashboard?.backToProfile || "Назад до профілю"}</span>
        </Link>
      )}

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1E1A41] mb-4">
          🛒 Маркетплейс рецептів
        </h1>
        <p className="text-lg text-[#1E1A41]/70">
          Професійні рецепти від досвідчених суші-шефів
        </p>
      </div>

      {/* Filters */}
      <RecipeFilters
        onSearchChange={setSearch}
        onDifficultyChange={setDifficulty}
        onSortChange={setSort}
      />

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} {...recipe} />
        ))}
      </div>
    </div>
  );
}
