"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import { Heart, MessageCircle, Bookmark, ChefHat } from "lucide-react";
import Link from "next/link";
import { academyApi } from "@/lib/api";
import type { RecipePost } from "@/lib/types";

export default function AllRecipes() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [recipes, setRecipes] = useState<RecipePost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setIsLoading(true);
        const response: any = await academyApi.getAllPosts({ limit: 50 });
        
        // Handle backend response format
        if (response && response.data) {
          setRecipes(response.data);
        } else if (Array.isArray(response)) {
          setRecipes(response);
        }
      } catch (error) {
        console.error("Error loading recipes:", error);
        // Set empty array on error to avoid breaking UI
        setRecipes([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipes();
  }, []);

  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-[1640px] mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Завантаження рецептів...</p>
          </div>
        </div>
      </section>
    );
  }

  if (recipes.length === 0) {
    return (
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-[1640px] mx-auto">
          <div className="text-center">
            <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Поки що немає рецептів</h3>
            <p className="text-gray-600">Будьте першим, хто поділиться своїм рецептом!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-12 sm:py-20 px-4 bg-white">
      <div className="max-w-[1640px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Портфоліо
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Відкрийте для себе найкращі рецепти від талановитих кухарів з усього світу
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Pinterest-style Masonry Grid */}
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
            {recipes.map((recipe, index) => {
              // Support both API formats: direct fields or nested author object
              const authorId = (recipe as any).author?.id || recipe.userId;
              const authorName = (recipe as any).author?.name || recipe.userName;
              const authorAvatar = (recipe as any).author?.avatarUrl || recipe.userAvatar;
              
              return (
                <Link
                  key={recipe.id}
                  href={`/academy/user/${authorId}`}
                  className="block break-inside-avoid mb-4 group"
                  onMouseEnter={() => setHoveredId(recipe.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: index * 0.02 }}
                    className="cursor-pointer"
                  >
                    <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                      {recipe.imageUrl ? (
                        <img
                          src={recipe.imageUrl}
                          alt={recipe.title}
                          loading="lazy"
                          className="w-full h-auto object-cover"
                        />
                      ) : (
                        <div className="w-full aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <ChefHat className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Pinterest Hover Overlay */}
                      <div 
                        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
                          hoveredId === recipe.id ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                      {/* Top Right Actions */}
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex gap-2">
                        <button 
                          className="p-1.5 sm:p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-800" />
                        </button>
                      </div>

                      {/* Bottom Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
                        <h3 className="font-semibold text-xs sm:text-sm mb-1 line-clamp-2">
                          {recipe.title}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-white/90 line-clamp-2 mb-2 hidden sm:block">
                          {recipe.description}
                        </p>
                        
                        {/* Author Info */}
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                          {authorAvatar ? (
                            <img 
                              src={authorAvatar} 
                              alt={authorName}
                              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white"
                            />
                          ) : (
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-[10px] sm:text-xs font-bold border-2 border-white">
                              {authorName?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="text-[10px] sm:text-xs font-medium truncate">{authorName}</span>
                        </div>
                        
                        {/* Bottom Actions */}
                        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                          <div className="flex items-center gap-1 text-[10px] sm:text-xs">
                            <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{recipe.likesCount || 0}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] sm:text-xs">
                            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{recipe.commentsCount || 0}</span>
                          </div>
                          {recipe.difficulty && (
                            <span className="text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white/20 rounded-full backdrop-blur-sm whitespace-nowrap">
                              {recipe.difficulty === 'beginner' && '🟢 Початківець'}
                              {recipe.difficulty === 'intermediate' && '🟡 Середній'}
                              {recipe.difficulty === 'advanced' && '🔴 Професіонал'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
