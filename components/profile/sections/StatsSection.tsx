"use client";

import { motion } from "framer-motion";
import { HealthProfile } from "../HealthProfile";
import type { UserProfile } from "@/lib/profile-types";

interface StatsSectionProps {
  userProfile: UserProfile;
  healthData: {
    age: number;
    weight: number;
    height: number;
    dailyCalories: number;
    allergies: string[];
    dietaryRestrictions: string[];
    fitnessGoal: string;
  };
  onHealthDataUpdate: (data: any) => void;
}

export function StatsSection({
  userProfile,
  healthData,
  onHealthDataUpdate,
}: StatsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
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
    </motion.div>
  );
}
