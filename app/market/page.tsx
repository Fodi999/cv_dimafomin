"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Search, Coins, Star, Users } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const mockRecipes = [
  {
    id: "1",
    title: "⭐ Profesjonalne Nigiri: Od A do Z",
    description: "Kompletny kurs przygotowania nigiri sushi z sekretami japońskich mistrzów",
    price: 150,
    rating: 4.9,
    studentsCount: 234,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
    author: "Dima Fomin",
    difficulty: "Zaawansowany",
    tokens: "150 CT",
  },
  {
    id: "2",
    title: "⭐ Maki i Uramaki dla Początkujących",
    description: "Naucz się gotować popularne rolki w zaledwie 2 godziny",
    price: 100,
    rating: 4.7,
    studentsCount: 567,
    image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400",
    author: "Dima Fomin",
    difficulty: "Początkujący",
    tokens: "100 CT",
  },
  {
    id: "3",
    title: "⭐ Fusion Sushi: Nowoczesny Podejście",
    description: "Twórz unikalne autorskie sushi z europejskimi składnikami",
    price: 200,
    rating: 4.8,
    studentsCount: 189,
    image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400",
    author: "Dima Fomin",
    difficulty: "Średniozaawansowany",
    tokens: "200 CT",
  },
  {
    id: "4",
    title: "⭐ Food Pairing: Idealne Połączenia",
    description: "Odkryj idealne kombinacje przystawek i napojów jak profesjonalista",
    price: 180,
    rating: 5.0,
    studentsCount: 312,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
    author: "Dima Fomin",
    difficulty: "Średniozaawansowany",
    tokens: "180 CT",
  },
  {
    id: "5",
    title: "⭐ Techniki Krojenia dla Profesjonalistów",
    description: "Opanuj wszystkie sposoby krojenia na poziomie restauracyjnym",
    price: 120,
    rating: 4.9,
    studentsCount: 445,
    image: "https://images.unsplash.com/photo-1553504653527-7dd5b39ef828?w=400",
    author: "Dima Fomin",
    difficulty: "Średniozaawansowany",
    tokens: "120 CT",
  },
  {
    id: "6",
    title: "⭐ Autorskie Dania: Stwórz Swój Styl",
    description: "Opracuj unikatową recepturę autorską, która odzwierciedla Twój styl",
    price: 220,
    rating: 4.8,
    studentsCount: 256,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    author: "Dima Fomin",
    difficulty: "Zaawansowany",
    tokens: "220 CT",
  },
];

export default function MarketPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Set body background to dark gradient
    document.body.style.backgroundColor = "#030712";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  const filteredRecipes = mockRecipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-sky-950 to-cyan-950 pt-24 pb-20">
      {/* Animated background gradient */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-sky-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-sky-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="p-3 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-lg"
            >
              <ShoppingBag className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              {t.market.title}
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl leading-relaxed mb-2">
            {t.market.subtitle}
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-20"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t.market.search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white/10 border border-sky-300/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-sky-300/60 focus:ring-1 focus:ring-sky-300/40 transition-all backdrop-blur-sm"
            />
          </div>
        </motion.div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipes.map((recipe, idx) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
            >
              <div className="bg-gradient-to-br from-sky-500/10 to-cyan-500/10 rounded-2xl overflow-hidden border border-sky-300/40 hover:border-sky-300/60 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm h-full flex flex-col">
                {/* Image */}
                <div className="relative overflow-hidden h-56">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-sky-300 transition-colors">
                    {recipe.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-6 flex-grow leading-relaxed">
                    {recipe.description}
                  </p>

                  {/* Meta Info */}
                  <div className="space-y-3 mb-6 pb-6 border-t border-sky-300/30">
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold">{recipe.rating}</span>
                      <span className="text-gray-400">•</span>
                      <Users className="w-4 h-4 text-sky-400" />
                      <span>{recipe.studentsCount}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <span>{t.common.level} {recipe.difficulty}</span>
                    </div>
                  </div>

                  {/* Price & Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-sky-400" />
                      <span className="font-bold text-lg text-white">{recipe.tokens}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all"
                    >
                      {t.common.buy}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRecipes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">{t.common.notFound}</h3>
            <p className="text-gray-400">{t.common.tryAgain}</p>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-24 bg-gradient-to-r from-sky-600/80 via-cyan-600/80 to-sky-500/80 backdrop-blur-sm rounded-3xl p-16 text-white text-center shadow-2xl border border-sky-500/50"
        >
          <h2 className="text-4xl font-bold mb-4">
            {t.market.title}
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            {t.hero.earnTokens}
          </p>
          <Link href="/academy/earn-tokens">
            <Button className="px-8 py-4 bg-white text-sky-600 hover:bg-gray-100 font-bold rounded-xl transition-all inline-flex items-center gap-2">
              <Coins className="w-5 h-5" />
              {t.hero.earnTokens}
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
