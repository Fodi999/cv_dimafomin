"use client";

import { motion } from "framer-motion";
import { PostsCard } from "../PostsCard";
import { SavedPostsCard } from "../SavedPostsCard";
import { CoursesGrid } from "../CoursesGrid";
import type { Post } from "@/lib/profile-types";

interface ContentSectionProps {
  posts: Post[];
  savedPosts: Post[];
  translations: Record<string, string>;
}

export function ContentSection({
  posts,
  savedPosts,
  translations,
}: ContentSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Posts */}
      <PostsCard posts={posts} />

      {/* Saved Posts */}
      <SavedPostsCard posts={savedPosts} />

      {/* Courses */}
      <CoursesGrid />
    </motion.div>
  );
}
