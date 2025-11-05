"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string;
  icon: LucideIcon | string;
  color: string;
}

export default function DashboardCard({ title, value, icon, color }: DashboardCardProps) {
  const IconComponent = typeof icon !== 'string' ? icon : null;
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden"
    >
      {/* Gradient Background */}
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-full -mr-8 -mt-8`} />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="mb-3 flex items-center">
          {IconComponent ? (
            <IconComponent className="w-10 h-10 text-[#3BC864]" strokeWidth={2} />
          ) : (
            <span className="text-4xl">{icon as string}</span>
          )}
        </div>
        <div className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent mb-2`}>
          {value}
        </div>
        <div className="text-sm text-[#1E1A41]/70 font-medium">
          {title}
        </div>
      </div>
    </motion.div>
  );
}
