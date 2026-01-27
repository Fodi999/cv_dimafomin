/**
 * Admin Dishes API
 * GET /api/admin/dishes - List dishes
 * 
 * Proxies to backend
 */

import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/api/proxy";
import { requireAdmin } from "@/lib/api/middleware";

export async function GET(request: NextRequest) {
  const { user, error } = await requireAdmin(request);
  if (error) return error;

  return proxyToBackend(request, {
    endpoint: "/api/admin/dishes",
    method: "GET",
  });
}
