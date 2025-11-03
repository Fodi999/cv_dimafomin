"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface RecipeCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  studentsCount: number;
  image: string;
  author: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export default function RecipeCard({
  id,
  title,
  description,
  price,
  rating,
  studentsCount,
  image,
  author,
  difficulty,
}: RecipeCardProps) {
  const difficultyColors = {
    beginner: "bg-green-100 text-green-700",
    intermediate: "bg-yellow-100 text-yellow-700",
    advanced: "bg-red-100 text-red-700",
  };

  const difficultyLabels = {
    beginner: "Початківець",
    intermediate: "Середній",
    advanced: "Професіонал",
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden group cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[difficulty]}`}>
            {difficultyLabels[difficulty]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#1E1A41] mb-2 line-clamp-1">
          {title}
        </h3>
        <p className="text-sm text-[#1E1A41]/60 mb-4 line-clamp-2">
          {description}
        </p>

        {/* Author */}
        <p className="text-xs text-[#1E1A41]/50 mb-4">
          👨‍🍳 {author}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm text-[#1E1A41]/70">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{studentsCount}</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-[#3BC864]">{price} zł</span>
          </div>
          <Button
            size="sm"
            className="bg-gradient-to-r from-[#3BC864] to-[#C5E98A] text-white hover:opacity-90"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Купити
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
