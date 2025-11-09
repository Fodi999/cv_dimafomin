// useProfileTranslations.ts — хук для перекладів профілю

import { useLanguage } from "@/contexts/LanguageContext";
import { profileTranslations, type Language } from "@/lib/profile-translations";

export function useProfileTranslations() {
  const { language } = useLanguage();
  
  const translations = profileTranslations[language as Language] || profileTranslations.uk;
  
  return { translations, language };
}
