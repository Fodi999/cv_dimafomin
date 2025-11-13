"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  MessageCircle,
  Camera,
  PlayCircle,
  Lightbulb,
  Zap,
  Sparkles,
  Coins,
  TrendingUp,
  Users,
  BookOpen,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AcademyAbout() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white/50 to-white dark:from-gray-950/50 dark:to-gray-950">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/5 to-cyan-500/5 dark:via-sky-500/10 dark:to-cyan-500/10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-400/10 dark:bg-sky-500/20 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/10 dark:bg-cyan-500/20 rounded-full blur-3xl translate-y-1/2" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-24 py-24">
        {/* SECTION 1: HERO BLOCK - О ПРОЕКТЕ */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center space-y-4"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              О проекте
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Seafood Academy — платформа, где вы учитесь готовить морепродукты, совершенствуете навыки и зарабатываете ChefTokens через диалог с персональным AI-наставником
            </p>
          </motion.div>
        </motion.div>

        {/* SECTION 2: КТО ТАКОЙ AI DIMA FOMIN */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="bg-gradient-to-r from-sky-50/50 to-cyan-50/50 dark:from-sky-950/30 dark:to-cyan-950/30 rounded-xl border border-sky-100 dark:border-sky-900/50 shadow-md dark:shadow-sky-500/5 p-8 md:p-12"
        >
          <motion.div variants={itemVariants} className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 dark:bg-sky-500/20 border border-sky-200/50 dark:border-sky-800/50 mb-6">
              <Brain className="w-6 h-6 text-sky-600 dark:text-sky-400" />
              <span className="text-sm font-semibold text-sky-600 dark:text-sky-400">КТО ТАКОЙ AI DIMA FOMIN</span>
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Цифровой наставник с опытом шефа
            </h3>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              AI Dima Fomin — цифровой наставник, созданный на основе опыта шефа. Обучает через живой диалог, анализирует блюда по фото, разбирает видео и помогает готовить как настоящий шеф.
            </p>

            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  title: "Опыт",
                  desc: "Знания основаны на многолетнем мастерстве в кулинарии морепродуктов",
                },
                {
                  title: "Философия",
                  desc: "Каждый ответ передаёт подход и видение шефа к кулинарному искусству",
                },
                {
                  title: "Метод обучения",
                  desc: "Обучает через диалог и практику, а не сухую теорию",
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="p-4 rounded-lg bg-white/40 dark:bg-white/5 border border-sky-200/50 dark:border-sky-800/50"
                >
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* SECTION 3: КАК ПРОХОДИТ ОБУЧЕНИЕ - ИНТЕРАКТИВНЫЕ ШАГИ */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="text-center">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              Как проходит обучение
            </h3>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Выбирайте удобный для вас формат: от живого диалога до анализа блюд по фото
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { icon: <MessageCircle className="w-6 h-6 text-sky-600 dark:text-sky-400" />, title: "Чат-диалоги", desc: "Задавайте вопросы — получайте ответы мгновенно" },
              { icon: <Camera className="w-6 h-6 text-sky-600 dark:text-sky-400" />, title: "Фотоанализ", desc: "Отправьте фото — AI оценит технику приготовления" },
              { icon: <PlayCircle className="w-6 h-6 text-sky-600 dark:text-sky-400" />, title: "Видео на YouTube", desc: "AI подбирает обучающие видео с YouTube под вашу цель" },
              { icon: <Lightbulb className="w-6 h-6 text-sky-600 dark:text-sky-400" />, title: "Персональные подсказки", desc: "Адаптируется под ваш уровень и цели" },
              { icon: <Zap className="w-6 h-6 text-sky-600 dark:text-sky-400" />, title: "Помощь во время готовки", desc: "Сопровождение в реальном времени прямо на кухне" },
              { icon: <Coins className="w-6 h-6 text-sky-600 dark:text-sky-400" />, title: "Оплата токенами", desc: "Каждый запрос к AI оплачивается ChefTokens" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="p-6 rounded-xl bg-gradient-to-br from-sky-50/50 to-cyan-50/50 dark:from-sky-950/30 dark:to-cyan-950/30 border border-sky-100 dark:border-sky-900/50 shadow-md dark:shadow-sky-500/5 hover:shadow-lg dark:hover:shadow-sky-500/10 transition-all duration-200"
              >
                <div className="text-sky-600 dark:text-sky-400 mb-3">{item.icon}</div>
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* SECTION 4: AI-НАСТАВНИК - ФУНКЦИОНАЛЬНЫЕ ВОЗМОЖНОСТИ */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="text-center">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              Возможности AI-наставника
            </h3>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Всё, что делает AI Dima Fomin, чтобы развивать ваши кулинарные навыки
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                icon: <Sparkles className="w-6 h-6 text-sky-600 dark:text-sky-400" />,
                title: "Генерация рецептов",
                desc: "AI создаёт рецепты, исходя из того, что есть у вас дома",
              },
              {
                icon: <BookOpen className="w-6 h-6 text-sky-600 dark:text-sky-400" />,
                title: "Пошаговые инструкции по приготовлению",
                desc: "Объясняет каждый шаг приготовления простыми и понятными действиями",
              },
              {
                icon: <Camera className="w-6 h-6 text-sky-600 dark:text-sky-400" />,
                title: "Анализ техники по фото",
                desc: "Оценивает подачу, прожарку, текстуру и даёт рекомендации",
              },
              {
                icon: <Lightbulb className="w-6 h-6 text-sky-600 dark:text-sky-400" />,
                title: "Подбор под ваш уровень",
                desc: "Рекомендует блюда, которые соответствуют вашему опыту и навыкам",
              },
              {
                icon: <Zap className="w-6 h-6 text-sky-600 dark:text-sky-400" />,
                title: "Помощь во время готовки",
                desc: "Сопровождает в реальном времени и подсказывает, что делать дальше",
              },
              {
                icon: <Clock className="w-6 h-6 text-sky-600 dark:text-sky-400" />,
                title: "Работа 24/7 и адаптация",
                desc: "Всегда доступен и обучается под ваши предпочтения и стиль готовки",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="p-6 rounded-xl bg-gradient-to-br from-sky-50/50 to-cyan-50/50 dark:from-sky-950/30 dark:to-cyan-950/30 border border-sky-100 dark:border-sky-900/50 shadow-md dark:shadow-sky-500/5 hover:shadow-lg dark:hover:shadow-sky-500/10 transition-all duration-200"
              >
                <div className="text-sky-600 dark:text-sky-400 mb-3">{item.icon}</div>
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* SECTION 7: FINAL CTA */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="bg-gradient-to-r from-sky-500/10 to-cyan-500/10 dark:from-sky-900/30 dark:to-cyan-900/30 rounded-xl border border-sky-100 dark:border-sky-900/50 shadow-md dark:shadow-sky-500/5 p-8 md:p-12 text-center"
        >
          <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              Морские продукты с нуля
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-semibold uppercase tracking-wide">
              Обучение от основ до уровня ресторана
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              AI проведёт вас от выбора свежих ингредиентов до блюда ресторанного уровня — через диалог, анализ и персональные подсказки.
            </p>
            <Link href="/create-chat">
              <Button className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 dark:from-sky-600 dark:to-cyan-600 dark:hover:from-sky-700 dark:hover:to-cyan-700 text-white font-medium px-8 py-6 text-lg rounded-xl shadow-md hover:shadow-lg dark:shadow-sky-500/20 dark:hover:shadow-sky-500/30 transition-all duration-200 active:scale-95 group">
                Начать обучение с AI
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform ml-2" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
