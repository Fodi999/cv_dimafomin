/**
 * Russian Dictionary Aggregation
 * Агрегирует все русские domain-переводы в один объект
 */

import { common } from "@/i18n/ru/common";
import { navigation } from "@/i18n/ru/navigation";
import { auth } from "@/i18n/ru/auth";
import { profile } from "@/i18n/ru/profile";
import { recipes } from "@/i18n/ru/recipes";
import { academy } from "@/i18n/ru/academy";
import { tokens } from "@/i18n/ru/tokens";
import { admin } from "@/i18n/ru/admin";
import { errors } from "@/i18n/ru/errors";
import { market } from "@/i18n/ru/market";
import { fridge } from "@/i18n/ru/fridge";
import { losses } from "@/i18n/ru/losses";
import { ingredients } from "@/i18n/ru/ingredients";
import { home } from "@/i18n/ru/home";
import journey, { nextButtonTexts as journeyNextButtonTexts } from "@/i18n/ru/journey";

export const ru = {
  common,
  navigation,
  auth,
  profile,
  recipes,
  academy,
  tokens,
  admin,
  errors,
  market,
  fridge,
  losses,
  ingredients,
  home,
  journey,
  journeyNextButtonTexts,
} as const;
