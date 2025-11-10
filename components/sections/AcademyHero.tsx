"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AcademyHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E1A41] via-[#2d1b4e] to-[#0a2e4a] z-0">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#3BC864] rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-[#00D9FF] rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000" />
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
        </div>
      </div>

      {/* Animated wave pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-32 z-0">
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z"
            fill="rgba(59, 200, 100, 0.1)"
            className="animate-pulse"
          />
          <path
            d="M0,60 Q300,30 600,60 T1200,60 L1200,120 L0,120 Z"
            fill="rgba(0, 217, 255, 0.05)"
            className="animate-pulse delay-700"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#3BC864]/20 to-[#00D9FF]/20 border border-[#3BC864]/30 mb-8"
        >
          <Sparkles className="w-4 h-4 text-[#3BC864]" />
          <span className="text-sm font-semibold text-white">
            Добро пожаловать в Seafood Academy
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3BC864] via-[#00D9FF] to-blue-400">
              Seafood Academy
            </span>
            <br />
            <span className="text-white">by Dima Fomin</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          🧑‍🍳 Твой AI-наставник по морепродуктам и кулинарии.
          <br />
          <span className="text-[#3BC864]">Учись, готовь и зарабатывай ChefTokens</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Link href="/academy" className="group">
            <Button className="bg-gradient-to-r from-[#3BC864] to-[#2da050] hover:from-[#2da050] hover:to-[#1e7a38] text-white font-bold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all w-full sm:w-auto">
              Начать обучение
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform ml-2" />
            </Button>
          </Link>

          <Link href="/create-chat" className="group">
            <Button className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-6 text-lg rounded-xl border-2 border-white/30 hover:border-white/50 transition-all w-full sm:w-auto">
              💬 AI-наставник
              <Waves className="w-5 h-5 group-hover:translate-x-1 transition-transform ml-2" />
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-3 gap-6 max-w-xl mx-auto"
        >
          {[
            { number: "50+", label: "Рецептов" },
            { number: "1000+", label: "Учеников" },
            { number: "24/7", label: "AI-помощь" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-[#3BC864]/30 transition-colors"
            >
              <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3BC864] to-[#00D9FF]">
                {stat.number}
              </p>
              <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="w-8 h-12 border-2 border-[#3BC864] rounded-full flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 bg-[#3BC864] rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
