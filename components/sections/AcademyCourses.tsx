"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, BrainCircuit, ChefHat, Lightbulb, Clock, Wine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AcademyAIMentor() {
  const { t } = useLanguage();
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 },
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, delay: 0.3 },
    },
  };

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-white/50 to-white dark:from-gray-950/50 dark:to-gray-950">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 via-transparent to-cyan-500/5 dark:from-sky-500/10 dark:to-cyan-500/10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-sky-400/10 dark:bg-sky-500/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/10 dark:bg-cyan-500/20 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />

      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 dark:bg-sky-500/20 border border-sky-200/50 dark:border-sky-800/50 mb-6">
            <Sparkles className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <span className="text-sm font-semibold text-sky-600 dark:text-sky-400 leading-relaxed">AI-Mentor</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Porozmawiaj z AI-Mentorem
          </h2>
          <p className="text-base sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            AI-Mentor prowadzi Cię przez decyzje kulinarne za pomocą pytań, scenariuszy i gotowych wyborów.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-2xl mx-auto"
        >
          {/* Chat window */}
          <motion.div
            whileHover={{ y: -8 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-xl dark:shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl dark:hover:shadow-sky-500/20 transition-all duration-300"
          >
            {/* Chat header */}
            <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-5 flex items-center gap-3 border-b-2 border-gray-200 dark:border-gray-700">
              <Avatar className="w-12 h-12 ring-2 ring-sky-400/30">
                <AvatarFallback className="bg-gradient-to-br from-sky-500 to-cyan-500 dark:from-sky-600 dark:to-cyan-600 text-white font-bold text-lg">
                  <BrainCircuit className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight">Dima Fomin AI</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                  Online teraz
                </p>
              </div>
            </div>

            {/* Guided Mentor Interface */}
            <div className="p-6 space-y-6 bg-white dark:bg-gray-900">
              {/* AI Mentor Question */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  AI-Mentor zaczyna od pytania:
                </p>
                <p className="text-xl font-bold text-sky-600 dark:text-sky-400 italic">
                  Jakie wyzwanie kulinarne chcesz teraz rozwiązać?
                </p>
              </motion.div>

              {/* Scenario Buttons */}
              <div className="space-y-3">
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white rounded-lg p-4 text-left transition-all shadow-md hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <ChefHat className="w-6 h-6 flex-shrink-0" />
                    <span className="font-semibold text-sm sm:text-base">
                      Chcę stworzyć nowoczesne danie
                    </span>
                  </div>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg p-4 text-left transition-all shadow-md hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <Lightbulb className="w-6 h-6 flex-shrink-0" />
                    <span className="font-semibold text-sm sm:text-base">
                      Chcę poprawić smak mojego dania
                    </span>
                  </div>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-lg p-4 text-left transition-all shadow-md hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 flex-shrink-0" />
                    <span className="font-semibold text-sm sm:text-base">
                      Chcę gotować szybciej i taniej
                    </span>
                  </div>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg p-4 text-left transition-all shadow-md hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <Wine className="w-6 h-6 flex-shrink-0" />
                    <span className="font-semibold text-sm sm:text-base">
                      Chcę dobrać idealne połączenie smaków
                    </span>
                  </div>
                </motion.button>
              </div>

              {/* Explanation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-lg p-4 text-center"
              >
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <Sparkles className="w-4 h-4 inline mr-1 text-sky-600 dark:text-sky-400" />
                  AI-Mentor zada kolejne pytania i poprowadzi Cię krok po kroku — jak prawdziwy szef kuchni.
                </p>
              </motion.div>
            </div>

            {/* Example Dialog Section */}
            <div className="border-t-2 border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Przykład rozmowy z AI-Mentorem:
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-sky-600 dark:text-sky-400 font-bold">→</span>
                  <p className="text-sky-600 dark:text-sky-400 font-medium">
                    Dlaczego wybrałeś ten produkt?
                  </p>
                </div>
                <div className="pl-6 text-gray-600 dark:text-gray-400">
                  Bo jest świeży i aromatyczny.
                </div>
                
                <div className="flex items-start gap-2 mt-4">
                  <span className="text-sky-600 dark:text-sky-400 font-bold">→</span>
                  <p className="text-sky-600 dark:text-sky-400 font-medium">
                    Jak możesz wykorzystać ten aromat najefektywniej?
                  </p>
                </div>
                <div className="pl-6 text-gray-600 dark:text-gray-400">
                  Zmieniając technikę obróbki.
                </div>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-4 italic border-t border-gray-200 dark:border-gray-700 pt-4">
                AI-Mentor nie mówi, co robić.<br />
                Pomaga zrozumieć, dlaczego to działa.
              </p>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-12"
          >
            <Link href="/assistant">
              <Button className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 dark:from-sky-600 dark:to-cyan-600 dark:hover:from-sky-700 dark:hover:to-cyan-700 text-white font-medium px-8 py-3 text-base rounded-lg shadow-md hover:shadow-lg dark:shadow-sky-500/20 dark:hover:shadow-sky-500/30 transition-all duration-200 active:scale-95 group">
                {t.sections.about.ctaButton}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
        </div>
      </div>
    </section>
  );
}
