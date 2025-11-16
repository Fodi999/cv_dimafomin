"use client";

import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Post } from "@/lib/profile-types";
import { composite, borderRadius, colors } from "@/lib/design-tokens";

interface PostsCardProps {
  posts: Post[];
  onCreatePost?: () => void;
}

export function PostsCard({ posts, onCreatePost }: PostsCardProps) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-sky-400" />
          <h3 className="text-lg font-semibold text-white">
            Публікації
          </h3>
          <span className={`px-2 py-0.5 ${borderRadius.full} ${colors.primary.light.badge} text-sm font-medium`}>
            {posts.length}
          </span>
        </div>
        {onCreatePost && (
          <Button
            onClick={onCreatePost}
            size="sm"
            className={`${colors.primary.light.gradient} text-white h-8 px-3 font-semibold`}
          >
            <Plus className="w-4 h-4 mr-1" />
            Нова
          </Button>
        )}
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Немає публікацій</p>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.slice(0, 5).map((post) => (
            <div
              key={post.id}
              className={`p-3 ${borderRadius.lg} bg-gray-900/40 border ${colors.border.dark.primary} hover:border-sky-500 transition-colors cursor-pointer`}
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
              +{posts.length - 5} ще публікацій
            </p>
          )}
        </div>
      )}
    </div>
  );
}
