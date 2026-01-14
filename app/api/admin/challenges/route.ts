/**
 * Admin Challenges API - List & Create
 * 
 * GET    /api/admin/challenges      - List all challenges (admin)
 * POST   /api/admin/challenges      - Create new challenge
 */

import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/api/proxy";

export async function GET(request: NextRequest) {
  try {
    return await proxyToBackend(request, {
      endpoint: "/api/admin/challenges",
      method: "GET",
    });
  } catch (error) {
    // Fallback: return empty array if backend not ready
    console.warn("Backend not available, returning empty challenges list");
    return NextResponse.json({
      success: true,
      data: [],
      message: "Backend not available - showing empty list"
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    return await proxyToBackend(request, {
      endpoint: "/api/admin/challenges",
      method: "POST",
    });
  } catch (error) {
    console.error("Backend POST error:", error);
    return NextResponse.json(
      { success: false, error: "Backend not available" },
      { status: 503 }
    );
  }
}
