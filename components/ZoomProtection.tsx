"use client";

import { useEffect } from "react";

/**
 * Zoom Protection - PWA 2025 Best Practice
 * 
 * Blocks Ctrl+wheel zoom on macOS trackpad / desktop
 * 
 * ✅ Disables: Ctrl+wheel zoom (Safari, Chrome)
 * ✅ Preserves: Normal scroll, accessibility
 * 
 * Use case: SaaS dashboards, kitchen tools, PWA apps
 * NOT for: Public blogs (accessibility concern)
 */
export function ZoomProtection() {
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Block zoom via Ctrl+wheel (trackpad pinch)
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    // Passive: false allows preventDefault()
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return null; // This component renders nothing
}
