"use client";

import { motion } from "framer-motion";

interface DashboardCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
}

export default function DashboardCard({ title, value, icon, color }: DashboardCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-xl shadow-lg p-6 relative overflow-hidden"
    >
      {/* Gradient Background */}
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-full -mr-8 -mt-8`} />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="text-4xl mb-3">{icon}</div>
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
