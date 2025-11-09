// PostsGrid.tsx — сітка постів у Pinterest-стилі

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Bookmark, Share2, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Post } from "@/lib/profile-types";

interface PostsGridProps {
  posts: Post[];
  loading: boolean;
  emptyMessage: string;
  onCreatePost?: () => void;
  translations: Record<string, string>;
}

export function PostsGrid({ posts, loading, emptyMessage, onCreatePost, translations }: PostsGridProps) {
  const [hoveredPostId, setHoveredPostId] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-purple-600"></div>
        <p className="text-gray-500 mt-4">{translations.loading}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 mb-4">{emptyMessage}</p>
        {onCreatePost && (
          <Button onClick={onCreatePost}>
            Створити перший рецепт
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="columns-2 md:columns-3 gap-4">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className="break-inside-avoid mb-4 group cursor-pointer"
          onMouseEnter={() => setHoveredPostId(post.id)}
          onMouseLeave={() => setHoveredPostId(null)}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
            <img
              src={post.image || post.imageUrl || "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=500&fit=crop"}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
            
            {/* Hover Overlay */}
            <div 
              className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
                hoveredPostId === post.id ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Top Right Actions */}
              <div className="absolute top-3 right-3 flex gap-2">
                <button 
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <Bookmark className={`w-4 h-4 ${post.saved ? 'fill-gray-800 text-gray-800' : 'text-gray-800'}`} />
                </button>
              </div>

              {/* Bottom Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-semibold text-sm mb-1">{post.title}</h3>
                <div className="flex items-center gap-3 mt-2">
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-xs hover:scale-110 transition-transform"
                  >
                    <Heart className="w-4 h-4" />
                    <span>{post.likes || 0}</span>
                  </button>
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-xs hover:scale-110 transition-transform"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
