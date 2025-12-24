"use client";

import { motion } from "framer-motion";
import { BookmarkCheck, ChefHat, FileText, ShoppingBag, Star } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ResourcesTabProps {
  savedRecipes: number;
  cookedRecipes: number;
  ownRecipes: number;
  cartItems: number;
  purchasedCourses: number;
}

type ResourceSubTab = "saved" | "cooked" | "own";

/**
 * Tab 3: Zasoby (Resources)
 * My resources: Recipes (Zapisane/Ugotowane/Własne), Cart, Purchased courses
 * Answers: "What do I have?"
 */
export function ResourcesTab({
  savedRecipes,
  cookedRecipes,
  ownRecipes,
  cartItems,
  purchasedCourses,
}: ResourcesTabProps) {
  const router = useRouter();
  const [activeSubTab, setActiveSubTab] = useState<ResourceSubTab>("saved");

  return (
    <div className="space-y-6">
      {/* Resource Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/40">
          <BookmarkCheck className="w-6 h-6 text-purple-400 mb-2" />
          <div className="text-2xl font-bold text-white">{savedRecipes}</div>
          <div className="text-xs text-gray-400">Zapisane przepisy</div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/40">
          <ChefHat className="w-6 h-6 text-green-400 mb-2" />
          <div className="text-2xl font-bold text-white">{cookedRecipes}</div>
          <div className="text-xs text-gray-400">Ugotowane dania</div>
        </div>

        <div className="bg-gradient-to-br from-sky-500/20 to-cyan-500/20 rounded-xl p-4 border border-sky-500/40">
          <FileText className="w-6 h-6 text-sky-400 mb-2" />
          <div className="text-2xl font-bold text-white">{ownRecipes}</div>
          <div className="text-xs text-gray-400">Własne przepisy</div>
        </div>
      </div>

      {/* Subtabs for Recipes */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Moje przepisy</h3>
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveSubTab("saved")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeSubTab === "saved"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            📘 Zapisane ({savedRecipes})
          </button>
          <button
            onClick={() => setActiveSubTab("cooked")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeSubTab === "cooked"
                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            🍽 Ugotowane ({cookedRecipes})
          </button>
          <button
            onClick={() => setActiveSubTab("own")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeSubTab === "own"
                ? "bg-gradient-to-r from-sky-600 to-cyan-600 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            ✍️ Własne ({ownRecipes})
          </button>
        </div>

        {/* Recipe List Placeholder */}
        <div className="bg-white/5 rounded-lg p-8 border border-white/10 text-center">
          <p className="text-gray-400 mb-2">
            {activeSubTab === "saved" && "Twoje zapisane przepisy pojawią się tutaj"}
            {activeSubTab === "cooked" && "Historia ugotowanych dań pojawi się tutaj"}
            {activeSubTab === "own" && "Twoje autorskie przepisy pojawią się tutaj"}
          </p>
          <p className="text-xs text-gray-500">(TODO: Implement recipe cards list)</p>
        </div>
      </div>

      {/* Cart + Purchased Courses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Cart */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/market")}
          className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-orange-500/40 text-left transition-all hover:border-orange-500/60"
        >
          <ShoppingBag className="w-8 h-8 text-orange-400 mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{cartItems}</div>
          <div className="text-sm text-gray-400">Produktów w koszyku</div>
          {cartItems > 0 && (
            <div className="mt-3 text-xs text-orange-300">
              → Dokończ planowanie
            </div>
          )}
        </motion.button>

        {/* Purchased Courses */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/academy")}
          className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-xl p-6 border border-amber-500/40 text-left transition-all hover:border-amber-500/60"
        >
          <Star className="w-8 h-8 text-amber-400 mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{purchasedCourses}</div>
          <div className="text-sm text-gray-400">Kupione kursy</div>
          <div className="mt-3 text-xs text-amber-300">
            → Przejdź do Akademii
          </div>
        </motion.button>
      </div>
    </div>
  );
}
