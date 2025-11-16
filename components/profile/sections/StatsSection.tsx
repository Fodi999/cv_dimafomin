"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HealthProfile } from "../HealthProfile";
import { HealthEditSheet } from "../HealthEditSheet";
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
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleSaveHealth = async (data: any) => {
    onHealthDataUpdate(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Health Profile */}
      <HealthProfile
        age={healthData.age}
        weight={healthData.weight}
        height={healthData.height}
        dailyCalories={healthData.dailyCalories}
        allergies={healthData.allergies}
        dietaryRestrictions={healthData.dietaryRestrictions}
        fitnessGoal={healthData.fitnessGoal}
        onUpdate={onHealthDataUpdate}
        onEditClick={() => setIsEditOpen(true)}
      />

      {/* Health Edit Sheet */}
      <HealthEditSheet
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        age={healthData.age}
        weight={healthData.weight}
        height={healthData.height}
        dailyCalories={healthData.dailyCalories}
        allergies={healthData.allergies}
        dietaryRestrictions={healthData.dietaryRestrictions}
        fitnessGoal={healthData.fitnessGoal}
        onSave={handleSaveHealth}
      />
    </motion.div>
  );
}
