"use client";

import { motion } from "framer-motion";
import { ProfileHeader } from "../ProfileHeader";
import { StatsGrid } from "../StatsCard";
import { WalletSummary } from "../WalletSummary";
import type { UserProfile } from "@/lib/profile-types";

interface OverviewSectionProps {
  userProfile: UserProfile;
  user: {
    chefTokens?: number;
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  translations: Record<string, string>;
  onEarnClick: () => void;
  onBuyClick: () => void;
  onRefreshClick: () => void;
  retryCount: number;
}

export function OverviewSection({
  userProfile,
  user,
  translations,
  onEarnClick,
  onBuyClick,
  onRefreshClick,
  retryCount,
}: OverviewSectionProps) {
  return (
    <div className="space-y-3">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <ProfileHeader
          name={userProfile.name}
          email={userProfile.email}
          avatar={userProfile.avatar}
          bio={userProfile.bio}
          location={userProfile.location}
          followers={userProfile.followers}
          following={userProfile.following}
        />
      </motion.div>

      {/* Stats Grid and Wallet */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-3"
      >
        <div>
          <StatsGrid
            level={5}
            xp={2450}
            maxXp={5000}
            balance={user?.chefTokens || 0}
            coursesCount={3}
          />
        </div>

        <div>
          <WalletSummary
            balance={user?.chefTokens || 0}
            earned={15000}
            spent={10000}
            pending={500}
          />
        </div>
      </motion.div>
    </div>
  );
}
