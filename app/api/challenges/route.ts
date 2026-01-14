/**
 * Public Challenges API - List
 * 
 * GET /api/challenges - Get published challenges (guest-accessible)
 */

import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/api/proxy";

export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    endpoint: "/api/challenges",
    method: "GET",
    skipAuth: true, // Guest accessible
  });
}
