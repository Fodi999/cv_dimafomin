"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Search, Coins } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useMarketRecipes } from "@/hooks/useMarketRecipes";
import { MarketRecipeCard } from "@/components/market/MarketRecipeCard";
import { AIMessageCard } from "@/components/ai/AIMessageCard";
import { BackButton } from "@/components/common/BackButton";
import { useRouter } from "next/navigation";

export default function MarketPage() {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const router = useRouter();
  const { data: recipes, loading, error } = useMarketRecipes();
  const [search, setSearch] = useState("");
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Set body background to dark gradient
    document.body.style.backgroundColor = "#030712";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  const handleBuy = (recipe: typeof recipes[0]) => {
    addToCart({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description || "",
      price: recipe.priceCT,
      image: recipe.image,
      difficulty: t.market.difficulty[recipe.level],
      rating: recipe.rating,
      studentsCount: recipe.reviews,
      quantity: 1,
    });
    
    // Show "added" state temporarily
    setAddedItems((prev) => new Set(prev).add(recipe.id));
    setTimeout(() => {
      setAddedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(recipe.id);
        return newSet;
      });
    }, 2000);
  };

  const filteredRecipes = recipes.filter((recipe) =>
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
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <BackButton fallbackHref="/recipes" />
        </motion.div>

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

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-sky-500/10 to-cyan-500/10 rounded-2xl overflow-hidden border border-sky-300/40 animate-pulse h-96"
              >
                <div className="h-56 bg-white/10" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-white/10 rounded w-3/4" />
                  <div className="h-16 bg-white/10 rounded" />
                  <div className="h-4 bg-white/10 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <AIMessageCard
            code="MARKET_ERROR"
            context={{ error }}
            onAction={(action) => {
              if (action === "retry") {
                window.location.reload();
              } else if (action === "go_back") {
                router.back();
              }
            }}
          />
        )}

        {/* Recipes Grid */}
        {!loading && !error && filteredRecipes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe, idx) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.6 }}
              >
                <MarketRecipeCard
                  recipe={recipe}
                  onBuy={handleBuy}
                  isAdded={addedItems.has(recipe.id)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State (no results or no data) */}
        {!loading && !error && filteredRecipes.length === 0 && (
          <AIMessageCard
            code={search ? "MARKET_NO_RESULTS" : "MARKET_EMPTY"}
            context={{ search }}
            onAction={(action) => {
              if (action === "clear_search") {
                setSearch("");
              } else if (action === "go_academy") {
                window.location.href = "/academy";
              }
            }}
          />
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
