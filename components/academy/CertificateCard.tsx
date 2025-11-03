"use client";

import { motion } from "framer-motion";
import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CertificateCardProps {
  title: string;
  date: string;
  instructor: string;
  certificateId: string;
}

export default function CertificateCard({
  title,
  date,
  instructor,
  certificateId,
}: CertificateCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#C5E98A]/30"
    >
      {/* Certificate Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">📜</div>
        <div className="text-xs text-[#1E1A41]/50 font-mono">
          {certificateId}
        </div>
      </div>

      {/* Certificate Info */}
      <h3 className="text-xl font-bold text-[#1E1A41] mb-2">{title}</h3>
      <p className="text-sm text-[#1E1A41]/60 mb-1">Інструктор: {instructor}</p>
      <p className="text-sm text-[#1E1A41]/60 mb-4">Дата: {date}</p>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          size="sm"
          className="flex-1 bg-gradient-to-r from-[#3BC864] to-[#C5E98A] text-white hover:opacity-90"
        >
          <Download className="w-4 h-4 mr-2" />
          Завантажити
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-[#3BC864] text-[#3BC864] hover:bg-[#3BC864] hover:text-white"
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
