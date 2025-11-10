// EditProfileModal.tsx — модальне вікно редагування профілю

import { motion } from "framer-motion";
import { X, Save, User, BookOpen, MapPin, Phone, Instagram, MessageCircle, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AvatarUploader from "@/components/profile/AvatarUploader";
import type { FormData, UserProfile } from "@/lib/profile-types";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  formData: FormData;
  onFormChange: (data: Partial<FormData>) => void;
  onSave: () => void;
  onAvatarUpload: (url: string) => void;
  isSaving: boolean;
  translations: Record<string, string>;
}

export function EditProfileModal({
  isOpen,
  onClose,
  user,
  formData,
  onFormChange,
  onSave,
  onAvatarUpload,
  isSaving,
  translations,
}: EditProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 rounded-t-3xl flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Редагувати профіль</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <AvatarUploader
                currentAvatar={user?.avatar}
                userName={user?.name || "User"}
                onUploadComplete={async (url) => {
                  await onAvatarUpload(url);
                  alert("Фото завантажено!");
                }}
              />
            </div>
            <p className="text-sm text-gray-500">Натисніть на фото, щоб змінити</p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              {translations.name}
            </label>
            <Input
              value={formData.name}
              onChange={(e) => onFormChange({ name: e.target.value })}
              placeholder={translations.name}
              className="text-lg"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <BookOpen className="w-4 h-4 inline mr-1" />
              {translations.aboutMe}
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => onFormChange({ bio: e.target.value })}
              placeholder={translations.aboutMe}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/500 символів</p>
          </div>

          {/* Location & Phone */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                {translations.location}
              </label>
              <Input
                value={formData.location}
                onChange={(e) => onFormChange({ location: e.target.value })}
                placeholder={translations.location}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                {translations.phone}
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => onFormChange({ phone: e.target.value })}
                placeholder={translations.phone}
              />
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{translations.socialMedia}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Instagram className="w-4 h-4 inline mr-1 text-pink-600" />
                  Instagram
                </label>
                <Input
                  value={formData.instagram}
                  onChange={(e) => onFormChange({ instagram: e.target.value })}
                  placeholder="@username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageCircle className="w-4 h-4 inline mr-1 text-blue-600" />
                  Telegram
                </label>
                <Input
                  value={formData.telegram}
                  onChange={(e) => onFormChange({ telegram: e.target.value })}
                  placeholder="@username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <AtSign className="w-4 h-4 inline mr-1 text-green-600" />
                  WhatsApp
                </label>
                <Input
                  value={formData.whatsapp}
                  onChange={(e) => onFormChange({ whatsapp: e.target.value })}
                  placeholder="+380 XX XXX XX XX"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-6 py-4 rounded-b-3xl flex gap-3">
          <Button
            onClick={onSave}
            disabled={isSaving}
            className="flex-1 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 dark:from-sky-600 dark:to-cyan-600 dark:hover:from-sky-700 dark:hover:to-cyan-700 text-white h-12 text-lg"
          >
            <Save className="w-5 h-5 mr-2" />
            {isSaving ? translations.saving : translations.saveChanges}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            disabled={isSaving}
            className="px-8 h-12"
          >
            {translations.cancel}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
