"use client";

import { motion, useScroll } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll({
    container: typeof window !== "undefined" ? { current: document.documentElement } : undefined,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3BC864] via-[#2B6A79] to-[#C5E98A] origin-left z-[60]"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
