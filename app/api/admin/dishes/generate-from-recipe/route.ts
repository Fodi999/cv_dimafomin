/**
 * Generate Dish from Recipe
 * POST /api/admin/dishes/generate-from-recipe
 * 
 * Proxies to backend: POST /api/admin/dishes/generate-from-recipe
 */

import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/api/proxy";
import { requireAdmin } from "@/lib/api/middleware";

export async function POST(request: NextRequest) {
  const { user, error } = await requireAdmin(request);
  if (error) return error;

  return proxyToBackend(request, {
    endpoint: "/api/admin/dishes/generate-from-recipe",
    method: "POST",
  });
}
