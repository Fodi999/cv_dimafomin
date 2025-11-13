"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Zap, Heart, FileText, ShoppingCart, BarChart3 } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { ProfileHeader } from "./ProfileHeader";
import { TokenBalanceCard } from "./TokenBalanceCard";
import { HealthProfile } from "./HealthProfile";
import type { UserProfile, Post, Transaction } from "@/lib/profile-types";
import React from "react";

interface ProfileNavigationProps {
  userProfile: UserProfile;
  user: {
    chefTokens?: number;
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  posts: Post[];
  savedPosts: Post[];
  transactions: Transaction[];
  pageLoading: boolean;
  retryCount: number;
  healthData: {
    age: number;
    weight: number;
    height: number;
    dailyCalories: number;
    allergies: string[];
    dietaryRestrictions: string[];
    fitnessGoal: string;
  };
  translationsRecord: Record<string, string>;
  onHealthDataUpdate: (data: any) => void;
  onEarnClick: () => void;
  onBuyClick: () => void;
  onRefreshClick: () => void;
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => (
  <li>
    <NavigationMenuLink asChild>
      <a
        ref={ref}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground",
          className
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </a>
    </NavigationMenuLink>
  </li>
));
ListItem.displayName = "ListItem";

export function ProfileNavigation({
  userProfile,
  user,
  posts,
  savedPosts,
  transactions,
  pageLoading,
  retryCount,
  healthData,
  translationsRecord,
  onHealthDataUpdate,
  onEarnClick,
  onBuyClick,
  onRefreshClick,
}: ProfileNavigationProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Profile Header - Always Visible */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
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

      {/* Navigation Menu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <NavigationMenu 
          className="w-full justify-start"
          value={openMenu || ""}
          onValueChange={setOpenMenu}
        >
          <NavigationMenuList className="flex-col sm:flex-row w-full gap-2">
            {/* Earn Tokens */}
            <NavigationMenuItem value="earn">
              <NavigationMenuTrigger className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>Zacznij zarabiać</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] p-6 bg-white dark:bg-gray-950">
                  <div className="max-w-4xl mx-auto">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Wykonuj zadania, twórz przepisy lub kupuj tokeny
                    </p>
                    <TokenBalanceCard
                      balance={user.chefTokens || 0}
                      loading={pageLoading}
                      retryCount={retryCount}
                      transactionsCount={transactions.length}
                      translations={translationsRecord}
                      onEarnClick={onEarnClick}
                      onBuyClick={onBuyClick}
                      onRefreshClick={onRefreshClick}
                    />
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Health Profile */}
            <NavigationMenuItem value="health">
              <NavigationMenuTrigger className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span>Здоров'я</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] p-6 bg-white dark:bg-gray-950">
                  <div className="max-w-4xl mx-auto">
                    <HealthProfile
                      age={healthData.age}
                      weight={healthData.weight}
                      height={healthData.height}
                      dailyCalories={healthData.dailyCalories}
                      allergies={healthData.allergies}
                      dietaryRestrictions={healthData.dietaryRestrictions}
                      fitnessGoal={healthData.fitnessGoal}
                      onUpdate={onHealthDataUpdate}
                    />
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Posts */}
            <NavigationMenuItem value="posts">
              <NavigationMenuTrigger className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                <span>Публікації</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] p-6 bg-white dark:bg-gray-950">
                  <div className="max-w-4xl mx-auto">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {posts.length > 0 ? `${posts.length} публікацій` : "Brak publikacji"}
                    </p>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Saved */}
            <NavigationMenuItem value="saved">
              <NavigationMenuTrigger className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-green-500" />
                <span>Збережені</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] p-6 bg-white dark:bg-gray-950">
                  <div className="max-w-4xl mx-auto">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {savedPosts.length > 0 ? `${savedPosts.length} збережених` : "Немає збережених"}
                    </p>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Transactions */}
            <NavigationMenuItem value="transactions">
              <NavigationMenuTrigger className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-500" />
                <span>Історія</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] p-6 bg-white dark:bg-gray-950">
                  <div className="max-w-4xl mx-auto">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {transactions.length > 0
                        ? `${transactions.length} транзакцій`
                        : "Немає транзакцій"}
                    </p>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </motion.div>
    </div>
  );
}
