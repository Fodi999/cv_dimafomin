"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * PWA Install Button - 2025 Model
 * 
 * Shows "Install App" button when PWA can be installed
 * Best practice: User-triggered install (not automatic prompt)
 */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showButton, setShowButton] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShowButton(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        console.log("PWA installed successfully");
      }

      setDeferredPrompt(null);
      setShowButton(false);
    } catch (error) {
      console.error("Install failed:", error);
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <AnimatePresence>
      {showButton && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={handleInstall}
          disabled={isInstalling}
          className="fixed bottom-20 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Install ChefOS as app"
        >
          <Download className="w-5 h-5" />
          <span className="font-semibold text-sm">
            {isInstalling ? "Installing..." : "Install App"}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
