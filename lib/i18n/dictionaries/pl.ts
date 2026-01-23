/**
 * Polish Dictionary Aggregation
 * Агрегирует все польские domain-переводы в один объект
 */

import { common } from "@/i18n/pl/common";
import { navigation } from "@/i18n/pl/navigation";
import { auth } from "@/i18n/pl/auth";
import { profile } from "@/i18n/pl/profile";
import { recipes } from "@/i18n/pl/recipes";
import { tokens } from "@/i18n/pl/tokens";
import { admin } from "@/i18n/pl/admin";
import { errors } from "@/i18n/pl/errors";
import { fridge } from "@/i18n/pl/fridge";
import { losses } from "@/i18n/pl/losses";
import { ingredients } from "@/i18n/pl/ingredients";
import { home } from "@/i18n/pl/home";
import { assistant } from "@/i18n/pl/assistant";
import { about } from "@/i18n/pl/about";
import journey, { nextButtonTexts as journeyNextButtonTexts } from "@/i18n/pl/journey";

export const pl = {
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

export type Dictionary = typeof pl;

