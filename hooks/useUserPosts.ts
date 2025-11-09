// useUserPosts.ts — хук для завантаження постів користувача

import { useState, useEffect } from "react";
import { academyApi } from "@/lib/api";
import type { Post } from "@/lib/profile-types";

interface UseUserPostsProps {
  userId?: string;
  autoLoad?: boolean;
}

export function useUserPosts({ userId, autoLoad = true }: UseUserPostsProps) {
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const loadUserPosts = async () => {
    if (!userId) return;
    
    setLoadingPosts(true);
    try {
      const response = await academyApi.getUserPosts(userId);
      const posts = Array.isArray(response) ? response : (response as any)?.posts || [];
      setUserPosts(posts);
      
      const saved = posts.filter((post: Post) => post.saved);
      setSavedPosts(saved);
    } catch (error: any) {
      console.error("Error loading user posts:", error);
      
      if (error.status === 404 || error.message?.includes('404')) {
        console.log("No posts found for user");
      }
      
      setUserPosts([]);
      setSavedPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    if (userId && autoLoad) {
      loadUserPosts();
    }
  }, [userId, autoLoad]);

  return {
    userPosts,
    savedPosts,
    loadingPosts,
    loadUserPosts,
  };
}
