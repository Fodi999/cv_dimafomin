"use client";

import { motion } from "framer-motion";
import { FileText, Bookmark, BookOpen } from "lucide-react";
import type { Post } from "@/lib/profile-types";
import { composite } from "@/lib/design-tokens";

interface ContentSectionProps {
  posts: Post[];
  savedPosts: Post[];
  translations: Record<string, string>;
  userProfile?: any;
  user?: {
    chefTokens?: number;
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export function ContentSection({
  posts,
  savedPosts,
  translations,
  userProfile,
  user,
}: ContentSectionProps) {
  // Mock courses data
  const courses = [
    {
      id: 1,
      title: "Майстер суші: професійний рівень",
      progress: 100,
      completedDate: "15 жовтня 2024",
      status: "completed"
    },
    {
      id: 2,
      title: "Японська кухня для початківців",
      progress: 30,
      status: "in-progress"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        gap: "24px"
      }}
    >

      {/* Publications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className={`${composite.card.container} ${composite.card.hover} overflow-hidden`}
      >
        <div className="px-4 sm:px-6 py-4 border-b border-gray-700/30 flex items-center gap-2">
          <FileText className="w-5 h-5 text-sky-400" />
          <h3 className="text-lg sm:text-xl font-bold text-white">Публікації</h3>
          <span className="ml-auto px-3 py-1 bg-gray-700/50 rounded-full text-sm font-semibold text-gray-300">
            {posts.length}
          </span>
        </div>
        <div className="px-4 sm:px-6 py-6">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30 text-gray-500" />
              <p className="text-gray-400 text-sm">Немає публікацій</p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.slice(0, 5).map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-lg p-4 border border-gray-700/30 hover:border-sky-500/50 transition-all cursor-pointer hover:bg-gray-800/30"
                >
                  <h4 className="font-semibold text-white text-sm sm:text-base">
                    {post.title || "Без назви"}
                  </h4>
                  {post.description && (
                    <p className="text-xs sm:text-sm text-gray-400 mt-2 line-clamp-2">
                      {post.description}
                    </p>
                  )}
                </motion.div>
              ))}
              {posts.length > 5 && (
                <p className="text-xs text-gray-500 text-center py-3">
                  +{posts.length - 5} ще публікацій
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Saved Posts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className={`${composite.card.container} ${composite.card.hover} overflow-hidden`}
      >
        <div className="px-4 sm:px-6 py-4 border-b border-gray-700/30 flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg sm:text-xl font-bold text-white">Збережені</h3>
          <span className="ml-auto px-3 py-1 bg-gray-700/50 rounded-full text-sm font-semibold text-gray-300">
            {savedPosts.length}
          </span>
        </div>
        <div className="px-4 sm:px-6 py-6">
          {savedPosts.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30 text-gray-500" />
              <p className="text-gray-400 text-sm">Немає збережених публікацій</p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedPosts.slice(0, 5).map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-lg p-4 border border-gray-700/30 hover:border-amber-500/50 transition-all cursor-pointer hover:bg-gray-800/30"
                >
                  <h4 className="font-semibold text-white text-sm sm:text-base">
                    {post.title || "Без назви"}
                  </h4>
                  {post.description && (
                    <p className="text-xs sm:text-sm text-gray-400 mt-2 line-clamp-2">
                      {post.description}
                    </p>
                  )}
                </motion.div>
              ))}
              {savedPosts.length > 5 && (
                <p className="text-xs text-gray-500 text-center py-3">
                  +{savedPosts.length - 5} ще публікацій
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Courses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className={`${composite.card.container} ${composite.card.hover} overflow-hidden`}
      >
        <div className="px-4 sm:px-6 py-4 border-b border-gray-700/30 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg sm:text-xl font-bold text-white">Курси</h3>
          <span className="ml-auto px-3 py-1 bg-gray-700/50 rounded-full text-sm font-semibold text-gray-300">
            {courses.length}
          </span>
        </div>
        <div className="px-4 sm:px-6 py-6">
          <div className="space-y-4">
            {courses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-lg p-5 border border-gray-700/30 hover:border-emerald-500/50 transition-all"
                style={{
                  background: course.status === "completed" 
                    ? "rgba(34, 197, 94, 0.08)" 
                    : "rgba(139, 92, 246, 0.08)"
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-sm sm:text-base">
                      {course.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      {course.status === "completed" ? (
                        <>
                          ✅ Завершено: {course.completedDate}
                        </>
                      ) : (
                        <>
                          🔄 В процесі навчання
                        </>
                      )}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-lg font-bold ${
                      course.status === "completed" 
                        ? "text-emerald-300" 
                        : "text-violet-300"
                    }`}>
                      {course.progress}%
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-700/40 rounded-full overflow-hidden border border-gray-700/30">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    transition={{ delay: 0.5 + idx * 0.1, duration: 1 }}
                    className={`h-full ${
                      course.status === "completed"
                        ? "bg-gradient-to-r from-emerald-500 to-green-400"
                        : "bg-gradient-to-r from-violet-500 via-violet-600 to-violet-400"
                    }`}
                    style={{
                      boxShadow: course.status === "completed"
                        ? "0 0 16px rgba(34, 197, 94, 0.8)"
                        : "0 0 16px rgba(139, 92, 246, 0.8)"
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
