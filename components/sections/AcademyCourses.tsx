"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AcademyAIMentor() {
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
    <section className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#3BC864]/5 via-transparent to-[#00D9FF]/5 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3BC864]/10 border border-[#3BC864]/30 mb-6">
            <Sparkles className="w-4 h-4 text-[#3BC864]" />
            <span className="text-sm font-semibold text-[#3BC864]">Превью AI-наставника</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1E1A41] mb-6">
            Поговори с AI-наставником
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Получай советы в реальном времени, генерируй рецепты и совершенствуй свое мастерство
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
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 overflow-hidden">
            {/* Chat header */}
            <div className="bg-gradient-to-r from-[#3BC864] to-[#2da050] p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl">
                🧑‍🍳
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Dima Fomin AI</h3>
                <p className="text-green-100 text-sm">Онлайн сейчас</p>
              </div>
            </div>

            {/* Chat messages */}
            <div className="p-6 space-y-6 min-h-96 bg-gray-50 flex flex-col justify-center">
              {/* AI Message */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex gap-4 justify-start"
              >
                <div className="w-8 h-8 rounded-full bg-[#3BC864] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  DF
                </div>
                <div className="max-w-xs bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                  <p className="text-gray-800 text-sm leading-relaxed">
                    👋 Привет! Хочешь научиться готовить морепродукты как настоящий шеф?
                  </p>
                  <p className="text-gray-600 text-xs mt-2">12:45</p>
                </div>
              </motion.div>

              {/* User Message */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex gap-4 justify-end"
              >
                <div className="max-w-xs bg-gradient-to-r from-[#3BC864] to-[#2da050] p-4 rounded-2xl rounded-tr-none shadow-sm text-white">
                  <p className="text-sm leading-relaxed">
                    Да! Я хочу научиться готовить устрицы 🦪
                  </p>
                  <p className="text-green-100 text-xs mt-2">12:46</p>
                </div>
              </motion.div>

              {/* AI Response */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex gap-4 justify-start"
              >
                <div className="w-8 h-8 rounded-full bg-[#3BC864] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  DF
                </div>
                <div className="max-w-xs bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                  <p className="text-gray-800 text-sm leading-relaxed">
                    🦪 Отлично! Устрицы требуют минимальной обработки, но максимального внимания к качеству. Начнем?
                  </p>
                  <p className="text-gray-600 text-xs mt-2">12:47</p>
                </div>
              </motion.div>
            </div>

            {/* Chat input */}
            <div className="border-t border-gray-200 p-4 bg-white flex gap-3">
              <input
                type="text"
                placeholder="Введи вопрос..."
                disabled
                className="flex-1 px-4 py-3 bg-gray-100 rounded-xl text-gray-400 text-sm focus:outline-none cursor-not-allowed"
              />
              <button
                disabled
                className="px-4 py-3 bg-gray-200 rounded-xl text-gray-400 cursor-not-allowed"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-12"
          >
            <Link href="/chat/create-chat">
              <Button className="bg-gradient-to-r from-[#3BC864] to-[#2da050] hover:from-[#2da050] hover:to-[#1e7a38] text-white font-bold px-10 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all group">
                💬 Начать разговор с AI
                <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">
                  →
                </span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
