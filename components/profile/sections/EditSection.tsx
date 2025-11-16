"use client";

import { motion } from "framer-motion";
import { EditProfileForm } from "../EditProfileForm";
import type { FormData, UserProfile } from "@/lib/profile-types";

interface EditSectionProps {
  user: UserProfile | null;
  formData: FormData;
  onFormChange: (data: Partial<FormData>) => void;
  onSave: () => Promise<void>;
  onAvatarUpload: (url: string) => Promise<void>;
  isSaving: boolean;
  translations: Record<string, string>;
}

export function EditSection({
  user,
  formData,
  onFormChange,
  onSave,
  onAvatarUpload,
  isSaving,
  translations,
}: EditSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <EditProfileForm
        user={user}
        formData={formData}
        onFormChange={onFormChange}
        onSave={onSave}
        onAvatarUpload={onAvatarUpload}
        isSaving={isSaving}
        translations={translations}
      />
    </motion.div>
  );
}
