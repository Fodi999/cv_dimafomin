"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Coins, Clock, Users as UsersIcon, ChefHat, Send } from "lucide-react";
import Link from "next/link";
import { RecipePost, RecipePostComment } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

interface RecipePostCardProps {
  post: RecipePost;
  currentUserId?: string;
  onLike?: (postId: string) => void;
  onComment?: (postId: string, text: string) => void;
}

export default function RecipePostCard({ post, currentUserId, onLike, onComment }: RecipePostCardProps) {
  const { t } = useLanguage();
  const community = (t.academy as any)?.community;

  const [showAllIngredients, setShowAllIngredients] = useState(false);
  const [showAllSteps, setShowAllSteps] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const isLiked = post.likes.some((like) => like.userId === currentUserId);
  const canComment = currentUserId && currentUserId !== post.userId;

  const handleLike = () => {
    if (onLike && currentUserId) {
      onLike(post.id);
    }
  };

  const handleComment = () => {
    if (onComment && commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText("");
    }
  };

  const difficultyColors = {
    beginner: "bg-green-100 text-green-700",
    intermediate: "bg-orange-100 text-orange-700",
    advanced: "bg-red-100 text-red-700",
  };

  const difficultyLabels = {
    beginner: community?.beginner || "Початковий",
    intermediate: community?.intermediate || "Середній",
    advanced: community?.advanced || "Просунутий",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-gray-100 hover:shadow-xl transition-shadow"
    >
      {/* User Header */}
      <div className="p-4 flex items-center gap-3 border-b border-gray-100">
        <Link 
          href={`/academy/user/${post.userId}`}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-[#3BC864] to-[#C5E98A] flex items-center justify-center text-white font-bold text-lg overflow-hidden hover:opacity-80 transition-opacity"
        >
          {post.userAvatar ? (
            <img src={post.userAvatar} alt={post.userName} className="w-full h-full object-cover" />
          ) : (
            post.userName.charAt(0).toUpperCase()
          )}
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Link 
              href={`/academy/user/${post.userId}`}
              className="font-bold text-[#1E1A41] hover:text-[#3BC864] transition-colors"
            >
              {post.userName}
            </Link>
            {post.userLevel && (
              <span className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full">
                LVL {post.userLevel}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleDateString("uk-UA", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        {post.tokensEarned > 0 && (
          <div className="flex items-center gap-1 text-amber-600 font-semibold">
            <Coins className="w-5 h-5" />
            <span>+{post.tokensEarned}</span>
          </div>
        )}
      </div>

      {/* Image */}
      <Link href={`/academy/user/${post.userId}`}>
        <div className="relative aspect-square bg-gray-100 cursor-pointer group">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:opacity-95 transition-opacity"
          />
          {/* Difficulty Badge */}
          {post.difficulty && (
            <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${difficultyColors[post.difficulty]}`}>
              {difficultyLabels[post.difficulty]}
            </div>
          )}
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="p-4 flex items-center gap-4 border-b border-gray-100">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleLike}
          className="flex items-center gap-2 group"
          disabled={!currentUserId}
        >
          <Heart
            className={`w-7 h-7 transition-all ${
              isLiked
                ? "fill-red-500 text-red-500"
                : "text-gray-600 group-hover:text-red-500 group-hover:scale-110"
            }`}
          />
          <span className="font-semibold text-gray-700">{post.likesCount}</span>
        </motion.button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 group"
        >
          <MessageCircle className="w-7 h-7 text-gray-600 group-hover:text-[#3BC864] transition-colors" />
          <span className="font-semibold text-gray-700">{post.commentsCount}</span>
        </button>

        <div className="ml-auto flex items-center gap-4 text-sm text-gray-600">
          {post.cookingTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{post.cookingTime} хв</span>
            </div>
          )}
          {post.servings && (
            <div className="flex items-center gap-1">
              <UsersIcon className="w-4 h-4" />
              <span>{post.servings} порц.</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Title & Description */}
        <div>
          <h2 className="text-xl font-bold text-[#1E1A41] mb-2">{post.title}</h2>
          {post.description && (
            <p className="text-gray-700 leading-relaxed">{post.description}</p>
          )}
        </div>

        {/* Ingredients */}
        {post.ingredients.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-[#1E1A41] mb-2 flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-[#3BC864]" />
              {community?.ingredients || "Інгредієнти"}
            </h3>
            <ul className="space-y-1">
              {(showAllIngredients ? post.ingredients : post.ingredients.slice(0, 3)).map((ingredient, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-[#3BC864]">•</span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
            {post.ingredients.length > 3 && (
              <button
                onClick={() => setShowAllIngredients(!showAllIngredients)}
                className="text-sm text-[#3BC864] font-semibold mt-2 hover:underline"
              >
                {showAllIngredients
                  ? community?.showLess || "Згорнути"
                  : `${community?.showMore || "Показати ще"} (${post.ingredients.length - 3})`}
              </button>
            )}
          </div>
        )}

        {/* Steps */}
        {post.steps.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-[#1E1A41] mb-2">
              👨‍🍳 {community?.steps || "Кроки приготування"}
            </h3>
            <ol className="space-y-2">
              {(showAllSteps ? post.steps : post.steps.slice(0, 2)).map((step, index) => (
                <li key={index} className="text-sm text-gray-700 flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#3BC864] text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="flex-1">{step}</span>
                </li>
              ))}
            </ol>
            {post.steps.length > 2 && (
              <button
                onClick={() => setShowAllSteps(!showAllSteps)}
                className="text-sm text-[#3BC864] font-semibold mt-2 hover:underline"
              >
                {showAllSteps
                  ? community?.showLess || "Згорнути"
                  : `${community?.showMore || "Показати ще"} (${post.steps.length - 2})`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <h3 className="font-bold text-[#1E1A41] mb-3">
            {community?.comments || "Коментарі"} ({post.commentsCount})
          </h3>

          {/* Comment Input */}
          {canComment && (
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={community?.addComment || "Додати коментар..."}
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-[#3BC864] focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleComment();
                  }
                }}
              />
              <Button
                onClick={handleComment}
                disabled={!commentText.trim()}
                className="bg-[#3BC864] hover:bg-[#2da050]"
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 overflow-hidden">
                    {comment.userAvatar ? (
                      <img src={comment.userAvatar} alt={comment.userName} className="w-full h-full object-cover" />
                    ) : (
                      comment.userName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 bg-white rounded-2xl px-4 py-2">
                    <p className="font-semibold text-sm text-[#1E1A41]">{comment.userName}</p>
                    <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(comment.createdAt).toLocaleDateString("uk-UA")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 text-sm py-4">
                {community?.noComments || "Коментарів поки немає. Будьте першим!"}
              </p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
