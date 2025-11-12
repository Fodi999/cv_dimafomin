"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import type { FormData, UserProfile } from "@/lib/profile-types";
import { useProfileTranslations } from "@/hooks/useProfileTranslations";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, updateProfile, uploadAvatar } = useUser();
  const { translations } = useProfileTranslations();
  const [isOpen, setIsOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    bio: "",
    location: "",
    phone: "",
    instagram: "",
    telegram: "",
    whatsapp: "",
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Initialize form with user data
  useEffect(() => {
    if (!user) return;

    setUserProfile({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio || "",
      location: user.location || "",
      phone: user.phone || "",
      instagram: user.instagram || "",
      telegram: user.telegram || "",
      whatsapp: user.whatsapp || "",
    });

    setFormData({
      name: user.name,
      email: user.email,
      bio: user.bio || "",
      location: user.location || "",
      phone: user.phone || "",
      instagram: user.instagram || "",
      telegram: user.telegram || "",
      whatsapp: user.whatsapp || "",
    });
  }, [user]);

  const handleFormChange = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      console.log("📝 Saving profile changes:", formData);

      await updateProfile({
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
        location: formData.location,
        phone: formData.phone,
        instagram: formData.instagram,
        telegram: formData.telegram,
        whatsapp: formData.whatsapp,
      });

      console.log("✅ Profile updated successfully");
      setIsOpen(false);
      router.push("/profile");
    } catch (error) {
      console.error("❌ Failed to save profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (url: string) => {
    try {
      console.log("🎯 handleAvatarUpload called with URL:", url);
      await updateProfile({ avatar: url });
      console.log("✅ Avatar updated successfully");
    } catch (error) {
      console.error("❌ Failed to upload avatar:", error);
      throw error;
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    router.push("/profile");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return null;
  }

  const translationsRecord = translations as Record<string, string>;

  return (
    <EditProfileModal
      isOpen={isOpen}
      onClose={handleClose}
      user={userProfile}
      formData={formData}
      onFormChange={handleFormChange}
      onSave={handleSave}
      onAvatarUpload={handleAvatarUpload}
      isSaving={isSaving}
      translations={translationsRecord}
    />
  );
}
