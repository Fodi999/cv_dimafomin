"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Coins,
  TrendingUp,
  Brain,
  ChefHat,
  Camera,
  Award,
  MessageSquare,
  BookOpen,
  Sparkles,
  CheckCircle,
  XCircle,
  ArrowRight,
  ShoppingBag,
  GraduationCap,
  Utensils
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ChefTokensPage() {
  const router = useRouter();
  const { t } = useLanguage();
  
  // Mock user state (later replace with real auth)
  const [isLoggedIn] = useState(false); // Change to true to test logged-in state
  const [currentBalance] = useState(120);
  const [todayEarned] = useState(12);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* 🧠 1. HERO / WYJAŚNIENIE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/20 px-4 py-2 rounded-full mb-6">
            <Coins className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
              {t?.tokens?.page?.hero?.badge || "Your conscious cooking currency"}
            </span>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t?.tokens?.page?.hero?.title || "ChefTokens — Your currency of"}<br />
            {t?.tokens?.page?.hero?.titleHighlight || "conscious cooking"}
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            {t?.tokens?.page?.hero?.description || "ChefTokens help you make smart decisions: plan, cook, and learn without chaos."}
          </p>

          {/* 3 Bullets */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-sky-50 dark:bg-sky-900/10 p-6 rounded-xl border border-sky-200 dark:border-sky-800">
              <div className="w-12 h-12 bg-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {t?.tokens?.page?.hero?.features?.control?.title || "🔄 Decision control, not \"paywall\""}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t?.tokens?.page?.hero?.features?.control?.description || "Tokens teach planning, not block access"}
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {t?.tokens?.page?.hero?.features?.thinking?.title || "🧠 Learn to think like a chef"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t?.tokens?.page?.hero?.features?.thinking?.description || "Every action is a conscious decision"}
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/10 p-6 rounded-xl border border-green-200 dark:border-green-800">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {t?.tokens?.page?.hero?.features?.planning?.title || "♻️ Less waste, more control"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t?.tokens?.page?.hero?.features?.planning?.description || "Planning instead of chaos"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* 💰 2. TWOJE SALDO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          {isLoggedIn ? (
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 rounded-2xl text-white shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{t?.tokens?.page?.yourTokens?.title || "Your ChefTokens"}</h2>
                  <p className="text-amber-100">Bieżące saldo</p>
                </div>
                <Coins className="w-12 h-12 text-amber-100" />
              </div>

              <div className="text-6xl font-bold mb-6">
                {currentBalance} CT
              </div>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-100" />
                  <span className="text-amber-100">+{todayEarned} CT dzisiaj</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-amber-100" />
                  <span className="text-amber-100">Status: aktywny</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Jak zdobyć ChefTokens
                </button>
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Historia transakcji
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
              <Coins className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t?.tokens?.page?.yourTokens?.title || "Your ChefTokens"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t?.tokens?.page?.yourTokens?.loginPrompt || "Log in to see your balance and history"}
              </p>
              <button
                onClick={() => router.push("/auth/login")}
                className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white py-3 px-8 rounded-lg font-semibold transition-all inline-flex items-center gap-2"
              >
                Zaloguj się
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </motion.div>

        {/* 🟢 3. JAK ZDOBYWASZ CHEFTOKENS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 text-center">
            {t?.tokens?.page?.howToEarn?.title || "How you earn ChefTokens"}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            {t?.tokens?.page?.howToEarn?.subtitle || "ChefTokens reward action, not clicking."}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Recipe completion */}
            <div className="bg-sky-50 dark:bg-sky-900/10 p-6 rounded-xl border border-sky-200 dark:border-sky-800 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-sky-600 rounded-full flex items-center justify-center mb-4">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {t?.tokens?.page?.howToEarn?.methods?.cookRecipe?.title || "Cook a recipe"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {t?.tokens?.page?.howToEarn?.methods?.cookRecipe?.description || "Every recipe you complete and mark as \"cooked\""}
              </p>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                  {t?.tokens?.page?.howToEarn?.methods?.cookRecipe?.reward || "+5 CT"}
                </div>
              </div>
            </div>

            {/* AI Dialog */}
            <div className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-xl border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {t?.tokens?.page?.howToEarn?.methods?.aiDialog?.title || "AI dialogue (task)"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {t?.tokens?.page?.howToEarn?.methods?.aiDialog?.description || "Complete one task in dialogue with AI Mentor"}
              </p>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {t?.tokens?.page?.howToEarn?.methods?.aiDialog?.reward || "+2 CT"}
                </div>
              </div>
            </div>

            {/* Academy Module */}
            <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-xl border border-amber-200 dark:border-amber-800 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {t?.tokens?.page?.howToEarn?.methods?.academyModule?.title || "Academy module"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {t?.tokens?.page?.howToEarn?.methods?.academyModule?.description || "Complete a full module with all tasks"}
              </p>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {t?.tokens?.page?.howToEarn?.methods?.academyModule?.reward || "+10 CT"}
                </div>
              </div>
            </div>

            {/* Photo Analysis */}
            <div className="bg-pink-50 dark:bg-pink-900/10 p-6 rounded-xl border border-pink-200 dark:border-pink-800 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {t?.tokens?.page?.howToEarn?.methods?.dishAnalysis?.title || "Dish analysis"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {t?.tokens?.page?.howToEarn?.methods?.dishAnalysis?.description || "Upload a photo and get AI analysis"}
              </p>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                  {t?.tokens?.page?.howToEarn?.methods?.dishAnalysis?.reward || "+5 CT"}
                </div>
              </div>
            </div>

            {/* Path Completion */}
            <div className="bg-green-50 dark:bg-green-900/10 p-6 rounded-xl border border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {t?.tokens?.page?.howToEarn?.methods?.completePath?.title || "Complete path"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {t?.tokens?.page?.howToEarn?.methods?.completePath?.description || "Finish entire development path in Academy"}
              </p>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {t?.tokens?.page?.howToEarn?.methods?.completePath?.reward || "+50 CT"}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 🔴 4. NA CO WYDAJESZ CHEFTOKENS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 text-center">
            {t?.tokens?.page?.howToSpend?.title || "What you spend ChefTokens on"}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            {t?.tokens?.page?.howToSpend?.subtitle || "Every token use is a conscious decision, not a random click."}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* AI Queries */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600 transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {t?.tokens?.page?.howToSpend?.options?.aiQuestions?.title || "AI questions"}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t?.tokens?.page?.howToSpend?.options?.aiQuestions?.description || "Ask AI about products, techniques, or pairing"}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-600 dark:text-purple-400 font-bold">
                  {t?.tokens?.page?.howToSpend?.options?.aiQuestions?.cost || "1–3 CT"}
                </span>
                <span className="text-xs text-gray-500">
                  {t?.tokens?.page?.howToSpend?.options?.aiQuestions?.unit || "per question"}
                </span>
              </div>
            </div>

            {/* Premium Recipes */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-sky-400 dark:hover:border-sky-600 transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-sky-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <ChefHat className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {t?.tokens?.page?.howToSpend?.options?.premiumRecipes?.title || "Premium recipes"}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t?.tokens?.page?.howToSpend?.options?.premiumRecipes?.description || "Access advanced recipes from chefs"}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sky-600 dark:text-sky-400 font-bold">
                  {t?.tokens?.page?.howToSpend?.options?.premiumRecipes?.cost || "5–15 CT"}
                </span>
                <span className="text-xs text-gray-500">
                  {t?.tokens?.page?.howToSpend?.options?.premiumRecipes?.unit || "per recipe"}
                </span>
              </div>
            </div>

            {/* Advanced Academy Paths */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-amber-400 dark:hover:border-amber-600 transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {t?.tokens?.page?.howToSpend?.options?.advancedPaths?.title || "Advanced Academy paths"}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t?.tokens?.page?.howToSpend?.options?.advancedPaths?.description || "Unlock advanced courses after basics"}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {t?.tokens?.page?.howToSpend?.options?.advancedPaths?.cost || "20–50 CT"}
                </span>
                <span className="text-xs text-gray-500">
                  {t?.tokens?.page?.howToSpend?.options?.advancedPaths?.unit || "per path"}
                </span>
              </div>
            </div>

            {/* Flavor Pairing */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-pink-400 dark:hover:border-pink-600 transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Utensils className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {t?.tokens?.page?.howToSpend?.options?.flavorAnalysis?.title || "Flavor analysis / pairing"}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t?.tokens?.page?.howToSpend?.options?.flavorAnalysis?.description || "Check which products pair well together"}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-pink-600 dark:text-pink-400 font-bold">
                  {t?.tokens?.page?.howToSpend?.options?.flavorAnalysis?.cost || "3–10 CT"}
                </span>
                <span className="text-xs text-gray-500">
                  {t?.tokens?.page?.howToSpend?.options?.flavorAnalysis?.unit || "per analysis"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 🔁 5. DLACZEGO TO DZIAŁA (FILOZOFIA) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 p-8 rounded-2xl border border-indigo-200 dark:border-indigo-800">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              {t?.tokens?.page?.whyItWorks?.title || "Why it works"}
            </h2>

            <div className="max-w-3xl mx-auto mb-8">
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                <strong>{t?.tokens?.page?.whyItWorks?.subtitle || "ChefTokens are not a penalty."}</strong><br />
                {t?.tokens?.page?.whyItWorks?.description || "They are a mechanism that:"}
              </p>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>{t?.tokens?.page?.whyItWorks?.benefits?.planning || "teaches planning — instead of chaos and impulsive decisions"}</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>{t?.tokens?.page?.whyItWorks?.benefits?.noChaos || "limits chaos — every action has value and consequences"}</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>{t?.tokens?.page?.whyItWorks?.benefits?.goodDecisions || "reinforces good cooking decisions — we reward action, not clicking"}</strong></span>
                </li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <XCircle className="w-6 h-6 text-red-500" />
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {t?.tokens?.page?.whyItWorks?.points?.noScrolling?.title || "No mindless scrolling"}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t?.tokens?.page?.whyItWorks?.points?.noScrolling?.description || "Every action is conscious, not random"}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {t?.tokens?.page?.whyItWorks?.points?.valueInAction?.title || "Every action has value"}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t?.tokens?.page?.whyItWorks?.points?.valueInAction?.description || "You learn to make better culinary decisions"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 🧭 6. CTA (КУДА ДАЛЬШЕ) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t?.tokens?.page?.cta?.title || "Where now?"}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <button
              onClick={() => router.push("/recipes")}
              className="bg-gradient-to-br from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white p-6 rounded-xl transition-all hover:shadow-lg flex flex-col items-center gap-3"
            >
              <ChefHat className="w-8 h-8" />
              <span className="font-semibold">Przejdź do Gotowania</span>
            </button>

            <button
              onClick={() => router.push("/assistant")}
              className="bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-6 rounded-xl transition-all hover:shadow-lg flex flex-col items-center gap-3"
            >
              <MessageSquare className="w-8 h-8" />
              <span className="font-semibold">Porozmawiaj z AI</span>
            </button>

            <button
              onClick={() => router.push("/academy")}
              className="bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white p-6 rounded-xl transition-all hover:shadow-lg flex flex-col items-center gap-3"
            >
              <GraduationCap className="w-8 h-8" />
              <span className="font-semibold">Rozwijaj się w Akademii</span>
            </button>

            <button
              onClick={() => router.push("/market")}
              className="bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-6 rounded-xl transition-all hover:shadow-lg flex flex-col items-center gap-3"
            >
              <ShoppingBag className="w-8 h-8" />
              <span className="font-semibold">Zobacz Rynek przepisów</span>
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
