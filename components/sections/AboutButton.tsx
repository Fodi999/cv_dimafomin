"use client";

import { Info, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";

interface AboutButtonProps {
  variant?: 'light' | 'dark';
}

export default function AboutButton({ variant = 'light' }: AboutButtonProps) {
  const { t } = useLanguage();
  const router = useRouter();

  const handleClick = () => {
    router.push('/about');
  };

  const bgClass = variant === 'light' 
    ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600' 
    : 'bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500';

  return (
    <div className="flex justify-center">
      <button
        onClick={handleClick}
        className={`
          ${bgClass}
          text-white font-semibold
          px-6 sm:px-8 py-3 sm:py-4
          rounded-full
          shadow-lg hover:shadow-xl
          transform hover:scale-105
          transition-all duration-300
          flex items-center gap-2 sm:gap-3
          group
        `}
      >
        <Info className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="text-base sm:text-lg">
          {t?.common?.aboutProject || "О проекте"}
        </span>
        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
