"use client";

import { Bookmark } from "lucide-react";
import type { Post } from "@/lib/profile-types";

interface SavedPostsCardProps {
  posts: Post[];
}

export function SavedPostsCard({ posts }: SavedPostsCardProps) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Bookmark className="w-5 h-5 text-green-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Збережені
        </h3>
        <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm font-medium">
          {posts.length}
        </span>
      </div>

      {/* Saved Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Немає збережених публікацій</p>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.slice(0, 5).map((post) => (
            <div
              key={post.id}
              className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-700 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 dark:text-white truncate text-sm">
                    {post.title || "Без назви"}
                  </h4>
                  {post.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
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
