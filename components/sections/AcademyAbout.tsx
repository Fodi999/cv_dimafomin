"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Brain, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AcademyAbout() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#3BC864]/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00D9FF]/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#3BC864]/10 rounded-full blur-3xl translate-y-1/2" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-8"
          >
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3BC864]/10 border border-[#3BC864]/30 mb-6">
                <Brain className="w-4 h-4 text-[#3BC864]" />
                <span className="text-sm font-semibold text-[#3BC864]">О проекте</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#1E1A41] mb-6">
                Искусственный интеллект в сервисе кулинара
              </h2>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-700 leading-relaxed"
            >
              <span className="font-bold text-[#3BC864]">AI Dima Fomin</span> — это не просто искусственный интеллект.
              <br />
              <br />
              Это <span className="text-[#3BC864] font-semibold">цифровой наставник</span>, который передаёт знания, опыт и философию шефа.
              Каждый рецепт, совет и техника — результат многолетнего мастерства.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="space-y-4"
            >
              {[
                { icon: "🎓", title: "Обучение", desc: "Структурированные курсы от базовых техник до advanced рецептов" },
                { icon: "🤖", title: "AI-наставник", desc: "Генерируй рецепты, получай советы, анализируй результаты" },
                { icon: "💰", title: "ChefTokens", desc: "Зарабатывай токены за учёбу и обмени их на эксклюзивные рецепты" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="flex gap-4 p-4 rounded-2xl bg-white/50 hover:bg-white transition-colors border border-gray-100"
                >
                  <span className="text-3xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <h3 className="font-bold text-[#1E1A41] mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link href="/academy">
                <Button className="bg-[#3BC864] hover:bg-[#2da050] text-white font-bold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all group w-full md:w-auto">
                  Подробнее об Академии
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform ml-2" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right side - Visual element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-96 hidden md:block"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#3BC864]/20 to-[#00D9FF]/20 rounded-3xl border-2 border-[#3BC864]/30 backdrop-blur-sm p-8 flex items-center justify-center">
              <motion.div
                animate={{ float: [0, 20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-center"
              >
                <div className="text-6xl mb-6">🍣</div>
                <h3 className="text-2xl font-bold text-[#1E1A41] mb-3">
                  Морские продукты с нуля
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed max-w-xs mx-auto">
                  От выбора ингредиентов до идеального блюда с помощью AI
                </p>
              </motion.div>

              {/* Floating icons */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-3xl"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#3BC864]/10 rounded-full flex items-center justify-center text-3xl">
                  🧂
                </div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#00D9FF]/10 rounded-full flex items-center justify-center text-3xl">
                  🌊
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
