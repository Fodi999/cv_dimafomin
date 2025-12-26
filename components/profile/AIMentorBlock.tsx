"use client";

import { motion } from "framer-motion";
import { Sparkles, ChefHat } from "lucide-react";
import { useRouter } from "next/navigation";

interface AIMentorBlockProps {
  onScenarioSelect?: (scenario: string) => void;
}

/**
 * AI-Mentor Block - Guided Mentor Interface (NOT chat)
 * 
 * Philosophy:
 * - AI prowadzi (guides), nie czatuje (chats)
 * - Button-driven scenarios, not free text input
 * - Socratic method: AI asks questions, user chooses
 */
export function AIMentorBlock({ onScenarioSelect }: AIMentorBlockProps) {
  const router = useRouter();

  const scenarios = [
    {
      id: "modern-dish",
      emoji: "🍽️",
      label: "Chcę stworzyć nowoczesne danie",
      color: "from-sky-600 to-cyan-600",
      hoverColor: "hover:from-sky-700 hover:to-cyan-700",
    },
    {
      id: "improve-taste",
      emoji: "🧠",
      label: "Chcę poprawić smak mojego dania",
      color: "from-purple-600 to-pink-600",
      hoverColor: "hover:from-purple-700 hover:to-pink-700",
    },
    {
      id: "cook-faster",
      emoji: "⏱️",
      label: "Chcę gotować szybciej i taniej",
      color: "from-emerald-600 to-green-600",
      hoverColor: "hover:from-emerald-700 hover:to-green-700",
    },
    {
      id: "flavor-pairing",
      emoji: "🥂",
      label: "Chcę dobrać idealne połączenie smaków",
      color: "from-amber-600 to-orange-600",
      hoverColor: "hover:from-amber-700 hover:to-orange-700",
    },
  ];

  const handleScenarioClick = (scenarioId: string) => {
    if (onScenarioSelect) {
      onScenarioSelect(scenarioId);
    }
    // Navigate to assistant with scenario context
    router.push(`/assistant?scenario=${scenarioId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Porozmawiaj z AI-Mentorem
            </h3>
            <p className="text-xs sm:text-sm text-gray-400">
              AI-Mentor prowadzi Cię przez decyzje kulinarne
              <br className="hidden sm:block" />
              za pomocą pytań, scenariuszy i gotowych wyborów.
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 mt-4 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg w-fit">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium text-green-400">
            Dima Fomin AI — Online teraz
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* AI Question */}
        <div className="mb-6">
          <p className="text-base sm:text-lg font-semibold text-white mb-1">
            AI-Mentor zaczyna od pytania:
          </p>
          <p className="text-lg sm:text-xl text-purple-300 font-medium italic">
            Jakie wyzwanie kulinarne chcesz teraz rozwiązać?
          </p>
        </div>

        {/* Scenario Buttons */}
        <div className="space-y-3 mb-6">
          {scenarios.map((scenario, index) => (
            <motion.button
              key={scenario.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleScenarioClick(scenario.id)}
              className={`w-full bg-gradient-to-r ${scenario.color} ${scenario.hoverColor} rounded-xl p-4 text-white text-left transition-all shadow-lg hover:shadow-xl`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{scenario.emoji}</span>
                <span className="font-semibold text-sm sm:text-base">
                  {scenario.label}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Explanation */}
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            <ChefHat className="w-4 h-4 inline mr-1 text-purple-400" />
            AI-Mentor zada kolejne pytania i poprowadzi Cię krok po kroku — jak prawdziwy szef kuchni.
          </p>
        </div>
      </div>

      {/* Example Dialog (Simulation) */}
      <div className="p-6 bg-white/5 border-t border-white/10">
        <p className="text-sm font-semibold text-white mb-3">
          Przykład rozmowy z AI-Mentorem:
        </p>
        <div className="space-y-2 text-xs sm:text-sm">
          <div className="text-purple-300">
            <span className="font-semibold">→</span> Dlaczego wybrałeś ten produkt?
          </div>
          <div className="text-gray-400 pl-4">
            Bo jest świeży i aromatyczny.
          </div>
          
          <div className="text-purple-300 mt-3">
            <span className="font-semibold">→</span> Jak możesz wykorzystać ten aromat najefektywniej?
          </div>
          <div className="text-gray-400 pl-4">
            Zmieniając technikę obróbki.
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4 italic">
          AI-Mentor nie mówi, co robić.
          <br />
          Pomaga zrozumieć, dlaczego to działa.
        </p>
      </div>
    </motion.div>
  );
}
