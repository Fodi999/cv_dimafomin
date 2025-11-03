"use client";

import { use } from "react";
import { ArrowLeft, Star, Users, Clock, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import PurchaseButton from "@/components/market/PurchaseButton";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Mock data (в реальному проекті - з API)
const mockRecipeData: Record<string, any> = {
  "1": {
    title: "Професійне нігірі: від А до Я",
    description: "Повний курс приготування нігірі суші з секретами японських майстрів",
    fullDescription: "Цей комплексний курс навчить вас усім тонкощам приготування автентичного нігірі суші. Ви дізнаєтесь про вибір риби, техніку нарізання, правильний рис та секрети презентації.",
    price: 149,
    rating: 4.9,
    studentsCount: 234,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800",
    author: "Dima Fomin",
    difficulty: "advanced",
    duration: "6 годин",
    modules: 12,
    certificate: true,
    whatYouLearn: [
      "Вибір та підготовка свіжої риби",
      "Техніка нарізання (сашимі-стиль)",
      "Приготування ідеального рису для суші",
      "Формування нігірі (10+ видів)",
      "Презентація та подача",
      "Санітарні норми (HACCP)",
    ],
  },
};

interface RecipeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const recipe = mockRecipeData[id];

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#1E1A41] mb-4">
            Рецепт не знайдено
          </h2>
          <Button onClick={() => router.push("/market")}>
            Назад до маркетплейсу
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push("/market")}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Назад
      </Button>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Hero Image */}
        <div className="relative h-96">
          <Image
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#1E1A41] mb-2">
                {recipe.title}
              </h1>
              <p className="text-[#1E1A41]/60">👨‍🍳 {recipe.author}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-[#3BC864] mb-1">
                {recipe.price} zł
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{recipe.rating}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#1E1A41]/60" />
              <span>{recipe.studentsCount} студентів</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#1E1A41]/60" />
              <span>{recipe.duration}</span>
            </div>
            {recipe.certificate && (
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#3BC864]" />
                <span>Сертифікат</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#1E1A41] mb-4">
              Про курс
            </h2>
            <p className="text-[#1E1A41]/70 leading-relaxed">
              {recipe.fullDescription}
            </p>
          </div>

          {/* What You'll Learn */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#1E1A41] mb-4">
              Що ви вивчите
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recipe.whatYouLearn.map((item: string, index: number) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="text-[#3BC864] mt-1">✓</div>
                  <span className="text-[#1E1A41]/70">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Purchase Button */}
          <div className="max-w-md">
            <PurchaseButton recipeId={id} price={recipe.price} />
          </div>
        </div>
      </div>
    </div>
  );
}
