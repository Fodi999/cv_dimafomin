/**
 * Marketplace Dishes API (PUBLIC)
 * GET /api/marketplace/dishes
 * 
 * Returns only published + available dishes
 * Proxies to backend
 */

import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/api/proxy";

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    endpoint: "/api/marketplace/dishes",
    method: "GET",
    skipAuth: true, // Public endpoint
  });
}
