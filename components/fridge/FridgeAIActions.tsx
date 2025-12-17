"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FridgeAIActions() {
  const router = useRouter();

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => router.push("/assistant")}
      className="
        w-full p-4 rounded-xl text-white
        bg-gradient-to-br from-purple-500 to-pink-500
        hover:from-purple-600 hover:to-pink-600
        shadow-lg hover:shadow-xl
        transition-all duration-300
        flex items-center justify-center gap-3
        font-semibold text-lg
      "
    >
      <Sparkles className="w-6 h-6" />
      Zobacz rekomendacje AI
    </motion.button>
  );
}

