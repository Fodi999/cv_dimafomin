"use client";

import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

/**
 * Global Auth Modal Wrapper
 * 
 * Использует глобальное состояние из AuthContext для отображения модалки
 * входа/регистрации в любом месте приложения.
 */
export default function GlobalAuthModal() {
  const { isAuthModalOpen, authModalTab, closeAuthModal } = useAuth();

  return (
    <AuthModal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      initialTab={authModalTab}
    />
  );
}
