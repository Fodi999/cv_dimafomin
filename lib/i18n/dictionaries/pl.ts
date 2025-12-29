/**
 * Polish Dictionary Aggregation
 * Агрегирует все польские domain-переводы в один объект
 */

import { common } from "@/i18n/pl/common";
import { navigation } from "@/i18n/pl/navigation";
import { auth } from "@/i18n/pl/auth";
import { profile } from "@/i18n/pl/profile";
import { recipes } from "@/i18n/pl/recipes";
import { academy } from "@/i18n/pl/academy";
import { tokens } from "@/i18n/pl/tokens";
import { admin } from "@/i18n/pl/admin";
import { errors } from "@/i18n/pl/errors";
import { market } from "@/i18n/pl/market";
import { fridge } from "@/i18n/pl/fridge";
import { losses } from "@/i18n/pl/losses";
import { ingredients } from "@/i18n/pl/ingredients";

export const pl = {
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

export type Dictionary = typeof pl;

