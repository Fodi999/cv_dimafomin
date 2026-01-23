/**
 * English Dictionary Aggregation
 * Агрегирует все английские domain-переводы в один объект
 */

import { common } from "@/i18n/en/common";
import { navigation } from "@/i18n/en/navigation";
import { auth } from "@/i18n/en/auth";
import { profile } from "@/i18n/en/profile";
import { recipes } from "@/i18n/en/recipes";
import { tokens } from "@/i18n/en/tokens";
import { admin } from "@/i18n/en/admin";
import { errors } from "@/i18n/en/errors";
import { fridge } from "@/i18n/en/fridge";
import { losses } from "@/i18n/en/losses";
import { ingredients } from "@/i18n/en/ingredients";
import { home } from "@/i18n/en/home";
import { assistant } from "@/i18n/en/assistant";
import { about } from "@/i18n/en/about";
import journey, { nextButtonTexts as journeyNextButtonTexts } from "@/i18n/en/journey";

export const en = {
  common,
  navigation,
  auth,
  profile,
  recipes,
  tokens,
  admin,
  errors,
  fridge,
  losses,
  ingredients,
  home,
  assistant,
  about,
  journey,
  journeyNextButtonTexts,
} as const;

