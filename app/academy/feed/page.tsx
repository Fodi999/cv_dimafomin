"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Legacy feed page - redirects to unified community page
 * Maintains backward compatibility for /academy/feed links
 */
export default function FeedRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/academy/community?tab=feed");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#3BC864]"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Przekierowanie do społeczności...</p>
      </div>
    </div>
  );
}
