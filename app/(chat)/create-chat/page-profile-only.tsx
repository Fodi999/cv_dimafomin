// page.tsx — Profile page with refactored components (компактна версія)

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useProfileTranslations } from "@/hooks/useProfileTranslations";
import { useWallet } from "@/hooks/useWallet";
import { useUserPosts } from "@/hooks/useUserPosts";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { TokenBalanceCard } from "@/components/profile/TokenBalanceCard";
import { TransactionHistory } from "@/components/profile/TransactionHistory";
import { ActionButtons } from "@/components/profile/ActionButtons";
import { TabsNavigation } from "@/components/profile/TabsNavigation";
import { PostsGrid } from "@/components/profile/PostsGrid";
import { CoursesGrid } from "@/components/profile/CoursesGrid";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { PurchaseTokensModal } from "@/components/profile/PurchaseTokensModal";
import type { TabType, FormData } from "@/lib/profile-types";

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateProfile, uploadAvatar, logout } = useUser();
  const { translations } = useProfileTranslations();
  
  // Wallet hook
  const {
    walletBalance,
    transactions,
    loadingWallet,
    walletRetryCount,
    purchaseTokens,
    refreshWallet,
  } = useWallet({ userId: user?.id });
  
  // Posts hook
  const { userPosts, savedPosts, loadingPosts } = useUserPosts({ 
    userId: user?.id,
    autoLoad: true 
  });

  // Local state
  const [activeTab, setActiveTab] = useState<TabType>("posts");
  const [isEditing, setIsEditing] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tokenAmount, setTokenAmount] = useState<number>(100);
  const [formData, setFormData] = useState<FormData>({
    name: user?.name || "",
    email: user?.email || "",
    bio: (user as any)?.bio || "",
    location: (user as any)?.location || "",
    phone: (user as any)?.phone || "",
    instagram: (user as any)?.instagram || "",
    telegram: (user as any)?.telegram || "",
    whatsapp: (user as any)?.whatsapp || "",
  });

  // Update form when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: (user as any)?.bio || "",
        location: (user as any)?.location || "",
        phone: (user as any)?.phone || "",
        instagram: (user as any)?.instagram || "",
        telegram: (user as any)?.telegram || "",
        whatsapp: (user as any)?.whatsapp || "",
      });
    }
  }, [user]);

  // Handlers
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
      alert("Профіль оновлено!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Помилка оновлення профілю");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      bio: (user as any)?.bio || "",
      location: (user as any)?.location || "",
      phone: (user as any)?.phone || "",
      instagram: (user as any)?.instagram || "",
      telegram: (user as any)?.telegram || "",
      whatsapp: (user as any)?.whatsapp || "",
    });
    setIsEditing(false);
  };

  const handlePurchaseTokens = async () => {
    setIsSaving(true);
    try {
      const success = await purchaseTokens(tokenAmount);
      if (success) {
        setIsPurchaseModalOpen(false);
        alert(`Успішно куплено ${tokenAmount} токенів!`);
      } else {
        alert("Помилка покупки токенів. Спробуйте пізніше.");
      }
    } catch (error) {
      console.error("Error purchasing tokens:", error);
      alert("Помилка покупки токенів");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (url: string) => {
    console.log("🖼️ ProfilePage: handleAvatarUpload called with URL:", url);
    try {
      console.log("📝 ProfilePage: calling updateProfile with avatar");
      await updateProfile({ avatar: url });
      console.log("✅ ProfilePage: avatar updated successfully");
    } catch (error) {
      console.error("❌ ProfilePage: updateProfile failed:", error);
      throw error;
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Get current posts based on active tab
  const getCurrentPosts = () => {
    if (activeTab === "posts") return userPosts;
    if (activeTab === "saved") return savedPosts;
    return [];
  };

  const getEmptyMessage = () => {
    if (activeTab === "posts") return translations.noPostsYet;
    if (activeTab === "saved") return translations.noSavedYet;
    return translations.noCourses;
  };

  return (
    <>
      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditing}
        onClose={handleCancelEdit}
        user={user}
        formData={formData}
        onFormChange={(data) => setFormData({ ...formData, ...data })}
        onSave={handleSaveProfile}
        onAvatarUpload={handleAvatarUpload}
        isSaving={isSaving}
        translations={translations}
      />

      {/* Purchase Tokens Modal */}
      <PurchaseTokensModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        currentBalance={walletBalance}
        tokenAmount={tokenAmount}
        onAmountChange={setTokenAmount}
        onPurchase={handlePurchaseTokens}
        isSaving={isSaving}
        loadingBalance={loadingWallet}
      />

      {/* Profile Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-sm">
            <User className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-bold text-gray-800">{translations.myProfile}</h1>
        </div>
      </header>

      {/* Profile Content */}
      <main className="flex-1 w-full bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm p-6">
            {/* Profile Header */}
            <ProfileHeader 
              name={user!.name}
              email={user!.email}
              avatar={user!.avatar}
              bio=""
              location=""
              followers={0}
              following={0}
            />

            {/* Token Balance Card */}
            <TokenBalanceCard
              balance={walletBalance}
              loading={loadingWallet}
              retryCount={walletRetryCount}
              transactionsCount={transactions.length}
              translations={translations}
              onEarnClick={() => router.push("/academy/earn-tokens")}
              onBuyClick={() => setIsPurchaseModalOpen(true)}
              onRefreshClick={refreshWallet}
            />

            {/* Transaction History */}
            <TransactionHistory 
              transactions={transactions} 
              translations={translations}
            />

            {/* Action Buttons */}
            <ActionButtons
              translations={translations}
              onEditProfile={() => setIsEditing(true)}
              onToChat={() => router.push("/create-chat")}
              onToHome={() => router.push("/")}
              onLogout={handleLogout}
            />
          </div>

          {/* Tabs */}
          <TabsNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            translations={translations}
          />

          {/* Content */}
          <div className="bg-white rounded-b-3xl p-6">
            {activeTab === "courses" ? (
              <CoursesGrid />
            ) : (
              <PostsGrid
                posts={getCurrentPosts()}
                loading={loadingPosts}
                emptyMessage={getEmptyMessage()}
                onCreatePost={activeTab === "posts" ? () => router.push("/create-chat") : undefined}
                translations={translations}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
