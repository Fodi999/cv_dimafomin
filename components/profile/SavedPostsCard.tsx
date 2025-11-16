"use client";

import { Bookmark } from "lucide-react";
import type { Post } from "@/lib/profile-types";
import { borderRadius, colors } from "@/lib/design-tokens";

interface SavedPostsCardProps {
  posts: Post[];
}

export function SavedPostsCard({ posts }: SavedPostsCardProps) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Bookmark className="w-5 h-5 text-emerald-400" />
        <h3 className="text-lg font-semibold text-white">
          Збережені
        </h3>
        <span className={`px-2 py-0.5 ${borderRadius.full} bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-sm font-medium`}>
          {posts.length}
        </span>
      </div>

      {/* Saved Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Немає збережених публікацій</p>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.slice(0, 5).map((post) => (
            <div
              key={post.id}
              className={`p-3 ${borderRadius.lg} bg-gray-900/40 border ${colors.border.dark.primary} hover:border-emerald-500 transition-colors cursor-pointer`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white truncate text-sm">
                    {post.title || "Без назви"}
                  </h4>
                  {post.description && (
                    <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                      {post.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
          {posts.length > 5 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
              +{posts.length - 5} ще збережених
            </p>
          )}
        </div>
      )}
    </div>
  );
}
