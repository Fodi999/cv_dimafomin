"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

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
    <Link href={`/market/${id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden group cursor-pointer border-2 border-transparent hover:border-[#3BC864]/30 transition-all duration-300"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute top-4 right-4">
            <motion.span
              whileHover={{ scale: 1.1 }}
              className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${difficultyColors[difficulty]} shadow-lg`}
            >
              {difficultyLabels[difficulty]}
            </motion.span>
          </div>

          {/* Price badge on hover */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <span className="text-xl font-bold text-[#3BC864]">{price} zł</span>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-[#1E1A41] mb-2 line-clamp-1 group-hover:text-[#3BC864] transition-colors">
            {title}
          </h3>
          <p className="text-sm text-[#1E1A41]/60 mb-4 line-clamp-2">
            {description}
          </p>

          {/* Author */}
          <p className="text-xs text-[#1E1A41]/50 mb-4 font-medium">
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
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <span className="text-2xl font-bold text-[#3BC864]">{price} zł</span>
            </div>
            <Button
              size="sm"
              className="bg-gradient-to-r from-[#3BC864] to-[#C5E98A] text-white hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Купити
            </Button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
