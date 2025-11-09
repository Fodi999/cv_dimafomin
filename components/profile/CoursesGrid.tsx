// CoursesGrid.tsx — відображення курсів з прогресом

import { motion } from "framer-motion";
import { Award, BookOpen } from "lucide-react";

export function CoursesGrid() {
  return (
    <div className="space-y-4">
      {/* Completed Course */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Майстер суші: професійний рівень</h3>
              <p className="text-sm text-gray-600">Завершено: 15 жовтня 2024</p>
            </div>
          </div>
          <div className="text-green-600 font-bold text-2xl">100%</div>
        </div>
        <div className="w-full bg-green-200 h-3 rounded-full overflow-hidden">
          <div className="bg-green-600 h-3 rounded-full" style={{ width: "100%" }} />
        </div>
      </motion.div>

      {/* In Progress Course */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-2xl"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-orange-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Японська кухня для початківців</h3>
              <p className="text-sm text-gray-600">В процесі навчання</p>
            </div>
          </div>
          <div className="text-orange-600 font-bold text-2xl">30%</div>
        </div>
        <div className="w-full bg-orange-200 h-3 rounded-full overflow-hidden">
          <div 
            className="bg-orange-600 h-3 rounded-full transition-all duration-500" 
            style={{ width: "30%" }} 
          />
        </div>
      </motion.div>
    </div>
  );
}
