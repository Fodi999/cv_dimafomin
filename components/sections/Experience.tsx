"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, ChefHat, BookOpen, Coins, Award, Users, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

const getStepIcon = (iconName: string) => {
  switch (iconName) {
    case 'user-plus':
      return UserPlus;
    case 'chef-hat':
      return ChefHat;
    case 'book-open':
      return BookOpen;
    case 'coins':
      return Coins;
    case 'award':
      return Award;
    case 'users':
      return Users;
    default:
      return BookOpen;
  }
};

export default function Experience() {
  const { t } = useLanguage();
  const router = useRouter();
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const steps = t.experience.steps || [];

  return (
    <section id="experience" className="py-24 px-4 bg-gradient-to-b from-[#FEF9F5] to-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E1A41] mb-4">
              {t.experience.title}
            </h2>
            <div className="w-20 h-1 bg-[#3BC864] mx-auto rounded-full mb-6" />
            <p className="text-lg text-[#240F24] max-w-3xl mx-auto leading-relaxed">
              {t.experience.subtitle}
            </p>
          </div>

          {/* Intro Text */}
          {t.experience.journeyIntro && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-16"
            >
              <div className="bg-gradient-to-r from-[#3BC864]/10 to-[#C5E98A]/20 rounded-2xl p-8 border-2 border-[#3BC864]/30">
                <p className="text-[#1E1A41] text-lg leading-relaxed text-center">
                  {t.experience.journeyIntro}
                </p>
              </div>
            </motion.div>
          )}

          {/* Steps */}
          <div className="relative space-y-8">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#3BC864] via-[#C5E98A] to-[#3BC864]" />

            {steps.map((step: any, index: number) => {
              const Icon = getStepIcon(step.icon);
              const isHovered = hoveredStep === index;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.15, duration: 0.6 }}
                  className="relative"
                  onMouseEnter={() => setHoveredStep(index)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  <Card className={`p-6 md:p-8 bg-white transition-all duration-300 border-[#E0D8D0] md:ml-24 cursor-pointer ${
                    isHovered 
                      ? 'shadow-2xl border-[#3BC864] scale-[1.02] bg-gradient-to-r from-[#3BC864]/5 to-[#C5E98A]/10' 
                      : 'hover:shadow-xl hover:border-[#3BC864]/50'
                  }`}>
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Step Number & Icon */}
                      <div className="flex md:flex-col items-center md:items-start gap-4">
                        {/* Number Badge */}
                        <motion.div 
                          className={`absolute -left-0 md:-left-24 top-6 flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full shadow-lg transition-all duration-300 ${
                            isHovered 
                              ? 'bg-gradient-to-br from-[#3BC864] to-[#C5E98A] scale-110' 
                              : 'bg-gradient-to-br from-[#3BC864] to-[#C5E98A]'
                          }`}
                          animate={isHovered ? { rotate: [0, -5, 5, -5, 0] } : {}}
                          transition={{ duration: 0.5 }}
                        >
                          <span className="text-white text-xl md:text-2xl font-bold">
                            {step.number}
                          </span>
                        </motion.div>
                        
                        {/* Icon */}
                        <motion.div 
                          className={`p-4 rounded-xl ml-16 md:ml-0 transition-all duration-300 ${
                            isHovered 
                              ? 'bg-gradient-to-br from-[#3BC864] to-[#C5E98A] scale-110' 
                              : 'bg-gradient-to-br from-[#3BC864]/10 to-[#C5E98A]/20'
                          }`}
                          animate={isHovered ? { y: [0, -5, 0] } : {}}
                          transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
                        >
                          <Icon className={`w-8 h-8 transition-colors duration-300 ${
                            isHovered ? 'text-white' : 'text-[#3BC864]'
                          }`} />
                        </motion.div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className={`text-xl md:text-2xl font-bold mb-3 transition-colors duration-300 ${
                          isHovered ? 'text-[#3BC864]' : 'text-[#1E1A41]'
                        }`}>
                          {step.title}
                        </h3>
                        <p className="text-[#240F24] text-base md:text-lg leading-relaxed mb-4">
                          {step.description}
                        </p>
                        
                        {/* Bonus Badge */}
                        {step.bonus && (
                          <motion.div 
                            className={`inline-block px-4 py-2 rounded-lg transition-all duration-300 ${
                              isHovered 
                                ? 'bg-gradient-to-r from-amber-200 to-orange-200 border-2 border-amber-400 scale-105' 
                                : 'bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-300'
                            }`}
                            animate={isHovered ? { scale: [1, 1.05, 1] } : {}}
                            transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
                          >
                            <p className="text-amber-800 font-medium text-sm">
                              {step.bonus}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* Arrow between steps */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:flex justify-center my-4 ml-24">
                      <motion.div
                        animate={{ y: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className={`w-6 h-6 transition-colors duration-300 ${
                          isHovered ? 'text-[#3BC864]' : 'text-[#3BC864]/60'
                        }`} />
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Final Path Summary */}
          {t.experience.finalPath && t.experience.pathSteps && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
              className="mt-16"
            >
              <div className="bg-gradient-to-r from-[#3BC864] to-[#C5E98A] rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-white text-xl md:text-2xl font-bold text-center mb-5">
                    {t.experience.finalPath}
                  </h3>
                  
                  {/* Minimalist Path Steps */}
                  <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
                    {t.experience.pathSteps.split(' → ').map((step: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 md:gap-3">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={inView ? { opacity: 1, y: 0 } : {}}
                          transition={{ 
                            delay: 1.4 + index * 0.1, 
                            duration: 0.6,
                            ease: "easeOut"
                          }}
                        >
                          <div className="bg-white/95 px-3 md:px-5 py-1.5 md:py-2 rounded-lg shadow-md">
                            <p className="text-[#1E1A41] text-xs md:text-base font-semibold whitespace-nowrap">
                              {step.trim()}
                            </p>
                          </div>
                        </motion.div>
                        
                        {/* Simple Arrow */}
                        {index < t.experience.pathSteps.split(' → ').length - 1 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={inView ? { opacity: 1 } : {}}
                            transition={{ 
                              delay: 1.5 + index * 0.1,
                              duration: 0.6,
                              ease: "easeOut"
                            }}
                          >
                            <ArrowRight className="w-3 h-3 md:w-5 md:h-5 text-white/80" />
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* CTA Button */}
          {t.experience.ctaText && t.experience.ctaButton && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.5, duration: 0.6 }}
              className="mt-12 text-center"
            >
              <p className="text-[#1E1A41] text-xl md:text-2xl font-semibold mb-6">
                {t.experience.ctaText}
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#3BC864] to-[#C5E98A] text-white hover:from-[#C5E98A] hover:to-[#3BC864] text-xl px-12 py-8 rounded-full shadow-2xl transition-all duration-300 group relative overflow-hidden"
                  onClick={() => router.push("/create-chat")}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {t.experience.ctaButton}
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
