"use client";

import { motion } from "framer-motion";
import { 
  Brain, 
  MessageSquare, 
  Coins, 
  Clock, 
  Layers, 
  CheckCircle, 
  Lock,
  ArrowRight,
  Lightbulb,
  TrendingUp,
  DollarSign,
  Target,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { allPaths } from "@/lib/academy/paths-data";
import type { PathStatus } from "@/lib/academy/paths-data";

export default function AcademyPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const paths = allPaths;

  const benefits = [
    {
      icon: Brain,
      text: t?.academy?.page?.benefits?.thinking || "Chef's thinking, not recipe copying"
    },
    {
      icon: TrendingUp,
      text: t?.academy?.page?.benefits?.lessWaste || "Less food waste"
    },
    {
      icon: DollarSign,
      text: t?.academy?.page?.benefits?.betterTaste || "Better taste without expensive purchases"
    },
    {
      icon: Target,
      text: t?.academy?.page?.benefits?.realSkills || "Real skills for life"
    }
  ];

  const getStatusButton = (status: PathStatus) => {
    const statusText = t?.academy?.page?.pathStatus;
    
    switch (status) {
      case "available":
        return {
          text: statusText?.available || "Start",
          className: "bg-sky-600 hover:bg-sky-700 text-white",
          icon: ArrowRight
        };
      case "in-progress":
        return {
          text: statusText?.inProgress || "Continue",
          className: "bg-amber-600 hover:bg-amber-700 text-white",
          icon: ArrowRight
        };
      case "locked":
        return {
          text: statusText?.locked || "Locked",
          className: "bg-gray-600 cursor-not-allowed text-gray-300",
          icon: Lock
        };
      case "completed":
        return {
          text: statusText?.completed || "Completed",
          className: "bg-green-600 text-white cursor-default",
          icon: CheckCircle
        };
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1️⃣ HERO BLOCK */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 pt-12"
        >
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {t?.academy?.page?.title || "Academy of Conscious Cooking"}
          </h1>
          
          <p className="text-2xl text-gray-700 dark:text-gray-300 mb-4 font-semibold">
            {t?.academy?.page?.subtitle || "Develop chef's thinking, not just learn recipes"}
          </p>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            {t?.academy?.page?.description || "Development paths based on practice, AI dialogue, and real kitchen decisions."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/academy/paths/foundations')}
              className="px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {t?.academy?.page?.cta?.startFirst || "Start your first path"}
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-white dark:bg-gray-800 border-2 border-sky-600 text-sky-600 dark:text-sky-400 font-semibold rounded-lg hover:bg-sky-50 dark:hover:bg-gray-700 transition-colors">
              {t?.academy?.page?.cta?.howItWorks || "How Academy works"}
            </button>
          </div>
        </motion.div>

        {/* 2️⃣ HOW IT WORKS - 3 Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            {t?.academy?.page?.howItWorks?.title || "How Academy works"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-900/20 dark:to-cyan-900/20 p-8 rounded-2xl border-2 border-sky-200 dark:border-sky-800">
              <div className="w-16 h-16 bg-sky-600 rounded-2xl flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {t?.academy?.page?.howItWorks?.paths?.title || "Development paths"}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {t?.academy?.page?.howItWorks?.paths?.description || "Not courses, but logical skill paths"}
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-8 rounded-2xl border-2 border-purple-200 dark:border-purple-800">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {t?.academy?.page?.howItWorks?.dialog?.title || "AI dialogue"}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {t?.academy?.page?.howItWorks?.dialog?.description || "AI guides you through decisions, analysis, and practice"}
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-8 rounded-2xl border-2 border-amber-200 dark:border-amber-800">
              <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center mb-4">
                <Coins className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {t?.academy?.page?.howItWorks?.tokens?.title || "ChefTokens"}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {t?.academy?.page?.howItWorks?.tokens?.description || "Earn tokens for progress and conscious choices"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* 3️⃣ CORE BLOCK - Ścieżki rozwoju */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
            {t?.academy?.page?.pathsSection?.title || "Choose your development path"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paths.map((path, index) => {
              const statusBtn = getStatusButton(path.status);
              const Icon = statusBtn.icon;
              const isLocked = path.status === "locked";

              return (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`relative p-6 rounded-2xl border-2 transition-all ${
                    isLocked
                      ? "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 opacity-60"
                      : "bg-white dark:bg-gray-900 border-sky-200 dark:border-sky-800 hover:border-sky-400 dark:hover:border-sky-600 hover:shadow-xl"
                  }`}
                >
                  {/* Lock overlay */}
                  {isLocked && (
                    <div className="absolute top-4 right-4">
                      <Lock className="w-6 h-6 text-gray-400" />
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {path.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {path.description}
                    </p>
                  </div>

                  {/* Progress indicator */}
                  {path.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span>Postęp</span>
                        <span>{path.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-sky-600 h-2 rounded-full transition-all"
                          style={{ width: `${path.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{path.totalDuration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Layers className="w-4 h-4" />
                      <span>{path.totalModules} modułów</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Coins className="w-4 h-4 text-amber-500" />
                      <span className="font-semibold text-amber-600 dark:text-amber-400">
                        +{path.totalReward} ChefTokens
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    disabled={isLocked}
                    onClick={() => !isLocked && router.push(`/academy/paths/${path.id}`)}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${statusBtn.className}`}
                  >
                    {statusBtn.text}
                    <Icon className="w-5 h-5" />
                  </button>

                  {isLocked && (
                    <p className="text-xs text-center text-gray-500 dark:text-gray-500 mt-3">
                      {t?.academy?.page?.pathStatus?.unlockRequirement || "Complete previous path to unlock"}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* 4️⃣ VALUE BENEFITS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            {t?.academy?.page?.benefits?.title || "What you'll gain"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    {benefit.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* 5️⃣ AI MENTOR PREVIEW */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl p-8 md:p-12 border-2 border-purple-200 dark:border-purple-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              {/* Left: Mock dialog */}
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {t?.academy?.page?.aiExample?.question || "Why did you choose this product?"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-sky-100 dark:bg-sky-900/30 p-4 rounded-2xl ml-8">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {t?.academy?.page?.aiExample?.answer || "Because it's fresh..."}
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {t?.academy?.page?.aiExample?.followUp || "Great! Now think: how can you use this aroma most effectively?"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Description */}
              <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {t?.academy?.page?.aiExample?.explanation || "AI-Mentor doesn't tell you what to do"}
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                  {t?.academy?.page?.aiExample?.explanationDetail || "It asks, analyzes, and helps you make decisions — like a real chef."}
                </p>
                <Link href="/assistant">
                  <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
                    Porozmawiaj z AI mentorem
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 6️⃣ FOOTER CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-sky-600 to-cyan-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t?.academy?.page?.finalCta?.badge || "First path is free"}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {t?.academy?.page?.finalCta?.title || "Start thinking like a chef today"}
            </p>
            <button 
              onClick={() => router.push('/academy/paths/foundations')}
              className="px-10 py-4 bg-white text-sky-600 font-bold rounded-lg hover:bg-gray-100 transition-colors text-lg flex items-center gap-2 mx-auto"
            >
              {t?.academy?.page?.cta?.startFirst || "Start your first path"}
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
