"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, ArrowRight, Shell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";

export default function Hero() {
  const { t } = useLanguage();
  const router = useRouter();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  // Typing effect state
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    setTypedText(""); // Reset text when language changes
    let i = 0;
    const typingDelay = setTimeout(() => {
      const interval = setInterval(() => {
        setTypedText(t.hero.description.slice(0, i));
        i++;
        if (i > t.hero.description.length) {
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }, 1400);

    return () => clearTimeout(typingDelay);
  }, [t.hero.description]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
      
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      ref={ref}
      id="hero"
      className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-900 via-sky-900/20 to-neutral-900"
    >
      {/* Animated Background Gradient */}
      <motion.div 
        className="absolute inset-0 z-0"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{
            backgroundImage:
              "url('https://i.postimg.cc/nV6RZ6ZV/DSCF4639.webp')",
          }}
        />
        {/* Улучшенный AI-градиент оверлей */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 backdrop-blur-sm" />
        
        {/* Subtle animated waves */}
        <motion.div 
          className="absolute inset-0 opacity-20"
          style={{
            background: "radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)",
          }}
          animate={{
            x: [-50, 50],
            y: [-50, 50],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </motion.div>

      {/* Content */}
      <motion.div 
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        style={{ opacity }}
      >
        <motion.div className="space-y-6">
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
          >
            {t.hero.title}
          </motion.h1>

          {/* Subheading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="text-2xl md:text-3xl lg:text-4xl font-medium text-white/95"
          >
            {t.hero.subtitle}
          </motion.h2>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            className="text-lg md:text-xl text-[#C5E98A] max-w-3xl mx-auto leading-relaxed font-medium flex items-center justify-center gap-2"
          >
            {t.hero.tagline}
            <motion.div
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block"
            >
              <Shell className="w-5 h-5 text-amber-400" />
            </motion.div>
          </motion.p>

          {/* Description - Typing Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed italic font-light min-h-[4rem] md:min-h-[5rem]"
          >
            {typedText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
              className="inline-block w-0.5 h-6 md:h-8 bg-white/90 ml-1 align-middle"
            />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-400 text-white hover:from-cyan-500 hover:to-sky-500 text-lg px-8 py-6 rounded-full shadow-2xl hover:shadow-sky-500/50 transition-all duration-300 group relative overflow-hidden font-semibold"
                onClick={() => router.push("/academy")}
              >
                {/* Pulsing glow effect */}
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-full"
                  animate={{ scale: [1, 1.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  {t.hero.ctaPrimary}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-2 border-white text-white hover:bg-white hover:text-sky-900 text-lg px-8 py-6 rounded-full transition-all duration-300 font-semibold backdrop-blur-sm"
                onClick={() => scrollToSection("about")}
              >
                {t.hero.ctaSecondary}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 1,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 0.5,
        }}
        onClick={() => scrollToSection("about")}
      >
        <ChevronDown className="w-8 h-8 text-white/70" />
      </motion.div>
    </section>
  );
}
