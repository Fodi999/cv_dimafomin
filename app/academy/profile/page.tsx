"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, X, Mail, MapPin, Phone, User as UserIcon, Instagram, MessageCircle, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/contexts/UserContext";
import { useLanguage } from "@/contexts/LanguageContext";
import AvatarUploader from "@/components/profile/AvatarUploader";
import { useToast } from "@/components/ui/toast";

export default function ProfilePage() {
  const { user, isAuthenticated, updateProfile, uploadAvatar } = useUser();
  const { t } = useLanguage();
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    location: user?.location || "",
    phone: user?.phone || "",
    instagram: user?.instagram || "",
    telegram: user?.telegram || "",
    whatsapp: user?.whatsapp || "",
  });

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push("/");
    return null;
  }

  if (!user) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
      showToast(t.academy?.profile?.profileUpdated || "Profile updated successfully!", "success");
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast(t.academy?.profile?.uploadError || "Error updating profile", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
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
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto relative">
      {/* Toast Container */}
      <ToastContainer />
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1E1A41] mb-4">
          👤 {t.academy?.profile?.title || "Мій профіль"}
        </h1>
        <p className="text-lg text-[#1E1A41]/70">
          {t.academy?.profile?.subtitle || "Керуйте вашим обліковим записом"}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Avatar Section */}
        <div className="relative h-48 bg-gradient-to-r from-[#3BC864] to-[#C5E98A]">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <AvatarUploader
              currentAvatar={user.avatar}
              userName={user.name}
              onUploadComplete={async (url) => {
                await updateProfile({ avatar: url });
                showToast(t.academy?.profile?.uploadSuccess || "Photo uploaded successfully!", "success");
              }}
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-20 px-8 pb-8">
          {/* Edit Button */}
          <div className="flex justify-end mb-6">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-[#3BC864] hover:bg-[#2fa352]"
              >
                {t.academy?.profile?.edit || "Редагувати профіль"}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  disabled={isSaving}
                >
                  <X className="w-4 h-4 mr-2" />
                  {t.academy?.profile?.cancel || "Скасувати"}
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-[#3BC864] hover:bg-[#2fa352]"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? (t.academy?.profile?.saving || "Збереження...") : (t.academy?.profile?.save || "Зберегти")}
                </Button>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#1E1A41] mb-2">
                <UserIcon className="w-4 h-4 inline mr-2" />
                {t.academy?.profile?.name || "Ім'я та прізвище"}
              </label>
              {isEditing ? (
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="text-lg"
                />
              ) : (
                <p className="text-lg font-semibold text-[#1E1A41]">{user.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#1E1A41] mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                {t.academy?.profile?.email || "Email"}
              </label>
              {isEditing ? (
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="text-lg"
                />
              ) : (
                <p className="text-lg text-[#1E1A41]">{user.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-[#1E1A41] mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                {t.academy?.profile?.phone || "Телефон"}
              </label>
              {isEditing ? (
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+48 123 456 789"
                  className="text-lg"
                />
              ) : (
                <div className="flex items-center gap-3">
                  <p className="text-lg text-[#1E1A41]">
                    {user.phone || (
                      <span className="text-gray-400">
                        {t.academy?.profile?.notProvided || "Не вказано"}
                      </span>
                    )}
                  </p>
                  {!user.phone && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-sm text-[#3BC864] hover:text-[#2da552] font-medium transition-colors"
                    >
                      {t.academy?.profile?.fillIn || "Заповнити"}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-[#1E1A41] mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                {t.academy?.profile?.location || "Місцезнаходження"}
              </label>
              {isEditing ? (
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Warszawa, Polska"
                  className="text-lg"
                />
              ) : (
                <div className="flex items-center gap-3">
                  <p className="text-lg text-[#1E1A41]">
                    {user.location || (
                      <span className="text-gray-400">
                        {t.academy?.profile?.notProvided || "Не вказано"}
                      </span>
                    )}
                  </p>
                  {!user.location && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-sm text-[#3BC864] hover:text-[#2da552] font-medium transition-colors"
                    >
                      {t.academy?.profile?.fillIn || "Заповнити"}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-[#1E1A41] mb-2">
                {t.academy?.profile?.bio || "Про себе"}
              </label>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder={t.academy?.profile?.bioPlaceholder || "Розкажіть про себе..."}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3BC864] focus:border-transparent"
                />
              ) : (
                <div className="flex items-start gap-3">
                  <p className="text-lg text-[#1E1A41] whitespace-pre-wrap flex-1">
                    {user.bio || (
                      <span className="text-gray-400">
                        {t.academy?.profile?.notProvided || "Не вказано"}
                      </span>
                    )}
                  </p>
                  {!user.bio && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-sm text-[#3BC864] hover:text-[#2da552] font-medium transition-colors mt-1"
                    >
                      {t.academy?.profile?.fillIn || "Заповнити"}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Social Media Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-[#1E1A41] mb-4">
                🌐 {t.academy?.profile?.socialMedia || "Соціальні мережі"}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Instagram */}
                <div>
                  <label className="block text-sm font-medium text-[#1E1A41] mb-2">
                    <Instagram className="w-4 h-4 inline mr-2" />
                    Instagram
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      placeholder="@username"
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <p className="text-lg text-[#1E1A41]">
                        {user.instagram ? (
                          <a 
                            href={`https://instagram.com/${user.instagram.replace('@', '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-pink-600 hover:underline"
                          >
                            {user.instagram}
                          </a>
                        ) : (
                          <span className="text-gray-400">
                            {t.academy?.profile?.notProvided || "Не вказано"}
                          </span>
                        )}
                      </p>
                      {!user.instagram && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="text-sm text-[#3BC864] hover:text-[#2da552] font-medium transition-colors"
                        >
                          {t.academy?.profile?.fillIn || "Заповнити"}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Telegram */}
                <div>
                  <label className="block text-sm font-medium text-[#1E1A41] mb-2">
                    <MessageCircle className="w-4 h-4 inline mr-2" />
                    Telegram
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.telegram}
                      onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                      placeholder="@username"
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <p className="text-lg text-[#1E1A41]">
                        {user.telegram ? (
                          <a 
                            href={`https://t.me/${user.telegram.replace('@', '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {user.telegram}
                          </a>
                        ) : (
                          <span className="text-gray-400">
                            {t.academy?.profile?.notProvided || "Не вказано"}
                          </span>
                        )}
                      </p>
                      {!user.telegram && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="text-sm text-[#3BC864] hover:text-[#2da552] font-medium transition-colors"
                        >
                          {t.academy?.profile?.fillIn || "Заповнити"}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-sm font-medium text-[#1E1A41] mb-2">
                    <AtSign className="w-4 h-4 inline mr-2" />
                    WhatsApp
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="+48 123 456 789"
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <p className="text-lg text-[#1E1A41]">
                        {user.whatsapp ? (
                          <a 
                            href={`https://wa.me/${user.whatsapp.replace(/\D/g, '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-600 hover:underline"
                          >
                            {user.whatsapp}
                          </a>
                        ) : (
                          <span className="text-gray-400">
                            {t.academy?.profile?.notProvided || "Не вказано"}
                          </span>
                        )}
                      </p>
                      {!user.whatsapp && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="text-sm text-[#3BC864] hover:text-[#2da552] font-medium transition-colors"
                        >
                          {t.academy?.profile?.fillIn || "Заповнити"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Role Badge */}
            <div>
              <label className="block text-sm font-medium text-[#1E1A41] mb-2">
                {t.academy?.profile?.role || "Роль"}
              </label>
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium">
                {user.role === "instructor" ? "Інструктор" : user.role === "student" ? "Студент" : "Адміністратор"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning History */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
        <h2 className="text-2xl font-bold text-[#1E1A41] mb-6">
          📚 {t.academy?.profile?.learningHistory || "Історія навчання"}
        </h2>
        <div className="space-y-4">
          {/* Completed Course */}
          <div className="p-4 bg-[#FEF9F5] rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-[#1E1A41]">Майстер суші: професійний рівень</h3>
                <p className="text-sm text-[#1E1A41]/60">
                  {t.academy?.profile?.completed || "Завершено"}: 2025-10-15
                </p>
              </div>
              <div className="text-[#3BC864] font-bold">100%</div>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-[#3BC864] h-2 rounded-full transition-all duration-500" 
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* In Progress Course */}
          <div className="p-4 bg-[#FEF9F5] rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-[#1E1A41]">Японська кухня для початківців</h3>
                <p className="text-sm text-[#1E1A41]/60">
                  {t.academy?.profile?.inProgress || "В процесі"}
                </p>
              </div>
              <div className="text-orange-500 font-bold">30%</div>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: "30%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
