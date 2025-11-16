"use client";

import { motion } from "framer-motion";
import { Save, User, BookOpen, MapPin, Phone, Instagram, MessageCircle, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AvatarUploader from "@/components/profile/AvatarUploader";
import { useState } from "react";
import type { FormData, UserProfile } from "@/lib/profile-types";

interface EditProfileFormProps {
  user: UserProfile | null;
  formData: FormData;
  onFormChange: (data: Partial<FormData>) => void;
  onSave: () => void;
  onAvatarUpload: (url: string) => void;
  isSaving: boolean;
  translations: Record<string, string>;
}

export function EditProfileForm({
  user,
  formData,
  onFormChange,
  onSave,
  onAvatarUpload,
  isSaving,
  translations,
}: EditProfileFormProps) {
  const [successMessage, setSuccessMessage] = useState("");

  const handleSaveClick = async () => {
    try {
      await onSave();
      setSuccessMessage("Профиль успешно обновлён!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to save:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md space-y-6"
    >
      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-500/20 border border-emerald-500/50 rounded-lg p-4 text-emerald-700 dark:text-emerald-400"
        >
          ✅ {successMessage}
        </motion.div>
      )}

      {/* Avatar Upload */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <AvatarUploader
            currentAvatar={user?.avatar}
            userName={user?.name || "User"}
            onUploadComplete={async (url) => {
              try {
                await onAvatarUpload(url);
              } catch (error) {
                console.error("Failed to upload avatar:", error);
                throw error;
              }
            }}
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Нажмите на фото для изменения</p>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <User className="w-4 h-4 inline mr-2" />
          {translations.name || "Имя"}
        </label>
        <Input
          value={formData.name}
          onChange={(e) => onFormChange({ name: e.target.value })}
          placeholder="Ваше имя"
          className="text-lg"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <AtSign className="w-4 h-4 inline mr-2" />
          Email
        </label>
        <Input
          value={formData.email}
          onChange={(e) => onFormChange({ email: e.target.value })}
          placeholder="ваш@email.com"
          type="email"
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <BookOpen className="w-4 h-4 inline mr-2" />
          {translations.aboutMe || "Обо мне"}
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => onFormChange({ bio: e.target.value })}
          placeholder="Расскажите о себе..."
          rows={4}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <MapPin className="w-4 h-4 inline mr-2" />
          {translations.location || "Местоположение"}
        </label>
        <Input
          value={formData.location}
          onChange={(e) => onFormChange({ location: e.target.value })}
          placeholder="Ваш город"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Phone className="w-4 h-4 inline mr-2" />
          {translations.phone || "Телефон"}
        </label>
        <Input
          value={formData.phone}
          onChange={(e) => onFormChange({ phone: e.target.value })}
          placeholder="+1 234 567 8900"
        />
      </div>

      {/* Social Links */}
      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">Социальные сети</h3>

        {/* Instagram */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Instagram className="w-4 h-4 inline mr-2" />
            Instagram
          </label>
          <Input
            value={formData.instagram}
            onChange={(e) => onFormChange({ instagram: e.target.value })}
            placeholder="@username"
          />
        </div>

        {/* Telegram */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <MessageCircle className="w-4 h-4 inline mr-2" />
            Telegram
          </label>
          <Input
            value={formData.telegram}
            onChange={(e) => onFormChange({ telegram: e.target.value })}
            placeholder="@username"
          />
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            WhatsApp
          </label>
          <Input
            value={formData.whatsapp}
            onChange={(e) => onFormChange({ whatsapp: e.target.value })}
            placeholder="+1 234 567 8900"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          onClick={handleSaveClick}
          disabled={isSaving}
          className="w-full bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              Сохранение...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 inline mr-2" />
              Сохранить изменения
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
