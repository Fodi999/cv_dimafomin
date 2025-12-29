/**
 * English Dictionary Aggregation
 * Агрегирует все английские domain-переводы в один объект
 */

import { common } from "@/i18n/en/common";
import { navigation } from "@/i18n/en/navigation";
import { auth } from "@/i18n/en/auth";
import { profile } from "@/i18n/en/profile";
import { recipes } from "@/i18n/en/recipes";
import { academy } from "@/i18n/en/academy";
import { tokens } from "@/i18n/en/tokens";
import { admin } from "@/i18n/en/admin";
import { errors } from "@/i18n/en/errors";
import { market } from "@/i18n/en/market";
import { fridge } from "@/i18n/en/fridge";
import { losses } from "@/i18n/en/losses";
import { ingredients } from "@/i18n/en/ingredients";

export const en = {
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
} as const;

